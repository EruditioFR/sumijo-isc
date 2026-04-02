import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProgramSection from '@/components/ProgramSection';
import AnnouncementVideoSection from '@/components/AnnouncementVideoSection';
import IntroductionSection from '@/components/IntroductionSection';
import HarmonySection from '@/components/HarmonySection';
import StatsSection from '@/components/StatsSection';
import VideoGallerySection from '@/components/VideoGallerySection';
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
        title="SUMI JO International Singing Competition 2026 | Concours de chant lyrique"
        description="Concours international de chant lyrique au Château de la Ferté-Imbault, Val de Loire. Présidé par Sumi Jo, soprano de renommée mondiale. Du 5 au 11 juillet 2026."
        keywords="Sumi Jo, concours chant lyrique, opéra, competition, Château Ferté-Imbault, Val de Loire, soprano, musique classique"
        path="/"
        type="event"
        jsonLd={jsonLdSchemas}
      />
      <Header />
      <main>
        <HeroSection />
        <ProgramSection />
        <AnnouncementVideoSection />
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