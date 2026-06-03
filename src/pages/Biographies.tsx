import { useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, User, Ticket } from 'lucide-react';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import posterAsset from '@/assets/concert-cortot-poster.png.asset.json';

const Footer = lazy(() => import('@/components/Footer'));
const ScrollToTop = lazy(() => import('@/components/ScrollToTop'));

interface Artist {
  name: string;
  role: string;
  bio: string;
  photo?: string;
}

const RESERVATION_URL =
  'https://indiv.themisweb.fr/0768/fChoixSeanceWidget.aspx?idstructure=0768&EventId=84&request=QcE+w0WHSuCWF9OlCSGcmWqlK7pLRVeqfHLZDpsKXHZIitc1vsQigXTiGajZ/qa9/NopmtBrZh3PJSLWiosMEO9FLFGThy1ThmBKAIqIKfkEQaTkgMrkrQ==';

const artists: Artist[] = [
  {
    name: 'Sumi Jo',
    role: 'Soprano colorature — Présidente du jury',
    bio: 'Biographie à compléter.',
  },
  {
    name: 'Zihao Li',
    role: 'Lauréat 2024',
    bio: 'Biographie à compléter.',
  },
  {
    name: 'Juliette Tacchino',
    role: 'Lauréate 2024',
    bio: 'Biographie à compléter.',
  },
  {
    name: 'George Virban',
    role: 'Lauréat 2024',
    bio: 'Biographie à compléter.',
  },
  {
    name: 'Marie Lombard',
    role: 'Lauréate 2024',
    bio: 'Biographie à compléter.',
  },
  {
    name: 'Alexandre Baldo',
    role: 'Lauréat 2024',
    bio: 'Biographie à compléter.',
  },
];

const BiographyCard = ({ artist, index }: { artist: Artist; index: number }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-2xl border border-gold/20 p-5 sm:p-6 md:p-8 hover:border-gold/50 transition-all duration-500"
    >
      <div className="flex flex-col sm:grid sm:grid-cols-[180px_1fr] md:grid-cols-[220px_1fr] gap-5 md:gap-8 items-start">
        <div className="relative w-32 sm:w-full mx-auto sm:mx-0">
          <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-gradient-to-br from-rose/10 to-gold/10 border border-gold/20 flex items-center justify-center">
            {artist.photo ? (
              <img
                src={artist.photo}
                alt={artist.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center text-gold/40 gap-1">
                <User className="w-10 h-10 sm:w-14 sm:h-14" />
                <span className="text-[9px] tracking-[0.2em] uppercase text-center px-1">
                  Photo à venir
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 text-center sm:text-left">
          <div>
            <p className="text-gold text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
              {artist.role}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground font-bold">
              {artist.name}
            </h2>
            <div className="h-px w-16 bg-gradient-to-r from-gold to-transparent mt-3 mx-auto sm:mx-0" />
          </div>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {artist.bio}
          </p>
        </div>
      </div>
    </motion.article>
  );
};

const Biographies = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Biographies des artistes | Concert Sumi Jo & Winners — Salle Cortot 10 juin 2026"
        description="Découvrez les biographies de Sumi Jo et des lauréats du Sumi Jo International Singing Competition 2024 : Zihao Li, Juliette Tacchino, George Virban, Marie Lombard et Alexandre Baldo, en concert le 10 juin 2026 à la Salle Cortot, Paris."
        keywords="biographies, chanteurs, Sumi Jo, lauréats, Salle Cortot, concert, opéra"
        path="/biographies"
      />
      <Header />

      <main className="pt-20 sm:pt-24 md:pt-32 pb-32 sm:pb-28">
        {/* Poster */}
        <section className="container mx-auto px-4 mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="max-w-sm sm:max-w-md md:max-w-lg mx-auto"
          >
            <img
              src={posterAsset.url}
              alt="Affiche du concert Sumi Jo & Winners — Salle Cortot, 10 juin 2026"
              className="w-full h-auto rounded-xl shadow-2xl border border-gold/20"
            />
          </motion.div>
        </section>

        {/* Hero */}
        <section className="container mx-auto px-4 mb-10 sm:mb-16 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-4 sm:space-y-6"
          >
            <p className="text-gold text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.25em] uppercase">
              10 juin 2026 — Salle Cortot
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl text-foreground font-bold leading-tight">
              Biographies des artistes
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-gold/60" />
              <div className="w-2 h-2 rotate-45 bg-gold" />
              <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed px-2">
              Découvrez les parcours exceptionnels de Sumi Jo et des lauréats 2024 du Sumi Jo
              International Singing Competition.
            </p>
          </motion.div>
        </section>

        {/* Artists */}
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-5 sm:space-y-8">
            {artists.map((artist, i) => (
              <BiographyCard key={artist.name} artist={artist} index={i} />
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mt-12 mb-6">
              <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-gold/40" />
              <div className="w-2 h-2 rotate-45 bg-gold/40" />
              <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-gold/40" />
            </div>
            <div className="text-center">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-bold border-rose/30 hover:border-rose hover:bg-rose hover:text-white transition-all duration-300"
              >
                <Link to="/concert-gala-paris">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Retour au concert
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Suspense fallback={<div className="h-40 bg-muted" />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>

      {/* Floating ticket button — mobile-optimized */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed bottom-3 left-0 right-0 flex justify-center px-3 sm:bottom-6 sm:px-0 z-50"
      >
        <Button
          asChild
          size="lg"
          className="w-full sm:w-auto bg-gradient-to-r from-rose-dark via-rose to-rose-dark text-white font-bold px-4 sm:px-6 py-4 sm:py-5 shadow-[0_8px_30px_rgba(200,90,107,0.45)] hover:shadow-[0_0_30px_rgba(200,90,107,0.6)] transition-all duration-300 hover:scale-[1.02] rounded-full text-xs sm:text-sm leading-tight h-auto whitespace-normal text-center"
        >
          <a href={RESERVATION_URL} target="_blank" rel="noopener noreferrer">
            <Ticket className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" />
            <span>Réservez vos places — SJISC 2026</span>
          </a>
        </Button>
      </motion.div>
    </div>
  );
};

export default Biographies;
