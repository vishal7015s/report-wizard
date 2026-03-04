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

  const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const normalizeChapterTitle = (chapterNumber: number, title: string) => {
    const raw = (title || '').trim();
    if (!raw) return `Chapter ${chapterNumber}`;

    let normalized = raw
      .replace(/^chapter\s*\d+\s*[:.)-]?\s*/i, '')
      .replace(/^chapter\s*[:.)-]?\s*/i, '')
      .trim();

    const chapterNumberRegex = new RegExp(`^${escapeRegExp(String(chapterNumber))}\\s*[:.)-]?\\s*`, 'i');
    normalized = normalized.replace(chapterNumberRegex, '').trim();

    return normalized || raw;
  };

  const normalizeSectionHeading = (sectionNumber: string, heading: string) => {
    const raw = (heading || '').trim();
    if (!raw) return '';

    const sectionRegex = new RegExp(`^${escapeRegExp(sectionNumber)}\\s*[:.)-]?\\s*`, 'i');
    return raw.replace(sectionRegex, '').trim();
  };

  // Split sections into fixed A4 pages with smart text + image packing.
  // - Uses char-based budgeting for text
  // - Places images on the same page when space is available
  // - Never repeats section heading on continuation fragments
  const splitSectionsIntoPages = (sections: ChapterSection[]): ChapterSection[][] => {
    const MAX_PAGE_UNITS = 2500;
    const PAGE_SAFETY_BUFFER = 180; // keep reserve so rendered text never gets cut
    const USABLE_PAGE_UNITS = MAX_PAGE_UNITS - PAGE_SAFETY_BUFFER;
    const IMAGE_UNITS = 700;
    const HEADING_UNITS = 140;
    const MIN_TEXT_CHUNK_UNITS = 220;
    const TEXT_THRESHOLD_FOR_IMAGE = 1550;

    const pages: ChapterSection[][] = [];
    let currentPage: ChapterSection[] = [];
    let usedBudget = 0;
    let currentPageTextUnits = 0;

    const flushPage = () => {
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
        usedBudget = 0;
        currentPageTextUnits = 0;
      }
    };

    const remainingBudget = () => USABLE_PAGE_UNITS - usedBudget;

    const estimateTextUnits = (value: string) => {
      const text = value.replace(/\r/g, '');
      const chars = text.length;
      const lineBreaks = (text.match(/\n/g) || []).length;
      const paragraphBreaks = (text.match(/\n\s*\n/g) || []).length;
      const bulletLines = (text.match(/(?:^|\n)\s*[•\-\*○]\s+/g) || []).length;
      const numberedLines = (text.match(/(?:^|\n)\s*\(?\[?\d+\]?\)?[.):]\s+/g) || []).length;

      return (
        chars +
        lineBreaks * 20 +
        paragraphBreaks * 60 +
        bulletLines * 120 +
        numberedLines * 90
      );
    };

    const findBreakPoint = (content: string, maxLength: number): number => {
      if (content.length <= maxLength) return content.length;

      const paragraphBreak = content.lastIndexOf('\n\n', maxLength);
      if (paragraphBreak > maxLength * 0.55) return paragraphBreak;

      const lineBreak = content.lastIndexOf('\n', maxLength);
      if (lineBreak > maxLength * 0.45) return lineBreak;

      const sentenceEnd = content.lastIndexOf('. ', maxLength);
      if (sentenceEnd > maxLength * 0.35) return sentenceEnd + 1;

      return maxLength;
    };

    const takeChunkByUnits = (content: string, maxUnits: number) => {
      if (!content.trim()) {
        return { chunk: '', rest: '', units: 0 };
      }

      if (estimateTextUnits(content) <= maxUnits) {
        const trimmed = content.trim();
        return { chunk: trimmed, rest: '', units: estimateTextUnits(trimmed) };
      }

      let candidateLength = Math.max(120, Math.min(content.length, Math.floor(maxUnits * 0.92)));
      let breakPoint = findBreakPoint(content, candidateLength);
      let chunk = content.slice(0, breakPoint).trim();
      let units = estimateTextUnits(chunk);

      while (chunk && units > maxUnits && candidateLength > 120) {
        candidateLength = Math.max(120, Math.floor(candidateLength * 0.85));
        breakPoint = findBreakPoint(content, candidateLength);
        chunk = content.slice(0, breakPoint).trim();
        units = estimateTextUnits(chunk);
      }

      if (!chunk) {
        const fallbackPoint = Math.min(content.length, 120);
        const fallbackChunk = content.slice(0, fallbackPoint).trim();
        return {
          chunk: fallbackChunk,
          rest: content.slice(fallbackPoint).trim(),
          units: estimateTextUnits(fallbackChunk),
        };
      }

      return {
        chunk,
        rest: content.slice(breakPoint).trim(),
        units,
      };
    };

    const shownHeadings = new Set<string>();

    sections.forEach((section) => {
      let text = (section.content || '').trim();
      let images = [...(section.images || [])];

      if (!text && images.length === 0) return;

      const cleanedHeading = normalizeSectionHeading(section.number, section.heading);
      const displayHeading = cleanedHeading ? `${section.number} ${cleanedHeading}` : section.number;
      const isFirstFragment = !shownHeadings.has(section.id);

      let fragmentIdx = 0;

      while (text.length > 0) {
        const showHeading = isFirstFragment && fragmentIdx === 0 && !shownHeadings.has(section.id);
        const headingCost = showHeading ? HEADING_UNITS : 0;
        const availableUnits = remainingBudget() - headingCost;

        if (availableUnits < MIN_TEXT_CHUNK_UNITS && currentPage.length > 0) {
          flushPage();
          continue;
        }

        const chunkBudget = Math.max(MIN_TEXT_CHUNK_UNITS, availableUnits);
        const { chunk, rest, units: chunkUnits } = takeChunkByUnits(text, chunkBudget);

        if (!chunk && currentPage.length > 0) {
          flushPage();
          continue;
        }

        text = rest;

        const budgetAfterText = usedBudget + headingCost + chunkUnits;
        const totalTextAfter = currentPageTextUnits + chunkUnits;
        let imgCount = 0;

        if (totalTextAfter <= TEXT_THRESHOLD_FOR_IMAGE) {
          while (
            imgCount < images.length &&
            budgetAfterText + (imgCount + 1) * IMAGE_UNITS <= USABLE_PAGE_UNITS
          ) {
            imgCount++;
          }
        }

        const placedImages = images.slice(0, imgCount);
        images = images.slice(imgCount);

        if (showHeading) shownHeadings.add(section.id);

        currentPage.push({
          ...section,
          id: fragmentIdx === 0 ? section.id : `${section.id}-f${fragmentIdx}`,
          heading: showHeading ? displayHeading : '',
          content: chunk,
          images: placedImages,
        });

        usedBudget += headingCost + chunkUnits + placedImages.length * IMAGE_UNITS;
        currentPageTextUnits += chunkUnits;
        fragmentIdx++;

        if (remainingBudget() < MIN_TEXT_CHUNK_UNITS) {
          flushPage();
        }
      }

      while (images.length > 0) {
        if (currentPageTextUnits > TEXT_THRESHOLD_FOR_IMAGE && currentPage.length > 0) {
          flushPage();
          continue;
        }

        let imgCount = 0;
        while (
          imgCount < images.length &&
          usedBudget + (imgCount + 1) * IMAGE_UNITS <= USABLE_PAGE_UNITS
        ) {
          imgCount++;
        }

        if (imgCount === 0 && currentPage.length > 0) {
          flushPage();
          continue;
        }

        if (imgCount === 0) imgCount = 1;

        const showHeading = isFirstFragment && fragmentIdx === 0 && !shownHeadings.has(section.id);
        if (showHeading) shownHeadings.add(section.id);

        const placedImages = images.slice(0, imgCount);
        images = images.slice(imgCount);

        currentPage.push({
          ...section,
          id: fragmentIdx === 0 ? section.id : `${section.id}-f${fragmentIdx}`,
          heading: showHeading ? displayHeading : '',
          content: '',
          images: placedImages,
        });

        usedBudget += placedImages.length * IMAGE_UNITS;
        fragmentIdx++;

        if (remainingBudget() < IMAGE_UNITS) {
          flushPage();
        }
      }
    });

    flushPage();
    return pages.length ? pages : [[]];
  };

  // Generate TOC entries with calculated page numbers
  const tocEntries = useMemo(() => {
    const entries: { title: string; pageNumber: string; isChapter?: boolean; isSection?: boolean }[] = [
      { title: 'Certificate', pageNumber: 'III' },
      { title: 'Candidate Declaration', pageNumber: 'IV' },
      { title: 'Project Approval Certificate', pageNumber: 'V' },
      { title: 'Acknowledgement', pageNumber: 'VI' },
      { title: 'Abstract', pageNumber: 'VII' },
      { title: 'List of Figures', pageNumber: 'VIII' },
      { title: 'List of Tables', pageNumber: 'IX' },
      { title: 'Table of Content', pageNumber: 'X' },
    ];

    let currentPage = 1;
    activeData.chapters.forEach((chapter) => {
      const sectionPages = splitSectionsIntoPages(chapter.sections);
      
      // Add chapter title
      entries.push({
        title: `Chapter ${chapter.number} ${normalizeChapterTitle(chapter.number, chapter.title)}`,
        pageNumber: currentPage.toString(),
        isChapter: true,
      });
      
      // Add section entries
      let sectionPage = currentPage + 1;
      chapter.sections.forEach((section) => {
        const normalizedSection = normalizeSectionHeading(section.number, section.heading);
        entries.push({
          title: normalizedSection ? `${section.number} ${normalizedSection}` : section.number,
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
                <PDFCertificate data={activeData} pageNumber="i" />
              </div>
              
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFDeclaration data={activeData} pageNumber="ii" />
              </div>
              
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFApproval data={activeData} pageNumber="iii" />
              </div>
              
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFAcknowledgement data={activeData} pageNumber="iv" />
              </div>
              
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFAbstract data={activeData} pageNumber="v" />
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
                        chapterTitle={normalizeChapterTitle(chapter.number, chapter.title)}
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
            <PDFCoverPage data={activeData} pageNumber="I" />
            <PDFCoverPageWithSVCE data={activeData} pageNumber="II" />
            <PDFCertificate data={activeData} pageNumber="i" />
            <PDFDeclaration data={activeData} pageNumber="ii" />
            <PDFApproval data={activeData} pageNumber="iii" />
            <PDFAcknowledgement data={activeData} pageNumber="iv" />
            <PDFAbstract data={activeData} pageNumber="v" />
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
                      chapterTitle={normalizeChapterTitle(chapter.number, chapter.title)}
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
