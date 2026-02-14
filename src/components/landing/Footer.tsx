import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-[14px] text-background tracking-tight">ReportGen</span>
            </div>
            <p className="text-[13px] text-background/40 leading-relaxed">
              AI-powered project report generator for RGPV engineering students. Faculty-ready reports in minutes.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[12px] font-semibold text-background/60 uppercase tracking-[0.1em] mb-3.5">Product</h4>
            <ul className="space-y-2 text-[13px]">
              <li><Link to="/create" className="text-background/40 hover:text-background/70 transition-colors">Create Report</Link></li>
              <li><a href="#features" className="text-background/40 hover:text-background/70 transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-background/40 hover:text-background/70 transition-colors">Pricing</a></li>
              <li><a href="#faq" className="text-background/40 hover:text-background/70 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[12px] font-semibold text-background/60 uppercase tracking-[0.1em] mb-3.5">Company</h4>
            <ul className="space-y-2 text-[13px]">
              <li><Link to="/about-us" className="text-background/40 hover:text-background/70 transition-colors">About Us</Link></li>
              <li><Link to="/contact-us" className="text-background/40 hover:text-background/70 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[12px] font-semibold text-background/60 uppercase tracking-[0.1em] mb-3.5">Legal</h4>
            <ul className="space-y-2 text-[13px]">
              <li><Link to="/privacy-policy" className="text-background/40 hover:text-background/70 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="text-background/40 hover:text-background/70 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="text-background/40 hover:text-background/70 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/[0.06] pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-background/30">
            © {new Date().getFullYear()} ReportGen. Made for engineering students.
          </p>
          <p className="text-[12px] text-background/30">
            <a href="mailto:developer.vishalshivhare123@gmail.com" className="hover:text-background/50 transition-colors">
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
