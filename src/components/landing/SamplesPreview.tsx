import { FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SamplesPreview = () => {
  const navigate = useNavigate();

  const samples = [
    { title: 'Cover Page', desc: 'With university & college logos' },
    { title: 'Certificate', desc: 'Official certificate format' },
    { title: 'Chapter Content', desc: 'Formatted text with figures' },
    { title: 'Table of Contents', desc: 'Auto-generated TOC' },
  ];

  return (
    <section className="py-24 lg:py-28 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-[0.12em] mb-3">Preview</p>
          <h2 className="text-3xl sm:text-[2.25rem] font-extrabold text-foreground tracking-[-0.02em] leading-tight mb-4">
            See what you'll get
          </h2>
          <p className="text-[15px] text-muted-foreground">Every page is formatted exactly per RGPV standards</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {samples.map((sample, i) => (
            <div key={i} className="group bg-card rounded-xl border border-border/60 overflow-hidden card-hover cursor-pointer">
              <div className="aspect-[3/4] bg-secondary/40 flex items-center justify-center relative">
                <FileText className="w-10 h-10 text-muted-foreground/20" />
                <div className="absolute inset-0 bg-primary/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-[13px] font-semibold text-foreground mb-0.5">{sample.title}</h3>
                <p className="text-[11px] text-muted-foreground">{sample.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            variant="outline"
            className="rounded-xl text-[13px] font-medium h-9 px-5 border-border/60"
            onClick={() => navigate('/create')}
          >
            Try it yourself — it's free
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SamplesPreview;
