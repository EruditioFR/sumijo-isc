import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Trophy, Music, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import magicTourImage from '@/assets/magic-sumi-jo-winners.jpg';

const WinnersSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [isImageOpen, setIsImageOpen] = useState(false);

  const winners = [
    {
      name: 'Zihao Li',
      category: t('winners.baritone'),
      country: t('winners.china'),
      prize: '1er',
      color: 'from-gold via-gold-light to-gold',
    },
    {
      name: 'George Virban',
      category: t('winners.tenor'),
      country: t('winners.romania'),
      prize: '2ème',
      color: 'from-gray-400 via-gray-300 to-gray-400',
    },
    {
      name: 'Kiup Lee',
      category: t('winners.tenor'),
      country: t('winners.southKorea'),
      prize: '3ème',
      color: 'from-amber-600 via-amber-500 to-amber-600',
    },
  ];

  const juryPrizes = [
    {
      name: 'Marie Lombard',
      category: t('winners.soprano'),
      country: t('winners.france'),
    },
    {
      name: 'Juliette Tacchino',
      category: t('winners.soprano'),
      country: t('winners.france'),
    },
  ];

  return (
    <section id="winners" className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center space-y-12"
        >
          <div>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              {t('winners.title')}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light mx-auto mb-6" />
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('winners.subtitle')}
            </p>
          </div>

          {/* Main Winners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {winners.map((winner, index) => (
              <motion.div
                key={winner.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              >
                <Card className="relative overflow-hidden bg-card border-gold/20 hover:shadow-gold transition-all duration-300 group">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${winner.color}`} />
                  <CardContent className="p-8 text-center">
                    <div className="mb-4">
                      <Trophy className={`w-16 h-16 mx-auto ${index === 0 ? 'text-gold' : index === 1 ? 'text-gray-400' : 'text-amber-600'}`} />
                    </div>
                    <div className={`font-display text-6xl mb-4 bg-gradient-to-r ${winner.color} bg-clip-text text-transparent`}>
                      {winner.prize}
                    </div>
                    <h3 className="font-display text-2xl text-foreground mb-2">{winner.name}</h3>
                    <p className="text-muted-foreground mb-1">{winner.category}</p>
                    <p className="text-sm text-muted-foreground">{winner.country}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Special Jury Prizes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16"
          >
            <h3 className="font-display text-2xl md:text-3xl text-foreground mb-8">
              {t('winners.juryPrize')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {juryPrizes.map((winner, index) => (
                <Card
                  key={winner.name}
                  className="bg-card border-gold/20 hover:shadow-gold transition-all duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <Music className="w-10 h-10 text-gold mx-auto mb-3" />
                    <h4 className="font-display text-xl text-foreground mb-1">{winner.name}</h4>
                    <p className="text-muted-foreground text-sm mb-1">{winner.category}</p>
                    <p className="text-xs text-muted-foreground">{winner.country}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Tour Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 bg-gradient-to-r from-gold/10 via-gold-light/10 to-gold/10 border border-gold/20 rounded-lg p-8"
          >
          <Music className="w-12 h-12 text-gold mx-auto mb-4" />
            <h3 className="font-display text-2xl md:text-3xl text-foreground mb-6">
              {t('winners.tour.title')}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              {t('winners.tour.description')}
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto whitespace-pre-line text-sm">
              {t('winners.tour.dates')}
            </p>
            <div className="mt-8">
              <img 
                src={magicTourImage} 
                alt="The Magic 2025 - Sumi Jo & Winners Tour" 
                className="max-w-xs w-full mx-auto rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsImageOpen(true)}
              />
              <p className="text-xs text-muted-foreground mt-2">Cliquez pour agrandir</p>
            </div>

            <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
              <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
                <img 
                  src={magicTourImage} 
                  alt="The Magic 2025 - Sumi Jo & Winners Tour" 
                  className="w-full rounded-lg"
                />
              </DialogContent>
            </Dialog>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WinnersSection;
