import { useEffect } from 'react';
import { lazy, Suspense } from 'react';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ticket, ArrowLeft } from 'lucide-react';

const Header = lazy(() => import('@/components/Header'));
const Footer = lazy(() => import('@/components/Footer'));
const ScrollToTop = lazy(() => import('@/components/ScrollToTop'));

const programData = [
  {
    day: 'Lundi 6 juillet',
    slots: [
      { time: '14h - 17h', title: 'Auditions', desc: 'des 12 premiers candidats' },
      { time: '20h - 22h', title: 'Récital', desc: 'des candidats' },
    ],
  },
  {
    day: 'Mardi 7 juillet',
    slots: [
      { time: '14h - 17h', title: 'Auditions', desc: 'des 12 candidats restants' },
      { time: '20h - 22h', title: 'Récital', desc: 'des candidats' },
    ],
  },
  {
    day: 'Mercredi 8 juillet',
    slots: [
      null,
      { time: '20h - 22h', title: 'Récital', desc: 'des lauréats 2024' },
    ],
  },
  {
    day: 'Jeudi 9 juillet',
    slots: [
      { time: 'Horaires à définir', title: 'Masterclass', desc: '' },
      { time: '20h - 22h30', title: 'Petite finale', desc: '' },
    ],
  },
  {
    day: 'Vendredi 10 juillet',
    slots: [
      { time: 'Horaires à définir', title: 'Masterclass', desc: '' },
      { time: '20h - 22h45', title: 'Grande finale', desc: '' },
    ],
  },
  {
    day: 'Samedi 11 juillet',
    slots: [
      null,
      { time: '20h - 22h', title: 'Concert de gala', desc: '' },
    ],
  },
];

const Programme = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Programme 2026 | SUMI JO International Singing Competition"
        description="Programme détaillé du concours international de chant lyrique SUMI JO 2026 au Château de la Ferté-Imbault. Du 6 au 11 juillet 2026."
        keywords="programme, concours chant, SJISC 2026, auditions, finale, gala"
        path="/programme"
      />
      <Suspense fallback={<div className="h-20 bg-background" />}>
        <Header />
      </Suspense>
      <main className="pt-8">
        <section className="relative py-20 md:py-28 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-rose/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10" ref={ref}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-gold text-sm font-medium tracking-[0.3em] uppercase mb-4 block">
                Édition 2026
              </span>
              <h1 className="text-4xl md:text-5xl font-display text-foreground">
                Programme <span className="text-gold">détaillé</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-6">
                Du lundi 6 au samedi 11 juillet — Château de la Ferté-Imbault
              </p>
            </motion.div>

            {/* Desktop table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:block overflow-x-auto"
            >
              <div className="grid grid-cols-6 gap-2 min-w-[900px]">
                {/* Headers */}
                {programData.map((col, i) => (
                  <motion.div
                    key={`header-${i}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 * i }}
                    className="bg-muted/40 border-b-2 border-gold/40 px-3 py-4 text-center font-display text-xs font-bold tracking-widest uppercase text-muted-foreground"
                  >
                    {col.day}
                  </motion.div>
                ))}

                {/* Row 1 - Après-midi */}
                {programData.map((col, i) => (
                  <motion.div
                    key={`r1-${i}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + 0.05 * i }}
                    className="bg-muted/20 px-3 py-5 text-center min-h-[120px] flex flex-col justify-center"
                  >
                    {col.slots[0] ? (
                      <>
                        <p className="font-display text-base font-bold text-foreground">{col.slots[0].title}</p>
                        {col.slots[0].desc && (
                          <p className="text-muted-foreground text-sm mt-1">{col.slots[0].desc}</p>
                        )}
                        <p className="text-gold text-xs font-semibold mt-2">{col.slots[0].time}</p>
                      </>
                    ) : (
                      <p className="text-muted-foreground/30 text-sm italic">—</p>
                    )}
                  </motion.div>
                ))}

                {/* Row 2 - Soirée */}
                {programData.map((col, i) => (
                  <motion.div
                    key={`r2-${i}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + 0.05 * i }}
                    className={`bg-muted/20 px-3 py-5 text-center min-h-[120px] flex flex-col justify-center ${
                      ['Petite finale', 'Grande finale', 'Concert de gala'].includes(col.slots[1]?.title || '')
                        ? 'bg-gold/5'
                        : ''
                    }`}
                  >
                    {col.slots[1] ? (
                      <>
                        <p className="font-display text-base font-bold text-foreground">
                          {col.slots[1].title}
                        </p>
                        {col.slots[1].desc && (
                          <p className="text-muted-foreground text-sm mt-1">{col.slots[1].desc}</p>
                        )}
                        <p className="text-gold text-xs font-semibold mt-2">{col.slots[1].time}</p>
                      </>
                    ) : (
                      <p className="text-muted-foreground/30 text-sm italic">—</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {programData.map((col, i) => (
                <motion.div
                  key={`mobile-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="bg-card border border-border/50 rounded-xl p-4 shadow-sm"
                >
                  <h3 className="font-display text-lg font-bold text-foreground border-b border-border/30 pb-2 mb-3">
                    {col.day}
                  </h3>
                  <div className="space-y-3">
                    {col.slots.map((slot, j) =>
                      slot ? (
                        <div key={j} className={`flex items-start gap-3 ${
                          ['Petite finale', 'Grande finale', 'Concert de gala'].includes(slot.title)
                            ? 'bg-gold/5 rounded-lg p-2 -mx-2'
                            : ''
                        }`}>
                          <span className="text-gold text-xs font-semibold whitespace-nowrap mt-0.5">{slot.time}</span>
                          <div>
                            <p className="font-display text-sm font-bold text-foreground">{slot.title}</p>
                            {slot.desc && <p className="text-muted-foreground text-xs">{slot.desc}</p>}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Ornamental separator */}
            <div className="flex items-center justify-center gap-3 mt-16 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
              <div className="w-2 h-2 rotate-45 bg-gold/40" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-rose-dark via-rose to-rose-dark text-white font-bold text-base px-8 py-6 hover:shadow-[0_0_30px_rgba(200,90,107,0.5)] transition-all duration-300 hover:scale-105">
                <Link to="/billetterie">
                  <Ticket className="w-5 h-5 mr-2" />
                  Achetez vos places
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-bold text-base px-8 py-6 border-gold/20 hover:border-gold/40 hover:bg-gold/5">
                <Link to="/">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
            </motion.div>
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

export default Programme;
