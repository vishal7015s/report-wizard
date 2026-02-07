import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">1. Introduction</h2>
            <p className="text-muted-foreground">
              AI Project Report Generator ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">2. Information We Collect</h2>
            <p className="text-muted-foreground">We collect the following types of information:</p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li><strong>Personal Information:</strong> Name, enrollment number, college name, branch, and session year — provided voluntarily for report generation.</li>
              <li><strong>Project Information:</strong> Project title, guide name, and chapter content entered by you for report creation.</li>
              <li><strong>Payment Information:</strong> Payment transactions are processed securely through Razorpay. We do not store your card details, bank account numbers, or UPI IDs on our servers.</li>
              <li><strong>Usage Data:</strong> Browser type, device information, and pages visited — collected automatically for improving our services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">3. How We Use Your Information</h2>
            <p className="text-muted-foreground">Your information is used for:</p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Generating your project report with accurate details</li>
              <li>Processing payments through our payment gateway (Razorpay)</li>
              <li>Providing customer support and responding to inquiries</li>
              <li>Improving our platform and user experience</li>
              <li>Sending important service-related communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">4. Payment Processing</h2>
            <p className="text-muted-foreground">
              All payment transactions are handled by <strong>Razorpay</strong>, a PCI-DSS compliant payment gateway. When you make a payment:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Your payment details are encrypted and processed directly by Razorpay</li>
              <li>We only receive transaction confirmation (payment ID, status, and amount)</li>
              <li>We do not store sensitive financial data like card numbers or bank details</li>
              <li>Razorpay's privacy policy applies to all payment data: <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://razorpay.com/privacy/</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">5. Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground">
              We may use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Remember your preferences and session data</li>
              <li>Analyze website traffic using tools like Google Analytics</li>
              <li>Improve website functionality and performance</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              You can disable cookies through your browser settings, though some features may not work properly without them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">6. Third-Party Services</h2>
            <p className="text-muted-foreground">We use the following third-party services:</p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li><strong>Razorpay:</strong> For secure payment processing</li>
              <li><strong>Google Analytics:</strong> For website usage analytics</li>
              <li><strong>AI Services:</strong> For generating report content (no personal data is shared with AI models)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">7. Data Security</h2>
            <p className="text-muted-foreground">
              We implement industry-standard security measures to protect your data, including encrypted connections (HTTPS), secure servers, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">8. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information only for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Report data entered by you is processed in real-time and is not permanently stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">9. Your Rights</h2>
            <p className="text-muted-foreground">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction of inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              To exercise any of these rights, please contact us at <a href="mailto:developer.vishalshivhare123@gmail.com" className="text-primary hover:underline">developer.vishalshivhare123@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">11. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mt-2">
              <p className="text-muted-foreground">📧 Email: <a href="mailto:developer.vishalshivhare123@gmail.com" className="text-primary hover:underline">developer.vishalshivhare123@gmail.com</a></p>
              <p className="text-muted-foreground">📞 Phone: <a href="tel:+918839801203" className="text-primary hover:underline">+91 8839801203</a></p>
              <p className="text-muted-foreground">📍 Address: Vijay Nagar Colony, Indorama Pithampur, Madhya Pradesh, India - 454774</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
