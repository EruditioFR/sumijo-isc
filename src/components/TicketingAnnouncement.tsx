import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import posterImage from '@/assets/competition-2026-poster.jpg';

const TicketingAnnouncement = () => {
  const { t, i18n } = useTranslation();
  const [iframeHeight, setIframeHeight] = useState(900);

  const getBilletwebLang = useCallback(() => {
    // Billetweb supports: fr, en, es, de, it, nl, zh
    switch (i18n.language) {
      case 'en': return 'en';
      case 'zh': return 'zh';
      case 'kr': return 'en'; // Korean not supported by Billetweb, fallback to English
      default: return 'fr';
    }
  }, [i18n.language]);

  const lang = getBilletwebLang();
  const iframeSrc = `https://widget.billetweb.fr/shop.php?event=sumi-jo-international-singing-competition1&lang=${lang}&color=ffffff`;

  // Listen for Billetweb iframe resize messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.origin === 'string' && event.origin.includes('billetweb.fr')) {
        const data = event.data;
        if (typeof data === 'object' && data !== null && 'height' in data) {
          const h = Number((data as { height: unknown }).height);
          if (!Number.isNaN(h) && h > 200) setIframeHeight(h);
        } else if (typeof data === 'string' && data.startsWith('height:')) {
          const h = Number(data.split(':')[1]);
          if (!Number.isNaN(h) && h > 200) setIframeHeight(h);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
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

      {/* Billetweb Widget — keyed by lang to force reload on language change */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-elegant p-4 md:p-8"
      >
        <iframe
          key={lang}
          src={iframeSrc}
          title="Billetterie SUMI JO"
          width="100%"
          height={iframeHeight}
          style={{ border: 'none', width: '100%', minHeight: 600 }}
          scrolling="no"
          allow="payment"
        />
      </motion.div>
    </section>
  );
};

export default TicketingAnnouncement;

