import { useRef, useState } from 'react';
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
import PDFChapter from '@/components/pdf/PDFChapter';

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
  
  // Calculate chapter page numbers (starting from 1 after preliminary pages)
  const getChapterPageNumber = (index: number) => (index + 1).toString();

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
                <PDFCertificate data={reportData} pageNumber="III" />
              </div>
              
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFDeclaration data={reportData} pageNumber="IV" />
              </div>
              
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFApproval data={reportData} pageNumber="V" />
              </div>
              
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFAcknowledgement data={reportData} pageNumber="VI" />
              </div>
              
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFAbstract data={reportData} pageNumber="VII" />
              </div>

              {/* Chapter Pages */}
              {reportData.chapters.map((chapter, index) => (
                <div key={chapter.id} className="transform scale-[0.5] origin-top -mt-[400px]">
                  <PDFChapter 
                    chapter={chapter} 
                    data={reportData} 
                    pageNumber={getChapterPageNumber(index)} 
                  />
                </div>
              ))}
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
            <PDFCertificate data={reportData} pageNumber="III" />
            <PDFDeclaration data={reportData} pageNumber="IV" />
            <PDFApproval data={reportData} pageNumber="V" />
            <PDFAcknowledgement data={reportData} pageNumber="VI" />
            <PDFAbstract data={reportData} pageNumber="VII" />
            {reportData.chapters.map((chapter, index) => (
              <PDFChapter 
                key={chapter.id}
                chapter={chapter} 
                data={reportData} 
                pageNumber={getChapterPageNumber(index)} 
              />
            ))}
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
