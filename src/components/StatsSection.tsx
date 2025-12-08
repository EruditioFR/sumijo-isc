import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Globe2, Trophy } from 'lucide-react';
import statsBackground from '@/assets/stats-background.jpg';

const StatsSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const stats = [
    { icon: Users, value: '500+', label: t('introduction.participants') },
    { icon: Globe2, value: '20+', label: t('introduction.countries') },
    { icon: Trophy, value: '80 000€', label: t('introduction.prizes') },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={statsBackground} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-4 py-2 mb-6"
          >
            <Trophy className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">Édition 2024</span>
          </motion.div>
          <h3 className="font-display text-2xl md:text-3xl text-cream mb-8">
            {t('introduction.statsTitle')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="bg-black/40 backdrop-blur-sm border border-gold/30 rounded-lg p-8 shadow-lg hover:bg-black/50 transition-all"
              >
                <stat.icon className="w-12 h-12 text-gold mx-auto mb-4" />
                <div className="font-display text-4xl text-gold mb-2">{stat.value}</div>
                <div className="text-sm text-cream/80 uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
