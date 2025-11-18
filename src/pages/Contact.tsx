import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8">
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Contact;
