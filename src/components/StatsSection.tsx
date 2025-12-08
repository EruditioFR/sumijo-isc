import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Globe2, Trophy } from 'lucide-react';

const StatsSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const stats = [
    { icon: Users, value: '500+', label: t('introduction.participants') },
    { icon: Globe2, value: '20+', label: t('introduction.countries') },
    { icon: Trophy, value: '80 000€', label: t('introduction.prizes') },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h3 className="font-display text-2xl md:text-3xl text-foreground mb-8">
            {t('introduction.statsTitle')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="bg-rose/10 border border-rose/30 rounded-lg p-8 shadow-lg hover:shadow-xl hover:bg-rose/20 transition-all"
              >
                <stat.icon className="w-12 h-12 text-rose-dark mx-auto mb-4" />
                <div className="font-display text-4xl text-rose-dark mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
