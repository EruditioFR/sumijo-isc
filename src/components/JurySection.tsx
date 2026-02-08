import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import sumiJoImage from '@/assets/jury-sumi-jo.png';
import ramonVargasImage from '@/assets/jury-ramon-vargas.png';
import jeremieRhorerImage from '@/assets/jury-jeremie-rhorer.png';
import alainLanceronImage from '@/assets/jury-alain-lanceron.png';
import alessandroGaloppiniImage from '@/assets/jury-alessandro-galoppini.png';
import jonathanFriendImage from '@/assets/jury-jonathan-friend.png';
import olivierOperowiczImage from '@/assets/jury-olivier-operowicz.png';
import melanieAllemendinger from '@/assets/jury-melanie-allemendinger.jpg';

// Placeholder for jury members without photos yet
const placeholderImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face&auto=format&q=80';

interface JuryMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string | null;
}

const JurySection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [selectedMember, setSelectedMember] = useState<JuryMember | null>(null);

  // All jury members (used for 2024)
  const juryMembers: JuryMember[] = [
    {
      id: 'operowicz',
      name: t('jury.members.operowicz.name'),
      role: t('jury.members.operowicz.role'),
      bio: t('jury.members.operowicz.bio'),
      image: olivierOperowiczImage,
    },
    {
      id: 'jo',
      name: t('jury.president.name'),
      role: t('jury.president.role'),
      bio: t('jury.president.bio'),
      image: sumiJoImage,
    },
    {
      id: 'friend',
      name: t('jury.members.friend.name'),
      role: t('jury.members.friend.role'),
      bio: t('jury.members.friend.bio'),
      image: jonathanFriendImage,
    },
    {
      id: 'galoppini',
      name: t('jury.members.galoppini.name'),
      role: t('jury.members.galoppini.role'),
      bio: t('jury.members.galoppini.bio'),
      image: alessandroGaloppiniImage,
    },
    {
      id: 'lanceron',
      name: t('jury.members.lanceron.name'),
      role: t('jury.members.lanceron.role'),
      bio: t('jury.members.lanceron.bio'),
      image: alainLanceronImage,
    },
    {
      id: 'rhorer',
      name: t('jury.members.rhorer.name'),
      role: t('jury.members.rhorer.role'),
      bio: t('jury.members.rhorer.bio'),
      image: jeremieRhorerImage,
    },
    {
      id: 'vargas',
      name: t('jury.members.vargas.name'),
      role: t('jury.members.vargas.role'),
      bio: t('jury.members.vargas.bio'),
      image: ramonVargasImage,
    },
    {
      id: 'allemendinger',
      name: t('jury.members.allemendinger.name'),
      role: t('jury.members.allemendinger.role'),
      bio: t('jury.members.allemendinger.bio'),
      image: melanieAllemendinger,
    },
    {
      id: 'gavazzeni',
      name: t('jury.members.gavazzeni.name'),
      role: t('jury.members.gavazzeni.role'),
      bio: t('jury.members.gavazzeni.bio'),
      image: null,
    },
  ];

  // Jury 2026 - excludes Galoppini, Rhorer, and Vargas
  const jury2026Members = juryMembers.filter(
    member => !['galoppini', 'rhorer', 'vargas'].includes(member.id)
  );

  return (
    <>
      {/* Jury 2026 Section */}
      <section id="jury-2026" className="py-20 bg-gradient-to-b from-muted via-muted to-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-rose/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold text-sm font-medium tracking-[0.3em] uppercase mb-4 block">
              Édition 2026
            </span>
            <h2 className="text-4xl md:text-5xl font-display text-foreground">
              {t('jury.title2026')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
          </motion.div>

          {/* Jury 2026 Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {jury2026Members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="group"
              >
                <div 
                  className="relative cursor-pointer h-full"
                  onClick={() => setSelectedMember(member)}
                >
                  {/* Card with luxury styling */}
                  <div className="relative bg-card rounded-xl overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-gold/20 border border-gold/10 group-hover:border-gold/30 h-full">
                    {/* Image container with overlay */}
                    <div className="relative overflow-hidden">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          loading="lazy"
                          decoding="async"
                          width="400"
                          height="320"
                          className={`w-full h-80 object-cover transition-all duration-700 group-hover:scale-110 ${
                            member.id === 'allemendinger' ? 'object-[center_35%]' : 'object-[center_20%]'
                          }`}
                        />
                      ) : (
                        <div className="w-full h-80 bg-gradient-to-b from-muted to-muted/80 flex items-center justify-center transition-all duration-700 group-hover:scale-110">
                          <svg className="w-24 h-24 text-gold/30" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                      )}
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      
                      {/* Gold accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 relative">
                      {/* Decorative corner accent */}
                      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-bl from-gold/20 to-transparent rotate-45 transform origin-bottom-left" />
                      </div>
                      
                      <h4 className="text-lg font-display text-foreground mb-2 line-clamp-1 group-hover:text-gold transition-colors duration-300">
                        {member.name}
                      </h4>
                      <p className="text-xs text-muted-foreground font-sans mb-4 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                        {member.role}
                      </p>
                      
                      {/* Elegant CTA */}
                      <div className="flex items-center gap-2 text-gold/70 group-hover:text-gold transition-colors duration-300">
                        <span className="text-xs font-medium tracking-wide uppercase">
                          {t('jury.viewDetails')}
                        </span>
                        <svg 
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Jury 2024 Section - Compact Grid */}
      <section id="jury-2024" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-display text-center mb-12 text-foreground"
          >
            {t('jury.title')}
          </motion.h2>

          {/* Jury 2024 Compact Grid - 3 columns x 2 rows */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {juryMembers.map((member, index) => (
              <motion.div
                key={`2024-${member.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.05 }}
              >
                <Card 
                  className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:shadow-gold/10 border-gold/20 h-full relative group"
                  onClick={() => setSelectedMember(member)}
                >
                  <CardContent className="p-0 relative">
                    <div className="relative group overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        decoding="async"
                        width="200"
                        height="160"
                        className="w-full h-40 object-cover object-top transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-display text-foreground mb-1 line-clamp-1">
                        {member.name}
                      </h4>
                      <p className="text-xs text-muted-foreground font-sans line-clamp-1">
                        {member.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Dialog - Luxury Design */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-gradient-to-b from-card via-card to-muted/50 border-gold/20">
          {selectedMember && (
            <div className="relative">
              {/* Decorative header background */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-gold/10 via-rose/5 to-transparent" />
              <div className="absolute top-4 right-4 w-24 h-24 bg-gold/5 rounded-full blur-2xl" />
              <div className="absolute top-8 left-8 w-16 h-16 bg-rose/5 rounded-full blur-xl" />
              
              {/* Content */}
              <div className="relative z-10 p-8">
                <DialogHeader className="mb-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Profile image with decorative ring */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute -inset-1 bg-gradient-to-br from-gold via-gold/50 to-rose/30 rounded-xl blur-sm opacity-60" />
                      <img
                        src={selectedMember.image}
                        alt={selectedMember.name}
                        loading="lazy"
                        decoding="async"
                        width="128"
                        height="128"
                        className="relative w-28 h-28 sm:w-32 sm:h-32 object-cover object-top rounded-xl border-2 border-gold/40 shadow-xl"
                      />
                      {/* Corner accent */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gold rounded-full border-2 border-card flex items-center justify-center">
                        <svg className="w-3 h-3 text-background" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Name and role */}
                    <div className="text-center sm:text-left flex-1">
                      <DialogTitle className="text-2xl sm:text-3xl font-display text-foreground mb-3 leading-tight">
                        {selectedMember.name}
                      </DialogTitle>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full border border-gold/20">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                        <p className="text-sm text-gold font-medium">
                          {selectedMember.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
                
                {/* Decorative separator */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <div className="w-2 h-2 bg-gold/40 rotate-45" />
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                </div>
                
                {/* Biography */}
                <DialogDescription className="text-foreground/90 font-sans leading-relaxed text-base sm:text-lg whitespace-pre-line">
                  {selectedMember.bio}
                </DialogDescription>
                
                {/* Bottom decorative element */}
                <div className="mt-8 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent rounded-full" />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JurySection;
