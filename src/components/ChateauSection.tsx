import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Calendar, Castle, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import chateauDroneImage from '@/assets/chateau-drone.jpg';
import { useRef } from 'react';

const ChateauSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const imageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const features = [
    {
      icon: MapPin,
      title: t('chateau.features.location.title'),
      description: t('chateau.features.location.description'),
    },
    {
      icon: Calendar,
      title: t('chateau.features.history.title'),
      description: t('chateau.features.history.description'),
    },
    {
      icon: Castle,
      title: t('chateau.features.capacity.title'),
      description: t('chateau.features.capacity.description'),
    },
    {
      icon: Award,
      title: t('chateau.features.heritage.title'),
      description: t('chateau.features.heritage.description'),
    },
  ];

  return (
    <section id="chateau" className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto space-y-16"
        >
          {/* Header */}
          <div className="text-center space-y-6">
            <h1 className="font-display text-4xl md:text-5xl text-foreground">
              {t('chateau.title')}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light mx-auto" />
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto">
              {t('chateau.subtitle')}
            </p>
          </div>

          {/* Main Image with Parallax */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl shadow-2xl"
          >
            <motion.img
              style={{ y }}
              src={chateauDroneImage}
              alt="Château de la Ferté-Imbault vue aérienne"
              className="w-full h-[400px] md:h-[600px] object-cover scale-110"
            />
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="prose prose-lg max-w-4xl mx-auto"
          >
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
              {t('chateau.introduction')}
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify mt-6">
              {t('chateau.currentChateau')}
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
              >
                <Card className="h-full bg-card border-gold/20 hover:shadow-gold transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]" 
                         style={{ 
                           mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                           WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                           maskComposite: 'exclude',
                           WebkitMaskComposite: 'xor',
                           padding: '2px'
                         }} 
                    />
                  </div>
                  <CardContent className="p-6 text-center space-y-4 relative z-10">
                    <feature.icon className="w-10 h-10 text-gold mx-auto group-hover:scale-110 transition-transform duration-300" />
                    <h4 className="font-display text-lg text-foreground">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-12"
          >
            <div className="text-center">
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                {t('chateau.history.title')}
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-gold to-gold-light mx-auto" />
            </div>

            <div className="prose prose-lg max-w-4xl mx-auto space-y-6">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
                {t('chateau.history.origins')}
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
                {t('chateau.history.medieval')}
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
                {t('chateau.history.hundredYearsWar')}
              </p>
              <p className="text-base md:text-lg text-gold font-semibold text-center italic">
                {t('chateau.history.jeanneDArc')}
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
                {t('chateau.history.renaissance')}
              </p>
            </div>
          </motion.div>

          {/* Maréchal Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                {t('chateau.marechal.title')}
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-gold to-gold-light mx-auto" />
            </div>

            <div className="prose prose-lg max-w-4xl mx-auto space-y-6">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
                {t('chateau.marechal.content')}
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
                {t('chateau.marechal.legacy')}
              </p>
            </div>
          </motion.div>

          {/* Marquise Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                {t('chateau.marquise.title')}
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-gold to-gold-light mx-auto" />
            </div>

            <div className="prose prose-lg max-w-4xl mx-auto space-y-6">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
                {t('chateau.marquise.content')}
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
                {t('chateau.marquise.culture')}
              </p>
            </div>
          </motion.div>

          {/* Modern History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                {t('chateau.modernHistory.title')}
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-gold to-gold-light mx-auto" />
            </div>

            <div className="prose prose-lg max-w-4xl mx-auto space-y-6">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
                {t('chateau.modernHistory.revolution')}
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
                {t('chateau.modernHistory.english')}
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
                {t('chateau.modernHistory.recent')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChateauSection;
