import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Globe2, Users, Award, TrendingUp, Heart, Briefcase, Wrench, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SponsorshipSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const benefits = [
    {
      icon: Globe2,
      title: t('sponsorship.benefits.visibility.title'),
      description: t('sponsorship.benefits.visibility.description'),
    },
    {
      icon: Users,
      title: t('sponsorship.benefits.engagement.title'),
      description: t('sponsorship.benefits.engagement.description'),
    },
    {
      icon: Award,
      title: t('sponsorship.benefits.vip.title'),
      description: t('sponsorship.benefits.vip.description'),
    },
    {
      icon: TrendingUp,
      title: t('sponsorship.benefits.networking.title'),
      description: t('sponsorship.benefits.networking.description'),
    },
  ];

  const partners2024 = {
    main: [
      { name: 'Hyundai Motor Group', category: 'main' },
      { name: 'Medinger', category: 'main' },
    ],
    institutional: [
      'Communauté de Communes Sologne 2 Rivières',
      'Loir-et-Cher',
      'Vinci Cultura',
      'Government de Pingshan',
      'Théâtre de Pingshan',
    ],
    private: [
      'SMI Entertainment Inc.',
      'Fonds de dotation Canopée Maya',
      'I&S',
    ],
  };

  return (
    <section id="sponsorship" className="py-20 md:py-32 bg-gradient-to-b from-muted/20 to-background">
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
              {t('sponsorship.title')}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light mx-auto" />
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto">
              {t('sponsorship.intro')}
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full bg-card border-gold/20 hover:shadow-gold transition-all duration-300 group">
                  <CardHeader>
                    <benefit.icon className="w-12 h-12 text-gold mb-4 group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Support Modalities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                {t('sponsorship.support.title')}
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                {t('sponsorship.support.subtitle')}
              </p>
            </div>

            <Tabs defaultValue="financial" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
                <TabsTrigger value="financial">
                  <Heart className="w-4 h-4 mr-2" />
                  {t('sponsorship.support.financial.tab')}
                </TabsTrigger>
                <TabsTrigger value="inKind">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {t('sponsorship.support.inKind.tab')}
                </TabsTrigger>
                <TabsTrigger value="skills">
                  <Wrench className="w-4 h-4 mr-2" />
                  {t('sponsorship.support.skills.tab')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="financial" className="mt-8">
                <Card className="bg-card border-gold/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">{t('sponsorship.support.financial.title')}</CardTitle>
                    <CardDescription>{t('sponsorship.support.financial.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-muted-foreground">
                      {(t('sponsorship.support.financial.items', { returnObjects: true }) as string[]).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-gold mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inKind" className="mt-8">
                <Card className="bg-card border-gold/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">{t('sponsorship.support.inKind.title')}</CardTitle>
                    <CardDescription>{t('sponsorship.support.inKind.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-muted-foreground">
                      {(t('sponsorship.support.inKind.items', { returnObjects: true }) as string[]).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-gold mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="mt-8">
                <Card className="bg-card border-gold/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">{t('sponsorship.support.skills.title')}</CardTitle>
                    <CardDescription>{t('sponsorship.support.skills.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-muted-foreground">
                      {(t('sponsorship.support.skills.items', { returnObjects: true }) as string[]).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-gold mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* 2024 Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="font-display text-3xl md:text-4xl text-foreground mb-8">
                {t('sponsorship.partners.title')}
              </h3>
            </div>

            <div className="space-y-8">
              {/* Main Partners */}
              <div>
                <h4 className="font-display text-xl text-gold mb-4 text-center">
                  {t('sponsorship.partners.main')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {partners2024.main.map((partner) => (
                    <Card key={partner.name} className="bg-gradient-to-br from-gold/5 to-gold-light/5 border-gold/30">
                      <CardContent className="p-6 text-center">
                        <p className="font-display text-xl text-foreground">{partner.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Institutional Partners */}
              <div>
                <h4 className="font-display text-xl text-foreground/80 mb-4 text-center">
                  {t('sponsorship.partners.institutional')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {partners2024.institutional.map((partner) => (
                    <Card key={partner} className="bg-card border-gold/20">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">{partner}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Private Partners */}
              <div>
                <h4 className="font-display text-xl text-foreground/80 mb-4 text-center">
                  {t('sponsorship.partners.private')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {partners2024.private.map((partner) => (
                    <Card key={partner} className="bg-card border-gold/20">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">{partner}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center space-y-6 bg-gradient-to-r from-gold/10 via-gold-light/10 to-gold/10 border border-gold/20 rounded-lg p-12"
          >
            <h3 className="font-display text-2xl md:text-3xl text-foreground">
              {t('sponsorship.cta.title')}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('sponsorship.cta.description')}
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-white shadow-lg hover:shadow-gold transition-all"
              onClick={() => window.location.href = 'mailto:contact@sumijo-isc.com'}
            >
              <Mail className="w-5 h-5 mr-2" />
              {t('sponsorship.cta.button')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorshipSection;
