import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import IntroductionSection from '@/components/IntroductionSection';
import HarmonySection from '@/components/HarmonySection';
import SumiJoSection from '@/components/SumiJoSection';
import CareerSection from '@/components/CareerSection';
import FestivalSection from '@/components/FestivalSection';
import JurySection from '@/components/JurySection';
import ContactSection from '@/components/ContactSection';
import SponsorsSection from '@/components/SponsorsSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <IntroductionSection />
        <HarmonySection />
        <SumiJoSection />
        <CareerSection />
        <FestivalSection />
        <JurySection />
        <ContactSection />
        <SponsorsSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
