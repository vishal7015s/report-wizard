import { FileText, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-border/40">
      <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-[15px] text-foreground tracking-tight">ReportGen</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <a href="#features" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3.5 py-2 rounded-lg hover:bg-secondary/60">Features</a>
          <a href="#pricing" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3.5 py-2 rounded-lg hover:bg-secondary/60">Pricing</a>
          <a href="#faq" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3.5 py-2 rounded-lg hover:bg-secondary/60">FAQ</a>
          <Link to="/about-us" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3.5 py-2 rounded-lg hover:bg-secondary/60">About</Link>
        </div>

        <div className="flex items-center gap-2.5">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-[13px] font-medium hidden sm:inline-flex h-8 px-3"
            onClick={() => navigate('/contact-us')}
          >
            Contact
          </Button>
          <Button 
            size="sm"
            className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-[13px] px-4 h-8 shadow-sm transition-all duration-200 hover:shadow-md"
            onClick={() => navigate('/create')}
          >
            Get Started
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl px-6 py-4 space-y-1">
          <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground py-2" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground py-2" onClick={() => setMobileOpen(false)}>Pricing</a>
          <a href="#faq" className="block text-sm text-muted-foreground hover:text-foreground py-2" onClick={() => setMobileOpen(false)}>FAQ</a>
          <Link to="/about-us" className="block text-sm text-muted-foreground hover:text-foreground py-2" onClick={() => setMobileOpen(false)}>About</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
