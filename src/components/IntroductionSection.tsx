import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import competitionPoster from '@/assets/competition-2026-poster.jpg';

const IntroductionSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

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

          {/* Intro text above poster */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed pt-8">
            {t('introduction.intro')} <span className="font-bold text-rose-dark">{t('introduction.introDate')}</span>.
          </p>

          {/* Competition Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-4"
          >
            <img 
              src={competitionPoster} 
              alt="Sumi Jo International Singing Competition 2026" 
              className="mx-auto max-w-md md:max-w-lg rounded-lg shadow-lg"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroductionSection;
