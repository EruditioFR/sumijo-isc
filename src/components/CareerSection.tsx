import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CareerSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const events = [
    { year: t('career.event1.year'), description: t('career.event1.description') },
    { year: t('career.event2.year'), description: t('career.event2.description') },
    { year: t('career.event3.year'), description: t('career.event3.description') },
    { year: t('career.event4.year'), description: t('career.event4.description') },
  ];

  return (
    <section className="py-20 md:py-32 bg-secondary/30">
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
              {t('career.title')}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light mx-auto" />
          </div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto space-y-12">
            {events.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="relative"
              >
                <div className="flex items-start gap-8">
                  {/* Year */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center shadow-gold">
                      <span className="font-display text-3xl text-foreground">{event.year}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex-1 bg-card border border-gold/20 rounded-lg p-6 shadow-lg hover:shadow-gold transition-all">
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < events.length - 1 && (
                  <div className="absolute left-16 top-32 w-0.5 h-12 bg-gradient-to-b from-gold to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CareerSection;
