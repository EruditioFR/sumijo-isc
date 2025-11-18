import { useEffect } from 'react';
import Header from '@/components/Header';
import ChateauSection from '@/components/ChateauSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Chateau = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8">
        <ChateauSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Chateau;
