import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Check, X, BookOpen, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import posterImage from '@/assets/competition-2026-poster.jpg';

const TOKEN_KEY = 'sumijo_vote_token';
const VOTE_KEY = 'sumijo_vote_candidate';
const ROUND_KEY = 'sumijo_vote_round';

interface Candidate {
  id: string;
  nom: string;
  prenom: string;
  pays: string;
  typeVoix: string;
  photoUrl: string | null;
  bio: string | null;
}

const syncVoteRound = (serverRound: number | null) => {
  if (serverRound == null) return;
  const stored = localStorage.getItem(ROUND_KEY);
  const storedRound = stored ? parseInt(stored, 10) : null;
  if (storedRound !== serverRound) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(VOTE_KEY);
    localStorage.setItem(ROUND_KEY, String(serverRound));
  }
};

const getVoterToken = (): string => {
  let t = localStorage.getItem(TOKEN_KEY);
  if (!t) {
    t = crypto.randomUUID();
    localStorage.setItem(TOKEN_KEY, t);
  }
  return t;
};

const VotePage = () => {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVote, setCurrentVote] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bioCandidate, setBioCandidate] = useState<Candidate | null>(null);

  const [token, setToken] = useState<string>('');

  const loadData = async () => {
    try {
      const [{ data: settings }, candidatesRes] = await Promise.all([
        supabase
          .from('vote_settings')
          .select('is_open, vote_round')
          .limit(1)
          .maybeSingle(),
        supabase.functions.invoke('list-vote-candidates'),
      ]);

      syncVoteRound((settings as any)?.vote_round ?? null);
      setToken(getVoterToken());

      setIsOpen(settings?.is_open ?? false);
      if (candidatesRes.error) throw candidatesRes.error;
      setCandidates(candidatesRes.data?.candidates ?? []);
      setCurrentVote(localStorage.getItem(VOTE_KEY));
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const channel = supabase
      .channel('vote_settings_public')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vote_settings' },
        (payload) => {
          const next = (payload.new as any)?.is_open;
          if (typeof next === 'boolean') {
            setIsOpen((prev) => {
              if (prev === false && next === true) {
                toast.success('Les votes sont maintenant ouverts !');
              } else if (prev === true && next === false) {
                toast.info('Les votes sont clôturés.');
              }
              return next;
            });
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitVote = async () => {
    if (!pendingId || !isOpen || !token) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('cast-vote', {
        body: { voter_token: token, candidate_id: pendingId },
      });

      if (error) throw error;

      localStorage.setItem(VOTE_KEY, pendingId);
      setCurrentVote(pendingId);
      setPendingId(null);
      toast.success('Votre vote a été enregistré');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      const msg = err?.context?.status === 409 || /already/i.test(err?.message ?? '')
        ? 'Vous avez déjà voté.'
        : err?.message ?? "Impossible d'enregistrer le vote";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCandidate = pendingId ? candidates.find((c) => c.id === pendingId) : null;
  const showBar = isOpen && pendingId && pendingId !== currentVote;
  const showGrid = !isOpen || !currentVote;

  if (loading || isOpen === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Helmet>
        <title>Prix du public — Concours Sumi Jo</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div
        className="max-w-6xl mx-auto px-4 pt-6 pb-8 md:pt-10 md:pb-10"
        style={{ paddingBottom: showBar ? 'calc(env(safe-area-inset-bottom) + 6.5rem)' : undefined }}
      >
        <header className="text-center mb-6 md:mb-10">
          <img
            src={posterImage}
            alt="Affiche Concours International de Chant Sumi Jo 2026"
            className="mx-auto mb-5 md:mb-8 w-40 sm:w-48 md:w-64 h-auto rounded-lg shadow-lg"
          />
          <h1 className="font-display text-2xl md:text-5xl text-foreground mb-2 md:mb-3 leading-tight">
            {isOpen ? 'Votez pour votre candidat favori' : 'Découvrez les candidats'}
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Concours International de Chant Sumi Jo — Édition 2026
          </p>
        </header>

        {!isOpen && (
          <Card className="max-w-2xl mx-auto p-5 md:p-6 mb-6 md:mb-8 bg-muted/40 border-primary/20">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-lg md:text-2xl text-foreground mb-1">
                  Les votes ne sont pas encore ouverts
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Découvrez ci-dessous les candidats. Le vote sera activé prochainement — cette page se mettra à jour automatiquement.
                </p>
              </div>
            </div>
          </Card>
        )}

        {isOpen && currentVote && (
          <Card className="max-w-2xl mx-auto p-4 md:p-6 mb-6 md:mb-8 bg-primary/5 border-primary/30">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base md:text-lg text-foreground mb-1">
                  Merci, votre vote a été enregistré
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Vous avez voté pour{' '}
                  <strong className="text-foreground">
                    {(() => {
                      const c = candidates.find((c) => c.id === currentVote);
                      return c ? `${c.prenom} ${c.nom}` : '—';
                    })()}
                  </strong>
                  . Votre vote est définitif.
                </p>
              </div>
            </div>
          </Card>
        )}

        {showGrid && (
          <>
            {isOpen && (
              <p className="text-center text-lg md:text-2xl text-foreground font-medium mb-4 md:mb-6">
                Touchez une photo pour sélectionner votre candidat.
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {candidates.map((c) => {
                const isPending = pendingId === c.id;
                const isCurrent = currentVote === c.id;
                const clickable = isOpen;
                return (
                  <div
                    key={c.id}
                    className={`rounded-lg overflow-hidden bg-card border transition-all ${
                      isPending
                        ? 'ring-2 ring-primary border-primary shadow-lg'
                        : isCurrent
                        ? 'border-primary/40'
                        : 'border-border'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => clickable && setPendingId(c.id)}
                      disabled={!clickable}
                      className={`w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        clickable ? 'active:scale-[0.98] hover:shadow-md cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <div className="aspect-[3/4] bg-muted overflow-hidden relative">
                        {c.photoUrl ? (
                          <img
                            src={c.photoUrl}
                            alt={`${c.prenom} ${c.nom}`}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            Photo
                          </div>
                        )}
                        {isPending && (
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                        {isCurrent && !isPending && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-medium">
                            Choix actuel
                          </div>
                        )}
                      </div>
                      <div className="p-2.5 md:p-3">
                        <h3 className="font-display text-sm md:text-base text-foreground leading-tight line-clamp-2">
                          {c.prenom} {c.nom}
                        </h3>
                        <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5 truncate">
                          {c.pays}
                          {c.typeVoix ? ` — ${c.typeVoix}` : ''}
                        </p>
                      </div>
                    </button>
                    {c.bio && (
                      <button
                        type="button"
                        onClick={() => setBioCandidate(c)}
                        className="w-full px-3 py-2 text-xs md:text-sm text-primary hover:bg-primary hover:text-primary-foreground transition-colors border-t border-border flex items-center justify-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Lire la biographie
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Bio modal */}
      <Dialog open={!!bioCandidate} onOpenChange={(o) => !o && setBioCandidate(null)}>
        <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] max-h-[85vh] p-0 gap-0 flex flex-col overflow-hidden [&>button.absolute]:hidden">
          {bioCandidate && (
            <>
              <DialogHeader className="sticky top-0 z-10 bg-background border-b px-5 md:px-6 py-4 pr-14">
                <DialogTitle className="font-display text-xl md:text-2xl">
                  {bioCandidate.prenom} {bioCandidate.nom}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground pt-1">
                  {bioCandidate.typeVoix && (
                    <span className="text-primary font-medium">{bioCandidate.typeVoix}</span>
                  )}
                  {bioCandidate.pays && (
                    <>
                      <span>•</span>
                      <span>{bioCandidate.pays}</span>
                    </>
                  )}
                </div>
              </DialogHeader>
              <div className="overflow-y-auto px-5 md:px-6 py-4 md:py-5 prose prose-sm md:prose-base max-w-none text-foreground whitespace-pre-line leading-relaxed">
                {bioCandidate.bio}
              </div>
              <div className="sticky bottom-0 z-10 bg-background border-t px-5 md:px-6 py-3 flex justify-end" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}>
                <Button variant="outline" onClick={() => setBioCandidate(null)}>
                  Fermer
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setBioCandidate(null)}
                aria-label="Fermer"
                className="absolute right-3 top-3 z-20 w-10 h-10 rounded-full bg-background border border-border shadow-sm flex items-center justify-center text-foreground hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Sticky confirm bar */}
      {showBar && pendingCandidate && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur border-t shadow-lg"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <div className="w-11 h-11 rounded-md bg-muted overflow-hidden flex-shrink-0">
              {pendingCandidate.photoUrl && (
                <img
                  src={pendingCandidate.photoUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-muted-foreground leading-tight">Votre choix</p>
              <p className="text-sm font-medium text-foreground truncate leading-tight">
                {pendingCandidate.prenom} {pendingCandidate.nom}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setPendingId(currentVote)}
              disabled={submitting}
              aria-label="Annuler"
              className="flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              onClick={submitVote}
              disabled={submitting}
              className="flex-shrink-0"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Confirmer'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotePage;
