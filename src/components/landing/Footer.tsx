import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-base text-background">ReportGen</span>
            </div>
            <p className="text-sm text-background/50 leading-relaxed">
              AI-powered project report generator for RGPV engineering students. Faculty-ready reports in minutes.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-background mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/create" className="text-background/50 hover:text-background transition-colors">Create Report</Link></li>
              <li><a href="#features" className="text-background/50 hover:text-background transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-background/50 hover:text-background transition-colors">Pricing</a></li>
              <li><a href="#faq" className="text-background/50 hover:text-background transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-background mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about-us" className="text-background/50 hover:text-background transition-colors">About Us</Link></li>
              <li><Link to="/contact-us" className="text-background/50 hover:text-background transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-background mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/privacy-policy" className="text-background/50 hover:text-background transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="text-background/50 hover:text-background transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="text-background/50 hover:text-background transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} ReportGen. Made for engineering students.
          </p>
          <p className="text-xs text-background/40">
            <a href="mailto:developer.vishalshivhare123@gmail.com" className="hover:text-background transition-colors">
              developer.vishalshivhare123@gmail.com
            </a>
            {' · '}
            +91 8839801203
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
