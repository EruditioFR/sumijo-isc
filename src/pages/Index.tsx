import { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import SEOHead from '@/components/SEOHead';
import ScrollToTop from '@/components/ScrollToTop';
import {
  getOrganizationSchema,
  getEventSchema,
  getFAQSchema,
  getWebSiteSchema,
  defaultFAQItems,
} from '@/lib/structuredData';

// Lazy-load below-the-fold sections to shrink the initial JS bundle
const FinalistsLightbox = lazy(() => import('@/components/FinalistsLightbox'));
const ProgramSection = lazy(() => import('@/components/ProgramSection'));
const StatsSection = lazy(() => import('@/components/StatsSection'));
const VideoGallerySection = lazy(() => import('@/components/VideoGallerySection'));
const SemiFinalistsSection = lazy(() => import('@/components/SemiFinalistsSection'));
const FinalistsShowcase = lazy(() => import('@/components/FinalistsShowcase'));
const WinnersSection = lazy(() => import('@/components/WinnersSection'));
const GallerySection = lazy(() => import('@/components/GallerySection'));
const PressSection = lazy(() => import('@/components/PressSection'));
const IntroductionSection = lazy(() => import('@/components/IntroductionSection'));
const HarmonySection = lazy(() => import('@/components/HarmonySection'));
const FestivalSection = lazy(() => import('@/components/FestivalSection'));
const FAQSection = lazy(() => import('@/components/FAQSection'));
const PosterSection = lazy(() => import('@/components/PosterSection'));
const Footer = lazy(() => import('@/components/Footer'));

const SectionFallback = () => <div className="min-h-[40vh]" aria-hidden />;

const Index = () => {
  const jsonLdSchemas = [
    getWebSiteSchema(),
    getOrganizationSchema(),
    getEventSchema(),
    getFAQSchema(defaultFAQItems),
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Sumi Jo International Singing Competition 2026 - du 6 au 11 juillet 2026 - Château de La Ferté-Imbault"
        description="Sumi Jo International Singing Competition 2026 - du 6 au 11 juillet 2026 - Château de La Ferté-Imbault"
        keywords="Sumi Jo, concours chant lyrique, opéra, competition, Château Ferté-Imbault, Val de Loire, soprano, musique classique"
        path="/"
        type="event"
        jsonLd={jsonLdSchemas}
      />
      <Header />
      <Suspense fallback={null}>
        <FinalistsLightbox />
      </Suspense>
      <main>
        <HeroSection />
        <Suspense fallback={<SectionFallback />}>
          <ProgramSection />
          <StatsSection />
          <VideoGallerySection />
          <SemiFinalistsSection />
          <FinalistsShowcase />
          <WinnersSection />
          <GallerySection />
          <PressSection />
          <IntroductionSection />
          <HarmonySection />
          <FestivalSection />
          <FAQSection />
          <PosterSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <ScrollToTop />
    </div>
  );
};

export default Index;
