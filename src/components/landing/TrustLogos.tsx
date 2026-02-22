const TrustLogos = () => {
  const universities = [
    'RGPV Bhopal', 'SVCE Indore', 'LNCT Bhopal', 'SIRT Bhopal', 
    'TIT Bhopal', 'OIST Bhopal', 'SGSITS Indore', 'IPS Academy'
  ];

  return (
    <section className="py-12 border-y border-border/50 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-8">
          Trusted by students from top RGPV affiliated colleges
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
          {universities.map((uni) => (
            <span key={uni} className="text-sm font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              {uni}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustLogos;
