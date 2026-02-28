import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PricingSection = () => {
  const navigate = useNavigate();

  const features = [
    'AI-generated content for all 7 chapters',
    'Unique, plagiarism-free technical writing',
    'Complete report with all pages',
    'Diagrams & figure suggestions',
    'Instant PDF download',
    'Unlimited revisions before download',
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground">Manual editor is always free. AI generation at one flat price.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="bg-card rounded-2xl border border-border p-8">
            <h3 className="text-lg font-bold text-foreground mb-1">Manual Editor</h3>
            <p className="text-sm text-muted-foreground mb-6">Write your own content</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-foreground">Free</span>
            </div>
            <ul className="space-y-3 mb-8">
              {['Complete report formatting', 'Cover page with logos', 'Certificates & declaration', 'PDF download'].map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full rounded-xl h-11 font-semibold"
              onClick={() => navigate('/create')}
            >
              Start Free
            </Button>
          </div>

          {/* AI Plan */}
          <div className="relative bg-card rounded-2xl border-2 border-primary p-8 shadow-lg shadow-primary/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold shadow-sm">
                <Sparkles className="w-3 h-3" />
                Most Popular
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">AI Generator</h3>
            <p className="text-sm text-muted-foreground mb-6">Complete AI-powered report</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-foreground">₹50</span>
              <span className="text-sm text-muted-foreground ml-2">one-time</span>
            </div>
            <ul className="space-y-3 mb-8">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="w-full rounded-xl h-11 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
              onClick={() => navigate('/create')}
            >
              Generate with AI
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
