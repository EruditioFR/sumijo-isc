import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Globe2, Trophy, Sparkles } from 'lucide-react';

const StatsSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const stats = [
    { 
      icon: Users, 
      value: '500+', 
      label: t('introduction.participants'),
      iconColor: 'text-rose-dark',
      labelColor: 'text-rose-dark'
    },
    { 
      icon: Globe2, 
      value: '20+', 
      label: t('introduction.countries'),
      iconColor: 'text-burgundy',
      labelColor: 'text-burgundy'
    },
    { 
      icon: Trophy, 
      value: '80 000€', 
      label: t('introduction.prizes'),
      iconColor: 'text-gold-dark',
      labelColor: 'text-rose-dark'
    },
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-cream">
      {/* Decorative diagonal stripes - left side */}
      <div className="absolute top-0 left-0 w-1/3 h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[400px] h-[800px] rotate-[25deg] origin-top-left">
          <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-b from-gold/60 via-gold/40 to-gold/20" />
          <div className="absolute top-0 left-20 w-24 h-full bg-gradient-to-b from-rose/50 via-rose/30 to-transparent" />
          <div className="absolute top-0 left-48 w-32 h-full bg-gradient-to-b from-burgundy/40 via-burgundy/20 to-transparent" />
        </div>
      </div>

      {/* Decorative diagonal stripes - right side */}
      <div className="absolute top-0 right-0 w-1/3 h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[500px] h-[900px] -rotate-[25deg] origin-top-right">
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-b from-gold/50 via-gold/30 to-gold/10" />
          <div className="absolute top-0 right-24 w-28 h-full bg-gradient-to-b from-rose/40 via-rose/25 to-transparent" />
          <div className="absolute top-0 right-56 w-40 h-full bg-gradient-to-b from-burgundy/35 via-burgundy/15 to-transparent" />
        </div>
        {/* Abstract leaf/palm pattern */}
        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-tl from-burgundy via-rose to-transparent rotate-45" 
               style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
        </div>
      </div>

      {/* Bottom diagonal accent */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-r from-burgundy/20 via-transparent to-burgundy/20 -skew-y-2" />
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
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-rose text-white rounded-full px-6 py-2.5 mb-8 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold tracking-wide">Édition 2024</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4"
            >
              Un concours d'envergure <span className="text-rose-dark">internationale</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Des talents du monde entier réunis pour célébrer l'excellence vocale
            </motion.p>
          </div>

          {/* Stats Grid with offset cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                className={`group ${index === 1 ? 'md:-mt-4' : ''} ${index === 2 ? 'md:-mt-8' : ''}`}
              >
                {/* Card */}
                <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-rose/10 overflow-hidden">
                  {/* Subtle corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-rose/5 to-transparent rounded-bl-full" />
                  
                  {/* Icon */}
                  <div className="mb-6">
                    <stat.icon className={`w-12 h-12 ${stat.iconColor} stroke-[1.5]`} />
                  </div>
                  
                  {/* Value */}
                  <div className="font-display text-5xl md:text-6xl font-bold text-foreground mb-3 tracking-tight">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className={`${stat.labelColor} text-sm md:text-base font-bold uppercase tracking-wider leading-tight`}>
                    {stat.label.split(' ').map((word, i) => (
                      <span key={i} className="block">{word}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
