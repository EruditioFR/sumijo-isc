import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SemiFinalistsSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section id="demi-finalistes" className="relative py-16 md:py-24 bg-gradient-to-b from-cream via-background to-cream overflow-hidden">
      {/* Decorative gold accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose/10 rounded-full blur-3xl pointer-events-none" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-14 max-w-3xl mx-auto"
        >
          <span className="inline-block text-rose-dark font-medium text-sm md:text-base uppercase tracking-[0.3em] mb-3">
            {t("semifinalists.eyebrow", "Annonce officielle")}
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight">
            {t("semifinalists.title", "Les demi-finalistes")}{" "}
            <span className="text-rose-dark">2026</span>
          </h2>
          <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mt-6" />
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t(
              "semifinalists.subtitle",
              "24 artistes retenus parmi 500 candidats du monde entier."
            )}
          </p>
        </motion.div>

        {/* Stats + Video */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* Stats column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 order-3 lg:order-1"
          >
            <div className="bg-white/70 backdrop-blur-sm border border-gold/30 rounded-2xl p-6 md:p-8 shadow-elegant">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-6xl md:text-7xl font-bold text-rose-dark leading-none">
                  24
                </span>
                <span className="text-base md:text-lg text-muted-foreground">
                  {t("semifinalists.stats.selectedLabel", "artistes retenus")}
                </span>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-gold/40 via-gold/10 to-transparent my-5" />
              <div className="flex items-baseline gap-3">
                <span className="font-display text-6xl md:text-7xl font-bold text-gold leading-none">
                  500
                </span>
                <span className="text-base md:text-lg text-muted-foreground">
                  {t("semifinalists.stats.candidatesLabel", "candidats")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Video column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 order-1 lg:order-2"
          >
            <div className="relative mx-auto max-w-[360px] lg:max-w-[420px] aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.35)] ring-2 ring-gold/40">
              <video
                src="/videos/annonce-24-demi-finalistes-2026.mp4"
                poster="/videos/annonce-24-demi-finalistes-2026-poster.jpg"
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover bg-black"
              />
              {/* Decorative gold corner accents */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/60 rounded-tl-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/60 rounded-br-2xl pointer-events-none" />
            </div>
          </motion.div>

          {/* Description paragraph — right under video on mobile, under stats on desktop */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 text-sm md:text-base text-muted-foreground leading-relaxed px-1 order-2 lg:order-3"
          >
            {t(
              "semifinalists.description",
              "Découvrez en vidéo les 24 voix exceptionnelles qui se produiront au Château de La Ferté-Imbault en juillet 2026."
            )}
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default SemiFinalistsSection;
