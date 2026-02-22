import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import sampleCoverPage from '@/assets/sample-cover-page.jpg';
import sampleCertificate from '@/assets/sample-certificate.jpg';
import sampleChapter from '@/assets/sample-chapter.jpg';
import sampleToc from '@/assets/sample-toc.jpg';

const SamplesPreview = () => {
  const navigate = useNavigate();

  const samples = [
    { title: 'Front Page', desc: 'With university & college logos', image: sampleCoverPage },
    { title: 'Certificate', desc: 'Official certificate format', image: sampleCertificate },
    { title: 'Project Approval', desc: 'Approval certificate format', image: sampleChapter },
    { title: 'Candidate Declaration', desc: 'Declaration statement', image: sampleToc },
  ];

  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Preview</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            See what you'll get
          </h2>
          <p className="text-muted-foreground">Every page is formatted exactly per RGPV standards</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {samples.map((sample, i) => (
            <div key={i} className="group bg-card rounded-2xl border border-border overflow-hidden card-hover">
              <div className="aspect-[3/4] bg-secondary/50 relative overflow-hidden">
                <img src={sample.image} alt={sample.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-foreground mb-1">{sample.title}</h3>
                <p className="text-xs text-muted-foreground">{sample.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            variant="outline"
            className="rounded-xl"
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
