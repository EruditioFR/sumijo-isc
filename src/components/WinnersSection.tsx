import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Trophy, Music, Globe, User, Award } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import magicTourImage from '@/assets/magic-sumi-jo-winners.jpg';
import winnerZihaoLi from '@/assets/winner-zihao-li.png';
import winnerGeorgeVirban from '@/assets/winner-george-virban.png';
import winnerKiupLee from '@/assets/winner-kiup-lee.png';
import winnerMarieLombard from '@/assets/winner-marie-lombard.png';
import winnerJulietteTacchino from '@/assets/winner-juliette-tacchino.png';

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
      prizeLabel: t('winners.firstPrize'),
      color: 'gold',
      image: winnerZihaoLi,
    },
    {
      name: 'George Virban',
      category: t('winners.tenor'),
      country: t('winners.romania'),
      prize: '2ème',
      prizeLabel: t('winners.secondPrize'),
      color: 'silver',
      image: winnerGeorgeVirban,
    },
    {
      name: 'Kiup Lee',
      category: t('winners.tenor'),
      country: t('winners.southKorea'),
      prize: '3ème',
      prizeLabel: t('winners.thirdPrize'),
      color: 'bronze',
      image: winnerKiupLee,
    },
  ];

  const juryPrizes = [
    {
      name: 'Marie Lombard',
      category: t('winners.soprano'),
      country: t('winners.france'),
      image: winnerMarieLombard,
    },
    {
      name: 'Juliette Tacchino',
      category: t('winners.soprano'),
      country: t('winners.france'),
      image: winnerJulietteTacchino,
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'gold':
        return {
          bg: 'bg-gradient-to-br from-gold/20 via-gold-light/10 to-gold/5',
          border: 'border-gold/40',
          text: 'text-gold',
          badge: 'bg-gold text-background',
          ring: 'ring-gold/30',
        };
      case 'silver':
        return {
          bg: 'bg-gradient-to-br from-gray-300/20 via-gray-200/10 to-gray-300/5',
          border: 'border-gray-400/40',
          text: 'text-gray-400',
          badge: 'bg-gray-400 text-background',
          ring: 'ring-gray-400/30',
        };
      case 'bronze':
        return {
          bg: 'bg-gradient-to-br from-amber-600/20 via-amber-500/10 to-amber-600/5',
          border: 'border-amber-600/40',
          text: 'text-amber-600',
          badge: 'bg-amber-600 text-background',
          ring: 'ring-amber-600/30',
        };
      default:
        return {
          bg: 'bg-card',
          border: 'border-border',
          text: 'text-foreground',
          badge: 'bg-primary text-primary-foreground',
          ring: 'ring-primary/30',
        };
    }
  };

  return (
    <section id="winners" className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/10 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
              {t('winners.title')}
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('winners.subtitle')}
            </p>
          </div>

          {/* Main Winners - Podium Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20">
            {/* Second Place */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:mt-12 order-2 md:order-1"
            >
              <WinnerCard winner={winners[1]} colors={getColorClasses('silver')} />
            </motion.div>

            {/* First Place */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 md:order-2"
            >
              <WinnerCard winner={winners[0]} colors={getColorClasses('gold')} isFirst />
            </motion.div>

            {/* Third Place */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="md:mt-12 order-3"
            >
              <WinnerCard winner={winners[2]} colors={getColorClasses('bronze')} />
            </motion.div>
          </div>

          {/* Jury Prize Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-20"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-gold" />
                <h3 className="font-display text-2xl md:text-3xl text-foreground">
                  {t('winners.juryPrize')}
                </h3>
                <Award className="w-5 h-5 text-gold" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {juryPrizes.map((winner, index) => (
                <motion.div
                  key={winner.name}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="group"
                >
                  <div className="bg-card border border-gold/20 rounded-2xl p-8 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300">
                    <div className="flex items-center gap-6">
                      {/* Photo placeholder */}
                      <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gold/20 to-gold-light/10 border-2 border-gold/30 flex items-center justify-center overflow-hidden">
                          {winner.image ? (
                            <img src={winner.image} alt={winner.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-10 h-10 text-gold/50" />
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gold rounded-full flex items-center justify-center">
                          <Music className="w-4 h-4 text-background" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-display text-xl text-foreground mb-1">{winner.name}</h4>
                        <p className="text-gold text-base font-medium mb-0.5">{winner.category}</p>
                        <p className="text-muted-foreground text-sm">{winner.country}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tour Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gold/5 via-background to-gold/5 border border-gold/20 rounded-3xl p-8 md:p-12 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-light/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Globe className="w-8 h-8 text-gold" />
                  <h3 className="font-display text-2xl md:text-3xl text-foreground">
                    {t('winners.tour.title')}
                  </h3>
                </div>
                
                <p className="text-muted-foreground max-w-2xl mx-auto text-center mb-8">
                  {t('winners.tour.description')}
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Tour dates */}
                  <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-gold/10">
                    <h4 className="font-display text-lg text-gold mb-4">Dates et lieux des concerts</h4>
                    <div className="space-y-3 text-sm">
                      {[
                        { date: '10 juin 2025', location: 'Shijiazhuang, China' },
                        { date: '12 juin 2025', location: 'Shenzhen, China' },
                        { date: '19 juin 2025', location: 'Jeonju, South Korea' },
                        { date: '21 juin 2025', location: 'Seongnam, South Korea' },
                        { date: '22 juin 2025', location: 'Seoul, South Korea' },
                        { date: '24 juin 2025', location: 'Chuncheon, South Korea' },
                      ].map((concert, index) => (
                        <div key={index} className="flex items-center gap-3 text-muted-foreground">
                          <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                          <span className="font-medium text-foreground">{concert.date}</span>
                          <span className="text-gold">—</span>
                          <span>{concert.location}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tour image */}
                  <div className="flex justify-center">
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => setIsImageOpen(true)}
                    >
                      <img 
                        src={magicTourImage} 
                        alt="The Magic 2025 - Sumi Jo & Winners Tour" 
                        className="max-w-xs w-full rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:shadow-gold/20 transition-all duration-300 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <span className="text-white text-sm font-medium">Cliquez pour agrandir</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
              <DialogContent className="max-w-[90vw] max-h-[90vh] p-2 bg-background border-gold/20 overflow-auto">
                <img 
                  src={magicTourImage} 
                  alt="The Magic 2025 - Sumi Jo & Winners Tour" 
                  className="w-auto h-auto max-h-[85vh] mx-auto rounded-lg"
                />
              </DialogContent>
            </Dialog>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Winner Card Component
interface WinnerCardProps {
  winner: {
    name: string;
    category: string;
    country: string;
    prize: string;
    prizeLabel?: string;
    image: string | null;
  };
  colors: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    ring: string;
  };
  isFirst?: boolean;
}

const WinnerCard = ({ winner, colors, isFirst }: WinnerCardProps) => (
  <div className={`relative ${colors.bg} border ${colors.border} rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 group`}>
    {/* Prize badge */}
    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${colors.badge} px-4 py-1.5 rounded-full font-display text-sm shadow-lg`}>
      {winner.prize} Prix
    </div>
    
    <div className="pt-4 text-center">
      {/* Photo placeholder */}
      <div className="relative mx-auto mb-6">
        <div className={`w-28 h-28 md:w-32 md:h-32 ${isFirst ? 'md:w-40 md:h-40' : ''} mx-auto rounded-full bg-gradient-to-br from-muted/50 to-muted border-4 ${colors.border} flex items-center justify-center overflow-hidden ring-4 ${colors.ring} ring-offset-2 ring-offset-background transition-all duration-300 group-hover:ring-offset-4`}>
          {winner.image ? (
            <img src={winner.image} alt={winner.name} className="w-full h-full object-cover" />
          ) : (
            <User className={`w-12 h-12 md:w-16 md:h-16 ${colors.text} opacity-40`} />
          )}
        </div>
        {isFirst && (
          <div className="absolute -top-2 -right-2 md:right-4">
            <Trophy className="w-8 h-8 text-gold drop-shadow-lg" />
          </div>
        )}
      </div>
      
      {/* Winner info */}
      <h3 className={`font-display text-xl md:text-2xl ${isFirst ? 'md:text-3xl' : ''} text-foreground mb-2`}>
        {winner.name}
      </h3>
      <p className={`${colors.text} font-medium mb-1`}>{winner.category}</p>
      <p className="text-muted-foreground text-sm">{winner.country}</p>
    </div>
  </div>
);

export default WinnersSection;
