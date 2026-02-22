import { CheckCircle, X, Sparkles } from 'lucide-react';

const rows = [
  { feature: 'Cover Page & Logos', manual: true, ai: true },
  { feature: 'Certificate & Declaration', manual: true, ai: true },
  { feature: 'Table of Contents', manual: true, ai: true },
  { feature: 'All 7 Chapters Formatted', manual: true, ai: true },
  { feature: 'AI-Generated Content', manual: false, ai: true },
  { feature: 'AI Diagrams', manual: false, ai: true },
  { feature: 'Instant Generation', manual: false, ai: true },
  { feature: 'Price', manual: 'Free', ai: '₹50' },
];

const ComparisonTable = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">Compare Options</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Manual Editor vs AI Generator
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="overflow-hidden rounded-2xl border border-border shadow-card">
            {/* Header */}
            <div className="grid grid-cols-3 bg-secondary/50">
              <div className="p-5 text-sm font-bold text-foreground">Feature</div>
              <div className="p-5 text-sm font-bold text-foreground text-center">Manual Editor</div>
              <div className="p-5 text-sm font-bold text-center bg-primary/8 text-primary border-x border-primary/15">
                <div className="flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  AI Generator
                </div>
              </div>
            </div>

            {/* Rows */}
            {rows.map((row, index) => (
              <div key={index} className="grid grid-cols-3 border-t border-border/50">
                <div className="p-4 text-sm text-foreground">{row.feature}</div>
                <div className="p-4 flex items-center justify-center">
                  {typeof row.manual === 'boolean' ? (
                    row.manual ? (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/40" />
                    )
                  ) : (
                    <span className="text-sm font-semibold text-foreground">{row.manual}</span>
                  )}
                </div>
                <div className="p-4 flex items-center justify-center bg-primary/[0.03] border-x border-primary/10">
                  {typeof row.ai === 'boolean' ? (
                    row.ai ? (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/40" />
                    )
                  ) : (
                    <span className="text-sm font-bold text-primary">{row.ai}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
