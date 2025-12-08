import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Globe2, Trophy, Sparkles } from 'lucide-react';
import competitionPoster from '@/assets/competition-2026-poster.jpg';

const IntroductionSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const stats = [
    { icon: Users, value: '500+', label: t('introduction.participants') },
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
            {t('introduction.content1')}
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t('introduction.content2')}
          </p>

          {/* Stats */}
          <h3 className="font-display text-2xl md:text-3xl text-foreground pt-12">
            {t('introduction.statsTitle')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
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

          {/* Intro text above poster */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed pt-8">
            {t('introduction.intro')} <span className="font-bold text-rose-dark">{t('introduction.introDate')}</span>.
          </p>

          {/* Competition Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-4 relative"
          >
            {/* Sparkling stars - grandes */}
            <Sparkles className="absolute -top-6 left-1/4 w-8 h-8 text-gold animate-pulse" />
            <Sparkles className="absolute top-12 -right-4 md:right-12 w-8 h-8 text-gold-light animate-pulse" style={{ animationDelay: '0.4s' }} />
            <Sparkles className="absolute bottom-20 -left-4 md:left-8 w-8 h-8 text-gold animate-pulse" style={{ animationDelay: '0.8s' }} />
            <Sparkles className="absolute -bottom-4 right-1/4 w-8 h-8 text-gold-light animate-pulse" style={{ animationDelay: '1.1s' }} />
            
            {/* Sparkling stars - moyennes */}
            <Sparkles className="absolute -top-2 -left-2 md:left-20 w-6 h-6 text-gold animate-pulse" style={{ animationDelay: '0.2s' }} />
            <Sparkles className="absolute top-1/4 -right-2 md:right-16 w-6 h-6 text-gold-light animate-pulse" style={{ animationDelay: '0.6s' }} />
            <Sparkles className="absolute top-1/2 -left-6 md:left-6 w-6 h-6 text-gold animate-pulse" style={{ animationDelay: '1s' }} />
            <Sparkles className="absolute bottom-8 -right-6 md:right-8 w-6 h-6 text-gold-light animate-pulse" style={{ animationDelay: '0.3s' }} />
            <Sparkles className="absolute top-2/3 -left-4 md:left-14 w-5 h-5 text-gold animate-pulse" style={{ animationDelay: '0.7s' }} />
            <Sparkles className="absolute top-8 -left-8 md:left-4 w-5 h-5 text-gold-light animate-pulse" style={{ animationDelay: '1.3s' }} />
            
            {/* Sparkling stars - petites */}
            <Sparkles className="absolute top-4 right-1/3 w-3 h-3 text-gold animate-pulse" style={{ animationDelay: '0.15s' }} />
            <Sparkles className="absolute top-1/3 -left-3 md:left-18 w-3 h-3 text-gold-light animate-pulse" style={{ animationDelay: '0.45s' }} />
            <Sparkles className="absolute bottom-1/4 -right-3 md:right-20 w-3 h-3 text-gold animate-pulse" style={{ animationDelay: '0.75s' }} />
            <Sparkles className="absolute -top-3 -right-2 md:right-28 w-3 h-3 text-gold-light animate-pulse" style={{ animationDelay: '0.95s' }} />
            <Sparkles className="absolute bottom-4 left-1/3 w-3 h-3 text-gold animate-pulse" style={{ animationDelay: '1.15s' }} />
            <Sparkles className="absolute top-1/2 right-1/4 w-4 h-4 text-gold-light animate-pulse" style={{ animationDelay: '0.55s' }} />
            <Sparkles className="absolute bottom-1/3 -left-5 md:left-10 w-4 h-4 text-gold animate-pulse" style={{ animationDelay: '0.85s' }} />
            <Sparkles className="absolute -bottom-6 -left-2 md:left-24 w-4 h-4 text-gold-light animate-pulse" style={{ animationDelay: '1.25s' }} />
            
            <img 
              src={competitionPoster} 
              alt="Sumi Jo International Singing Competition 2026" 
              className="mx-auto max-w-md md:max-w-lg rounded-lg shadow-lg relative z-10"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroductionSection;
