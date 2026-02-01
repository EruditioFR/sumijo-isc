import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import logoCompetition from '@/assets/logo-competition.png';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const createContactSchema = (t: (key: string) => string) => z.object({
  name: z.string().trim().min(2, { message: t('contact.validation.nameMin') }).max(100),
  email: z.string().trim().email({ message: t('contact.validation.emailInvalid') }).max(255),
  subject: z.string().trim().min(3, { message: t('contact.validation.subjectMin') }).max(200),
  message: z.string().trim().min(10, { message: t('contact.validation.messageMin') }).max(1000),
});

type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

const ContactSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const contactSchema = createContactSchema(t);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = (data: ContactFormData) => {
    console.log('Contact form submitted:', data);
    toast.success(t('contact.success'));
    form.reset();
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

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
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
                      <a 
                        href="mailto:contact@aacfi.fr" 
                        className="text-gold hover:text-gold-light transition-colors"
                      >
                        contact@aacfi.fr
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative bg-card border border-gold/20 rounded-lg p-8 shadow-lg overflow-hidden"
            >
              {/* Logo Background */}
              <div 
                className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"
                style={{
                  backgroundImage: `url(${logoCompetition})`,
                  backgroundSize: '60%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              
              <div className="relative z-10">
                <h3 className="font-elegant text-2xl text-gold mb-6">
                  {t('contact.formTitle')}
                </h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">{t('contact.name')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('contact.namePlaceholder')} 
                              {...field} 
                              className="border-gold/30 focus:border-gold bg-background/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">{t('contact.email')}</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder={t('contact.emailPlaceholder')} 
                              {...field} 
                              className="border-gold/30 focus:border-gold bg-background/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">{t('contact.subject')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('contact.subjectPlaceholder')} 
                              {...field} 
                              className="border-gold/30 focus:border-gold bg-background/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">{t('contact.message')}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={t('contact.messagePlaceholder')} 
                              {...field} 
                              className="border-gold/30 focus:border-gold bg-background/50 min-h-[120px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-gold to-gold-light text-white font-semibold hover:shadow-gold transition-all"
                    >
                      <Send className="w-4 h-4 mr-2 text-white" />
                      {t('contact.send')}
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
