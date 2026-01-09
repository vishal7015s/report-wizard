import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-foreground mb-8">Refund and Cancellation Policy</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">No Refund Policy</h2>
            <p className="text-muted-foreground">
              Please read this policy carefully before making any payment on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">1. Digital Product Nature</h2>
            <p className="text-muted-foreground">
              Our AI-generated project reports are digital products that are delivered instantly upon successful payment. Due to the nature of digital goods:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
              <li>Once payment is completed, the report is generated and made available for download</li>
              <li>Digital products cannot be returned like physical goods</li>
              <li>The service is consumed at the time of delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">2. No Refunds</h2>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-4">
              <p className="text-foreground font-semibold">
                ⚠️ All payments are final. Once a payment is made, no refund will be provided under any circumstances.
              </p>
            </div>
            <p className="text-muted-foreground mt-4">
              By proceeding with the payment, you acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
              <li>You understand this is a no-refund policy</li>
              <li>You have reviewed the service details before payment</li>
              <li>You accept the AI-generated content as delivered</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">3. Cancellation</h2>
            <p className="text-muted-foreground">
              Since the report generation happens instantly after payment:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
              <li>Orders cannot be cancelled once payment is initiated</li>
              <li>There is no option to cancel a completed transaction</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">4. Technical Issues</h2>
            <p className="text-muted-foreground">
              In case of technical issues where:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
              <li>Payment was deducted but report was not generated</li>
              <li>Download link is not working</li>
              <li>Any other technical failure on our end</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Please contact us immediately with your payment details, and we will ensure you receive your report or resolve the issue.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">5. Free Manual Reports</h2>
            <p className="text-muted-foreground">
              We offer free manual report creation where you can enter your own content. We recommend trying the free option first to understand how the service works before opting for the paid AI-generated report.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">6. Contact Us</h2>
            <p className="text-muted-foreground">
              For any queries regarding this policy or technical support, please contact us through our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
