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
    <section className="py-24 lg:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-[0.12em] mb-3">Compare</p>
          <h2 className="text-3xl sm:text-[2.25rem] font-extrabold text-foreground tracking-[-0.02em] leading-tight mb-4">
            Manual Editor vs AI Generator
          </h2>
          <p className="text-[15px] text-muted-foreground">Choose what works best for you</p>
        </div>

        <div className="bg-card rounded-xl border border-border/60 overflow-hidden shadow-soft">
          {/* Header */}
          <div className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-3 border-b border-border/60 bg-secondary/40">
            <div className="p-4 text-[13px] font-semibold text-foreground">Feature</div>
            <div className="p-4 text-[13px] font-semibold text-foreground text-center">Manual</div>
            <div className="p-4 text-center">
              <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-2.5 py-0.5 rounded-md text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" />
                AI
              </span>
            </div>
          </div>

          {rows.map((row, i) => (
            <div key={i} className={`grid grid-cols-[1fr_120px_120px] sm:grid-cols-3 border-b border-border/30 last:border-0 transition-colors ${i % 2 === 1 ? 'bg-secondary/20' : ''}`}>
              <div className="p-4 text-[13px] text-foreground/90 font-medium">{row.feature}</div>
              <div className="p-4 text-[13px] text-center flex items-center justify-center">
                {row.manual === true ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : row.manual === false ? (
                  <X className="w-4 h-4 text-muted-foreground/30" />
                ) : (
                  <span className="text-muted-foreground text-[12px]">{row.manual}</span>
                )}
              </div>
              <div className="p-4 text-[13px] text-center flex items-center justify-center bg-primary/[0.015]">
                {row.ai === true ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : row.ai === false ? (
                  <X className="w-4 h-4 text-muted-foreground/30" />
                ) : (
                  <span className="text-foreground font-medium text-[12px]">{row.ai}</span>
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
