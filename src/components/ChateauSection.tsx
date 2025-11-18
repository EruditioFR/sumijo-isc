import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Calendar, Users, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import chateauDroneImage from '@/assets/chateau-drone.jpg';

const ChateauSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
      icon: Users,
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
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              {t('chateau.title')}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light mx-auto" />
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto">
              {t('chateau.subtitle')}
            </p>
          </div>

          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gold/60 via-gold/20 to-transparent z-10" />
            <img
              src={chateauDroneImage}
              alt="Château de la Ferté-Imbault vue aérienne"
              className="w-full h-[400px] md:h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6 text-center max-w-4xl mx-auto"
          >
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {t('chateau.description.paragraph1')}
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {t('chateau.description.paragraph2')}
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
                <Card className="h-full bg-card border-gold/20 hover:shadow-gold transition-all duration-300 group">
                  <CardContent className="p-6 text-center space-y-4">
                    <feature.icon className="w-10 h-10 text-gold mx-auto group-hover:scale-110 transition-transform" />
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
        </motion.div>
      </div>
    </section>
  );
};

export default ChateauSection;
