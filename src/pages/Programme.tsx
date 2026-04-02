import { useEffect } from 'react';
import { lazy, Suspense } from 'react';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ticket, ArrowLeft, Music, Mic2, Trophy, Star } from 'lucide-react';

const Header = lazy(() => import('@/components/Header'));
const Footer = lazy(() => import('@/components/Footer'));
const ScrollToTop = lazy(() => import('@/components/ScrollToTop'));

const programDetails = [
  {
    day: 'Lundi 6 juillet',
    icon: Mic2,
    events: [
      { time: '14h - 17h', title: 'AUDITIONS des 12 premiers candidats', description: 'Première session d\'auditions au Château de la Ferté-Imbault.' },
      { time: '20h - 22h', title: 'Récital des candidats', description: 'Les candidats du jour se produisent en récital.' },
    ],
  },
  {
    day: 'Mardi 7 juillet',
    icon: Mic2,
    events: [
      { time: '14h - 17h', title: 'AUDITIONS des 12 candidats restants', description: 'Seconde session d\'auditions.' },
      { time: '20h - 22h', title: 'Récital des candidats', description: 'Les candidats du jour se produisent en récital.' },
    ],
  },
  {
    day: 'Mercredi 8 juillet',
    icon: Music,
    events: [
      { time: '20h - 22h', title: 'Récital des lauréats 2024', description: 'Retrouvez les lauréats de l\'édition précédente sur scène.' },
    ],
  },
  {
    day: 'Jeudi 9 juillet',
    icon: Trophy,
    events: [
      { time: 'Horaires à définir', title: 'Masterclass', description: 'Masterclass ouverte au public.' },
      { time: '20h - 22h30', title: 'Petite finale', description: 'Les candidats sélectionnés s\'affrontent pour accéder à la grande finale.' },
    ],
  },
  {
    day: 'Vendredi 10 juillet',
    icon: Trophy,
    events: [
      { time: 'Horaires à définir', title: 'Masterclass', description: 'Masterclass ouverte au public.' },
      { time: '20h - 22h45', title: 'Grande finale', description: 'La grande finale du SUMI JO International Singing Competition 2026.' },
    ],
  },
  {
    day: 'Samedi 11 juillet',
    icon: Star,
    events: [
      { time: '20h - 22h', title: 'Concert de gala', description: 'Soirée de clôture exceptionnelle avec les lauréats et invités d\'honneur.' },
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
          {/* Decorative elements matching jury page */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-rose/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10" ref={ref}>
            {/* Header matching jury style */}
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

            {/* Programme cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {programDetails.map((day, i) => {
                const IconComponent = day.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className="group"
                  >
                    <div className="relative bg-card rounded-xl overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-gold/20 border border-gold/10 group-hover:border-gold/30 h-full">
                      {/* Day header with icon */}
                      <div className="relative bg-gradient-to-r from-foreground via-foreground to-foreground/95 text-background px-6 py-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <h2 className="font-display text-xl md:text-2xl font-bold">{day.day}</h2>
                        </div>
                        {/* Decorative corner accent */}
                        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                          <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-bl from-gold/20 to-transparent rotate-45 transform origin-bottom-left" />
                        </div>
                      </div>

                      {/* Gold accent line */}
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />

                      {/* Events */}
                      <div className="divide-y divide-border/30">
                        {day.events.map((event, j) => {
                          const isHighlight = ['Petite finale', 'Grande finale', 'Concert de gala'].includes(event.title);
                          return (
                            <div key={j} className={`px-6 py-5 transition-colors duration-300 ${
                              isHighlight ? 'bg-gold/5' : 'hover:bg-muted/30'
                            }`}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-gold font-semibold text-xs tracking-wide uppercase whitespace-nowrap">
                                  {event.time}
                                </span>
                              </div>
                              <h3 className={`font-display text-lg font-bold mb-1 ${
                                isHighlight ? 'text-gold' : 'text-foreground'
                              }`}>
                                {event.title}
                              </h3>
                              <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
