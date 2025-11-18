import { useEffect } from 'react';
import Header from '@/components/Header';
import SumiJoSection from '@/components/SumiJoSection';
import CareerSection from '@/components/CareerSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const SumiJo = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
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
