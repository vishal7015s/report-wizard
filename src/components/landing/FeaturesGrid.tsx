import { FileText, GraduationCap, Sparkles, Layout, Image, BookOpen } from 'lucide-react';

const FeaturesGrid = () => {
  const features = [
    {
      icon: <GraduationCap className="w-[18px] h-[18px]" />,
      title: 'College-Approved Format',
      description: 'Exact formatting per your college guidelines. Margins, fonts, logos — all perfect.',
    },
    {
      icon: <FileText className="w-[18px] h-[18px]" />,
      title: 'Pixel-Perfect PDF',
      description: 'A4 pages with correct borders, headers, page numbers and professional layout.',
    },
    {
      icon: <Sparkles className="w-[18px] h-[18px]" />,
      title: 'AI Content Generation',
      description: 'Generate all 7 chapters with AI. Unique, plagiarism-free technical content.',
    },
    {
      icon: <Layout className="w-[18px] h-[18px]" />,
      title: 'Complete Structure',
      description: 'Cover page, certificates, abstract, TOC, chapters, and references included.',
    },
    {
      icon: <Image className="w-[18px] h-[18px]" />,
      title: 'Diagrams & Figures',
      description: 'Add images and diagrams that are professionally placed within chapters.',
    },
    {
      icon: <BookOpen className="w-[18px] h-[18px]" />,
      title: 'Multiple Colleges',
      description: 'Support for SVCE, LNCT, SIRT and more RGPV-affiliated colleges.',
    },
  ];

  return (
    <section id="features" className="py-24 lg:py-28 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-[0.12em] mb-3">Features</p>
          <h2 className="text-3xl sm:text-[2.25rem] font-extrabold text-foreground tracking-[-0.02em] leading-tight mb-4">
            Everything you need for the perfect report
          </h2>
          <p className="text-[15px] text-muted-foreground max-w-lg mx-auto">
            Built specifically for RGPV engineering students. Every detail matters.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card rounded-xl border border-border/60 p-6 card-hover"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/[0.07] text-primary flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/[0.12]">
                {feature.icon}
              </div>
              <h3 className="text-[14px] font-semibold text-foreground mb-1.5 tracking-[-0.01em]">{feature.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
