import { useEffect } from 'react';
import Header from '@/components/Header';
import ChateauSection from '@/components/ChateauSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEOHead';
import { getChateauSchema, getOrganizationSchema } from '@/lib/structuredData';

const Chateau = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const jsonLdSchemas = [getChateauSchema(), getOrganizationSchema()];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Château de la Ferté-Imbault | Lieu du concours SJISC 2026"
        description="Découvrez le Château de la Ferté-Imbault, plus grand château en briques de Sologne, lieu d'accueil du concours international de chant lyrique SUMI JO."
        keywords="Château Ferté-Imbault, Sologne, Val de Loire, patrimoine, concours chant, SJISC"
        path="/chateau"
        image="/chateau-drone.jpg"
        jsonLd={jsonLdSchemas}
      />
      <Header />
      <main className="pt-8">
        <ChateauSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Chateau;
