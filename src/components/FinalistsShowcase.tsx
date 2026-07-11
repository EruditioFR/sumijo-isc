import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { countryNameToFlagUrl } from "@/lib/countryFlags";
import posterAsset from "@/assets/competition-2026-poster.jpg.asset.json";

interface Finalist {
  id: string;
  nom: string;
  prenom: string;
  pays: string;
  typeVoix: string;
  prix: string;
  photoUrl: string | null;
}

const SLIDE_MS = 3000;

const capitalize = (w: string) =>
  w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w;

const formatFirstName = (s: string) =>
  !s
    ? ""
    : s
        .trim()
        .split(" ")
        .map((part) => part.split("-").map(capitalize).join("-"))
        .join(" ");

// Deterministic pseudo-random sparkles so SSR/CSR match and they don't reshuffle each render.
const SPARKLES = Array.from({ length: 22 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const r1 = seed / 233280;
  const r2 = ((seed * 7) % 233280) / 233280;
  const r3 = ((seed * 13) % 233280) / 233280;
  return {
    top: `${r1 * 100}%`,
    left: `${r2 * 100}%`,
    delay: r3 * 2.4,
    size: 3 + r3 * 4,
    duration: 1.6 + r1 * 1.8,
  };
});

const FinalistsShowcase = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [list, setList] = useState<Finalist[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("list-finalists");
        if (error) throw error;
        if (mounted) setList((data as any)?.finalists ?? []);
      } catch (e) {
        console.error("Failed to load finalists", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (paused || list.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [paused, list.length]);

  const current = list[index];
  const flag = useMemo(
    () => (current ? countryNameToFlagUrl(current.pays) : null),
    [current],
  );

  return (
    <section
      id="finalistes"
      className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[#3a0f1a] via-[#4a1424] to-[#3a0f1a]"
    >
      {/* Ambient gold halos */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[70rem] h-[70rem] rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-rose/20 blur-3xl" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-cream leading-tight">
            {t("finalists.title", "Les 11 finalistes")}{" "}
            <span className="text-gold">2026</span>
          </h2>
          <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mt-6" />
        </motion.div>

        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {loading || !current ? (
            <div className="h-[26rem] md:h-[32rem] rounded-3xl bg-white/5 animate-pulse" />
          ) : (
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative mx-auto w-full max-w-xl"
                >
                  {/* Portrait with sparkling frame */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                    {/* Rotating gold shimmer ring */}
                    <motion.div
                      aria-hidden
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-[2px] rounded-2xl"
                      style={{
                        background:
                          "conic-gradient(from 0deg, transparent 0deg, hsl(var(--gold)) 60deg, transparent 140deg, transparent 220deg, hsl(var(--gold)) 300deg, transparent 360deg)",
                      }}
                    />
                    <div className="absolute inset-[2px] rounded-2xl overflow-hidden bg-gradient-to-br from-rose/20 to-gold/10">
                      {current.photoUrl ? (
                        <img
                          src={current.photoUrl}
                          alt={`${formatFirstName(current.prenom)} ${current.nom}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cream/40">
                          <User className="w-20 h-20" />
                        </div>
                      )}
                      {/* Shimmer sweep */}
                      <motion.div
                        aria-hidden
                        initial={{ x: "-120%" }}
                        animate={{ x: "120%" }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          repeatDelay: 0.6,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]"
                      />

                      {/* Dark gradient overlay for text readability */}
                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none" />

                      {/* Info overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 text-center">
                        {current.typeVoix && (
                          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-[10px] md:text-xs uppercase tracking-[0.25em] mb-3 border border-white/40 backdrop-blur-sm">
                            {current.typeVoix}
                          </span>
                        )}
                        <h3 className="font-display text-cream leading-tight drop-shadow-lg">
                          <span className="block text-2xl md:text-4xl font-light">
                            {formatFirstName(current.prenom)}
                          </span>
                          <span className="block text-3xl md:text-5xl font-semibold tracking-wide text-gold">
                            {current.nom.toUpperCase()}
                          </span>
                        </h3>
                        <div className="mt-3 flex items-center justify-center gap-2 text-cream/95">
                          {flag && (
                            <img
                              src={flag}
                              alt={current.pays}
                              className="h-4 md:h-5 w-auto rounded-[2px] shadow"
                            />
                          )}
                          <span className="text-sm md:text-base tracking-wide">
                            {current.pays}
                          </span>
                        </div>
                        <div className="mt-4 text-cream/60 text-[10px] md:text-xs uppercase tracking-[0.3em]">
                          {String(index + 1).padStart(2, "0")}{" "}
                          <span className="opacity-50">/</span>{" "}
                          {String(list.length).padStart(2, "0")}
                        </div>
                      </div>
                    </div>

                    {/* Logo Sumi Jo */}
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                      className="absolute top-3 left-3 md:top-4 md:left-4 z-10"
                    >
                      <img
                        src={posterAsset.url}
                        alt="Sumi Jo International Singing Competition"
                        className="w-16 md:w-24 h-auto block drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                        loading="lazy"
                        decoding="async"
                      />
                    </motion.div>


                    {/* Sparkles */}
                    <div className="pointer-events-none absolute inset-0">
                      {SPARKLES.map((s, i) => (
                        <motion.span
                          key={i}
                          className="absolute rounded-full bg-gold"
                          style={{
                            top: s.top,
                            left: s.left,
                            width: s.size,
                            height: s.size,
                            boxShadow: "0 0 10px hsl(var(--gold)), 0 0 20px hsl(var(--gold))",
                          }}
                          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
                          transition={{
                            duration: s.duration,
                            repeat: Infinity,
                            delay: s.delay,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dot indicators */}
              <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
                {list.map((f, i) => (
                  <button
                    key={f.id}
                    onClick={() => setIndex(i)}
                    aria-label={`${f.prenom} ${f.nom}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === index
                        ? "w-8 bg-gold"
                        : "w-1.5 bg-cream/25 hover:bg-cream/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinalistsShowcase;
