import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Globe, Medal, Music, Star, Mic } from 'lucide-react';
import sumiJoPortrait from '@/assets/sumi-jo-portrait.jpg';

const SumiJoSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const imageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const formationItems = t('sumijo.formation.items', { returnObjects: true }) as string[];
  const venueItems = t('sumijo.repertoire.venues', { returnObjects: true }) as string[];
  const titleItems = t('sumijo.beyond.titles', { returnObjects: true }) as string[];

  return (
    <section id="sumijo" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-16"
        >
          {/* Hero Title */}
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-6xl text-foreground">
              {t('sumijo.title')}
            </h1>
            <p className="font-elegant text-2xl md:text-3xl text-gold">
              {t('sumijo.subtitle')}
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light mx-auto" />
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
              {t('sumijo.intro')}
            </p>
          </div>

          {/* Main Content with Image */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Image */}
            <motion.div
              ref={imageRef}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:sticky lg:top-24"
            >
              <div className="relative overflow-hidden rounded-lg shadow-elegant">
                <motion.img
                  style={{ y }}
                  src={sumiJoPortrait}
                  alt="Sumi Jo - Soprano"
                  className="w-full h-[500px] lg:h-[600px] object-cover scale-110"
                />
                <div className="absolute inset-0 border-4 border-gold/30 rounded-lg" />
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-gold/20">
                  <Music className="w-8 h-8 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-display text-gold">50+</div>
                  <div className="text-xs text-muted-foreground">Albums</div>
                </div>
                <div className="text-center bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-gold/20">
                  <Award className="w-8 h-8 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-display text-gold">Grammy</div>
                  <div className="text-xs text-muted-foreground">Award</div>
                </div>
                <div className="text-center bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-gold/20">
                  <Star className="w-8 h-8 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-display text-gold">40</div>
                  <div className="text-xs text-muted-foreground">Years</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-12"
            >
              {/* 40 Years Career */}
              <div className="space-y-4">
                <h2 className="font-display text-2xl md:text-3xl text-foreground flex items-center gap-3">
                  <Mic className="w-6 h-6 text-gold" />
                  {t('sumijo.career40.title')}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('sumijo.career40.content')}
                </p>
              </div>

              {/* Formation */}
              <div className="space-y-4">
                <h2 className="font-display text-2xl md:text-3xl text-foreground flex items-center gap-3">
                  <Medal className="w-6 h-6 text-gold" />
                  {t('sumijo.formation.title')}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('sumijo.formation.content')}
                </p>
                <ul className="space-y-3 mt-4">
                  {formationItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-gold rounded-full mt-2 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Repertoire */}
              <div className="space-y-4">
                <h2 className="font-display text-2xl md:text-3xl text-foreground flex items-center gap-3">
                  <Globe className="w-6 h-6 text-gold" />
                  {t('sumijo.repertoire.title')}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('sumijo.repertoire.content')}
                </p>
                <ul className="space-y-3 mt-4">
                  {venueItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-gold rounded-full mt-2 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground leading-relaxed italic border-l-4 border-gold/30 pl-4 mt-4">
                  {t('sumijo.repertoire.composers')}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Beyond Opera Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="space-y-4">
              <h2 className="font-display text-2xl md:text-3xl text-foreground text-center">
                {t('sumijo.beyond.title')}
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-gold to-gold-light mx-auto" />
              <p className="text-muted-foreground leading-relaxed text-center">
                {t('sumijo.beyond.content')}
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed text-center">
              {t('sumijo.beyond.honors')}
            </p>

            {/* Honors Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {titleItems.map((title, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-r from-gold/10 to-gold-light/10 border border-gold/20 rounded-lg p-4 flex items-center gap-3"
                >
                  <Award className="w-5 h-5 text-gold shrink-0" />
                  <span className="text-foreground text-sm">{title}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Transmission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-r from-gold/10 to-gold-light/10 border-l-4 border-gold p-8 rounded-lg max-w-4xl mx-auto"
          >
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
              {t('sumijo.transmission.title')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('sumijo.transmission.content')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SumiJoSection;
