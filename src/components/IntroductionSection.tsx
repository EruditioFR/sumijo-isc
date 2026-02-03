import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import anniversaryImage from '@/assets/edition-2026-anniversary.png';
import franceKoreaLogo from '@/assets/140-france-korea-logo.png';

const IntroductionSection = () => {
  const {
    t
  } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  return <section id="competition" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial={{
        opacity: 0,
        y: 30
      }} animate={inView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        duration: 0.8
      }} className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            <span className="text-rose-dark">2026 : </span>{t('introduction.title')}
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light mx-auto" />
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t('introduction.content1')}
          </p>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t('introduction.content2')}
          </p>

          {/* Logo 140 ans France-Corée */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="py-4"
          >
            <img 
              src={franceKoreaLogo} 
              alt="140 ans d'amitié France-Corée 1886-2026" 
              className="mx-auto max-w-xs md:max-w-md w-full" 
            />
          </motion.div>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t('introduction.content3')}
          </p>

          {/* Competition Poster */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={inView ? {
          opacity: 1,
          y: 0
        } : {}} transition={{
          duration: 0.8,
          delay: 0.5
        }} className="pt-4">
            <img src={anniversaryImage} alt="Sumi Jo International Singing Competition 2026 - 40 ans de carrière, 140 ans d'amitié franco-coréenne" className="mx-auto max-w-2xl md:max-w-4xl rounded-lg shadow-lg w-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>;
};
export default IntroductionSection;