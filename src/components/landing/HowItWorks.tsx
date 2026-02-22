import { FileText, Pencil, Download } from 'lucide-react';

const steps = [
  {
    icon: <FileText className="w-6 h-6" />,
    step: '01',
    title: 'Select Your College',
    description: 'Choose your college and branch. We auto-apply the exact formatting guidelines.',
  },
  {
    icon: <Pencil className="w-6 h-6" />,
    step: '02',
    title: 'Add Your Content',
    description: 'Write manually for free or use AI to generate chapter-wise content instantly.',
  },
  {
    icon: <Download className="w-6 h-6" />,
    step: '03',
    title: 'Download Report',
    description: 'Get a pixel-perfect PDF with cover page, certificates, chapters — everything included.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Three steps to your perfect report
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((item, index) => (
            <div
              key={index}
              className="relative text-center group animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-border" />
              )}
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/8 border border-primary/15 text-primary flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {item.icon}
                </div>
                <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">{item.step}</p>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
