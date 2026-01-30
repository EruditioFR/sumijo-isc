import { useTranslation } from 'react-i18next';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState, useMemo } from 'react';

// Sparkle component for decorative particles
const Sparkle = ({ delay, index }: { delay: number; index: number }) => {
  const randomX = useMemo(() => Math.random() * 60 - 30, []);
  const randomY = useMemo(() => Math.random() * -40 - 10, []);
  
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 bg-primary rounded-full"
      style={{ 
        left: '50%', 
        top: '50%',
        filter: 'blur(0.5px)'
      }}
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
        x: [0, randomX],
        y: [0, randomY]
      }}
      transition={{ 
        duration: 0.8,
        delay: delay + index * 0.1,
        ease: "easeOut"
      }}
    />
  );
};

// Animated counter component with elastic effect
const AnimatedCounter = ({
  value,
  suffix = '',
  inView,
  onComplete,
  isHighlight = false
}: {
  value: number;
  suffix?: string;
  inView: boolean;
  onComplete?: () => void;
  isHighlight?: boolean;
}) => {
  const spring = useSpring(0, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });
  const display = useTransform(spring, current => Math.floor(current).toLocaleString('fr-FR'));
  const [displayValue, setDisplayValue] = useState('0');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (inView) {
      spring.set(value);
      // Detect when animation is complete
      const timeout = setTimeout(() => {
        setIsComplete(true);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [inView, spring, value, onComplete]);

  useEffect(() => {
    const unsubscribe = display.on('change', latest => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [display]);

  return (
    <motion.span
      className={isHighlight ? 'text-shimmer' : ''}
      animate={isComplete ? {
        scale: [1, 1.05, 1],
      } : {}}
      transition={{ duration: 0.3 }}
    >
      {displayValue}{suffix}
    </motion.span>
  );
};

const StatsSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [showSparkles, setShowSparkles] = useState<Set<number>>(new Set());

  const handleCardComplete = (index: number) => {
    setCompletedCards(prev => new Set([...prev, index]));
    setShowSparkles(prev => new Set([...prev, index]));
    // Remove sparkles after animation
    setTimeout(() => {
      setShowSparkles(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, 1500);
  };

  const stats = [
    {
      numericValue: 1000,
      suffix: '+',
      label: t('introduction.participants')
    },
    {
      numericValue: 40,
      suffix: '+',
      label: t('introduction.countries')
    },
    {
      numericValue: 80000,
      suffix: '€',
      label: t('introduction.prizes'),
      isHighlight: true
    },
    {
      numericValue: 24,
      suffix: '',
      label: t('introduction.days')
    },
    {
      numericValue: 6,
      suffix: '',
      label: t('introduction.competitionDays')
    }
  ];

  return (
    <section className="relative py-12 md:py-28 overflow-hidden bg-cream">
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
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-2xl md:text-4xl lg:text-5xl text-foreground mb-2 md:mb-4"
            >
              Un concours d'envergure <span className="text-rose-dark">internationale</span>
            </motion.h2>
            <span className="inline-block text-rose-dark font-medium text-sm md:text-base uppercase tracking-widest">
              Les chiffres de l'édition 2024
            </span>
          </div>

          {/* Mobile: Compact list layout with slide animations */}
          <div className="md:hidden space-y-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -40, scale: 0.95 }}
                animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: 0.2 + index * 0.1
                }}
                className="relative"
              >
                <motion.div
                  className="flex items-center justify-between bg-white rounded-xl px-5 py-4 shadow-md border border-rose/10 overflow-hidden"
                  animate={completedCards.has(index) ? {
                    boxShadow: [
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      "0 0 30px rgba(205, 124, 139, 0.4)",
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    ]
                  } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <span className={`font-display text-3xl font-bold ${stat.isHighlight ? 'text-shimmer' : 'text-rose-dark'}`}>
                    <AnimatedCounter
                      value={stat.numericValue}
                      suffix={stat.suffix}
                      inView={inView}
                      onComplete={() => handleCardComplete(index)}
                      isHighlight={stat.isHighlight}
                    />
                  </span>
                  <span className="text-muted-foreground text-sm font-medium text-right">{stat.label}</span>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Desktop: Grid with 3D flip animations */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-6 items-end" style={{ perspective: '1000px' }}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  rotateX: -60,
                  scale: 0.8,
                  y: 60
                }}
                animate={inView ? {
                  opacity: 1,
                  rotateX: 0,
                  scale: 1,
                  y: 0
                } : {}}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: 0.2 + index * 0.15
                }}
                className={`group ${index % 2 === 1 ? '-mt-4' : ''}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div
                  className={`relative bg-white rounded-2xl p-6 shadow-xl transition-all duration-500 border overflow-hidden text-center ${
                    stat.isHighlight ? 'border-primary/30' : 'border-rose/10'
                  }`}
                  animate={completedCards.has(index) ? {
                    boxShadow: [
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      "0 0 40px rgba(205, 124, 139, 0.5)",
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                    ]
                  } : {}}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Sparkles */}
                  <AnimatePresence>
                    {showSparkles.has(index) && (
                      <>
                        {[...Array(8)].map((_, i) => (
                          <Sparkle key={i} delay={0} index={i} />
                        ))}
                      </>
                    )}
                  </AnimatePresence>

                  {/* Corner decoration */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-rose/5 to-transparent rounded-bl-full" />
                  
                  {/* Highlight glow for 80000€ */}
                  {stat.isHighlight && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      animate={{
                        boxShadow: [
                          "inset 0 0 20px rgba(205, 124, 139, 0)",
                          "inset 0 0 30px rgba(205, 124, 139, 0.1)",
                          "inset 0 0 20px rgba(205, 124, 139, 0)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}

                  <div className={`font-display font-bold text-foreground mb-2 tracking-tight relative z-10 ${
                    stat.isHighlight ? 'text-4xl lg:text-5xl' : 'text-3xl lg:text-4xl'
                  }`}>
                    <AnimatedCounter
                      value={stat.numericValue}
                      suffix={stat.suffix}
                      inView={inView}
                      onComplete={() => handleCardComplete(index)}
                      isHighlight={stat.isHighlight}
                    />
                  </div>

                  <div className="text-rose-dark text-xs font-bold uppercase tracking-wider leading-tight relative z-10">
                    {stat.label}
                  </div>

                  {/* Floating animation after complete */}
                  {completedCards.has(index) && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2
                      }}
                    />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
