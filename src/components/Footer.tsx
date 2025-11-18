import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-foreground text-cream py-12 border-t border-gold/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Navigation */}
          <div>
            <h3 className="font-elegant text-lg text-gold mb-4">
              {t('footer.navigation')}
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-gold transition-colors"
                >
                  {t('nav.competition')}
                </button>
              </li>
              <li>
                <Link
                  to="/sumi-jo"
                  className="hover:text-gold transition-colors"
                >
                  {t('nav.sumijo')}
                </Link>
              </li>
              <li>
                <Link
                  to="/partenaires"
                  className="hover:text-gold transition-colors"
                >
                  {t('nav.sponsors')}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-gold transition-colors"
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-elegant text-lg text-gold mb-4">
              {t('footer.followUs')}
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center hover:bg-gold/20 transition-all hover:scale-110"
                >
                  <social.icon className="w-5 h-5 text-gold" />
                </a>
              ))}
            </div>
          </div>

          {/* Logo/Brand */}
          <div className="md:col-span-2">
            <div className="font-elegant text-2xl text-gold mb-4">
              SUMI JO INTERNATIONAL SINGING COMPETITION
            </div>
            <p className="text-sm text-gold">
              Château de la Ferté-Imbault<br />
              41300 La Ferté-Imbault, France
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gold/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-muted-foreground">
              {t('footer.copyright')}
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gold transition-colors">
                {t('footer.legal')}
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                {t('footer.privacy')}
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                {t('footer.cookies')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
