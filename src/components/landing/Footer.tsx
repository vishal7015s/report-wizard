import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">ReportGen</span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              Generate college-approved, faculty-ready project reports for RGPV engineering students.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-background/90">Product</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/create" className="text-background/50 hover:text-background transition-colors">Create Report</Link></li>
              <li><a href="#pricing" className="text-background/50 hover:text-background transition-colors">Pricing</a></li>
              <li><a href="#faq" className="text-background/50 hover:text-background transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-background/90">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about-us" className="text-background/50 hover:text-background transition-colors">About Us</Link></li>
              <li><Link to="/contact-us" className="text-background/50 hover:text-background transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-background/90">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/privacy-policy" className="text-background/50 hover:text-background transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="text-background/50 hover:text-background transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="text-background/50 hover:text-background transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} ReportGen. Made for Engineering Students.
          </p>
          <p className="text-xs text-background/40">
            <a href="mailto:developer.vishalshivhare123@gmail.com" className="hover:text-background transition-colors">
              developer.vishalshivhare123@gmail.com
            </a>
            {' '} • +91 8839801203
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
