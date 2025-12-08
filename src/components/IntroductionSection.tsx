import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Globe2, Trophy } from 'lucide-react';
import competitionPoster from '@/assets/competition-2026-poster.jpg';

const IntroductionSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const stats = [
    { icon: Users, value: '50+', label: t('introduction.participants') },
    { icon: Globe2, value: '20+', label: t('introduction.countries') },
    { icon: Trophy, value: '80 000€', label: t('introduction.prizes') },
  ];

  return (
    <section id="competition" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            {t('introduction.title')}
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light mx-auto" />
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t('introduction.intro')}
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t('introduction.content1')}
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t('introduction.content2')}
          </p>

          {/* Competition Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="pt-8"
          >
            <img 
              src={competitionPoster} 
              alt="Sumi Jo International Singing Competition 2026" 
              className="mx-auto max-w-md md:max-w-lg rounded-lg shadow-lg"
            />
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
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

export default IntroductionSection;
