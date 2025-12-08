import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import chateauGardens from '@/assets/chateau-drone.jpg';
import { useRef } from 'react';
import { Sparkles } from 'lucide-react';

const HarmonySection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const imageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.05, 1.1]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-accent via-accent/95 to-accent">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      
      {/* Floating decorative shapes */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-32 -right-32 w-64 h-64 border border-gold/10 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-48 -left-48 w-96 h-96 border border-gold/10 rounded-full"
      />

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Image column - takes 7 cols on large screens */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-7 relative order-2 lg:order-1"
          >
            {/* Main image container with luxury frame */}
            <div className="relative">
              {/* Golden corner accents */}
              <div className="absolute -top-4 -left-4 w-20 h-20 border-l-2 border-t-2 border-gold/60 z-20" />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 border-r-2 border-b-2 border-gold/60 z-20" />
              
              {/* Image with parallax */}
              <div className="relative overflow-hidden rounded-sm shadow-2xl">
                <motion.img
                  style={{ y, scale }}
                  src={chateauGardens}
                  alt="Château gardens"
                  className="w-full h-[400px] md:h-[550px] object-cover"
                />
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10" />
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -bottom-6 left-8 md:left-12 bg-gold px-6 py-3 shadow-xl"
              >
                <p className="text-accent font-display text-sm md:text-base tracking-widest uppercase">
                  Château de la Ferté-Imbault
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content column - takes 5 cols */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 space-y-8 order-1 lg:order-2"
          >
            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5 text-gold" />
              <span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">
                {t('harmony.label')}
              </span>
            </motion.div>

            {/* Title with elegant styling */}
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-white leading-tight">
              {t('harmony.title')}
            </h2>

            {/* Decorative divider */}
            <div className="flex items-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-gold to-transparent" />
              <div className="w-2 h-2 rotate-45 border border-gold" />
              <div className="h-px w-16 bg-gradient-to-l from-gold to-transparent" />
            </div>
            {/* Content paragraph */}
            <p className="text-base md:text-lg text-white/80 leading-relaxed">
              {t('harmony.content1')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HarmonySection;
