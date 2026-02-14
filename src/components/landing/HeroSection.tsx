import { ArrowRight, Sparkles, Users, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-20 pb-28 lg:pt-28 lg:pb-36">
      {/* Subtle gradient orbs */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-[-100px] w-[300px] h-[300px] bg-primary/[0.03] rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/[0.06] text-primary px-3.5 py-1.5 rounded-full mb-8 text-[13px] font-medium border border-primary/[0.08]">
              <Users className="w-3.5 h-3.5" />
              Trusted by 10,000+ RGPV students
            </div>

            <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.08] tracking-[-0.025em] text-foreground mb-6">
              Generate college-approved{' '}
              <span className="text-gradient">project reports</span>{' '}
              in minutes.
            </h1>

            <p className="text-[17px] text-muted-foreground leading-[1.65] mb-10 max-w-[480px]">
              Stop wasting days on formatting. Create pixel-perfect, faculty-ready reports 
              with exact RGPV guidelines — free manual editor or AI-powered generation.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Button
                size="lg"
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-7 h-11 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-px"
                onClick={() => navigate('/create')}
              >
                Create Free Report
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-7 h-11 text-sm font-semibold border-border/80 hover:bg-secondary/80 transition-all duration-300"
                onClick={() => navigate('/create')}
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Try AI Generator — ₹50
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-[13px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary/70" />
                No signup required
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-primary/70" />
                4.9/5 student rating
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary/70" />
                Plagiarism free
              </div>
            </div>
          </div>

          {/* Right - Preview */}
          <div className="relative animate-scale-in hidden lg:block">
            <div className="relative bg-card rounded-2xl border border-border/60 shadow-hero p-1">
              <div className="bg-secondary/40 rounded-[14px] p-6">
                <div className="bg-background rounded-xl border border-border/60 shadow-soft p-5 space-y-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 font-mono">report-preview.pdf</span>
                  </div>

                  <div className="border border-border/60 rounded-lg p-5 bg-background">
                    <div className="text-center space-y-2">
                      <p className="text-[10px] font-bold text-destructive/80 tracking-widest uppercase">Major Project Report</p>
                      <p className="text-[9px] text-muted-foreground">Submitted in Fulfillment for the Award of</p>
                      <p className="text-[10px] font-bold text-primary tracking-wide">BACHELOR OF TECHNOLOGY</p>
                      <div className="w-10 h-10 mx-auto bg-primary/[0.06] rounded-full flex items-center justify-center my-2.5">
                        <span className="text-base">🎓</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground">Department of Computer Science</p>
                      <div className="pt-2 border-t border-border/40 mt-2.5">
                        <p className="text-[8px] text-muted-foreground/70">Submitted to</p>
                        <p className="text-[9px] font-semibold text-primary/80">Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] text-primary/80 font-medium">Formatted & Ready</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/50">32 pages</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -left-5 bg-card rounded-xl border border-border/60 shadow-card px-3.5 py-2.5 animate-float">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/[0.08] flex items-center justify-center">
                  <span className="text-primary text-xs">✓</span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-foreground leading-tight">Faculty Approved</p>
                  <p className="text-[9px] text-muted-foreground">100% format match</p>
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
