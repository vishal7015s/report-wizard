import { useRef, useState, useMemo, useCallback } from 'react';
import { useReportStore } from '@/store/reportStore';
import { Button } from '@/components/ui/button';
import { Download, CreditCard, Eye, CheckCircle, Loader2, FileText, FileDown, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { generatePDF } from '@/lib/pdfGenerator';
import { generateDOCX } from '@/lib/docxGenerator';
import { supabase } from '@/integrations/supabase/client';
import PDFCoverPage from '@/components/pdf/PDFCoverPage';
import PDFCoverPageWithSVCE from '@/components/pdf/PDFCoverPageWithSVCE';
import PDFCertificate from '@/components/pdf/PDFCertificate';
import PDFDeclaration from '@/components/pdf/PDFDeclaration';
import PDFApproval from '@/components/pdf/PDFApproval';
import PDFAcknowledgement from '@/components/pdf/PDFAcknowledgement';
import PDFAbstract from '@/components/pdf/PDFAbstract';
import PDFTableOfContents from '@/components/pdf/PDFTableOfContents';
import PDFListOfFigures from '@/components/pdf/PDFListOfFigures';
import PDFChapterTitle from '@/components/pdf/PDFChapterTitle';
import PDFChapterContent from '@/components/pdf/PDFChapterContent';
import { ChapterSection } from '@/types/report';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';

const ReportPreview = () => {
  const { reportData, contentMode, aiPrompt, aiReportContent, setAiChapters, setChapters, setAbstract, setAcknowledgement } = useReportStore();
  const activeData = useMemo(() => {
    if (contentMode === 'ai') {
      return {
        ...reportData,
        chapters: aiReportContent.chapters,
        abstract: aiReportContent.abstract,
        acknowledgement: aiReportContent.acknowledgement,
      };
    }
    return reportData;
  }, [contentMode, reportData, aiReportContent]);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadType, setDownloadType] = useState<'pdf' | 'docx' | null>(null);
  const [isGeneratingFull, setIsGeneratingFull] = useState(false);

  const {
    isProcessing,
    isPaid,
    initiatePayment,
  } = useRazorpayPayment();

  const isAIGenerated = contentMode === 'ai';
  const isPreviewOnly = isAIGenerated && !isPaid && activeData.chapters.length <= 3;
  const price = isAIGenerated ? '₹50' : 'Free';

  // After payment, generate remaining chapters
  const generateRemainingChapters = useCallback(async () => {
    if (!aiPrompt) return;

    setIsGeneratingFull(true);
    toast.info('Generating full report with all 7 chapters...');

    try {
      const { data, error } = await supabase.functions.invoke('generate-report-content', {
        body: {
          prompt: aiPrompt,
          projectTitle: reportData.projectDetails.projectTitle,
          guideName: reportData.projectDetails.guideName,
          students: reportData.projectDetails.students,
          branch: reportData.projectDetails.branch,
          projectType: reportData.projectDetails.projectType,
          mode: 'remaining'
        }
      });

      if (error) throw new Error(error.message || 'Failed to generate remaining content');
      if (data.error) throw new Error(data.error);

      // Merge remaining chapters with existing AI preview chapters
      const existingChapters = aiReportContent.chapters;
      const allChapters = [...existingChapters, ...data.chapters];
      setAiChapters(allChapters);

      toast.success('Full report generated! You can now download.');
    } catch (error) {
      console.error('Full generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate full report');
    } finally {
      setIsGeneratingFull(false);
    }
  }, [aiPrompt, reportData, aiReportContent, setAiChapters]);

  const handlePaymentAndGenerate = async () => {
    const success = await initiatePayment(50);
    if (success) {
      // After successful payment, generate remaining chapters
      await generateRemainingChapters();
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfContainerRef.current) return;

    setIsGenerating(true);
    setDownloadType('pdf');
    toast.info('Generating PDF... Please wait');

    try {
      const projectTitle = activeData.projectDetails.projectTitle || 'project-report';
      const filename = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`;

      await generatePDF(pdfContainerRef.current, filename);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
      setDownloadType(null);
    }
  };

  const handleDownloadDOCX = async () => {
    setIsGenerating(true);
    setDownloadType('docx');
    toast.info('Generating Word document... Please wait');

    try {
      const projectTitle = activeData.projectDetails.projectTitle || 'project-report';
      const filename = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}.docx`;

      await generateDOCX(activeData, filename);
      toast.success('Word document downloaded successfully! You can open it in Google Docs.');
    } catch (error) {
      console.error('DOCX generation error:', error);
      toast.error('Failed to generate Word document. Please try again.');
    } finally {
      setIsGenerating(false);
      setDownloadType(null);
    }
  };

  const handlePayment = async () => {
    await initiatePayment(50);
  };

  // Generate Roman numerals for preliminary pages
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  // Split sections into pages - smart content management with proper page breaks
  const splitSectionsIntoPages = (sections: ChapterSection[]): ChapterSection[][] => {
    // Page capacity settings - strict limits to enforce fixed A4 page size
    const MAX_CHARS_PER_PAGE = 3500; // Increased limit to fill an A4 page
    const MIN_CHARS_FOR_NEW_PAGE = 600;
    const MAX_SECTIONS_PER_PAGE = 5; // Allow more sections per page
    const IMAGE_COST = 1500; // Adjusted cost per image
    const HEADING_COST = 250;

    const pages: ChapterSection[][] = [];
    let currentPage: ChapterSection[] = [];
    let currentPageCost = 0;

    const flushPage = () => {
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
        currentPageCost = 0;
      }
    };

    const calculateCost = (section: ChapterSection): number => {
      const textCost = (section.content || '').length;
      const imageCost = (section.images?.length || 0) * IMAGE_COST;
      return textCost + imageCost + HEADING_COST;
    };

    // Find natural break points in content - prioritize keeping lists and paragraphs together
    const findNaturalBreakPoint = (content: string, maxLength: number): number => {
      if (content.length <= maxLength) return content.length;

      // Look for break points in order of preference:
      // 1. Double newline (paragraph break) - best break point
      const paragraphBreak = content.lastIndexOf('\n\n', maxLength);
      if (paragraphBreak > maxLength * 0.5) return paragraphBreak;

      // 2. End of a bullet point list (newline not followed by bullet)
      const lines = content.slice(0, maxLength).split('\n');
      let charCount = 0;
      for (let i = 0; i < lines.length - 1; i++) {
        charCount += lines[i].length + 1; // +1 for newline
        const currentLine = lines[i].trim();
        const nextLine = lines[i + 1]?.trim() || '';

        // Break after a list item if next line starts a new paragraph (not a bullet)
        if ((currentLine.match(/^[•\-\*○]/) || currentLine.match(/^\d+[.)]/)) &&
          !nextLine.match(/^[•\-\*○]/) && !nextLine.match(/^\d+[.)]/)) {
          if (charCount > maxLength * 0.5) return charCount;
        }
      }

      // 3. Single newline (line break)
      const lineBreak = content.lastIndexOf('\n', maxLength);
      if (lineBreak > maxLength * 0.4) return lineBreak;

      // 4. End of sentence (period followed by space or newline)
      const sentenceEnd = content.lastIndexOf('. ', maxLength);
      if (sentenceEnd > maxLength * 0.4) return sentenceEnd + 1;

      // 5. Any period
      const period = content.lastIndexOf('.', maxLength);
      if (period > maxLength * 0.3) return period + 1;

      // 6. Hard cut as last resort
      return maxLength;
    };

    // Split long content at natural break points
    const splitLongContent = (content: string, maxLength: number): string[] => {
      const chunks: string[] = [];
      let remaining = content;

      while (remaining.length > maxLength) {
        const breakPoint = findNaturalBreakPoint(remaining, maxLength);
        chunks.push(remaining.slice(0, breakPoint).trim());
        remaining = remaining.slice(breakPoint).trim();
      }

      if (remaining) chunks.push(remaining);
      return chunks;
    };

    // Check if section should stay together (small enough and has content that shouldn't be split)
    const shouldKeepTogether = (section: ChapterSection): boolean => {
      const cost = calculateCost(section);
      const content = section.content || '';

      // If section has images, only keep together if text is very short
      if (section.images && section.images.length > 0) {
        const textOnly = (content.length) + HEADING_COST;
        return textOnly + (section.images.length * IMAGE_COST) <= MAX_CHARS_PER_PAGE;
      }

      if (cost <= MAX_CHARS_PER_PAGE) return true;

      // Check if mostly bullet points - try to keep together
      const bulletLines = (content.match(/^[•\-\*○]\s/gm) || []).length;
      const totalLines = content.split('\n').filter(l => l.trim()).length;
      if (bulletLines > totalLines * 0.5 && cost <= MAX_CHARS_PER_PAGE * 1.3) return true;

      return false;
    };

    // Process each section
    sections.forEach((section) => {
      const sectionCost = calculateCost(section);
      const hasImages = section.images && section.images.length > 0;
      const textLength = (section.content || '').length;

      // Calculate how much text footprint alone would be
      const remainingSpace = MAX_CHARS_PER_PAGE - currentPageCost;
      const textCost = textLength + HEADING_COST;

      // If text fits perfectly on the current page, but images make it overflow
      if (hasImages && sectionCost > remainingSpace && textCost <= remainingSpace && currentPage.length < MAX_SECTIONS_PER_PAGE) {
        // 1. Add text to the current page and immediately flush it
        currentPage.push({
          ...section,
          id: `${section.id}-text`,
          images: [],
        });
        flushPage();

        // 2. Add images to subsequent new pages
        const images = section.images!;
        for (let i = 0; i < images.length; i += 2) {
          const pageImages = images.slice(i, i + 2);
          pages.push([{
            ...section,
            id: `${section.id}-img-${i}`,
            heading: `${section.heading} - Figures`,
            content: '',
            images: pageImages,
          }]);
        }
        return; // Skip the rest, we fully processed this section
      }

      // Otherwise, if the section is massively huge, do a hard flush and split
      if (hasImages && textLength > 600 && sectionCost > remainingSpace) {
        // Flush current page to give this massive section a fresh canvas
        if (currentPage.length > 0) {
          flushPage();
        }

        const content = section.content || '';
        const availableForContent = MAX_CHARS_PER_PAGE - HEADING_COST - 200;

        if (content.length > availableForContent) {
          // Split text across pages, images on last page
          const chunks = splitLongContent(content, availableForContent);
          chunks.forEach((chunk, idx) => {
            const isFirst = idx === 0;
            pages.push([{
              ...section,
              id: `${section.id}-part-${idx + 1}`,
              heading: isFirst ? section.heading : `${section.heading} (Continued)`,
              content: chunk,
              images: [],
            }]);
          });
        } else {
          // Text fits on one page
          pages.push([{
            ...section,
            id: `${section.id}-text`,
            content: content,
            images: [],
          }]);
        }

        // Images get their own dedicated page(s) - one page per image for large display
        const images = section.images!;
        // Group max 2 images per page
        for (let i = 0; i < images.length; i += 2) {
          const pageImages = images.slice(i, i + 2);
          pages.push([{
            ...section,
            id: `${section.id}-img-${i}`,
            heading: `${section.heading} - Figures`,
            content: '',
            images: pageImages,
          }]);
        }
      }
      // If section is too large and shouldn't be kept together, split it
      else if (sectionCost > MAX_CHARS_PER_PAGE && !shouldKeepTogether(section)) {
        // Flush current page first
        if (currentPage.length > 0) {
          flushPage();
        }

        const content = section.content || '';
        const availableForContent = MAX_CHARS_PER_PAGE - HEADING_COST - 200;
        const chunks = splitLongContent(content, availableForContent);

        chunks.forEach((chunk, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === chunks.length - 1;

          pages.push([{
            ...section,
            id: `${section.id}-part-${idx + 1}`,
            heading: isFirst ? section.heading : `${section.heading} (Continued)`,
            content: chunk,
            images: isLast ? section.images : [],
          }]);
        });
      } else {
        // Try to fit on current page
        const remainingSpace = MAX_CHARS_PER_PAGE - currentPageCost;
        const wouldExceed = sectionCost > remainingSpace;
        const tooManySections = currentPage.length >= MAX_SECTIONS_PER_PAGE;

        if (wouldExceed || tooManySections) {
          // Start new page only if current page has enough content
          if (currentPageCost >= MIN_CHARS_FOR_NEW_PAGE) {
            flushPage();
          } else if (wouldExceed && currentPage.length > 0) {
            // Current page has little content but new section is too big
            // Check if combined they exceed reasonable limit
            if (currentPageCost + sectionCost > MAX_CHARS_PER_PAGE * 1.1) {
              flushPage();
            }
          }
        }

        currentPage.push(section);
        currentPageCost += sectionCost;
      }
    });

    flushPage();
    return pages.length ? pages : [[]];
  };

  // Generate TOC entries with calculated page numbers
  const tocEntries = useMemo(() => {
    const entries: { title: string; pageNumber: string; isChapter?: boolean; isSection?: boolean }[] = [
      { title: 'Certificate', pageNumber: 'iii' },
      { title: 'Candidate Declaration', pageNumber: 'iv' },
      { title: 'Project Approval Certificate', pageNumber: 'v' },
      { title: 'Acknowledgement', pageNumber: 'vi' },
      { title: 'Abstract', pageNumber: 'vii' },
      { title: 'List of Figures', pageNumber: 'viii' },
      { title: 'List of Tables', pageNumber: 'ix' },
      { title: 'Table of Content', pageNumber: 'x' },
    ];

    let currentPage = 1;
    activeData.chapters.forEach((chapter) => {
      const sectionPages = splitSectionsIntoPages(chapter.sections);

      // Add chapter title
      entries.push({
        title: `Chapter ${chapter.number} ${chapter.title}`,
        pageNumber: currentPage.toString(),
        isChapter: true,
      });

      // Add section entries
      let sectionPage = currentPage + 1;
      chapter.sections.forEach((section, sectionIdx) => {
        entries.push({
          title: `${chapter.number}.${sectionIdx + 1} ${section.heading}`,
          pageNumber: sectionPage.toString(),
          isSection: true,
        });
        // Estimate if section spans multiple pages
        const sectionCost = (section.content?.length || 0) + (section.images?.length || 0) * 500;
        if (sectionCost > 700) sectionPage++;
      });

      currentPage += 1 + sectionPages.length; // Title page + content pages
    });

    return entries;
  }, [activeData.chapters]);

  // Generate figure entries for List of Figures
  const figureEntries = useMemo(() => {
    const figures: { figureNumber: string; title: string; pageNumber: string }[] = [];
    let figureCounter = 1;
    let currentPage = 1;

    activeData.chapters.forEach((chapter) => {
      const sectionPages = splitSectionsIntoPages(chapter.sections);
      let sectionPage = currentPage + 1;

      chapter.sections.forEach((section) => {
        if (section.images && section.images.length > 0) {
          section.images.forEach((image) => {
            figures.push({
              figureNumber: `Fig ${chapter.number}.${figureCounter}`,
              title: image.caption || `Figure in ${section.heading}`,
              pageNumber: sectionPage.toString(),
            });
            figureCounter++;
          });
        }
        const sectionCost = (section.content?.length || 0) + (section.images?.length || 0) * 500;
        if (sectionCost > 700) sectionPage++;
      });

      currentPage += 1 + sectionPages.length;
      figureCounter = 1; // Reset for next chapter
    });

    return figures;
  }, [activeData.chapters]);

  // Calculate total content pages
  let pageCounter = 1;

  return (
    <div className="animate-fade-in lg:h-[calc(100vh-140px)] lg:flex lg:flex-col lg:overflow-hidden">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-foreground mb-1">Preview Your Report</h2>
        <p className="text-muted-foreground">
          Review the formatted pages before downloading
        </p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8 lg:flex-1 lg:min-h-0">
        {/* Preview Area */}
        <div className="lg:col-span-2 lg:min-h-0 order-2 lg:order-1">
          <div className="bg-muted/50 p-4 sm:p-8 rounded-xl overflow-auto max-h-[60vh] lg:max-h-none lg:h-full">
            <div className="space-y-8 flex flex-col items-center">
              {/* Preliminary Pages */}
              <div className="transform scale-[0.5] origin-top">
                <PDFCoverPage data={activeData} pageNumber="I" />
              </div>

              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFCoverPageWithSVCE data={activeData} pageNumber="II" />
              </div>

              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFCertificate data={activeData} pageNumber="iii" />
              </div>

              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFDeclaration data={activeData} pageNumber="iv" />
              </div>

              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFApproval data={activeData} pageNumber="v" />
              </div>

              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFAcknowledgement data={activeData} pageNumber="vi" />
              </div>

              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFAbstract data={activeData} pageNumber="vii" />
              </div>

              {/* List of Figures */}
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFListOfFigures
                  figures={figureEntries}
                  projectDetails={{
                    projectTitle: activeData.projectDetails.projectTitle,
                    department: activeData.projectDetails.department,
                  }}
                />
              </div>

              {/* Table of Contents */}
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFTableOfContents
                  entries={tocEntries}
                  projectDetails={{
                    projectTitle: activeData.projectDetails.projectTitle,
                    department: activeData.projectDetails.department,
                  }}
                />
              </div>

              {/* Chapter Pages */}
              {activeData.chapters.map((chapter) => {
                const sectionPages = splitSectionsIntoPages(chapter.sections);
                const titlePageNum = pageCounter++;

                return (
                  <div key={chapter.id}>
                    {/* Chapter Title Page */}
                    <div className="transform scale-[0.5] origin-top -mt-[400px]">
                      <PDFChapterTitle
                        chapterNumber={chapter.number}
                        chapterTitle={chapter.title}
                        data={activeData}
                        pageNumber={titlePageNum.toString()}
                      />
                    </div>

                    {/* Chapter Content Pages */}
                    {sectionPages.map((sections, pageIdx) => {
                      const contentPageNum = pageCounter++;
                      return (
                        <div key={`${chapter.id}-page-${pageIdx}`} className="transform scale-[0.5] origin-top -mt-[400px]">
                          <PDFChapterContent
                            sections={sections}
                            data={activeData}
                            pageNumber={contentPageNum.toString()}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hidden Full-Size PDF Container for Generation */}
          <div
            ref={pdfContainerRef}
            className="absolute left-[-9999px] top-0"
            style={{ width: '210mm' }}
          >
            <PDFCoverPage data={activeData} pageNumber="i" />
            <PDFCoverPageWithSVCE data={activeData} pageNumber="ii" />
            <PDFCertificate data={activeData} pageNumber="iii" />
            <PDFDeclaration data={activeData} pageNumber="iv" />
            <PDFApproval data={activeData} pageNumber="v" />
            <PDFAcknowledgement data={activeData} pageNumber="vi" />
            <PDFAbstract data={activeData} pageNumber="vii" />
            <PDFListOfFigures
              figures={figureEntries}
              projectDetails={{
                projectTitle: activeData.projectDetails.projectTitle,
                department: activeData.projectDetails.department,
              }}
            />
            <PDFTableOfContents
              entries={tocEntries}
              projectDetails={{
                projectTitle: activeData.projectDetails.projectTitle,
                department: activeData.projectDetails.department,
              }}
            />
            {(() => {
              let hiddenPageCounter = 1;
              return activeData.chapters.map((chapter) => {
                const sectionPages = splitSectionsIntoPages(chapter.sections);
                const titlePageNum = hiddenPageCounter++;

                return (
                  <div key={`hidden-${chapter.id}`}>
                    <PDFChapterTitle
                      chapterNumber={chapter.number}
                      chapterTitle={chapter.title}
                      data={activeData}
                      pageNumber={titlePageNum.toString()}
                    />
                    {sectionPages.map((sections, pageIdx) => {
                      const contentPageNum = hiddenPageCounter++;
                      return (
                        <PDFChapterContent
                          key={`hidden-${chapter.id}-page-${pageIdx}`}
                          sections={sections}
                          data={activeData}
                          pageNumber={contentPageNum.toString()}
                        />
                      );
                    })}
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 order-1 lg:order-2">
          <div className="bg-card rounded-2xl p-6 shadow-lg border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Report
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Project</span>
                <span className="font-medium truncate max-w-[150px]" title={activeData.projectDetails.projectTitle}>
                  {activeData.projectDetails.projectTitle || 'Untitled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Students</span>
                <span className="font-medium">{activeData.projectDetails.students.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chapters</span>
                <span className="font-medium">{activeData.chapters.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Pages</span>
                <span className="font-medium">{7 + activeData.chapters.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Content Mode</span>
                <span className="font-medium">{isAIGenerated ? 'AI Generated' : 'Manual'}</span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className={`text-2xl font-bold ${isAIGenerated ? 'text-primary' : 'text-green-600 dark:text-green-400'}`}>
                  {price}
                </span>
              </div>

              {isAIGenerated ? (
                isPaid && !isGeneratingFull ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-primary justify-center mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Payment verified - Full report ready!</span>
                    </div>
                    <Button
                      className="w-full gap-2 bg-primary hover:bg-primary/90"
                      size="lg"
                      onClick={handleDownloadPDF}
                      disabled={isGenerating}
                    >
                      {isGenerating && downloadType === 'pdf' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <FileDown className="w-4 h-4" />
                          Download PDF
                        </>
                      )}
                    </Button>

                    <Button
                      className="w-full gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                      size="lg"
                      onClick={handleDownloadDOCX}
                      disabled={isGenerating}
                    >
                      {isGenerating && downloadType === 'docx' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating Word...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          Download Word (Google Docs)
                        </>
                      )}
                    </Button>
                  </div>
                ) : isGeneratingFull ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-primary justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating full report (Chapters 4-7)...</span>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      Please wait, this may take a minute. Don't close this page.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {isPreviewOnly && (
                      <div className="flex items-center gap-2 text-xs text-amber-600 justify-center bg-amber-50 rounded-lg p-2">
                        <Lock className="w-3 h-3" />
                        <span>Preview: 3 chapters shown. Pay to unlock all 7 chapters.</span>
                      </div>
                    )}
                    <Button
                      className="w-full gap-2 bg-primary hover:bg-primary/90"
                      size="lg"
                      onClick={handlePaymentAndGenerate}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Pay ₹50 & Generate Full Report
                        </>
                      )}
                    </Button>
                  </div>
                )
              ) : (
                <div className="space-y-2">
                  <Button
                    className="w-full gap-2 bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                  >
                    {isGenerating && downloadType === 'pdf' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4" />
                        Download PDF
                      </>
                    )}
                  </Button>

                  <Button
                    className="w-full gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                    size="lg"
                    onClick={handleDownloadDOCX}
                    disabled={isGenerating}
                  >
                    {isGenerating && downloadType === 'docx' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating Word...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Download Word (Google Docs)
                      </>
                    )}
                  </Button>
                </div>
              )}

              {!isAIGenerated && (
                <div className="flex items-center gap-2 text-sm text-primary justify-center">
                  <CheckCircle className="w-4 h-4" />
                  <span>Manual content - Free download</span>
                </div>
              )}

              {isAIGenerated && !isPaid && (
                <p className="text-xs text-center text-muted-foreground">
                  Secure payment via Razorpay - UPI, Cards, Net Banking supported
                </p>
              )}
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 text-sm">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
              <Eye className="w-4 h-4" />
              Preview Note
            </h4>
            <p className="text-muted-foreground">
              The preview shows scaled versions of actual A4 pages.
              The downloaded PDF will be full-size and print-ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
