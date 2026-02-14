import { FileText, GraduationCap, Sparkles, Layout, Image, BookOpen } from 'lucide-react';

const FeaturesGrid = () => {
  const features = [
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: 'College-Approved Format',
      description: 'Exact formatting per your college guidelines. Margins, fonts, logos — all perfect.',
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'Pixel-Perfect PDF',
      description: 'A4 pages with correct borders, headers, page numbers and professional layout.',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'AI Content Generation',
      description: 'Generate all 7 chapters with AI. Unique, plagiarism-free technical content.',
    },
    {
      icon: <Layout className="w-5 h-5" />,
      title: 'Complete Structure',
      description: 'Cover page, certificates, abstract, TOC, chapters, and references included.',
    },
    {
      icon: <Image className="w-5 h-5" />,
      title: 'Diagrams & Figures',
      description: 'Add images and diagrams that are professionally placed within chapters.',
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: 'Multiple Colleges',
      description: 'Support for SVCE, LNCT, SIRT and more RGPV-affiliated colleges.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            Everything you need for the perfect report
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built specifically for RGPV engineering students. Every detail matters.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border p-8 card-hover animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
