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
      gradient: 'from-rose-500 to-rose-600'
    },
    { 
      icon: Globe2, 
      value: '20+', 
      label: t('introduction.countries'),
      gradient: 'from-burgundy to-rose-dark'
    },
    { 
      icon: Trophy, 
      value: '80 000€', 
      label: t('introduction.prizes'),
      gradient: 'from-rose-dark to-burgundy'
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-cream via-white to-cream">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-burgundy/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-light/5 rounded-full blur-3xl" />
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose/20 to-burgundy/20 border border-rose/30 rounded-full px-5 py-2.5 mb-6"
            >
              <Sparkles className="w-4 h-4 text-rose-dark" />
              <span className="text-sm font-semibold text-rose-dark tracking-wide">Édition 2024</span>
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-rose/10 overflow-hidden">
                  {/* Gradient accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stat.gradient}`} />
                  
                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${stat.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Value */}
                  <div className="font-display text-5xl md:text-6xl font-bold text-foreground mb-3 tracking-tight">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-muted-foreground text-base md:text-lg font-medium uppercase tracking-wider">
                    {stat.label}
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
