import { useEffect } from 'react';
import Header from '@/components/Header';
import SponsorshipSection from '@/components/SponsorshipSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEOHead';
import { getOrganizationSchema } from '@/lib/structuredData';

const Partenaires = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Nos Partenaires | SUMI JO International Singing Competition 2026"
        description="Découvrez les partenaires et mécènes qui soutiennent le concours international de chant lyrique SUMI JO au Château de la Ferté-Imbault."
        keywords="partenaires, mécènes, sponsors, SJISC, concours chant, opéra"
        path="/partenaires"
        jsonLd={[getOrganizationSchema()]}
      />
      <Header />
      <main className="pt-8">
        <SponsorshipSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Partenaires;
