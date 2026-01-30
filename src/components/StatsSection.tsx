import { useTranslation } from 'react-i18next';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

// Animated counter component
const AnimatedCounter = ({
  value,
  suffix = '',
  inView
}: {
  value: number;
  suffix?: string;
  inView: boolean;
}) => {
  const spring = useSpring(0, {
    duration: 2000,
    bounce: 0
  });
  const display = useTransform(spring, current => Math.floor(current).toLocaleString('fr-FR'));
  const [displayValue, setDisplayValue] = useState('0');
  useEffect(() => {
    if (inView) {
      spring.set(value);
    }
  }, [inView, spring, value]);
  useEffect(() => {
    const unsubscribe = display.on('change', latest => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [display]);
  return <span>
      {displayValue}{suffix}
    </span>;
};
const StatsSection = () => {
  const {
    t
  } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  const stats = [{
    numericValue: 1000,
    suffix: '+',
    label: t('introduction.participants')
  }, {
    numericValue: 40,
    suffix: '+',
    label: t('introduction.countries')
  }, {
    numericValue: 80000,
    suffix: '€',
    label: t('introduction.prizes')
  }, {
    numericValue: 24,
    suffix: '',
    label: t('introduction.days')
  }, {
    numericValue: 6,
    suffix: '',
    label: t('introduction.competitionDays')
  }];
  return <section className="relative py-12 md:py-28 overflow-hidden bg-cream">
      {/* Decorative diagonal stripes - desktop only */}
      <div className="hidden md:block absolute top-0 left-0 w-1/3 h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[400px] h-[800px] rotate-[25deg] origin-top-left">
          <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-b from-gold/60 via-gold/40 to-gold/20" />
          <div className="absolute top-0 left-20 w-24 h-full bg-gradient-to-b from-rose/50 via-rose/30 to-transparent" />
          <div className="absolute top-0 left-48 w-32 h-full bg-gradient-to-b from-burgundy/40 via-burgundy/20 to-transparent" />
        </div>
      </div>

      {/* Decorative diagonal stripes - desktop only */}
      <div className="hidden md:block absolute top-0 right-0 w-1/3 h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[500px] h-[900px] -rotate-[25deg] origin-top-right">
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-b from-gold/50 via-gold/30 to-gold/10" />
          <div className="absolute top-0 right-24 w-28 h-full bg-gradient-to-b from-rose/40 via-rose/25 to-transparent" />
          <div className="absolute top-0 right-56 w-40 h-full bg-gradient-to-b from-burgundy/35 via-burgundy/15 to-transparent" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div ref={ref} initial={{
        opacity: 0,
        y: 30
      }} animate={inView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        duration: 0.8
      }} className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-16">
            <motion.h2 initial={{
            opacity: 0,
            y: 20
          }} animate={inView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            duration: 0.6,
            delay: 0.1
          }} className="font-display text-2xl md:text-4xl lg:text-5xl text-foreground mb-2 md:mb-4">
              Un concours d'envergure <span className="text-rose-dark">internationale</span>
            </motion.h2>
            <span className="inline-block text-rose-dark font-medium text-sm md:text-base uppercase tracking-widest">
              Les chiffres de l'édition 2024
            </span>
          </div>

          {/* Mobile: Compact list layout */}
          <div className="md:hidden space-y-3">
            {stats.map((stat, index) => <motion.div key={stat.label} initial={{
            opacity: 0,
            x: -20
          }} animate={inView ? {
            opacity: 1,
            x: 0
          } : {}} transition={{
            duration: 0.4,
            delay: 0.2 + index * 0.1
          }} className="flex items-center justify-between bg-white rounded-xl px-5 py-4 shadow-md border border-rose/10">
                <span className="font-display text-3xl font-bold text-rose-dark">
                  <AnimatedCounter value={stat.numericValue} suffix={stat.suffix} inView={inView} />
                </span>
                <span className="text-muted-foreground text-sm font-medium text-right">{stat.label}</span>
              </motion.div>)}
          </div>

          {/* Desktop: Grid with offset cards */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-6 items-end">
            {stats.map((stat, index) => <motion.div key={stat.label} initial={{
            opacity: 0,
            y: 40
          }} animate={inView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            duration: 0.6,
            delay: 0.3 + index * 0.1
          }} className={`group ${index % 2 === 1 ? '-mt-4' : ''}`}>
                <div className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-rose/10 overflow-hidden text-center">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-rose/5 to-transparent rounded-bl-full" />
                  
                  <div className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2 tracking-tight">
                    <AnimatedCounter value={stat.numericValue} suffix={stat.suffix} inView={inView} />
                  </div>
                  
                  <div className="text-rose-dark text-xs font-bold uppercase tracking-wider leading-tight">
                    {stat.label}
                  </div>
                </div>
              </motion.div>)}
          </div>
        </motion.div>
      </div>
    </section>;
};
export default StatsSection;