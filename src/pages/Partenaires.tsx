import { useEffect } from 'react';
import Header from '@/components/Header';
import SponsorshipSection from '@/components/SponsorshipSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Partenaires = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8">
        <SponsorshipSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Partenaires;
