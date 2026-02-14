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
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            Loved by students across MP
          </h2>
          <p className="text-muted-foreground">Real feedback from real students</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-7 card-hover">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.branch}</p>
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
