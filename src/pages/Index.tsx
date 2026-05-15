import Header from '@/components/Header';
import AnnouncementLightbox from '@/components/AnnouncementLightbox';
import HeroSection from '@/components/HeroSection';
import ProgramSection from '@/components/ProgramSection';
import AnnouncementVideoSection from '@/components/AnnouncementVideoSection';
import IntroductionSection from '@/components/IntroductionSection';
import HarmonySection from '@/components/HarmonySection';
import StatsSection from '@/components/StatsSection';
import VideoGallerySection from '@/components/VideoGallerySection';
import SemiFinalistsSection from '@/components/SemiFinalistsSection';
import WinnersSection from '@/components/WinnersSection';
import PressSection from '@/components/PressSection';
import GallerySection from '@/components/GallerySection';
import FestivalSection from '@/components/FestivalSection';
import PosterSection from '@/components/PosterSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEOHead';
import {
  getOrganizationSchema,
  getEventSchema,
  getFAQSchema,
  getWebSiteSchema,
  defaultFAQItems,
} from '@/lib/structuredData';

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
        title="Sumi Jo International Singing Competition 2026 - du 5 au 11 juillet 2026 - Château de la Ferté-Imbault"
        description="Sumi Jo International Singing Competition 2026 - du 5 au 11 juillet 2026 - Château de la Ferté-Imbault"
        keywords="Sumi Jo, concours chant lyrique, opéra, competition, Château Ferté-Imbault, Val de Loire, soprano, musique classique"
        path="/"
        type="event"
        jsonLd={jsonLdSchemas}
      />
      <Header />
      <main>
        <HeroSection />
        <ProgramSection />
        <StatsSection />
        <VideoGallerySection />
        <WinnersSection />
        <GallerySection />
        <PressSection />
        <IntroductionSection />
        <HarmonySection />
        <FestivalSection />
        <FAQSection />
        <PosterSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;