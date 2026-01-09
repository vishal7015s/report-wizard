import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-foreground mb-8">Terms and Conditions</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to AI Project Report Generator. By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">2. Services</h2>
            <p className="text-muted-foreground">
              We provide an AI-powered project report generation service for students. Our service includes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
              <li>Manual report creation (Free)</li>
              <li>AI-generated report creation (Paid - ₹50)</li>
              <li>Download in PDF and DOCX formats</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">3. Payment Terms</h2>
            <p className="text-muted-foreground">
              AI-generated reports require a one-time payment of ₹50. Payment is processed securely through Instamojo payment gateway. By making a payment, you agree to our Refund and Cancellation Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">4. User Responsibilities</h2>
            <p className="text-muted-foreground">
              Users are responsible for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
              <li>Providing accurate information for report generation</li>
              <li>Using the generated reports for legitimate academic purposes</li>
              <li>Not sharing or reselling the generated content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">5. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The generated reports are for personal academic use only. Users may use the content for their academic submissions but should not claim it as entirely original work without proper modifications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              We provide the service "as is" and do not guarantee that the generated content will meet all academic requirements. Users are advised to review and modify the content as needed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">7. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">8. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms and Conditions, please contact us through our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
