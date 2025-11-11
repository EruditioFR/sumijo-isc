import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

const ContactSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              {t('practical.title')}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-light mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-card border border-gold/20 rounded-lg p-8 shadow-lg">
                <h3 className="font-elegant text-2xl text-gold mb-6">
                  {t('practical.contact.title')}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-gold flex-shrink-0" />
                    <a
                      href="mailto:contact@sumijo-isc.com"
                      className="text-muted-foreground hover:text-gold transition-colors"
                    >
                      {t('practical.contact.email')}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-gold/20 rounded-lg p-8 shadow-lg">
                <h3 className="font-elegant text-2xl text-gold mb-6">
                  {t('practical.venue.title')}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-muted-foreground font-semibold">
                        {t('practical.venue.name')}
                      </p>
                      <p className="text-muted-foreground">
                        {t('practical.venue.address')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-card border border-gold/20 rounded-lg p-8 shadow-lg h-fit"
            >
              <h3 className="font-elegant text-2xl text-gold mb-4">
                {t('practical.newsletter.title')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('practical.newsletter.description')}
              </p>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <Input
                  type="email"
                  placeholder={t('practical.newsletter.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gold/30 focus:border-gold"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gold to-gold-light text-foreground font-semibold hover:shadow-gold transition-all"
                >
                  {t('practical.newsletter.subscribe')}
                </Button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
