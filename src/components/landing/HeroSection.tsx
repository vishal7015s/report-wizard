import { ArrowRight, Sparkles, Users, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Text */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-6 text-sm font-medium">
              <Users className="w-3.5 h-3.5" />
              Trusted by 10,000+ RGPV students
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight text-foreground mb-6">
              Generate college-approved
              <br />
              <span className="text-gradient">project reports</span>
              <br />
              in minutes.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Stop wasting days on formatting. Create pixel-perfect, faculty-ready reports 
              with exact RGPV guidelines — free manual editor or AI-powered generation.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Button
                size="lg"
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
                onClick={() => navigate('/create')}
              >
                Create Free Report
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8 h-12 text-base font-semibold border-border hover:bg-secondary transition-all duration-300"
                onClick={() => navigate('/create')}
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Try AI Generator — ₹50
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" />
                No signup required
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-primary" />
                4.9/5 student rating
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                Plagiarism free
              </div>
            </div>
          </div>

          {/* Right - Preview Card */}
          <div className="relative animate-scale-in hidden lg:block">
            <div className="relative bg-card rounded-3xl border border-border shadow-elevated p-1.5">
              <div className="bg-secondary/50 rounded-2xl p-8">
                {/* Mock report preview */}
                <div className="bg-background rounded-xl border border-border shadow-soft p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-destructive/60" />
                      <div className="w-3 h-3 rounded-full bg-primary/40" />
                      <div className="w-3 h-3 rounded-full bg-primary/60" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">report-preview.pdf</span>
                  </div>

                  <div className="border-2 border-primary/15 rounded-lg p-5 bg-background">
                    <div className="text-center space-y-2">
                      <p className="text-xs font-bold text-destructive tracking-wide uppercase">Major Project Report</p>
                      <p className="text-[10px] text-muted-foreground">Submitted in Fulfillment for the Award of</p>
                      <p className="text-xs font-bold text-primary tracking-wide">BACHELOR OF TECHNOLOGY</p>
                      <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center my-3">
                        <span className="text-lg">🎓</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Department of Computer Science</p>
                      <div className="pt-2 border-t border-border mt-3">
                        <p className="text-[9px] text-muted-foreground">Submitted to</p>
                        <p className="text-[10px] font-semibold text-primary">Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] text-primary font-medium">Formatted & Ready</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">32 pages</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl border border-border shadow-card px-4 py-3 animate-float">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-sm">✓</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Faculty Approved</p>
                  <p className="text-[10px] text-muted-foreground">100% format match</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
