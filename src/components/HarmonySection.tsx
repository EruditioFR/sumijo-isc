import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import chateauGardens from '@/assets/chateau-drone.jpg';

const HarmonySection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background avec image discrète */}
      <div className="absolute inset-0">
        <img
          src={chateauGardens}
          alt=""
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-secondary/70" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="font-display text-4xl md:text-5xl text-white">
              {t('harmony.title')}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light" />
            <p className="font-elegant text-xl text-gold">
              {t('harmony.subtitle')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('harmony.content1')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('harmony.content2')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-lg shadow-elegant">
              <img
                src={chateauGardens}
                alt="Château gardens"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 border-4 border-gold/30 rounded-lg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HarmonySection;
