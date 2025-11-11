import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-sumi-performance.png';

const HeroSection = () => {
  const { t } = useTranslation();

  const scrollToNext = () => {
    const element = document.getElementById('competition');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Sumi Jo Performance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-accent/60 via-accent/40 to-accent/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-gold tracking-wide"
          >
            SUMI JO
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="font-display text-2xl md:text-4xl lg:text-5xl text-cream"
          >
            INTERNATIONAL SINGING COMPETITION
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="font-elegant text-lg md:text-xl text-gold-light max-w-2xl mx-auto"
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="space-y-4 pt-8"
          >
            <p className="text-cream text-lg">
              {t('hero.date')}
            </p>
            <p className="text-gold text-base">
              {t('hero.location')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Button
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-gold to-gold-light text-foreground font-semibold text-lg px-8 py-6 hover:shadow-gold transition-all"
            >
              {t('hero.participate')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToNext}
              className="border-2 border-gold text-gold hover:bg-gold hover:text-foreground font-semibold text-lg px-8 py-6 transition-all"
            >
              {t('hero.learnMore')}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: 'reverse', repeatDelay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold hover:text-gold-light transition-colors"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </section>
  );
};

export default HeroSection;
