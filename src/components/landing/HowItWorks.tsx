import { School, Edit3, Download } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      icon: <School className="w-6 h-6" />,
      title: 'Select your college',
      description: 'Choose your RGPV-affiliated college and branch. We auto-apply the correct format.',
    },
    {
      step: '02',
      icon: <Edit3 className="w-6 h-6" />,
      title: 'Add your content',
      description: 'Write manually for free or use AI to generate all 7 chapters instantly.',
    },
    {
      step: '03',
      icon: <Download className="w-6 h-6" />,
      title: 'Download your report',
      description: 'Get a pixel-perfect PDF with cover page, certificates, and all pages formatted.',
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Three steps to your perfect report
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((item, index) => (
            <div key={index} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-px bg-border -translate-x-1/2 z-0" />
              )}
              <div className="relative bg-card rounded-2xl border border-border p-8 card-hover z-10">
                <span className="text-5xl font-black text-primary/10 absolute top-4 right-6">{item.step}</span>
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  {item.icon}
                </div>
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
