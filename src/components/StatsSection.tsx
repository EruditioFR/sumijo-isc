import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { Trophy, Globe, Star, Award, LucideIcon } from 'lucide-react';

interface CircleStatProps {
  value: number;
  suffix?: string;
  label: string;
  progress: number;
  Icon: LucideIcon;
  index: number;
  inView: boolean;
}

const CircleStat = ({ value, suffix = '', label, progress, Icon, index, inView }: CircleStatProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const motionValue = useMotionValue(0);
  
  // SVG circle calculations - responsive sizes
  const desktopRadius = 108;
  const tabletRadius = 90;
  const mobileRadius = 70;
  
  const desktopStrokeWidth = 12;
  const tabletStrokeWidth = 10;
  const mobileStrokeWidth = 8;
  
  // Use desktop values for calculations (CSS handles responsive)
  const radius = desktopRadius;
  const strokeWidth = desktopStrokeWidth;
  const circumference = 2 * Math.PI * radius;
  
  const progressOffset = useMotionValue(circumference);
  const animatedOffset = useTransform(progressOffset, (v) => v);

  useEffect(() => {
    if (inView) {
      // Animate the counter
      const controls = animate(motionValue, value, {
        duration: 1.8,
        delay: 0.3 + index * 0.15,
        ease: [0.34, 1.56, 0.64, 1],
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        }
      });

      // Animate the progress ring
      const targetOffset = circumference - (progress / 100) * circumference;
      animate(progressOffset, targetOffset, {
        duration: 1.8,
        delay: 0.3 + index * 0.15,
        ease: [0.16, 1, 0.3, 1]
      });

      return () => controls.stop();
    }
  }, [inView, value, progress, circumference, index, motionValue, progressOffset]);

  const gradientId = `progress-gradient-${index}`;

  return (
    <motion.div
      className="circle-stat flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.15 + index * 0.15,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ scale: 1.05 }}
    >
      <div 
        className="relative w-40 h-40 md:w-[200px] md:h-[200px] lg:w-60 lg:h-60"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${value}${suffix}`}
      >
        <svg 
          className="w-full h-full transform -rotate-90"
          viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C85A6B" />
              <stop offset="100%" stopColor="#E89BA6" />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke="hsl(355 25% 90%)"
            strokeWidth={strokeWidth}
            className="md:stroke-[10] lg:stroke-[12]"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: animatedOffset }}
            className="md:stroke-[10] lg:stroke-[12] drop-shadow-lg"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
          <Icon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary mb-1 md:mb-2" />
          <span className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            {displayValue}{suffix}
          </span>
          <span className="text-xs md:text-sm text-muted-foreground font-medium text-center px-2 leading-tight mt-1">
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const StatsSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const stats = [
    {
      value: 150,
      suffix: '+',
      label: t('introduction.participants'),
      progress: 87,
      Icon: Trophy
    },
    {
      value: 25,
      suffix: '',
      label: t('introduction.countries'),
      progress: 65,
      Icon: Globe
    },
    {
      value: 10,
      suffix: '',
      label: t('introduction.competitionDays'),
      progress: 92,
      Icon: Star
    },
    {
      value: 100,
      suffix: 'K€',
      label: t('introduction.prizes'),
      progress: 78,
      Icon: Award
    }
  ];

  return (
    <section className="relative py-16 md:py-24 lg:py-28 overflow-hidden bg-cream">
      {/* Decorative diagonal stripes - desktop only */}
      <div className="hidden lg:block absolute top-0 left-0 w-1/3 h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[400px] h-[800px] rotate-[25deg] origin-top-left">
          <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-b from-primary/40 via-primary/20 to-primary/5" />
          <div className="absolute top-0 left-20 w-24 h-full bg-gradient-to-b from-rose-dark/30 via-rose-dark/15 to-transparent" />
        </div>
      </div>

      <div className="hidden lg:block absolute top-0 right-0 w-1/3 h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[500px] h-[900px] -rotate-[25deg] origin-top-right">
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-b from-primary/30 via-primary/15 to-primary/5" />
          <div className="absolute top-0 right-24 w-28 h-full bg-gradient-to-b from-rose-dark/25 via-rose-dark/10 to-transparent" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-2xl md:text-4xl lg:text-5xl text-foreground mb-2 md:mb-4"
            >
              Un concours d'envergure <span className="text-rose-dark">internationale</span>
            </motion.h2>
            <span className="inline-block text-rose-dark font-medium text-sm md:text-base uppercase tracking-widest">
              Édition 2026
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 justify-items-center">
            {stats.map((stat, index) => (
              <CircleStat
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                progress={stat.progress}
                Icon={stat.Icon}
                index={index}
                inView={inView}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
