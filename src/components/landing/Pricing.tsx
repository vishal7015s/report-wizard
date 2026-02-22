import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const features = [
  'AI-generated chapter content',
  'All 7 chapters formatted',
  'Cover page with university logos',
  'Certificate, Declaration, Approval',
  'Table of Contents & Abstract',
  'AI-powered diagrams',
  'Instant PDF download',
  'Unlimited revisions before download',
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground">Manual editor is always free. AI generation at a flat rate.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-card">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Manual Editor</p>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-extrabold text-foreground">Free</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Write your own content with perfect formatting.</p>
            <Button
              variant="outline"
              className="w-full rounded-xl py-5 font-semibold"
              onClick={() => navigate('/create')}
            >
              Get Started Free
            </Button>
            <ul className="mt-6 space-y-3">
              {['College-approved formatting', 'All pages included', 'PDF download', 'No signup required'].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* AI Plan */}
          <div className="relative bg-card p-8 rounded-2xl border-2 border-primary shadow-glow">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                Most Popular
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">AI Generator</p>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-extrabold text-foreground">₹50</span>
              <span className="text-sm text-muted-foreground">/report</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">AI writes everything. You just review and download.</p>
            <Button
              className="w-full rounded-xl py-5 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
              onClick={() => navigate('/create')}
            >
              Generate with AI
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <ul className="mt-6 space-y-3">
              {features.map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
