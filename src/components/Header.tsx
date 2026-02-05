import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import logoSjisc from '@/assets/logo-sjisc.jpg';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isHomepage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const isInHeroZone = window.scrollY < heroHeight - 100;
      
      setIsScrolled(window.scrollY > 50);
      // Masquer le header quand on est dans la zone du hero (homepage seulement)
      setHasScrolled(!isInHeroZone || !isHomepage);
    };
    
    // Sur les pages autres que l'accueil, le header est toujours visible
    if (!isHomepage) {
      setHasScrolled(true);
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  const languages = [
    { code: 'fr', label: '🇫🇷 FR' },
    { code: 'en', label: '🇬🇧 EN' },
    { code: 'kr', label: '🇰🇷 KR' },
    { code: 'zh', label: '🇨🇳 ZH' },
  ];

  return (
    <>
      {/* Language tab on screen edge */}
      <button
        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-accent/95 backdrop-blur-sm text-cream hover:text-gold transition-all duration-300 shadow-lg rounded-l-lg py-3 px-2 flex flex-col items-center gap-1 hover:pr-3"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-medium tracking-wide" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          {i18n.language.toUpperCase()}
        </span>
      </button>

      {/* Language selector side panel */}
      <AnimatePresence>
        {isLangMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[65]"
              onClick={() => setIsLangMenuOpen(false)}
            />
            
            {/* Side panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-64 bg-accent z-[70] shadow-2xl"
            >
              <div className="p-6">
                {/* Close button */}
                <button
                  onClick={() => setIsLangMenuOpen(false)}
                  className="absolute top-4 right-4 text-cream hover:text-gold transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Title */}
                <div className="pt-8 pb-6 border-b border-gold/20">
                  <div className="flex items-center gap-3 text-cream">
                    <Globe className="w-5 h-5 text-gold" />
                    <span className="font-medium tracking-wide">Langue / Language</span>
                  </div>
                </div>

                {/* Language options */}
                <nav className="pt-4 space-y-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`block w-full text-left px-4 py-3 rounded-lg text-cream hover:bg-gold/10 transition-colors ${
                        i18n.language === lang.code ? 'bg-gold/20 text-gold' : ''
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating burger button for mobile - always visible */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-[60] text-white hover:text-gold transition-colors bg-accent/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-md ${
          isScrolled ? 'shadow-elegant' : ''
        } ${
          !hasScrolled ? 'md:translate-y-0 -translate-y-full' : 'translate-y-0'
        }`}
        style={{ backgroundColor: 'hsl(var(--accent) / 0.95)' }}
      >
      <div className="container mx-auto px-4 py-2 md:py-[5px]">
        <div className="flex items-center justify-between">

          {/* Logo - Center */}
          <Link
            to="/"
            className="hover:opacity-80 transition-opacity flex items-center gap-3 md:gap-4"
          >
            <img 
              src={logoSjisc} 
              alt="Sumi Jo International Singing Competition" 
              className="hidden md:block h-16 md:h-20 w-auto object-contain"
            />
            <div className="flex flex-col text-left">
              <span className="text-rose-light font-elegant text-2xl md:text-3xl tracking-wide font-semibold">Sumi Jo</span>
              <span className="text-cream/80 text-[12px] md:text-sm tracking-widest">International Singing Competition</span>
              <span className="text-gold text-sm md:text-base font-medium">2026</span>
            </div>
          </Link>

          {/* Navigation - Hidden on mobile, shown on md+ */}
          <nav className="hidden md:flex items-center gap-4 md:gap-8">
            <Link
              to="/"
              className="text-xs md:text-sm text-cream hover:text-gold transition-colors"
            >
              {t('nav.competition')}
            </Link>
            <Link
              to="/sumi-jo"
              className="hidden sm:block text-xs md:text-sm text-cream hover:text-gold transition-colors"
            >
              {t('nav.sumijo')}
            </Link>
            <Link
              to="/jury"
              className="text-xs md:text-sm text-cream hover:text-gold transition-colors"
            >
              {t('nav.jury')}
            </Link>
            <Link
              to="/chateau"
              className="hidden sm:block text-xs md:text-sm text-cream hover:text-gold transition-colors"
            >
              {t('nav.chateau')}
            </Link>
            <Link
              to="/partenaires"
              className="hidden md:block text-xs md:text-sm text-cream hover:text-gold transition-colors"
            >
              {t('nav.sponsors')}
            </Link>
            <Link
              to="/billetterie"
              className="text-xs md:text-sm text-cream hover:text-gold transition-colors"
            >
              {t('nav.ticketing')}
            </Link>
            <Link
              to="/contact"
              className="text-xs md:text-sm text-cream hover:text-gold transition-colors"
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* CTA Button - Right */}
          <div className="hidden lg:flex items-center">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    <Button
                      className="bg-gradient-to-r from-gold/50 to-gold-light/50 text-white/70 font-semibold transition-all tracking-wider cursor-not-allowed pointer-events-none"
                    >
                      {t('nav.apply')}
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-accent border-gold/30 text-cream z-[100]">
                  <p>{t('nav.comingSoon')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Sidebar Menu */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-[55]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-accent z-[60] shadow-2xl overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Close button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-cream hover:text-gold transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Logo */}
              <div className="pt-8 pb-4 border-b border-gold/20 flex justify-center">
                <img 
                  src={logoSjisc} 
                  alt="Sumi Jo International Singing Competition" 
                  className="h-24 w-auto object-contain"
                />
              </div>

              {/* Navigation Links */}
              <nav className="space-y-3">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left text-cream hover:text-gold transition-colors py-2"
                >
                  {t('nav.competition')}
                </Link>
                <Link
                  to="/sumi-jo"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left text-cream hover:text-gold transition-colors py-2"
                >
                  {t('nav.sumijo')}
                </Link>
                <Link
                  to="/jury"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left text-cream hover:text-gold transition-colors py-2"
                >
                  {t('nav.jury')}
                </Link>
                <Link
                  to="/chateau"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left text-cream hover:text-gold transition-colors py-2"
                >
                  {t('nav.chateau')}
                </Link>
                <Link
                  to="/partenaires"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left text-cream hover:text-gold transition-colors py-2"
                >
                  {t('nav.sponsors')}
                </Link>
                <Link
                  to="/billetterie"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left text-cream hover:text-gold transition-colors py-2"
                >
                  {t('nav.ticketing')}
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left text-cream hover:text-gold transition-colors py-2"
                >
                  {t('nav.contact')}
                </Link>
              </nav>

              {/* Language Selector */}
              <div className="pt-4 border-t border-gold/20 space-y-2">
                <p className="text-sm text-cream/70 mb-2">{t('nav.language')}</p>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="block w-full text-left text-cream hover:text-gold transition-colors py-2"
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => {
                  scrollToSection('contact');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-gold to-gold-light text-foreground font-semibold"
              >
                {t('nav.participate')}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
};

export default Header;
