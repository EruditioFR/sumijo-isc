import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Trophy, User, Award } from 'lucide-react';
import winnerZihaoLi from '@/assets/winner-zihao-li.png';
import winnerGeorgeVirban from '@/assets/winner-george-virban.png';
import winnerKiupLee from '@/assets/winner-kiup-lee.png';
import winnerMarieLombard from '@/assets/winner-marie-lombard.png';
import winnerJulietteTacchino from '@/assets/winner-juliette-tacchino.png';
const WinnersSection = () => {
  const {
    t
  } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05
  });
  const winners = [{
    name: 'Zihao Li',
    category: t('winners.baritone'),
    country: t('winners.china'),
    prize: '1er',
    prizeLabel: t('winners.firstPrize'),
    color: 'gold',
    image: winnerZihaoLi
  }, {
    name: 'George Virban',
    category: t('winners.tenor'),
    country: t('winners.romania'),
    prize: '2ème',
    prizeLabel: t('winners.secondPrize'),
    color: 'silver',
    image: winnerGeorgeVirban
  }, {
    name: 'Kiup Lee',
    category: t('winners.tenor'),
    country: t('winners.southKorea'),
    prize: '3ème',
    prizeLabel: t('winners.thirdPrize'),
    color: 'bronze',
    image: winnerKiupLee
  }];
  const juryPrizes = [{
    name: 'Marie Lombard',
    category: t('winners.soprano'),
    country: t('winners.france'),
    image: winnerMarieLombard
  }, {
    name: 'Juliette Tacchino',
    category: t('winners.soprano'),
    country: t('winners.france'),
    image: winnerJulietteTacchino
  }];
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'gold':
        return {
          bg: 'bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5',
          border: 'border-primary/40',
          text: 'text-primary',
          badge: 'bg-primary text-primary-foreground',
          ring: 'ring-primary/30'
        };
      case 'silver':
        return {
          bg: 'bg-gradient-to-br from-gray-300/20 via-gray-200/10 to-gray-300/5',
          border: 'border-gray-400/40',
          text: 'text-gray-400',
          badge: 'bg-gray-400 text-background',
          ring: 'ring-gray-400/30'
        };
      case 'bronze':
        return {
          bg: 'bg-gradient-to-br from-amber-600/20 via-amber-500/10 to-amber-600/5',
          border: 'border-amber-600/40',
          text: 'text-amber-600',
          badge: 'bg-amber-600 text-background',
          ring: 'ring-amber-600/30'
        };
      default:
        return {
          bg: 'bg-card',
          border: 'border-border',
          text: 'text-foreground',
          badge: 'bg-primary text-primary-foreground',
          ring: 'ring-primary/30'
        };
    }
  };
  return <section id="winners" className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/10 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial={{
        opacity: 0,
        y: 30
      }} animate={inView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        duration: 0.8
      }} className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-sm md:text-base uppercase tracking-[0.3em] text-primary font-medium mb-4">
              {t('winners.subtitle')}
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              {t('winners.title')}
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          </div>

          {/* Main Winners - Podium Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20">
            {/* Second Place */}
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={inView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            duration: 0.8,
            delay: 0.3
          }} className="md:mt-12 order-2 md:order-1">
              <WinnerCard winner={winners[1]} colors={getColorClasses('silver')} />
            </motion.div>

            {/* First Place */}
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={inView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            duration: 0.8,
            delay: 0.2
          }} className="order-1 md:order-2">
              <WinnerCard winner={winners[0]} colors={getColorClasses('gold')} isFirst />
            </motion.div>

            {/* Third Place */}
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={inView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            duration: 0.8,
            delay: 0.4
          }} className="md:mt-12 order-3">
              <WinnerCard winner={winners[2]} colors={getColorClasses('bronze')} />
            </motion.div>
          </div>

          {/* Jury Prize Section */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={inView ? {
          opacity: 1,
          y: 0
        } : {}} transition={{
          duration: 0.8,
          delay: 0.5
        }} className="mb-20">
            
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
              {juryPrizes.map((winner, index) => <motion.div key={winner.name} initial={{
              opacity: 0,
              y: 30
            }} animate={inView ? {
              opacity: 1,
              y: 0
            } : {}} transition={{
              duration: 0.6,
              delay: 0.6 + index * 0.1
            }} className="group">
                  <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/30 rounded-3xl p-6 md:p-8 hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full flex flex-col items-center justify-center">
                    {/* Badge */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-display text-sm shadow-lg whitespace-nowrap">
                      {t('winners.juryPrize')}
                    </div>
                    
                    <div className="pt-4 flex flex-col items-center text-center">
                      {/* Photo */}
                      <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-muted/50 to-muted border-4 border-primary/30 flex items-center justify-center overflow-hidden ring-4 ring-primary/20 ring-offset-2 ring-offset-background transition-all duration-300 group-hover:ring-offset-4 mb-6">
                        {winner.image ? <img src={winner.image} alt={winner.name} className="w-full h-full object-cover" /> : <User className="w-12 h-12 md:w-16 md:h-16 text-primary opacity-40" />}
                      </div>
                      
                      {/* Winner info */}
                      <h4 className="font-display text-xl md:text-2xl text-foreground mb-2">
                        {winner.name}
                      </h4>
                      <p className="text-primary font-medium mb-1">{winner.category}</p>
                      <p className="text-muted-foreground text-sm">{winner.country}</p>
                    </div>
                  </div>
                </motion.div>)}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>;
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
const WinnerCard = ({
  winner,
  colors,
  isFirst
}: WinnerCardProps) => <div className={`relative ${colors.bg} border ${colors.border} rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 group`}>
    {/* Prize badge */}
    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${colors.badge} px-4 py-1.5 rounded-full font-display text-sm shadow-lg`}>
      {winner.prize} Prix
    </div>
    
    <div className="pt-4 text-center">
      {/* Photo placeholder */}
      <div className="relative mx-auto mb-6">
        <div className={`w-28 h-28 md:w-32 md:h-32 ${isFirst ? 'md:w-40 md:h-40' : ''} mx-auto rounded-full bg-gradient-to-br from-muted/50 to-muted border-4 ${colors.border} flex items-center justify-center overflow-hidden ring-4 ${colors.ring} ring-offset-2 ring-offset-background transition-all duration-300 group-hover:ring-offset-4`}>
          {winner.image ? <img src={winner.image} alt={winner.name} className="w-full h-full object-cover" /> : <User className={`w-12 h-12 md:w-16 md:h-16 ${colors.text} opacity-40`} />}
        </div>
        {isFirst && <div className="absolute -top-2 -right-2 md:right-4">
            <Trophy className="w-8 h-8 text-gold drop-shadow-lg" />
          </div>}
      </div>
      
      {/* Winner info */}
      <h3 className={`font-display text-xl md:text-2xl ${isFirst ? 'md:text-3xl' : ''} text-foreground mb-2`}>
        {winner.name}
      </h3>
      <p className={`${colors.text} font-medium mb-1`}>{winner.category}</p>
      <p className="text-muted-foreground text-sm">{winner.country}</p>
    </div>
  </div>;
export default WinnersSection;