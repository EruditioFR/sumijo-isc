import { useEffect } from 'react';
import Header from '@/components/Header';
import SumiJoSection from '@/components/SumiJoSection';
import CareerSection from '@/components/CareerSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEOHead';
import { getSumiJoSchema, getOrganizationSchema } from '@/lib/structuredData';

const SumiJo = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const jsonLdSchemas = [getSumiJoSchema(), getOrganizationSchema()];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Sumi Jo | Soprano colorature & Présidente du Jury | SJISC 2026"
        description="Découvrez Sumi Jo, soprano colorature sud-coréenne de renommée mondiale, lauréate d'un Grammy Award. Présidente du jury du concours international de chant lyrique."
        keywords="Sumi Jo, soprano, colorature, Grammy Award, opéra, présidente jury, SJISC"
        path="/sumi-jo"
        image="/sumi-jo-portrait.jpg"
        jsonLd={jsonLdSchemas}
      />
      <Header />
      <main className="pt-8">
        <SumiJoSection />
        <CareerSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default SumiJo;
