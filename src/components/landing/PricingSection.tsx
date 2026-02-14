import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PricingSection = () => {
  const navigate = useNavigate();

  const freeFeatures = [
    'Complete report formatting',
    'Cover page with logos',
    'Certificates & declaration',
    'PDF download',
  ];

  const aiFeatures = [
    'AI-generated content for all 7 chapters',
    'Unique, plagiarism-free technical writing',
    'Complete report with all pages',
    'Diagrams & figure suggestions',
    'Instant PDF download',
    'Unlimited revisions before download',
  ];

  return (
    <section id="pricing" className="py-24 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-[0.12em] mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-[2.25rem] font-extrabold text-foreground tracking-[-0.02em] leading-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-[15px] text-muted-foreground">Manual editor is always free. AI generation at one flat price.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {/* Free */}
          <div className="bg-card rounded-xl border border-border/60 p-7">
            <h3 className="text-[15px] font-semibold text-foreground mb-1">Manual Editor</h3>
            <p className="text-[13px] text-muted-foreground mb-5">Write your own content</p>
            <div className="mb-6">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">Free</span>
            </div>
            <ul className="space-y-2.5 mb-7">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full rounded-xl h-10 text-[13px] font-semibold border-border/60"
              onClick={() => navigate('/create')}
            >
              Start Free
            </Button>
          </div>

          {/* AI */}
          <div className="relative bg-card rounded-xl border-2 border-primary/60 p-7 shadow-glow">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-[11px] font-semibold shadow-sm">
                <Sparkles className="w-3 h-3" />
                Most Popular
              </span>
            </div>
            <h3 className="text-[15px] font-semibold text-foreground mb-1">AI Generator</h3>
            <p className="text-[13px] text-muted-foreground mb-5">Complete AI-powered report</p>
            <div className="mb-6">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">₹50</span>
              <span className="text-[13px] text-muted-foreground ml-1.5">one-time</span>
            </div>
            <ul className="space-y-2.5 mb-7">
              {aiFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-foreground/90">
                  <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="w-full rounded-xl h-10 text-[13px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/15"
              onClick={() => navigate('/create')}
            >
              Generate with AI
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
