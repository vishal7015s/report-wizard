import { FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">ReportGen</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/about-us" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link to="/contact-us" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
        </div>

        <Button
          onClick={() => navigate('/create')}
          className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm text-sm font-medium px-5"
        >
          Create Report
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
