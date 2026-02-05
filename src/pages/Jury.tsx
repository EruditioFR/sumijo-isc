import { useEffect, lazy, Suspense } from 'react';
import JurySection from '@/components/JurySection';
import SEOHead from '@/components/SEOHead';
import { getOrganizationSchema } from '@/lib/structuredData';

const Header = lazy(() => import('@/components/Header'));
const Footer = lazy(() => import('@/components/Footer'));
const ScrollToTop = lazy(() => import('@/components/ScrollToTop'));

const Jury = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Le Jury | SUMI JO International Singing Competition 2026"
        description="Découvrez le jury d'exception du concours SJISC 2026, présidé par Sumi Jo. Des personnalités de renommée internationale du monde lyrique."
        keywords="jury, Sumi Jo, concours chant, opéra, personnalités lyriques, SJISC"
        path="/jury"
        jsonLd={[getOrganizationSchema()]}
      />
      <Suspense fallback={<div className="h-20 bg-background" />}>
        <Header />
      </Suspense>
      <main className="pt-8">
        <JurySection />
      </main>
      <Suspense fallback={<div className="h-40 bg-muted" />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </div>
  );
};

export default Jury;
