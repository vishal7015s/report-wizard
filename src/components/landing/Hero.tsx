import { ArrowRight, Sparkles, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="hero-glow absolute inset-0 pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-24 md:py-32 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 text-primary px-4 py-1.5 rounded-full mb-6">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold tracking-wide">Trusted by 10,000+ RGPV Students</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight text-foreground mb-6">
              Generate College-Approved
              <br />
              <span className="text-gradient">Project Reports</span>
              <br />
              in Minutes
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Stop wasting days on formatting. Create pixel-perfect, faculty-ready reports 
              with the exact structure your college demands.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                size="lg"
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold shadow-glow transition-all duration-300 hover:-translate-y-0.5"
                onClick={() => navigate('/create')}
              >
                Create Free Report
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8 py-6 text-base font-semibold border-border hover:bg-secondary transition-all duration-300"
                onClick={() => navigate('/create')}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Try AI Generator — ₹50
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-primary" />
                <span>4.9/5 rating</span>
              </div>
            </div>
          </div>

          {/* Right - Preview Card */}
          <div className="relative animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="bg-card rounded-3xl shadow-elevated border border-border/50 p-8 transform lg:rotate-1 hover:rotate-0 transition-all duration-500">
              <div className="border-2 border-primary/20 rounded-2xl p-6 bg-background">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mx-auto">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-primary font-bold text-sm tracking-wide uppercase">Major Project Report</p>
                  <p className="text-xs text-muted-foreground">Submitted in Fulfillment for the Award of</p>
                  <p className="font-bold text-sm text-foreground">Bachelor of Technology</p>
                  <div className="h-px bg-border my-2" />
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Department of Computer Science</p>
                    <p className="font-semibold text-primary">RGPV, Bhopal</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-1.5 rounded-full bg-primary/20 flex-1" />
                    <div className="h-1.5 rounded-full bg-primary/40 flex-1" />
                    <div className="h-1.5 rounded-full bg-primary flex-1" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
