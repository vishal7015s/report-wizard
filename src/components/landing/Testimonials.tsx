import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Rahul Sharma',
    branch: 'CSE, LNCT Bhopal',
    quote: 'Saved me 3 full days of formatting. My faculty approved the report on the first submission itself.',
  },
  {
    name: 'Priya Patel',
    branch: 'IT, SVCE Indore',
    quote: 'The AI generator is insane. It wrote my entire report and the formatting was exactly what my college needed.',
  },
  {
    name: 'Amit Verma',
    branch: 'ECE, TIT Bhopal',
    quote: 'Best ₹50 I ever spent. The report looked so professional, my guide was genuinely impressed.',
  },
];

const Testimonials = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            Loved by thousands of students
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-2xl border border-border/50 shadow-card card-hover animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-6">"{t.quote}"</p>
              <div>
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.branch}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
