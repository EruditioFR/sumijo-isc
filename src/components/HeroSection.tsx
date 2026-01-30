import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-sumi-2026.jpg';
import chateauImage from '@/assets/hero-chateau.jpg';
import chateauSilhouette from '@/assets/chateau-silhouette.png';

const HeroSection = () => {
  const { t } = useTranslation();

  const scrollToNext = () => {
    const element = document.getElementById('competition');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24">
      {/* Background Château Layer - Desktop only */}
      <div className="absolute inset-0 top-24 hidden md:block">
        <img
          src={chateauImage}
          alt="Château de la Ferté-Imbault"
          className="w-full h-full object-cover object-center opacity-40"
        />
      </div>
      
      {/* Château Silhouette - Mobile only - behind Sumi image */}
      <div className="absolute inset-0 top-20 flex items-start justify-center md:hidden pointer-events-none z-0">
        <img
          src={chateauSilhouette}
          alt=""
          className="w-[150%] max-w-none object-contain opacity-40 -mt-4 brightness-150 sepia hue-rotate-[-30deg] saturate-50"
        />
      </div>
      
      {/* Foreground Sumi Jo Image with Overlay */}
      <div className="absolute inset-0 top-20 md:top-24 z-[1]">
        <img
          src={heroImage}
          alt="Sumi Jo Performance"
          className="w-full h-full object-cover object-[10%_30%] md:object-[center_15%] scale-105 opacity-90 md:opacity-100 animate-[scale-in_20s_ease-out_infinite_alternate]"
        />
        {/* Mobile: wider transparent zone, lower opacity. Desktop: overlay on left for Sumi Jo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_35%_35%,transparent,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.45))] md:bg-[radial-gradient(ellipse_50%_70%_at_20%_25%,transparent,rgba(0,0,0,0.45)_45%,rgba(0,0,0,0.6))]" />
        {/* Decorative overlay pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(162,148,124,0.1),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Main Title with enhanced styling - positioned lower on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-2 mt-24 md:mt-0"
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white/60 tracking-widest drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-bold">
              SUMI JO
            </h1>
            <h2 className="font-display text-lg md:text-2xl lg:text-3xl text-white md:text-cream/60 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-wide leading-relaxed mt-4">
              INTERNATIONAL SINGING<br className="md:hidden" /> COMPETITION
            </h2>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent" />
          </motion.div>

          {/* Subtitle with elegant spacing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="space-y-3"
          >
            <p className="font-display text-xl md:text-5xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-bold tracking-wider">
              du 5 au 11 juillet 2026
            </p>
          </motion.div>


          {/* Event Details with cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center pt-4"
          >
            <div className="md:backdrop-blur-md md:bg-accent/50 md:border-2 md:border-gold/50 md:rounded-lg px-4 md:px-10 py-2 md:py-5 md:shadow-elegant">
              <p className="text-white md:text-gold-light text-lg md:text-2xl lg:text-3xl font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] tracking-wide">
                {t('hero.location')}
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons with enhanced design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
          >
            <Button
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative bg-gradient-to-r from-gold via-gold-light to-gold font-bold text-lg px-10 py-7 hover:shadow-[0_0_30px_rgba(162,148,124,0.6)] transition-all duration-300 hover:scale-105 overflow-hidden text-white"
            >
              <span className="relative z-10">{t('hero.participate')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToNext}
              className="border-2 border-gold text-gold bg-accent/20 backdrop-blur-sm hover:bg-gold hover:text-foreground font-bold text-lg px-10 py-7 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(162,148,124,0.4)]"
            >
              {t('hero.learnMore')}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: 'reverse', repeatDelay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold hover:text-gold-light transition-all duration-300 hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="w-10 h-10" />
      </motion.button>
    </section>
  );
};

export default HeroSection;
