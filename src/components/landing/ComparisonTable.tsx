import { Check, X, Sparkles } from 'lucide-react';

const ComparisonTable = () => {
  const rows = [
    { feature: 'Cover Page & Formatting', manual: true, ai: true },
    { feature: 'Certificates & Declaration', manual: true, ai: true },
    { feature: 'Table of Contents', manual: true, ai: true },
    { feature: 'All 7 Chapters', manual: 'Write yourself', ai: 'AI Generated' },
    { feature: 'Diagrams & Figures', manual: true, ai: true },
    { feature: 'Plagiarism Free Content', manual: '—', ai: true },
    { feature: 'Time Required', manual: '2-3 days', ai: '5 minutes' },
    { feature: 'Price', manual: 'Free', ai: '₹50' },
  ];

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Compare</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            Manual Editor vs AI Generator
          </h2>
          <p className="text-muted-foreground">Choose what works best for you</p>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft">
          <div className="grid grid-cols-3 bg-secondary/50 border-b border-border">
            <div className="p-5 text-sm font-semibold text-foreground">Feature</div>
            <div className="p-5 text-sm font-semibold text-foreground text-center">Manual Editor</div>
            <div className="p-5 text-sm font-semibold text-center">
              <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-bold">
                <Sparkles className="w-3 h-3" />
                AI Generator
              </span>
            </div>
          </div>

          {rows.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 border-b border-border/50 last:border-0 ${i % 2 === 0 ? '' : 'bg-secondary/20'}`}>
              <div className="p-5 text-sm text-foreground font-medium">{row.feature}</div>
              <div className="p-5 text-sm text-center flex items-center justify-center">
                {row.manual === true ? (
                  <Check className="w-5 h-5 text-primary" />
                ) : row.manual === false ? (
                  <X className="w-5 h-5 text-muted-foreground/40" />
                ) : (
                  <span className="text-muted-foreground">{row.manual}</span>
                )}
              </div>
              <div className="p-5 text-sm text-center flex items-center justify-center bg-primary/[0.02]">
                {row.ai === true ? (
                  <Check className="w-5 h-5 text-primary" />
                ) : row.ai === false ? (
                  <X className="w-5 h-5 text-muted-foreground/40" />
                ) : (
                  <span className="text-foreground font-medium">{row.ai}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
