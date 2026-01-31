import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TicketingAnnouncement from '@/components/TicketingAnnouncement';
import ScrollToTop from '@/components/ScrollToTop';

const Billetterie = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1ED' }}>
      <Header />
      <main>
        <TicketingAnnouncement />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Billetterie;
