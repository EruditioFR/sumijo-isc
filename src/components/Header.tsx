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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md ${
        isScrolled ? 'shadow-elegant' : ''
      }`}
      style={{ backgroundColor: 'hsl(var(--accent) / 0.95)' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-elegant text-xl md:text-2xl text-gold tracking-wider hover:text-gold-light transition-colors"
          >
            SJISC
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
            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm text-cream hover:text-gold transition-colors"
            >
              {t('nav.contact')}
            </button>
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-cream hover:text-gold transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-accent border-t border-gold/20"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
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
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left text-cream hover:text-gold transition-colors py-2"
              >
                {t('nav.contact')}
              </button>
              <div className="pt-4 border-t border-gold/20 space-y-2">
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
              <Button
                onClick={() => scrollToSection('contact')}
                className="w-full bg-gradient-to-r from-gold to-gold-light text-foreground font-semibold"
              >
                {t('nav.participate')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
