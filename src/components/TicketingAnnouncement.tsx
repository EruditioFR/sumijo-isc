import { useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import posterImage from '@/assets/competition-2026-poster.jpg';

const TicketingAnnouncement = () => {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const getBilletwebLang = useCallback(() => {
    // Billetweb supports: fr, en, es, de, it, nl, zh
    switch (i18n.language) {
      case 'en': return 'en';
      case 'zh': return 'zh';
      case 'kr': return 'en'; // Korean not supported by Billetweb, fallback to English
      default: return 'fr';
    }
  }, [i18n.language]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous widget content
    container.innerHTML = '';

    const lang = getBilletwebLang();
    const baseUrl = `https://www.billetweb.fr/shop.php?event=sumi-jo-international-singing-competition1`;
    const url = `${baseUrl}&lang=${lang}`;

    // Create the anchor element that Billetweb will transform into an iframe
    const anchor = document.createElement('a');
    anchor.title = 'Vente de billets en ligne';
    anchor.href = url;
    anchor.className = 'shop_frame';
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.setAttribute('data-src', url);
    anchor.setAttribute('data-max-width', '100%');
    anchor.setAttribute('data-initial-height', '600');
    anchor.setAttribute('data-scrolling', 'no');
    anchor.setAttribute('data-id', 'sumi-jo-international-singing-competition1');
    anchor.setAttribute('data-resize', '1');
    anchor.setAttribute('data-lang', lang);
    anchor.textContent = 'Vente de billets en ligne';

    container.appendChild(anchor);

    // Load Billetweb script
    const script = document.createElement('script');
    script.src = 'https://www.billetweb.fr/js/export.js';
    script.type = 'text/javascript';
    script.async = true;
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [getBilletwebLang]);

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-elegant p-4 md:p-8"
      >
        <div ref={containerRef} />
      </motion.div>
    </section>
  );
};

export default TicketingAnnouncement;
