import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

const FAQSection = () => {
  const { t } = useTranslation();

  const faqItems = [
    { key: 'dates' },
    { key: 'location' },
    { key: 'tickets' },
  ];

  return (
    <section id="faq" className="py-20 md:py-32 bg-cream relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-[1px] bg-gold" />
            <HelpCircle className="w-6 h-6 text-gold" />
            <div className="w-12 h-[1px] bg-gold" />
          </div>
          
          <h2 className="font-elegant text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={item.key}
                value={item.key}
                className="bg-white border border-gold/20 rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-gold py-5 hover:no-underline">
                  <span className="flex items-start gap-3">
                    <span className="text-gold font-elegant text-lg">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{t(`faq.items.${item.key}.question`)}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 pl-9">
                  {t(`faq.items.${item.key}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
