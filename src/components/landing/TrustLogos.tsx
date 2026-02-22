import rgpvLogo from '@/assets/rgpv-logo.png';
import svceLogo from '@/assets/svce-logo.png';

const TrustLogos = () => {
  return (
    <section className="py-12 border-y border-border/40 bg-secondary/20">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-medium text-muted-foreground tracking-widest uppercase mb-8">
          Trusted by students from top RGPV colleges
        </p>
        <div className="flex items-center justify-center gap-12 md:gap-20 flex-wrap opacity-40 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-500">
          <img src={rgpvLogo} alt="RGPV University" className="h-12 object-contain" />
          <img src={svceLogo} alt="SVCE College" className="h-12 object-contain" />
          <div className="text-sm font-semibold text-muted-foreground px-4 py-2 bg-secondary rounded-lg">LNCT Group</div>
          <div className="text-sm font-semibold text-muted-foreground px-4 py-2 bg-secondary rounded-lg">TIT Bhopal</div>
          <div className="text-sm font-semibold text-muted-foreground px-4 py-2 bg-secondary rounded-lg">SIRT Bhopal</div>
        </div>
      </div>
    </section>
  );
};

export default TrustLogos;
