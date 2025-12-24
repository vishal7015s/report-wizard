import { useReportStore } from '@/store/reportStore';
import { Button } from '@/components/ui/button';
import { Download, CreditCard, Eye, CheckCircle } from 'lucide-react';
import PDFCoverPage from '@/components/pdf/PDFCoverPage';
import PDFCoverPageWithSVCE from '@/components/pdf/PDFCoverPageWithSVCE';
import PDFCertificate from '@/components/pdf/PDFCertificate';
import PDFDeclaration from '@/components/pdf/PDFDeclaration';
import PDFApproval from '@/components/pdf/PDFApproval';
import PDFAcknowledgement from '@/components/pdf/PDFAcknowledgement';
import PDFAbstract from '@/components/pdf/PDFAbstract';

const ReportPreview = () => {
  const { reportData, contentMode } = useReportStore();

  const isAIGenerated = contentMode === 'ai';
  const price = isAIGenerated ? '₹10' : 'Free';

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
              {/* Page 1: Cover with RGPV Logo */}
              <div className="transform scale-[0.5] origin-top">
                <PDFCoverPage data={reportData} pageNumber="I" />
              </div>
              
              {/* Page 2: Cover with SVCE Logo */}
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFCoverPageWithSVCE data={reportData} pageNumber="II" />
              </div>
              
              {/* Page 3: Certificate */}
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFCertificate data={reportData} pageNumber="III" />
              </div>
              
              {/* Page 4: Candidate Declaration */}
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFDeclaration data={reportData} pageNumber="IV" />
              </div>
              
              {/* Page 5: Project Approval */}
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFApproval data={reportData} pageNumber="V" />
              </div>
              
              {/* Page 6: Acknowledgement */}
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFAcknowledgement data={reportData} pageNumber="VI" />
              </div>
              
              {/* Page 7: Abstract */}
              <div className="transform scale-[0.5] origin-top -mt-[400px]">
                <PDFAbstract data={reportData} pageNumber="VII" />
              </div>
            </div>
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
                <Button className="w-full gap-2 bg-[#1a365d] hover:bg-[#2d4a7c]" size="lg">
                  <CreditCard className="w-4 h-4" />
                  Pay & Download PDF
                </Button>
              ) : (
                <Button className="w-full gap-2 bg-green-600 hover:bg-green-700" size="lg">
                  <Download className="w-4 h-4" />
                  Download PDF (Free)
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
