import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import posterImage from '@/assets/competition-2026-poster.jpg';

const emailSchema = z.string().trim().email().max(255);

const TicketingAnnouncement = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(t('ticketing.error'));
      return;
    }

    setIsLoading(true);
    
    try {
      const { error: dbError } = await supabase
        .from('ticketing_notifications')
        .insert({ email: result.data });

      if (dbError) {
        // Handle duplicate email
        if (dbError.code === '23505') {
          setError(t('ticketing.alreadyRegistered'));
          setIsLoading(false);
          return;
        }
        throw dbError;
      }

      setIsSuccess(true);
      toast({
        title: t('ticketing.success'),
        duration: 5000,
      });
    } catch (err) {
      console.error('Error subscribing:', err);
      setError(t('ticketing.errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 pt-32">
      <motion.div
        className="text-center max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Poster */}
        <motion.div variants={itemVariants} className="mb-12 max-w-sm mx-auto">
          <AspectRatio ratio={3/4} className="overflow-hidden rounded-lg shadow-elegant">
            <img 
              src={posterImage} 
              alt="Sumi Jo International Singing Competition 2026" 
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </motion.div>
        {/* Label with decorative line */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-rose" />
            <span 
              className="text-base md:text-lg tracking-[0.3em] text-[#3A3A3A] font-medium"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('ticketing.label')}
            </span>
            <div className="h-px w-12 bg-rose" />
          </div>
          <div className="mt-3 mx-auto w-16 h-0.5 bg-rose" />
        </motion.div>

        {/* Date */}
        <motion.h1 
          variants={itemVariants}
          className="text-[56px] sm:text-[64px] md:text-[96px] font-elegant text-[#3A3A3A] leading-none tracking-tight"
        >
          {t('ticketing.date')}
        </motion.h1>

        {/* Year */}
        <motion.p 
          variants={itemVariants}
          className="text-[24px] md:text-[36px] text-[#3A3A3A] mt-2 font-light tracking-wide"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {t('ticketing.year')}
        </motion.p>

        {/* Description */}
        <motion.p 
          variants={itemVariants}
          className="text-[15px] md:text-[18px] text-[#3A3A3A] mt-8 mb-10"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {t('ticketing.description')}
        </motion.p>

        {/* Form */}
        <motion.form 
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto"
        >
          {!isSuccess ? (
            <>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder={t('ticketing.emailPlaceholder')}
                aria-label={t('ticketing.emailPlaceholder')}
                className="h-12 px-4 bg-white border-[#E0E0E0] focus:border-rose focus:ring-rose/20 text-[#3A3A3A] placeholder:text-[#9E9E9E] rounded-md w-full sm:w-64"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 px-6 bg-rose hover:bg-[#B04A5B] text-white font-medium rounded-md transition-all hover:shadow-lg w-full sm:w-auto"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"
                    />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t('ticketing.notify')}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-rose"
            >
              <CheckCircle className="w-5 h-5" />
              <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('ticketing.success')}
              </span>
            </motion.div>
          )}
        </motion.form>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-3"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {error}
          </motion.p>
        )}

        {/* Small print */}
        <motion.p 
          variants={itemVariants}
          className="text-[13px] text-[#9E9E9E] mt-8"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {t('ticketing.smallPrint')}
        </motion.p>
      </motion.div>
    </section>
  );
};

export default TicketingAnnouncement;
