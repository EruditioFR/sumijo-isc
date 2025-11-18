import { useEffect } from 'react';
import Header from '@/components/Header';
import JurySection from '@/components/JurySection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Jury = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8">
        <JurySection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Jury;
