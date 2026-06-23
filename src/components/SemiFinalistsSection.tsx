import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { supabase } from "@/integrations/supabase/client";
import { countryNameToFlagUrl } from "@/lib/countryFlags";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, User } from "lucide-react";

interface SemiFinalist {
  id: string;
  nom: string;
  prenom: string;
  age: number | null;
  pays: string;
  typeVoix: string;
  photoUrl: string | null;
  bio: string | null;
}

const formatFirstName = (s: string) =>
  s
    ? s
        .trim()
        .split(/[\s-]/)
        .map((p, i, arr) => {
          const sep = i < arr.length - 1 ? (s.includes("-") ? "-" : " ") : "";
          return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() + sep;
        })
        .join("")
    : "";

const SemiFinalistsSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [list, setList] = useState<SemiFinalist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SemiFinalist | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("list-semifinalists");
        if (error) throw error;
        if (mounted) setList((data as any)?.semifinalists ?? []);
      } catch (e) {
        console.error("Failed to load semifinalists", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="demi-finalistes"
      className="relative py-16 md:py-24 bg-gradient-to-b from-cream via-background to-cream overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose/10 rounded-full blur-3xl pointer-events-none" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-block text-rose-dark font-medium text-sm md:text-base uppercase tracking-[0.3em] mb-3">
            {t("semifinalists.eyebrow", "Annonce officielle")}
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight">
            {t("semifinalists.title", "Les demi-finalistes")} <span className="text-rose-dark">2026</span>
          </h2>
          <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mt-6" />
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("semifinalists.subtitle", "24 artistes retenus parmi 500 candidats du monde entier.")}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-muted/40 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {list.map((p, idx) => {
              const flag = countryNameToFlagUrl(p.pays);
              return (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: Math.min(idx * 0.04, 0.6) }}
                  className="group relative bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 ring-1 ring-border hover:ring-gold/50"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-rose/10 to-gold/10">
                    {p.photoUrl ? (
                      <img
                        src={p.photoUrl}
                        alt={`${formatFirstName(p.prenom)} ${p.nom.toUpperCase()}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <User className="w-16 h-16 opacity-40" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {p.typeVoix && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cream/95 text-rose-dark text-[11px] md:text-xs font-medium uppercase tracking-wider shadow-sm">
                        {p.typeVoix}
                      </span>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">
                      <h3 className="font-display text-lg md:text-xl leading-tight">
                        <span className="block font-light opacity-95">
                          {formatFirstName(p.prenom)}
                        </span>
                        <span className="block font-semibold tracking-wide">
                          {p.nom.toUpperCase()}
                        </span>
                      </h3>
                      <div className="mt-2 flex items-center gap-2 text-xs md:text-sm text-white/90">
                        {flag && (
                          <img
                            src={flag}
                            alt={p.pays}
                            className="h-3.5 w-auto rounded-[2px] shadow"
                          />
                        )}
                        <span>{p.pays}</span>
                        {p.age != null && (
                          <>
                            <span className="opacity-50">•</span>
                            <span>{p.age} ans</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {p.bio && (
                    <button
                      onClick={() => setSelected(p)}
                      className="w-full px-4 py-3 text-xs md:text-sm text-rose-dark hover:text-white hover:bg-rose-dark transition-colors duration-300 flex items-center justify-center gap-2 border-t border-border"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {t("semifinalists.readBio", "Lire sa biographie")}
                    </button>
                  )}
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl md:text-3xl">
                  <span className="font-light">{formatFirstName(selected.prenom)}</span>{" "}
                  <span className="font-semibold">{selected.nom.toUpperCase()}</span>
                </DialogTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground pt-1">
                  {selected.typeVoix && (
                    <span className="text-rose-dark font-medium">{selected.typeVoix}</span>
                  )}
                  {selected.pays && (
                    <>
                      <span>•</span>
                      <span>{selected.pays}</span>
                    </>
                  )}
                  {selected.age != null && (
                    <>
                      <span>•</span>
                      <span>{selected.age} ans</span>
                    </>
                  )}
                </div>
              </DialogHeader>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent my-2" />
              <div className="prose prose-sm md:prose-base max-w-none text-foreground whitespace-pre-line leading-relaxed">
                {selected.bio}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SemiFinalistsSection;
