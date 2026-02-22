import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Is the manual editor really free?',
    answer: 'Yes, 100% free. You can write your content manually, and we handle all the formatting, cover pages, certificates, and PDF generation at no cost.',
  },
  {
    question: 'What does the AI generator do?',
    answer: 'The AI generator writes all 7 chapters of your project report based on your project title and details. It generates professional academic content with proper structure and formatting.',
  },
  {
    question: 'Will my college accept this report format?',
    answer: 'Absolutely. The report follows the exact RGPV guidelines — same fonts, margins, logos, and page structure that your college requires.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No signup or account creation is needed. Just fill in your details, add content, and download your report.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept UPI, debit cards, credit cards, and net banking via secure payment gateways like Razorpay.',
  },
  {
    question: 'Can I edit the report after generating it?',
    answer: 'Yes. After AI generates your content, you can edit any section before downloading. You have full control over the final output.',
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Frequently asked questions
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-2xl px-6 shadow-sm data-[state=open]:shadow-card transition-shadow"
              >
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
