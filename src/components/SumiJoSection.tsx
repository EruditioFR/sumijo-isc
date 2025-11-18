import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Music, Trophy } from 'lucide-react';
import singerPerformance from '@/assets/singer-performance.jpg';

const SumiJoSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="sumijo" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          {/* Title */}
          <div className="text-center space-y-4">
            <h2 className="font-display text-4xl md:text-6xl text-foreground">
              {t('sumijo.title')}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light mx-auto" />
            <p className="font-elegant text-xl md:text-2xl text-gold">
              {t('sumijo.subtitle')}
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('sumijo.content1')}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('sumijo.content2')}
              </p>

              {/* Awards Highlight */}
              <div className="grid grid-cols-3 gap-4 py-8">
                <div className="text-center">
                  <Award className="w-12 h-12 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-display text-gold">50+</div>
                  <div className="text-sm text-muted-foreground">Albums</div>
                </div>
                <div className="text-center">
                  <Trophy className="w-12 h-12 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-display text-gold">Grammy</div>
                  <div className="text-sm text-muted-foreground">Award</div>
                </div>
                <div className="text-center">
                  <Music className="w-12 h-12 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-display text-gold">36</div>
                  <div className="text-sm text-muted-foreground">Years</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-lg shadow-elegant">
                <div className="absolute inset-0 bg-gradient-to-t from-gold/60 via-gold/20 to-transparent z-10" />
                <img
                  src={singerPerformance}
                  alt="Sumi Jo performance"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 border-4 border-gold/30 rounded-lg" />
              </div>
            </motion.div>
          </div>

          {/* Additional Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('sumijo.content3')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('sumijo.content4')}
            </p>

            {/* UNESCO Quote */}
            <div className="bg-gradient-to-r from-gold/10 to-gold-light/10 border-l-4 border-gold p-8 rounded-lg mt-8">
              <p className="font-elegant text-2xl text-gold text-center">
                "{t('sumijo.unesco')}"
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SumiJoSection;
