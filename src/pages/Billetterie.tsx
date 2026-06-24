import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TicketingAnnouncement from '@/components/TicketingAnnouncement';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEOHead';
import { getEventSchema, getOrganizationSchema } from '@/lib/structuredData';

const Billetterie = () => {
  const jsonLdSchemas = [getEventSchema(), getOrganizationSchema()];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1ED' }}>
      <SEOHead
        title="Billetterie | SUMI JO International Singing Competition 2026"
        description="Réservez vos billets pour le concours international de chant lyrique SUMI JO au Château de La Ferté-Imbault. Ouverture le 1er mars 2026."
        keywords="billetterie, tickets, réservation, SJISC, concours chant, opéra"
        path="/billetterie"
        type="event"
        jsonLd={jsonLdSchemas}
      />
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
