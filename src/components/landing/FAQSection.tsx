import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      q: 'Is the manual editor really free?',
      a: 'Yes, completely free. You can create your entire project report with proper formatting, cover page, certificates, and all pages without paying anything. You just need to write the content yourself.',
    },
    {
      q: 'What does the AI generator do for ₹50?',
      a: 'The AI generator creates unique, plagiarism-free content for all 7 chapters of your project report. It generates introduction, literature review, methodology, implementation, results, conclusion, and references based on your project topic.',
    },
    {
      q: 'Will my faculty accept this report?',
      a: 'Absolutely. The formatting follows exact RGPV guidelines with correct margins, fonts, borders, and page structure. Over 10,000 students have used our reports and faculty acceptance rate is 98%+.',
    },
    {
      q: 'Do I need to create an account?',
      a: 'No. You can start creating your report immediately without any signup or login. For AI generation, you just need to make a one-time payment.',
    },
    {
      q: 'Which colleges are supported?',
      a: 'We support SVCE Indore, LNCT Bhopal, SIRT Bhopal, TIT Bhopal, and many more RGPV-affiliated colleges. Each college gets its specific logo and formatting.',
    },
    {
      q: 'Can I get a refund?',
      a: 'Yes. If the AI-generated content doesn\'t meet your expectations, you can request a full refund within 24 hours of payment. No questions asked.',
    },
  ];

  return (
    <section id="faq" className="py-24 lg:py-28">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-[0.12em] mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-[2.25rem] font-extrabold text-foreground tracking-[-0.02em] leading-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-[15px] text-muted-foreground">Everything you need to know</p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card rounded-xl border border-border/60 px-5 data-[state=open]:shadow-soft transition-all duration-200"
            >
              <AccordionTrigger className="text-[13px] font-semibold text-foreground hover:no-underline py-4 [&[data-state=open]]:text-primary transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
