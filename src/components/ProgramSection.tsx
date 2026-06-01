import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, Ticket } from 'lucide-react';

const programData = [
  {
    day: 'Lundi 6 juillet',
    slots: [
      { time: '14h - 17h', title: 'Auditions', desc: 'des 12 premiers candidats' },
      { time: '20h - 22h', title: 'Récital', desc: 'des candidats 2024' },
    ],
  },
  {
    day: 'Mardi 7 juillet',
    slots: [
      { time: '14h - 17h', title: 'Auditions', desc: 'des 12 candidats restants' },
      { time: '20h - 22h', title: 'Récital', desc: 'des candidats 2024' },
    ],
  },
  {
    day: 'Mercredi 8 juillet',
    slots: [
      null,
      { time: '20h - 22h', title: 'Récital', desc: 'des candidats 2024' },
    ],
  },
  {
    day: 'Jeudi 9 juillet',
    slots: [
      { time: '14h - 17h', title: 'Masterclass', desc: '' },
      { time: '20h - 22h30', title: 'Petite finale', desc: '' },
    ],
  },
  {
    day: 'Vendredi 10 juillet',
    slots: [
      { time: '14h - 17h', title: 'Masterclass', desc: '' },
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

const ProgramSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="programme" className="pt-20 md:pt-28 pb-8 md:pb-12 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            Le programme <span className="text-gold">2026</span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light mx-auto" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Du lundi 6 au samedi 11 juillet<br />
            Château de la Ferté-Imbault
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
                className={`bg-muted/20 px-3 py-5 text-center min-h-[120px] flex flex-col justify-center ${
                  col.slots[0] ? '' : ''
                }`}
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

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
        >
          <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-bold text-base px-8 py-6">
            <Link to="/programme">
              <CalendarDays className="w-5 h-5 mr-2" />
              Découvrir les détails du programme
            </Link>
          </Button>
          <Button asChild size="lg" className="bg-gradient-to-r from-rose-dark via-rose to-rose-dark text-white font-bold text-base px-8 py-6 hover:shadow-[0_0_30px_rgba(200,90,107,0.5)] transition-all duration-300 hover:scale-105">
            <Link to="/billetterie">
              <Ticket className="w-5 h-5 mr-2" />
              Achetez vos places
            </Link>
          </Button>
        </motion.div>

        {/* Teaser concert Salle Cortot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-rose-dark/5 via-gold/5 to-rose-dark/5 border border-gold/30 rounded-2xl p-6 md:p-8 text-center shadow-lg">
            <span className="inline-block text-gold text-xs font-bold tracking-[0.3em] uppercase mb-3">
              Événement exceptionnel — Paris
            </span>
            <h3 className="font-display text-xl md:text-2xl text-foreground leading-snug">
              Et ne manquez pas le concert{' '}
              <span className="text-rose-dark font-semibold">« Sumi Jo &amp; Winners »</span>{' '}
              avec les lauréats 2024, le <span className="text-rose-dark font-semibold">10 juin 2026 à 20h00</span> à la{' '}
              <span className="text-rose-dark font-semibold">Salle Cortot, Paris</span>.
            </h3>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-5" />
            <Button asChild variant="outline" className="font-bold border-gold/60 text-foreground hover:bg-gold hover:text-white hover:border-gold transition-all duration-300">
              <Link to="/concert-gala-paris">En savoir plus →</Link>
            </Button>
          </div>
        </motion.div>
      </div>
      {/* Smooth transition to next section */}
      <div className="h-16 md:h-24 bg-gradient-to-b from-background via-background/50 to-cream/80" />
    </section>
  );
};

export default ProgramSection;
