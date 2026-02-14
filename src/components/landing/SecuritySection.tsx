import { Shield, Lock, Eye, BadgeCheck } from 'lucide-react';

const SecuritySection = () => {
  const items = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Payments',
      description: 'All payments processed through Razorpay with 256-bit SSL encryption.',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Data Privacy',
      description: 'Your project data is never stored or shared. Reports are generated in real-time.',
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Plagiarism Free',
      description: 'AI generates unique content every time. No two reports are ever the same.',
    },
    {
      icon: <BadgeCheck className="w-6 h-6" />,
      title: 'Payment Protection',
      description: 'Full refund within 24 hours if you\'re not satisfied with the generated content.',
    },
  ];

  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Security</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            Your data is safe with us
          </h2>
          <p className="text-muted-foreground">We take privacy and security seriously</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {items.map((item, i) => (
            <div key={i} className="text-center bg-card rounded-2xl border border-border p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
