import { useEffect, lazy, Suspense } from 'react';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import artistsImageAsset from '@/assets/concert-gala-paris-artists-v2.png.asset.json';
const artistsImage = artistsImageAsset.url;

const Header = lazy(() => import('@/components/Header'));
const Footer = lazy(() => import('@/components/Footer'));
const ScrollToTop = lazy(() => import('@/components/ScrollToTop'));

type Piece = { artists: string; aria: string; opera: string; composer: string };

const partOne: Piece[] = [
  { artists: 'Alexandre Baldo', aria: '« Sous les Pieds d'une Femme »', opera: 'La Reine de Saba', composer: 'Gounod' },
  { artists: 'Zihao Li', aria: '« O Vaterland, du machst bei tag »', opera: 'Die lustige Witwe', composer: 'Lehar' },
  { artists: 'Juliette Tacchino', aria: '« Naughty Marietta »', opera: 'Naughty Marietta', composer: 'Herbert' },
  { artists: 'George Virban', aria: '« Ah, Lève-toi Soleil ! »', opera: 'Roméo et Juliette', composer: 'Gounod' },
  { artists: 'Marie Lombard', aria: '« Robert, toi que j'aime »', opera: 'Robert le Diable', composer: 'Meyerbeer' },
  { artists: 'Marie Lombard & Juliette Tacchino', aria: '« Sull'aria »', opera: 'Nozze di Figaro', composer: 'Mozart' },
  { artists: 'Zihao Li', aria: '« Mein Sehnen, mein Wahnen »', opera: 'Die Tote Stadt', composer: 'Korngold' },
  { artists: 'George Virban & Juliette Tacchino', aria: '« Caro elisir »', opera: 'L'elisir d'amore', composer: 'Donizetti' },
];

const partTwo: Piece[] = [
  { artists: 'Zihao Li', aria: '« Largo al factotum »', opera: 'Il Barbiere di Siviglia', composer: 'Rossini' },
  { artists: 'Juliette Tacchino', aria: '« Da Tempeste »', opera: 'Giulio Cesare', composer: 'Handel' },
  { artists: 'Alexandre Baldo', aria: '« O Isis und Osiris »', opera: 'La Flûte Enchantée', composer: 'Mozart' },
  { artists: 'Juliette Tacchino & Alexandre Baldo', aria: '« La ci darem la mano »', opera: 'Don Giovanni', composer: 'Mozart' },
  { artists: 'Marie Lombard', aria: '« Ah fors'e lui… sempre libera »', opera: 'Traviata', composer: 'Verdi' },
  { artists: 'Quartetto — G. Virban, Z. Li, J. Tacchino, M. Lombard', aria: '« Dunque e proprio finita ? »', opera: 'La Bohème', composer: 'Puccini' },
  { artists: 'George Virban', aria: '« Nessun Dorma »', opera: 'Turandot', composer: 'Puccini' },
  { artists: 'Sumi Jo', aria: '« Oh, quante volte »', opera: 'I Capuletti e i Montecchi', composer: 'Bellini' },
  { artists: 'Sumi Jo', aria: '« Spiel ich die Unschuld vom Lande »', opera: 'Die Fledermaus', composer: 'Johann Strauss II' },
  { artists: 'Tutti avec Sumi Jo', aria: '« Make our Garden Grow »', opera: 'Candide', composer: 'Bernstein' },
];

const PieceRow = ({ piece, index, inView }: { piece: Piece; index: number; inView: boolean }) => (
  <motion.li
    initial={{ opacity: 0, y: 12 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.4, delay: 0.04 * index }}
    className="border-b border-gold/10 last:border-b-0 py-4"
  >
    <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-1">{piece.artists}</p>
    <p className="font-display text-base md:text-lg text-foreground leading-snug">{piece.aria}</p>
    <p className="text-muted-foreground text-sm italic">
      {piece.opera} <span className="text-muted-foreground/70 not-italic">— {piece.composer}</span>
    </p>
  </motion.li>
);

const ConcertGalaParis = () => {
  const [introRef, introInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [progRef, progInView] = useInView({ triggerOnce: true, threshold: 0.05 });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Concert Sumi Jo & Winners — 10 juin 2026, Salle Cortot Paris"
        description="Concert exceptionnel de Sumi Jo et des candidats 2024 du Sumi Jo International Singing Competition. Mercredi 10 juin 2026 à 20h00, Salle Cortot, Paris."
        keywords="Sumi Jo, concert, Salle Cortot, Paris, lauréats, opéra, gala, 2026"
        path="/concert-gala-paris"
      />
      <Suspense fallback={<div className="h-20 bg-background" />}>
        <Header />
      </Suspense>

      <main className="pt-8">
        {/* HERO */}
        <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-cream via-background to-background">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-rose/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-gold text-sm font-medium tracking-[0.3em] uppercase mb-4 block">
                Concert exceptionnel — Paris
              </span>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight">
                Sumi Jo <span className="text-rose-dark">&</span> Winners
              </h1>
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-6" />
              <p className="text-lg md:text-xl text-muted-foreground italic max-w-2xl mx-auto">
                Concert des Lauréats de la Sumi Jo International Singing Competition 2024
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10 text-foreground/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  <span className="font-medium">Mercredi 10 juin 2026 — 20h00</span>
                </div>
                <span className="hidden sm:inline text-gold/60">•</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold" />
                  <span className="font-medium">Salle Cortot, Paris</span>
                </div>
              </div>

              <div className="flex justify-center items-center mt-10">
                <Button asChild variant="outline" size="lg" className="font-bold px-8 py-6 border-rose/30 hover:border-rose hover:bg-rose hover:text-white transition-all duration-300">
                  <Link to="/">
                    En savoir plus sur le concours
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ARTISTS IMAGE */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.25)] ring-1 ring-gold/30"
            >
              <img
                src={artistsImage}
                alt="Sumi Jo et les lauréats 2024 - Zihao Li, Marie Lombard, Juliette Tacchino, George Virban"
                className="w-full h-auto block"
                loading="lazy"
              />
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/60 rounded-tl-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/60 rounded-br-2xl pointer-events-none" />
            </motion.div>
            <p className="text-center text-muted-foreground text-sm italic mt-4">
              Sumi Jo et les lauréats 2024 - Zihao Li, Marie Lombard, Juliette Tacchino, George Virban
            </p>
          </div>
        </section>

        {/* INTRO */}
        <section ref={introRef} className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={introInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="space-y-6 text-foreground/85 text-base md:text-lg leading-relaxed"
            >
              <p>
                La légendaire soprano colorature coréenne <span className="text-rose-dark font-semibold">Sumi Jo</span>,
                commandeure des Arts et des Lettres, Unesco Artist for Peace, Grammy Award Winner — celle que
                Maestro Herbert von Karajan appelait <em>La Voix des Cieux</em> (« the Voice from Heaven ») —
                fête en 2026 ses <span className="text-rose-dark font-semibold">quarante années de carrière</span> à
                travers une triomphante tournée mondiale.
              </p>
              <p>
                Cette tournée l'a conduite en Asie, à Londres (<em>Cadogan Hall</em>) et New York (<em>Carnegie Hall</em>),
                et pour <span className="text-rose-dark font-semibold">une soirée seulement à Paris</span>, à la Salle
                Cortot, où elle chantera avec les gagnants de la première édition de son concours international de chant,
                le Sumi Jo International Singing Competition.
              </p>

              <blockquote className="border-l-2 border-gold pl-6 py-2 my-8 italic font-display text-xl md:text-2xl text-foreground/90">
                « The Voice from Heaven »
                <footer className="not-italic text-sm text-muted-foreground mt-2 font-sans">
                  — Maestro Herbert von Karajan
                </footer>
              </blockquote>

              <div className="text-center pt-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-gold hover:text-rose-dark transition-colors text-sm font-semibold tracking-wide uppercase"
                >
                  En savoir plus sur la Sumi Jo International Singing Competition →
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PROGRAMME */}
        <section ref={progRef} className="py-16 md:py-24 bg-muted/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={progInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <span className="text-gold text-sm font-medium tracking-[0.3em] uppercase mb-3 block">
                Programme du concert
              </span>
              <h2 className="font-display text-3xl md:text-5xl text-foreground">
                Une soirée d'<span className="text-rose-dark">exception</span>
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {/* Première partie */}
              <div className="bg-card rounded-xl border border-gold/20 shadow-lg p-6 md:p-8">
                <div className="text-center mb-6">
                  <span className="inline-block text-gold text-xs font-bold tracking-[0.3em] uppercase">
                    Première partie
                  </span>
                  <div className="w-16 h-0.5 bg-gold/40 mx-auto mt-3" />
                </div>
                <ul>
                  {partOne.map((p, i) => (
                    <PieceRow key={`p1-${i}`} piece={p} index={i} inView={progInView} />
                  ))}
                </ul>
              </div>

              {/* Deuxième partie */}
              <div className="bg-card rounded-xl border border-gold/30 shadow-lg p-6 md:p-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-dark to-rose text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1 rounded-full shadow-md">
                  Avec Sumi Jo
                </div>
                <div className="text-center mb-6 mt-2">
                  <span className="inline-block text-gold text-xs font-bold tracking-[0.3em] uppercase">
                    Deuxième partie
                  </span>
                  <div className="w-16 h-0.5 bg-gold/40 mx-auto mt-3" />
                </div>
                <ul>
                  {partTwo.map((p, i) => (
                    <PieceRow key={`p2-${i}`} piece={p} index={i} inView={progInView} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Lien vers biographies */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="font-bold border-gold/40 text-foreground hover:border-gold hover:bg-gold/10 transition-all duration-300"
            >
              <Link to="/biographies">
                Découvrir les biographies des artistes
              </Link>
            </Button>

            {/* Ornament + back */}
            <div className="flex items-center justify-center gap-3 mt-16 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
              <div className="w-2 h-2 rotate-45 bg-gold/40" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
            </div>

            <Button asChild variant="outline" size="lg" className="font-bold border-rose/30 hover:border-rose hover:bg-rose hover:text-white transition-all duration-300">
              <Link to="/">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
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

export default ConcertGalaParis;
