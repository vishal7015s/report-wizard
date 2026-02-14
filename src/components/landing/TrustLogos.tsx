const TrustLogos = () => {
  const universities = [
    'RGPV Bhopal', 'SVCE Indore', 'LNCT Bhopal', 'SIRT Bhopal', 
    'TIT Bhopal', 'OIST Bhopal', 'SGSITS Indore', 'IPS Academy'
  ];

  return (
    <section className="py-10 border-y border-border/30">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-[11px] font-medium text-muted-foreground/60 uppercase tracking-[0.15em] mb-6">
          Trusted by students from top RGPV affiliated colleges
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
          {universities.map((uni) => (
            <span key={uni} className="text-[13px] font-medium text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors duration-300 cursor-default">
              {uni}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustLogos;
