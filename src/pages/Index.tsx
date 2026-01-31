import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import IntroductionSection from '@/components/IntroductionSection';
import HarmonySection from '@/components/HarmonySection';
import StatsSection from '@/components/StatsSection';
import VideoGallerySection from '@/components/VideoGallerySection';
import WinnersSection from '@/components/WinnersSection';
import PressSection from '@/components/PressSection';
import TourSection from '@/components/TourSection';
import FestivalSection from '@/components/FestivalSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <VideoGallerySection />
        <WinnersSection />
        <PressSection />
        <IntroductionSection />
        <HarmonySection />
        <FestivalSection />
        <TourSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
