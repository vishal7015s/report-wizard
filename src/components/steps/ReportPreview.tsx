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

  const { isProcessing, isPaid, initiatePayment } = useRazorpayPayment();

  const isAIGenerated = contentMode === 'ai';
  const isPreviewOnly = isAIGenerated && !isPaid && activeData.chapters.length <= 3;
  const price = isAIGenerated ? '₹50' : 'Free';

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
    if (success) await generateRemainingChapters();
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
      toast.success('Word document downloaded successfully!');
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

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  
  const splitSectionsIntoPages = (sections: ChapterSection[]): ChapterSection[][] => {
    const MAX_CHARS_PER_PAGE = 1500;
    const MIN_CHARS_FOR_NEW_PAGE = 300;
    const MAX_SECTIONS_PER_PAGE = 2;
    const IMAGE_COST = 1800;
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

    const findNaturalBreakPoint = (content: string, maxLength: number): number => {
      if (content.length <= maxLength) return content.length;
      const paragraphBreak = content.lastIndexOf('\n\n', maxLength);
      if (paragraphBreak > maxLength * 0.5) return paragraphBreak;
      const lineBreak = content.lastIndexOf('\n', maxLength);
      if (lineBreak > maxLength * 0.4) return lineBreak;
      const sentenceEnd = content.lastIndexOf('. ', maxLength);
      if (sentenceEnd > maxLength * 0.4) return sentenceEnd + 1;
      const period = content.lastIndexOf('.', maxLength);
      if (period > maxLength * 0.3) return period + 1;
      return maxLength;
    };

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

    const shouldKeepTogether = (section: ChapterSection): boolean => {
      const cost = calculateCost(section);
      const content = section.content || '';
      if (section.images && section.images.length > 0) {
        const textOnly = (content.length) + HEADING_COST;
        return textOnly + (section.images.length * IMAGE_COST) <= MAX_CHARS_PER_PAGE;
      }
      if (cost <= MAX_CHARS_PER_PAGE) return true;
      const bulletLines = (content.match(/^[•\-\*○]\s/gm) || []).length;
      const totalLines = content.split('\n').filter(l => l.trim()).length;
      if (bulletLines > totalLines * 0.5 && cost <= MAX_CHARS_PER_PAGE * 1.3) return true;
      return false;
    };

    sections.forEach((section) => {
      const sectionCost = calculateCost(section);
      if (sectionCost > MAX_CHARS_PER_PAGE && !shouldKeepTogether(section)) {
        if (currentPage.length > 0) flushPage();
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
        const remainingSpace = MAX_CHARS_PER_PAGE - currentPageCost;
        const wouldExceed = sectionCost > remainingSpace;
        const tooManySections = currentPage.length >= MAX_SECTIONS_PER_PAGE;
        if (wouldExceed || tooManySections) {
          if (currentPageCost >= MIN_CHARS_FOR_NEW_PAGE) {
            flushPage();
          } else if (wouldExceed && currentPage.length > 0) {
            if (currentPageCost + sectionCost > MAX_CHARS_PER_PAGE * 1.1) flushPage();
          }
        }
        currentPage.push(section);
        currentPageCost += sectionCost;
      }
    });

    flushPage();
    return pages.length ? pages : [[]];
  };

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
      entries.push({ title: `Chapter ${chapter.number} ${chapter.title}`, pageNumber: currentPage.toString(), isChapter: true });
      let sectionPage = currentPage + 1;
      chapter.sections.forEach((section, sectionIdx) => {
        entries.push({ title: `${chapter.number}.${sectionIdx + 1} ${section.heading}`, pageNumber: sectionPage.toString(), isSection: true });
        const sectionCost = (section.content?.length || 0) + (section.images?.length || 0) * 500;
        if (sectionCost > 700) sectionPage++;
      });
      currentPage += 1 + sectionPages.length;
    });

    return entries;
  }, [activeData.chapters]);

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
      figureCounter = 1;
    });

    return figures;
  }, [activeData.chapters]);

  let pageCounter = 1;

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">Preview Your Report</h2>
        <p className="text-sm text-muted-foreground">
          Review the formatted pages before downloading
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Preview Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-secondary/20 p-8 rounded-2xl overflow-auto max-h-[800px] border border-border/30">
            <div className="space-y-8 flex flex-col items-center">
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
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFListOfFigures 
                  figures={figureEntries}
                  projectDetails={{ projectTitle: activeData.projectDetails.projectTitle, department: activeData.projectDetails.department }}
                />
              </div>
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFTableOfContents 
                  entries={tocEntries}
                  projectDetails={{ projectTitle: activeData.projectDetails.projectTitle, department: activeData.projectDetails.department }}
                />
              </div>

              {activeData.chapters.map((chapter) => {
                const sectionPages = splitSectionsIntoPages(chapter.sections);
                const titlePageNum = pageCounter++;
                return (
                  <div key={chapter.id}>
                    <div className="transform scale-[0.5] origin-top -mt-[400px]">
                      <PDFChapterTitle chapterNumber={chapter.number} chapterTitle={chapter.title} data={activeData} pageNumber={titlePageNum.toString()} />
                    </div>
                    {sectionPages.map((sections, pageIdx) => {
                      const contentPageNum = pageCounter++;
                      return (
                        <div key={`${chapter.id}-page-${pageIdx}`} className="transform scale-[0.5] origin-top -mt-[400px]">
                          <PDFChapterContent sections={sections} data={activeData} pageNumber={contentPageNum.toString()} />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hidden Full-Size PDF Container */}
          <div ref={pdfContainerRef} className="absolute left-[-9999px] top-0" style={{ width: '210mm' }}>
            <PDFCoverPage data={activeData} pageNumber="I" />
            <PDFCoverPageWithSVCE data={activeData} pageNumber="II" />
            <PDFCertificate data={activeData} pageNumber="i" />
            <PDFDeclaration data={activeData} pageNumber="ii" />
            <PDFApproval data={activeData} pageNumber="iii" />
            <PDFAcknowledgement data={activeData} pageNumber="iv" />
            <PDFAbstract data={activeData} pageNumber="v" />
            <PDFListOfFigures figures={figureEntries} projectDetails={{ projectTitle: activeData.projectDetails.projectTitle, department: activeData.projectDetails.department }} />
            <PDFTableOfContents entries={tocEntries} projectDetails={{ projectTitle: activeData.projectDetails.projectTitle, department: activeData.projectDetails.department }} />
            {(() => {
              let hiddenPageCounter = 1;
              return activeData.chapters.map((chapter) => {
                const sectionPages = splitSectionsIntoPages(chapter.sections);
                const titlePageNum = hiddenPageCounter++;
                return (
                  <div key={`hidden-${chapter.id}`}>
                    <PDFChapterTitle chapterNumber={chapter.number} chapterTitle={chapter.title} data={activeData} pageNumber={titlePageNum.toString()} />
                    {sectionPages.map((sections, pageIdx) => {
                      const contentPageNum = hiddenPageCounter++;
                      return <PDFChapterContent key={`hidden-${chapter.id}-page-${pageIdx}`} sections={sections} data={activeData} pageNumber={contentPageNum.toString()} />;
                    })}
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              Download Report
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Project</span>
                <span className="font-medium text-xs truncate max-w-[150px]" title={activeData.projectDetails.projectTitle}>
                  {activeData.projectDetails.projectTitle || 'Untitled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Students</span>
                <span className="font-medium text-xs">{activeData.projectDetails.students.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Chapters</span>
                <span className="font-medium text-xs">{activeData.chapters.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Total Pages</span>
                <span className="font-medium text-xs">{7 + activeData.chapters.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Content Mode</span>
                <span className="font-medium text-xs">{isAIGenerated ? 'AI Generated' : 'Manual'}</span>
              </div>
            </div>

            <hr className="my-5 border-border/30" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Total</span>
                <span className={`text-2xl font-extrabold ${isAIGenerated ? 'text-primary' : 'text-primary'}`}>
                  {price}
                </span>
              </div>

              {isAIGenerated ? (
                isPaid && !isGeneratingFull ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-primary justify-center mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Payment verified - Full report ready!</span>
                    </div>
                    <Button className="w-full gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" size="lg" onClick={handleDownloadPDF} disabled={isGenerating}>
                      {isGenerating && downloadType === 'pdf' ? <><Loader2 className="w-4 h-4 animate-spin" />Generating PDF...</> : <><FileDown className="w-4 h-4" />Download PDF</>}
                    </Button>
                    <Button className="w-full gap-2 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold" size="lg" onClick={handleDownloadDOCX} disabled={isGenerating}>
                      {isGenerating && downloadType === 'docx' ? <><Loader2 className="w-4 h-4 animate-spin" />Generating Word...</> : <><FileText className="w-4 h-4" />Download Word (Google Docs)</>}
                    </Button>
                  </div>
                ) : isGeneratingFull ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-primary justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating full report (Chapters 4-7)...</span>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">Please wait. Don't close this page.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {isPreviewOnly && (
                      <div className="flex items-center gap-2 text-xs text-amber-500 justify-center bg-amber-500/10 rounded-xl p-2.5 border border-amber-500/20">
                        <Lock className="w-3 h-3" />
                        <span>Preview: 3 chapters shown. Pay to unlock all 7.</span>
                      </div>
                    )}
                    <Button className="w-full gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow" size="lg" onClick={handlePaymentAndGenerate} disabled={isProcessing}>
                      {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" />Processing...</> : <><CreditCard className="w-4 h-4" />Pay ₹50 & Generate Full Report</>}
                    </Button>
                  </div>
                )
              ) : (
                <div className="space-y-2">
                  <Button className="w-full gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" size="lg" onClick={handleDownloadPDF} disabled={isGenerating}>
                    {isGenerating && downloadType === 'pdf' ? <><Loader2 className="w-4 h-4 animate-spin" />Generating PDF...</> : <><FileDown className="w-4 h-4" />Download PDF</>}
                  </Button>
                  <Button className="w-full gap-2 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold" size="lg" onClick={handleDownloadDOCX} disabled={isGenerating}>
                    {isGenerating && downloadType === 'docx' ? <><Loader2 className="w-4 h-4 animate-spin" />Generating Word...</> : <><FileText className="w-4 h-4" />Download Word (Google Docs)</>}
                  </Button>
                </div>
              )}

              {!isAIGenerated && (
                <div className="flex items-center gap-2 text-xs text-primary justify-center">
                  <CheckCircle className="w-4 h-4" />
                  <span>Manual content - Free download</span>
                </div>
              )}

              {isAIGenerated && !isPaid && (
                <p className="text-xs text-center text-muted-foreground">
                  Secure payment via Razorpay - UPI, Cards, Net Banking
                </p>
              )}
            </div>
          </div>

          <div className="bg-secondary/20 rounded-2xl p-5 text-sm border border-border/30">
            <h4 className="font-bold text-xs mb-2 flex items-center gap-2 text-foreground">
              <Eye className="w-4 h-4 text-primary" />
              Preview Note
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
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
