import { useEffect } from 'react';
import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEOHead';
import { getOrganizationSchema } from '@/lib/structuredData';

const Contact = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Contact | SUMI JO International Singing Competition 2026"
        description="Contactez l'équipe du concours international de chant lyrique SUMI JO. Questions, partenariats, presse."
        keywords="contact, SJISC, concours chant, opéra, partenariats, presse"
        path="/contact"
        jsonLd={[getOrganizationSchema()]}
      />
      <Header />
      <main className="pt-8">
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Contact;
