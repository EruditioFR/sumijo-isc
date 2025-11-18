import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [showMobileHeader, setShowMobileHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Show mobile header after scrolling 75vh
      const scrollThreshold = window.innerHeight * 0.75;
      setShowMobileHeader(window.scrollY > scrollThreshold);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  ];

  return (
    <>
      {/* Floating burger button for mobile - always visible */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-[60] text-white hover:text-gold transition-colors bg-accent/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md ${
          isScrolled ? 'shadow-elegant' : ''
        } ${showMobileHeader ? 'translate-y-0' : '-translate-y-full md:translate-y-0'}`}
        style={{ backgroundColor: 'hsl(var(--accent) / 0.95)' }}
      >
      <div className="container mx-auto px-4 pt-10 md:pt-0">
        <div className="flex items-center justify-between h-28 md:h-20">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-elegant text-gold tracking-wider hover:text-gold-light transition-colors"
          >
            {/* Desktop logo */}
            <span className="hidden md:block text-xl md:text-2xl">SJISC</span>
            {/* Mobile logo */}
            <span className="md:hidden text-sm leading-tight">
              <span className="font-bold text-white text-2xl">Sumi Jo</span>
              <br />
              <span className="text-xs text-white">International Singing Competition</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm text-cream hover:text-gold transition-colors"
            >
              {t('nav.competition')}
            </Link>
            <Link
              to="/sumi-jo"
              className="text-sm text-cream hover:text-gold transition-colors"
            >
              {t('nav.sumijo')}
            </Link>
            <Link
              to="/jury"
              className="text-sm text-cream hover:text-gold transition-colors"
            >
              {t('nav.jury')}
            </Link>
            <Link
              to="/chateau"
              className="text-sm text-cream hover:text-gold transition-colors"
            >
              {t('nav.chateau')}
            </Link>
            <Link
              to="/partenaires"
              className="text-sm text-cream hover:text-gold transition-colors"
            >
              {t('nav.sponsors')}
            </Link>
            <Link
              to="/contact"
              className="text-sm text-cream hover:text-gold transition-colors"
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Language Selector & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="text-cream hover:text-gold hover:bg-transparent"
              >
                <Globe className="w-4 h-4 mr-2" />
                {i18n.language.toUpperCase()}
              </Button>
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 bg-card border border-gold/20 rounded-lg shadow-elegant overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gold/10 transition-colors"
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-to-r from-gold to-gold-light text-foreground font-semibold hover:shadow-gold transition-all"
            >
              {t('nav.participate')}
            </Button>
          </div>
        </div>
      </div>

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
                <div className="pt-8 pb-4 border-b border-gold/20">
                  <span className="font-elegant text-gold text-xl">SJISC</span>
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
    </header>
    </>
  );
};

export default Header;
