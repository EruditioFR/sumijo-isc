import { useEffect, lazy, Suspense } from 'react';
import JurySection from '@/components/JurySection';

const Header = lazy(() => import('@/components/Header'));
const Footer = lazy(() => import('@/components/Footer'));
const ScrollToTop = lazy(() => import('@/components/ScrollToTop'));

const Jury = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
  return (
    <div className="min-h-screen">
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
