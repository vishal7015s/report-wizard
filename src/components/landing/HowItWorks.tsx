import { School, Edit3, Download, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      icon: <School className="w-5 h-5" />,
      title: 'Select your college',
      description: 'Choose your RGPV-affiliated college and branch. We auto-apply the correct format and logos.',
    },
    {
      step: '02',
      icon: <Edit3 className="w-5 h-5" />,
      title: 'Add your content',
      description: 'Write manually for free or use AI to generate all 7 chapters instantly with one click.',
    },
    {
      step: '03',
      icon: <Download className="w-5 h-5" />,
      title: 'Download your report',
      description: 'Get a pixel-perfect PDF with cover page, certificates, and all pages formatted correctly.',
    },
  ];

  return (
    <section className="py-24 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-[0.12em] mb-3">How it works</p>
          <h2 className="text-3xl sm:text-[2.25rem] font-extrabold text-foreground tracking-[-0.02em] leading-tight">
            Three steps to your perfect report
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-14 left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] h-px bg-border/60" />

          {steps.map((item, index) => (
            <div key={index} className="relative group">
              <div className="relative bg-card rounded-2xl border border-border/60 p-7 card-hover z-10 h-full">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/[0.07] text-primary flex items-center justify-center transition-colors group-hover:bg-primary/[0.12]">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-black text-muted-foreground/[0.06] tabular-nums">{item.step}</span>
                </div>
                <h3 className="text-[15px] font-semibold text-foreground mb-2 tracking-[-0.01em]">{item.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
