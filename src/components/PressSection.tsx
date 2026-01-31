import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Quote, Newspaper } from "lucide-react";

const PressSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const pressItems = [
    {
      quote: "La légendaire Sumi Jo lance un concours international de chant en Sologne",
      source: "France Info",
      year: "2024",
    },
    {
      quote:
        "Nous avons été frappés par l'excellent niveau d'ensemble de cette compétition aux dotations particulièrement généreuse. Parfaitement organisée, la compétition se tiendra tous les deux ans.",
      source: "Opera Magazine, Thierry Guyenne",
      year: "2024",
    },
    {
      quote:
        "Rarement il a été donné de voir et d'entendre un niveau aussi excellent lors d'un concours de chant ainsi qu'autant d'audace dans le choix des airs",
      source: "Opera Online, Elodie Martinez",
      year: "2024",
    },
    {
      quote: "Plein succès pour ce premier concours qui s'est révélé être d'un excellent niveau",
      source: "Première Loge",
      year: "2024",
    },
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-white via-cream/50 to-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose/30 to-transparent" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-burgundy/10 text-burgundy rounded-full px-6 py-2.5 mb-8"
            >
              <Newspaper className="w-4 h-4" />
              <span className="text-sm font-bold tracking-wide">Revue de presse</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4"
            >
              La presse <span className="text-rose-dark">parle de nous</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Les médias saluent l'excellence et le rayonnement international du concours
            </motion.p>
          </div>

          {/* Press Quotes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {pressItems.map((item, index) => (
              <motion.div
                key={item.source}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="group"
              >
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-rose/10 h-full">
                  {/* Quote icon */}
                  <div className="absolute -top-3 left-8">
                    <div className="bg-gradient-to-br from-rose to-burgundy rounded-full p-2.5 shadow-lg">
                      <Quote className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Quote content */}
                  <div className="pt-4">
                    <p className="text-foreground text-lg md:text-xl leading-relaxed italic mb-6">"{item.quote}"</p>

                    {/* Source */}
                    <div className="flex items-center justify-between border-t border-rose/10 pt-4">
                      <span className="font-display text-burgundy font-bold text-lg">{item.source}</span>
                      <span className="text-muted-foreground text-sm">{item.year}</span>
                    </div>
                  </div>

                  {/* Hover accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose via-burgundy to-rose opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PressSection;
