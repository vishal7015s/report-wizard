import { Shield, Lock, Eye, BadgeCheck } from 'lucide-react';

const SecuritySection = () => {
  const items = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Secure Payments',
      description: 'All payments processed through Razorpay with 256-bit SSL encryption.',
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Data Privacy',
      description: 'Your project data is never stored or shared. Reports are generated in real-time.',
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Plagiarism Free',
      description: 'AI generates unique content every time. No two reports are ever the same.',
    },
    {
      icon: <BadgeCheck className="w-5 h-5" />,
      title: 'Payment Protection',
      description: 'Full refund within 24 hours if you\'re not satisfied with the generated content.',
    },
  ];

  return (
    <section className="py-24 lg:py-28 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-[0.12em] mb-3">Security</p>
          <h2 className="text-3xl sm:text-[2.25rem] font-extrabold text-foreground tracking-[-0.02em] leading-tight mb-4">
            Your data is safe with us
          </h2>
          <p className="text-[15px] text-muted-foreground">We take privacy and security seriously</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {items.map((item, i) => (
            <div key={i} className="text-center bg-card rounded-xl border border-border/60 p-6 card-hover">
              <div className="w-10 h-10 rounded-lg bg-primary/[0.07] text-primary flex items-center justify-center mx-auto mb-3.5">
                {item.icon}
              </div>
              <h3 className="text-[13px] font-semibold text-foreground mb-1.5">{item.title}</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
