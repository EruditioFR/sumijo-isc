import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import IntroductionSection from '@/components/IntroductionSection';
import HarmonySection from '@/components/HarmonySection';
import WinnersSection from '@/components/WinnersSection';
import FestivalSection from '@/components/FestivalSection';
import JurySection from '@/components/JurySection';
import SponsorshipSection from '@/components/SponsorshipSection';
import ContactSection from '@/components/ContactSection';
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
        <WinnersSection />
        <FestivalSection />
        <JurySection />
        <SponsorshipSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
