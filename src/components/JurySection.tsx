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

interface JuryMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const JurySection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [selectedMember, setSelectedMember] = useState<JuryMember | null>(null);

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
  ];

  return (
    <>
      <section id="jury" className="py-20 bg-muted">
        <div className="container mx-auto px-4" ref={ref}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-display text-center mb-16 text-foreground"
          >
            {t('jury.title')}
          </motion.h2>

          {/* Jury Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {juryMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card 
                  className="overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:shadow-gold/10 border-gold/20 h-full relative group"
                  onClick={() => setSelectedMember(member)}
                >
                  {/* Animated Border Gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold bg-[length:200%_100%] animate-gradient" 
                         style={{ 
                           mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                           WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                           maskComposite: 'exclude',
                           WebkitMaskComposite: 'xor',
                           padding: '2px'
                         }} 
                    />
                  </div>
                  <CardContent className="p-0 relative">
                    <div className="relative group overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-72 object-cover object-top transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-display text-foreground mb-2 line-clamp-1">
                        {member.name}
                      </h4>
                      <p className="text-xs text-muted-foreground font-sans mb-4 line-clamp-2 min-h-[2.5rem]">
                        {member.role}
                      </p>
                      <Button variant="ghost" size="sm" className="text-gold hover:text-gold hover:bg-gold/10 w-full">
                        {t('jury.viewDetails')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-6 mb-4">
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="w-24 h-24 object-cover rounded-lg border-2 border-gold shadow-md"
                  />
                  <div>
                    <DialogTitle className="text-2xl font-display mb-1">
                      {selectedMember.name}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground font-sans">
                      {selectedMember.role}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              <DialogDescription className="text-foreground font-sans leading-relaxed text-base">
                {selectedMember.bio}
              </DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JurySection;
