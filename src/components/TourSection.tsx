import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Globe } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import magicTourImage from '@/assets/magic-sumi-jo-winners.jpg';

const TourSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/10 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-gradient-to-br from-gold/5 via-background to-gold/5 border border-gold/20 rounded-3xl p-8 md:p-12 overflow-hidden relative">
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
                  <h4 className="font-display text-lg text-gold mb-4">{t('winners.tour.datesTitle')}</h4>
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
                      <span className="text-white text-sm font-medium">{t('winners.tour.clickToEnlarge')}</span>
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
      </div>
    </section>
  );
};

export default TourSection;
