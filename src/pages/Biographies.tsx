import { useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, User, Ticket } from 'lucide-react';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';

const Footer = lazy(() => import('@/components/Footer'));
const ScrollToTop = lazy(() => import('@/components/ScrollToTop'));

interface Artist {
  name: string;
  role: string;
  bio: string;
  photo?: string;
}

const artists: Artist[] = [
  {
    name: 'Sumi Jo',
    role: 'Soprano colorature — Présidente du jury',
    bio: "Biographie à compléter.",
  },
  {
    name: 'Zihao Li',
    role: 'Lauréat 2024',
    bio: "Biographie à compléter.",
  },
  {
    name: 'Juliette Tacchino',
    role: 'Lauréate 2024',
    bio: "Biographie à compléter.",
  },
  {
    name: 'George Virban',
    role: 'Lauréat 2024',
    bio: "Biographie à compléter.",
  },
  {
    name: 'Marie Lombard',
    role: 'Lauréate 2024',
    bio: "Biographie à compléter.",
  },
  {
    name: 'Alexandre Baldo',
    role: 'Lauréat 2024',
    bio: "Biographie à compléter.",
  },
];

const BiographyCard = ({ artist, index }: { artist: Artist; index: number }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const isReverse = index % 2 === 1;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className={`grid md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-start bg-card rounded-2xl border border-gold/20 p-6 md:p-10 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/5 transition-all duration-500 ${
        isReverse ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      <div className="relative">
        <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-gradient-to-br from-rose/10 to-gold/10 border border-gold/20 flex items-center justify-center">
          {artist.photo ? (
            <img
              src={artist.photo}
              alt={artist.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center text-gold/40 gap-2">
              <User className="w-16 h-16" />
              <span className="text-[10px] tracking-[0.2em] uppercase">Photo à venir</span>
            </div>
          )}
        </div>
        <div className="absolute -bottom-2 -right-2 w-16 h-16 border-2 border-gold/30 rounded-xl -z-10" />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-gold text-[11px] font-bold tracking-[0.25em] uppercase mb-2">
            {artist.role}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground font-bold">
            {artist.name}
          </h2>
          <div className="h-px w-20 bg-gradient-to-r from-gold to-transparent mt-4" />
        </div>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {artist.bio}
        </p>
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

      <main className="pt-24 md:pt-32 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-16 md:mb-24 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <p className="text-gold text-xs md:text-sm font-bold tracking-[0.3em] uppercase">
              Concert Sumi Jo & Winners — 10 juin 2026, Salle Cortot
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-foreground font-bold">
              Biographies des artistes
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
              <div className="w-2 h-2 rotate-45 bg-gold" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Découvrez les parcours exceptionnels de Sumi Jo et des lauréats 2024 du Sumi Jo
              International Singing Competition qui se produiront ensemble sur la scène de la
              Salle Cortot le 10 juin 2026.
            </p>
          </motion.div>
        </section>

        {/* Artists */}
        <section className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
            {artists.map((artist, i) => (
              <BiographyCard key={artist.name} artist={artist} index={i} />
            ))}
          </div>

          {/* Ornament + back */}
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-3 mt-16 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
              <div className="w-2 h-2 rotate-45 bg-gold/40" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
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
    </div>
  );
};

export default Biographies;
