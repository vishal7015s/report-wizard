import { GraduationCap, FileText, Sparkles, Image, BookOpen, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: 'College-Approved Format',
    description: 'Exact formatting as per your college guidelines. Zero faculty rejections.',
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Pixel-Perfect PDF',
    description: 'A4 pages with correct margins, borders, fonts, and logo placements.',
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'AI Content Generation',
    description: 'Generate chapter-wise content using AI or write manually — your choice.',
  },
  {
    icon: <Image className="w-5 h-5" />,
    title: 'Diagrams & Images',
    description: 'Add flowcharts, architecture diagrams, and images to any chapter section.',
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: 'All 7 Chapters Included',
    description: 'Introduction to Conclusion — complete report structure pre-built.',
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: 'Certificate & Approval Pages',
    description: 'Cover page, declaration, certificate, acknowledgement — all auto-generated.',
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            Everything you need for a perfect report
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built specifically for RGPV engineering students. Every detail is handled.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-2xl border border-border/50 shadow-card card-hover animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/8 text-primary flex items-center justify-center mb-4">
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

export default Features;
