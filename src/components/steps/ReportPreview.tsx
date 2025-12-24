import { useRef, useState, useMemo } from 'react';
import { useReportStore } from '@/store/reportStore';
import { Button } from '@/components/ui/button';
import { Download, CreditCard, Eye, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generatePDF } from '@/lib/pdfGenerator';
import PDFCoverPage from '@/components/pdf/PDFCoverPage';
import PDFCoverPageWithSVCE from '@/components/pdf/PDFCoverPageWithSVCE';
import PDFCertificate from '@/components/pdf/PDFCertificate';
import PDFDeclaration from '@/components/pdf/PDFDeclaration';
import PDFApproval from '@/components/pdf/PDFApproval';
import PDFAcknowledgement from '@/components/pdf/PDFAcknowledgement';
import PDFAbstract from '@/components/pdf/PDFAbstract';
import PDFTableOfContents from '@/components/pdf/PDFTableOfContents';
import PDFChapterTitle from '@/components/pdf/PDFChapterTitle';
import PDFChapterContent from '@/components/pdf/PDFChapterContent';
import { ChapterSection } from '@/types/report';

const ReportPreview = () => {
  const { reportData, contentMode } = useReportStore();
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const isAIGenerated = contentMode === 'ai';
  const price = isAIGenerated ? '₹10' : 'Free';

  const handleDownload = async () => {
    if (!pdfContainerRef.current) return;

    setIsGenerating(true);
    toast.info('Generating PDF... Please wait');

    try {
      const projectTitle = reportData.projectDetails.projectTitle || 'project-report';
      const filename = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      
      await generatePDF(pdfContainerRef.current, filename);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Roman numerals for preliminary pages
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  
  // Split sections into pages (balanced: not too much, not too little)
  const splitSectionsIntoPages = (sections: ChapterSection[]): ChapterSection[][] => {
    const MAX_COST_PER_PAGE = 1400;
    const MAX_SECTIONS_PER_PAGE = 2;
    const MAX_CHARS_PER_SECTION_CHUNK = 900;

    const splitLongString = (text: string, maxChars: number): string[] => {
      const out: string[] = [];
      let remaining = (text || '').trim();
      while (remaining.length > maxChars) {
        let cut = remaining.lastIndexOf(' ', maxChars);
        if (cut < Math.floor(maxChars * 0.6)) cut = maxChars;
        out.push(remaining.slice(0, cut).trim());
        remaining = remaining.slice(cut).trim();
      }
      if (remaining) out.push(remaining);
      return out.length ? out : [''];
    };

    const splitIntoChunks = (content: string): string[] => {
      const normalized = (content || '').trim();
      if (!normalized) return ['Content not provided.'];

      const paragraphs = normalized
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

      if (paragraphs.length <= 1 && normalized.length <= MAX_CHARS_PER_SECTION_CHUNK) {
        return [normalized];
      }

      const chunks: string[] = [];
      let buf = '';

      for (const p of paragraphs.length ? paragraphs : [normalized]) {
        if (p.length > MAX_CHARS_PER_SECTION_CHUNK) {
          // Flush buffer before splitting very long paragraph
          if (buf) {
            chunks.push(buf);
            buf = '';
          }
          chunks.push(...splitLongString(p, MAX_CHARS_PER_SECTION_CHUNK));
          continue;
        }

        const next = buf ? `${buf}\n\n${p}` : p;
        if (next.length > MAX_CHARS_PER_SECTION_CHUNK && buf) {
          chunks.push(buf);
          buf = p;
        } else {
          buf = next;
        }
      }

      if (buf) chunks.push(buf);
      return chunks.length ? chunks : [normalized];
    };

    const pages: ChapterSection[][] = [];
    let current: ChapterSection[] = [];
    let currentCost = 0;

    const pushPage = () => {
      if (current.length) pages.push(current);
      current = [];
      currentCost = 0;
    };

    const addToPage = (section: ChapterSection) => {
      const textCost = (section.content || '').length;
      const imageCost = (section.images?.length || 0) * 500;
      const cost = textCost + imageCost;

      const wouldOverflow = current.length > 0 && currentCost + cost > MAX_COST_PER_PAGE;
      const tooManySections = current.length >= MAX_SECTIONS_PER_PAGE;

      if (wouldOverflow || tooManySections) pushPage();

      current.push(section);
      currentCost += cost;
    };

    sections.forEach((section) => {
      const chunks = splitIntoChunks(section.content || '');

      chunks.forEach((chunk, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === chunks.length - 1;

        addToPage({
          ...section,
          id: `${section.id}-part-${idx + 1}`,
          heading: isFirst ? section.heading : `${section.heading} (Continued)`,
          content: chunk,
          images: isLast ? section.images : [],
        });
      });
    });

    if (current.length) pages.push(current);
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
    reportData.chapters.forEach((chapter) => {
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
  }, [reportData.chapters]);

  // Calculate total content pages
  let pageCounter = 1;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1a365d] mb-2">Preview Your Report</h2>
        <p className="text-muted-foreground">
          Review the formatted pages before downloading
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Preview Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-muted/50 p-8 rounded-xl overflow-auto max-h-[800px]">
            <div className="space-y-8 flex flex-col items-center">
              {/* Preliminary Pages */}
              <div className="transform scale-[0.5] origin-top">
                <PDFCoverPage data={reportData} pageNumber="I" />
              </div>
              
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFCoverPageWithSVCE data={reportData} pageNumber="II" />
              </div>
              
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFCertificate data={reportData} pageNumber="i" />
              </div>
              
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFDeclaration data={reportData} pageNumber="ii" />
              </div>
              
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFApproval data={reportData} pageNumber="iii" />
              </div>
              
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFAcknowledgement data={reportData} pageNumber="iv" />
              </div>
              
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFAbstract data={reportData} pageNumber="v" />
              </div>

              {/* Table of Contents */}
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFTableOfContents 
                  entries={tocEntries}
                  projectDetails={{
                    projectTitle: reportData.projectDetails.projectTitle,
                    department: reportData.projectDetails.department,
                  }}
                />
              </div>

              {/* Chapter Pages */}
              {reportData.chapters.map((chapter) => {
                const sectionPages = splitSectionsIntoPages(chapter.sections);
                const titlePageNum = pageCounter++;
                
                return (
                  <div key={chapter.id}>
                    {/* Chapter Title Page */}
                    <div className="transform scale-[0.5] origin-top -mt-[400px]">
                      <PDFChapterTitle 
                        chapterNumber={chapter.number}
                        chapterTitle={chapter.title}
                        data={reportData} 
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
                            data={reportData} 
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
            <PDFCoverPage data={reportData} pageNumber="I" />
            <PDFCoverPageWithSVCE data={reportData} pageNumber="II" />
            <PDFCertificate data={reportData} pageNumber="i" />
            <PDFDeclaration data={reportData} pageNumber="ii" />
            <PDFApproval data={reportData} pageNumber="iii" />
            <PDFAcknowledgement data={reportData} pageNumber="iv" />
            <PDFAbstract data={reportData} pageNumber="v" />
            <PDFTableOfContents 
              entries={tocEntries}
              projectDetails={{
                projectTitle: reportData.projectDetails.projectTitle,
                department: reportData.projectDetails.department,
              }}
            />
            {(() => {
              let pdfPageCounter = 1;
              return reportData.chapters.map((chapter) => {
                const sectionPages = splitSectionsIntoPages(chapter.sections);
                const titlePageNum = pdfPageCounter++;
                
                return (
                  <div key={chapter.id}>
                    <PDFChapterTitle 
                      chapterNumber={chapter.number}
                      chapterTitle={chapter.title}
                      data={reportData} 
                      pageNumber={titlePageNum.toString()} 
                    />
                    {sectionPages.map((sections, pageIdx) => {
                      const contentPageNum = pdfPageCounter++;
                      return (
                        <PDFChapterContent 
                          key={`${chapter.id}-page-${pageIdx}`}
                          sections={sections}
                          data={reportData} 
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
        <div className="space-y-6">
          <div className="bg-card rounded-xl border p-6 shadow-soft sticky top-24">
            <h3 className="font-bold text-lg text-[#1a365d] mb-4">Report Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">College</span>
                <span className="font-medium">{reportData.college?.shortName || 'SVCE'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Project Type</span>
                <span className="font-medium">{reportData.projectDetails.projectType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Branch</span>
                <span className="font-medium">{reportData.projectDetails.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Students</span>
                <span className="font-medium">{reportData.projectDetails.students.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chapters</span>
                <span className="font-medium">{reportData.chapters.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Pages</span>
                <span className="font-medium">{7 + reportData.chapters.length}</span>
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
                <span className={`text-2xl font-bold ${isAIGenerated ? 'text-[#1a365d]' : 'text-green-600'}`}>
                  {price}
                </span>
              </div>

              {isAIGenerated ? (
                <Button 
                  className="w-full gap-2 bg-[#1a365d] hover:bg-[#2d4a7c]" 
                  size="lg"
                  disabled={isGenerating}
                >
                  <CreditCard className="w-4 h-4" />
                  Pay & Download PDF
                </Button>
              ) : (
                <Button 
                  className="w-full gap-2 bg-green-600 hover:bg-green-700" 
                  size="lg"
                  onClick={handleDownload}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download PDF (Free)
                    </>
                  )}
                </Button>
              )}

              {!isAIGenerated && (
                <div className="flex items-center gap-2 text-sm text-green-600 justify-center">
                  <CheckCircle className="w-4 h-4" />
                  <span>Manual content - No payment required</span>
                </div>
              )}

              {isAIGenerated && (
                <p className="text-xs text-center text-muted-foreground">
                  Secure payment via Razorpay
                </p>
              )}
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 text-sm">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-[#1a365d]">
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
