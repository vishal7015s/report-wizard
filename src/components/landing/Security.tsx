import { Shield, Lock, FileCheck, CreditCard } from 'lucide-react';

const badges = [
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'Encrypted Processing',
    description: 'All data is processed securely and never stored after download.',
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: 'Secure Payments',
    description: 'Payments handled by Razorpay with bank-level encryption.',
  },
  {
    icon: <FileCheck className="w-5 h-5" />,
    title: 'Plagiarism Free',
    description: 'AI-generated content is unique and written specifically for your project.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Privacy Protected',
    description: 'Your personal details and project data are never shared with third parties.',
  },
];

const Security = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">Security & Trust</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Your data is safe with us
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-card border border-border/50 shadow-card card-hover animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/8 text-primary flex items-center justify-center mx-auto mb-4">
                {badge.icon}
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{badge.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;
