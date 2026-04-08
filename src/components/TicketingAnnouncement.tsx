import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import posterImage from '@/assets/competition-2026-poster.jpg';

const TicketingAnnouncement = () => {
  const { t, i18n } = useTranslation();
  const widgetRef = useRef<HTMLDivElement>(null);

  // Map site language to Billetweb locale
  const billetwebLocale = (() => {
    switch (i18n.language) {
      case 'en': return 'en';
      case 'zh': return 'zh';
      case 'kr': return 'en'; // Billetweb doesn't support Korean, fallback to English
      default: return 'fr';
    }
  })();

  useEffect(() => {
    // Load Billetweb script
    const script = document.createElement('script');
    script.src = 'https://www.billetweb.fr/js/export.js';
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="min-h-screen pt-28 pb-20 px-4" style={{ backgroundColor: '#F5F1ED' }}>
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto mb-12 text-center"
      >
        <div className="max-w-xs mx-auto mb-8">
          <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-lg shadow-elegant">
            <img
              src={posterImage}
              alt="Sumi Jo International Singing Competition 2026"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>

        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 bg-rose" />
          <span
            className="text-base md:text-lg tracking-[0.3em] text-[#3A3A3A] font-medium uppercase"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('ticketing.label')}
          </span>
          <div className="h-px w-12 bg-rose" />
        </div>
        <div className="mx-auto w-16 h-0.5 bg-rose" />
      </motion.div>

      {/* Billetweb Widget */}
      <motion.div
        ref={widgetRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-elegant p-4 md:p-8"
      >
        <a
          title="Vente de billets en ligne"
          href="https://www.billetweb.fr/shop.php?event=sumi-jo-international-singing-competition1"
          className="shop_frame"
          target="_blank"
          rel="noopener noreferrer"
          data-src="https://www.billetweb.fr/shop.php?event=sumi-jo-international-singing-competition1"
          data-max-width="100%"
          data-initial-height="600"
          data-scrolling="no"
          data-id="sumi-jo-international-singing-competition1"
          data-resize="1"
        >
          Vente de billets en ligne
        </a>
      </motion.div>
    </section>
  );
};

export default TicketingAnnouncement;
