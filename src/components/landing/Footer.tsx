import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary/40 text-foreground border-t border-border/40">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">ReportGen</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Generate college-approved, faculty-ready project reports for RGPV engineering students.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-foreground">Product</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/create" className="text-muted-foreground hover:text-foreground transition-colors">Create Report</Link></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-foreground">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about-us" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact-us" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="text-muted-foreground hover:text-foreground transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ReportGen. Made for Engineering Students.
          </p>
          <p className="text-xs text-muted-foreground">
            <a href="mailto:developer.vishalshivhare123@gmail.com" className="hover:text-foreground transition-colors">
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
