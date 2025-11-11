import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
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
  image: string;
}

const JurySection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const juryMembers: JuryMember[] = [
    {
      id: 'operowicz',
      name: t('jury.members.operowicz.name'),
      role: t('jury.members.operowicz.role'),
      image: olivierOperowiczImage,
    },
    {
      id: 'friend',
      name: t('jury.members.friend.name'),
      role: t('jury.members.friend.role'),
      image: jonathanFriendImage,
    },
    {
      id: 'galoppini',
      name: t('jury.members.galoppini.name'),
      role: t('jury.members.galoppini.role'),
      image: alessandroGaloppiniImage,
    },
    {
      id: 'lanceron',
      name: t('jury.members.lanceron.name'),
      role: t('jury.members.lanceron.role'),
      image: alainLanceronImage,
    },
    {
      id: 'rhorer',
      name: t('jury.members.rhorer.name'),
      role: t('jury.members.rhorer.role'),
      image: jeremieRhorerImage,
    },
    {
      id: 'vargas',
      name: t('jury.members.vargas.name'),
      role: t('jury.members.vargas.role'),
      image: ramonVargasImage,
    },
  ];

  return (
    <section id="jury" className="py-20 bg-beige">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display text-center mb-16 text-foreground"
        >
          {t('jury.title')}
        </motion.h2>

        {/* President - Sumi Jo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center mb-16"
        >
          <div className="relative mb-4 group">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-burgundy/20 rounded-lg transform transition-transform group-hover:scale-105" />
            <img
              src={sumiJoImage}
              alt={t('jury.president.name')}
              className="relative w-48 h-48 object-cover rounded-lg border-4 border-gold shadow-lg"
            />
          </div>
          <h3 className="text-2xl font-display text-foreground mb-1">
            {t('jury.president.name')}
          </h3>
          <p className="text-sm text-muted-foreground font-sans">
            {t('jury.president.role')}
          </p>
        </motion.div>

        {/* Jury Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {juryMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4 group">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-burgundy/10 rounded-lg transform transition-transform group-hover:scale-105" />
                <img
                  src={member.image}
                  alt={member.name}
                  className="relative w-40 h-40 object-cover rounded-lg border-2 border-gold-light shadow-md"
                />
              </div>
              <h4 className="text-lg font-display text-foreground text-center mb-1">
                {member.name}
              </h4>
              <p className="text-xs text-muted-foreground text-center font-sans max-w-xs">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JurySection;
