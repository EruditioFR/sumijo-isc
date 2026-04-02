import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ticket, ArrowLeft } from 'lucide-react';

const programDetails = [
  {
    day: 'Lundi 6 juillet',
    events: [
      { time: '14h - 17h', title: 'AUDITIONS des 12 premiers candidats', description: 'Première session d\'auditions au Château de la Ferté-Imbault.' },
      { time: '20h - 22h', title: 'Récital des candidats', description: 'Les candidats du jour se produisent en récital.' },
    ],
  },
  {
    day: 'Mardi 7 juillet',
    events: [
      { time: '14h - 17h', title: 'AUDITIONS des 12 candidats restants', description: 'Seconde session d\'auditions.' },
      { time: '20h - 22h', title: 'Récital des candidats', description: 'Les candidats du jour se produisent en récital.' },
    ],
  },
  {
    day: 'Mercredi 8 juillet',
    events: [
      { time: '20h - 22h', title: 'Récital des lauréats 2024', description: 'Retrouvez les lauréats de l\'édition précédente sur scène.' },
    ],
  },
  {
    day: 'Jeudi 9 juillet',
    events: [
      { time: 'Horaires à définir', title: 'Masterclass', description: 'Masterclass ouverte au public.' },
      { time: '20h - 22h30', title: 'Petite finale', description: 'Les candidats sélectionnés s\'affrontent pour accéder à la grande finale.' },
    ],
  },
  {
    day: 'Vendredi 10 juillet',
    events: [
      { time: 'Horaires à définir', title: 'Masterclass', description: 'Masterclass ouverte au public.' },
      { time: '20h - 22h45', title: 'Grande finale', description: 'La grande finale du SUMI JO International Singing Competition 2026.' },
    ],
  },
  {
    day: 'Samedi 11 juillet',
    events: [
      { time: '20h - 22h', title: 'Concert de gala', description: 'Soirée de clôture exceptionnelle avec les lauréats et invités d\'honneur.' },
    ],
  },
];

const Programme = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Programme 2026 | SUMI JO International Singing Competition"
        description="Programme détaillé du concours international de chant lyrique SUMI JO 2026 au Château de la Ferté-Imbault. Du 6 au 11 juillet 2026."
        keywords="programme, concours chant, SJISC 2026, auditions, finale, gala"
        path="/programme"
      />
      <Header />
      <main>
        {/* Hero Banner */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-foreground text-background">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="font-display text-4xl md:text-6xl font-bold">
                Programme <span className="text-gold">2026</span>
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light mx-auto" />
              <p className="text-background/70 text-lg md:text-xl max-w-2xl mx-auto">
                Du lundi 6 au samedi 11 juillet — Château de la Ferté-Imbault
              </p>
            </motion.div>
          </div>
        </section>

        {/* Programme détaillé */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div ref={ref} className="space-y-8">
              {programDetails.map((day, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * i }}
                  className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="bg-foreground text-background px-6 py-4">
                    <h2 className="font-display text-xl md:text-2xl font-bold">{day.day}</h2>
                  </div>
                  <div className="divide-y divide-border/30">
                    {day.events.map((event, j) => (
                      <div key={j} className={`px-6 py-5 flex flex-col md:flex-row md:items-start gap-3 ${
                        ['Petite finale', 'Grande finale', 'Concert de gala'].includes(event.title)
                          ? 'bg-gold/5'
                          : ''
                      }`}>
                        <span className="text-gold font-semibold text-sm whitespace-nowrap min-w-[140px]">
                          {event.time}
                        </span>
                        <div>
                          <h3 className={`font-display text-lg font-bold ${
                            ['Petite finale', 'Grande finale', 'Concert de gala'].includes(event.title)
                              ? 'text-gold'
                              : 'text-foreground'
                          }`}>
                            {event.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16"
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-rose-dark via-rose to-rose-dark text-white font-bold text-base px-8 py-6 hover:shadow-[0_0_30px_rgba(200,90,107,0.5)] transition-all duration-300 hover:scale-105">
                <Link to="/billetterie">
                  <Ticket className="w-5 h-5 mr-2" />
                  Achetez vos places
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-bold text-base px-8 py-6">
                <Link to="/">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Programme;
