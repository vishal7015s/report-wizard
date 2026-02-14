import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Rahul Sharma',
      branch: 'CSE, SVCE Indore',
      quote: 'Saved me 3 days of formatting. My faculty approved the report on the first submission. Absolutely worth it.',
    },
    {
      name: 'Priya Patel',
      branch: 'IT, LNCT Bhopal',
      quote: 'The AI-generated content was surprisingly good. I just had to make minor edits and my report was ready.',
    },
    {
      name: 'Amit Verma',
      branch: 'ECE, SIRT Bhopal',
      quote: 'Best ₹50 I ever spent. The formatting is exactly what our college requires. No more rejection from faculty.',
    },
    {
      name: 'Sneha Gupta',
      branch: 'CSE, TIT Bhopal',
      quote: 'Used the free manual editor and it was amazing. Cover page, certificates — everything was perfect.',
    },
    {
      name: 'Vikram Singh',
      branch: 'ME, SGSITS Indore',
      quote: 'I was struggling with formatting for weeks. This tool did it in 5 minutes. Highly recommended to all students.',
    },
    {
      name: 'Neha Jain',
      branch: 'CSE, IPS Academy',
      quote: 'Professional quality report with zero effort. My project guide was impressed with the formatting quality.',
    },
  ];

  return (
    <section className="py-24 lg:py-28 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-[0.12em] mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-[2.25rem] font-extrabold text-foreground tracking-[-0.02em] leading-tight mb-4">
            Loved by students across MP
          </h2>
          <p className="text-[15px] text-muted-foreground">Real feedback from real students</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-card rounded-xl border border-border/60 p-6 card-hover">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-primary/80 text-primary/80" />
                ))}
              </div>
              <p className="text-[13px] text-foreground/85 leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/[0.07] flex items-center justify-center text-[12px] font-semibold text-primary">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground leading-tight">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.branch}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
