import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';

const SponsorsSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const institutionalPartners = [
    'Centre Culturel Coréen',
    'Communauté de Communes Sologne 2 Rivières',
    'Département de Loir-et-Cher',
    'Gouvernement de Pingshan',
    'Vinci Cultura',
    'Théâtre de Pingshan',
  ];

  const privatePartners = [
    'SMI',
    'Medinger',
    'Fonds de dotation Canopée',
    'I&S',
  ];

  return (
    <section id="sponsors" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              {t('sponsors.title')}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light mx-auto" />
          </div>

          {/* Institutional Partners */}
          <div className="space-y-6">
            <h3 className="font-elegant text-2xl text-gold text-center">
              {t('sponsors.institutional')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {institutionalPartners.map((partner, index) => (
                <motion.div
                  key={partner}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                  className="bg-card border border-gold/20 rounded-lg p-6 flex items-center justify-center shadow-lg hover:shadow-gold transition-all hover:-translate-y-1"
                >
                  <p className="text-center text-sm text-muted-foreground font-semibold">
                    {partner}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Private Partners */}
          <div className="space-y-6">
            <h3 className="font-elegant text-2xl text-gold text-center">
              {t('sponsors.private')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {privatePartners.map((partner, index) => (
                <motion.div
                  key={partner}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                  className="bg-card border border-gold/20 rounded-lg p-6 flex items-center justify-center shadow-lg hover:shadow-gold transition-all hover:-translate-y-1"
                >
                  <p className="text-center text-sm text-muted-foreground font-semibold">
                    {partner}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center pt-8"
          >
            <Button
              size="lg"
              className="bg-accent text-accent-foreground font-semibold hover:shadow-elegant transition-all"
            >
              {t('sponsors.become')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorsSection;
