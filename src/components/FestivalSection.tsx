import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Users, Heart } from 'lucide-react';

const FestivalSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const values = [
    {
      icon: Star,
      title: t('festival.ambition.title'),
      content: t('festival.ambition.content'),
    },
    {
      icon: Users,
      title: t('festival.transmission.title'),
      content: t('festival.transmission.content'),
    },
    {
      icon: Heart,
      title: t('festival.emotion.title'),
      content: t('festival.emotion.content'),
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              {t('festival.title')}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light mx-auto" />
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t('festival.intro')}
            </p>
          </div>

          {/* Values Cards */}
          <div className="grid md:grid-cols-3 gap-8 pt-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="group relative bg-card border border-gold/20 rounded-lg p-8 shadow-lg hover:shadow-gold transition-all hover:-translate-y-2"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8 text-foreground" />
                </div>

                {/* Title */}
                <h3 className="font-elegant text-2xl text-gold text-center mb-4">
                  {value.title}
                </h3>

                {/* Content */}
                <p className="text-muted-foreground leading-relaxed text-center">
                  {value.content}
                </p>

                {/* Decorative element */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gold-light rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FestivalSection;
