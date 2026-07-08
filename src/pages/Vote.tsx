import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import posterImage from '@/assets/competition-2026-poster.jpg';

const TOKEN_KEY = 'sumijo_vote_token';

interface Candidate {
  id: string;
  nom: string;
  prenom: string;
  pays: string;
  typeVoix: string;
  photoUrl: string | null;
}

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
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const token = useMemo(() => getVoterToken(), []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: settings }, candidatesRes, { data: myVote }] = await Promise.all([
        supabase.from('vote_settings').select('is_open').limit(1).maybeSingle(),
        supabase.functions.invoke('list-vote-candidates'),
        supabase.from('public_votes').select('candidate_id').eq('voter_token', token).maybeSingle(),
      ]);

      setIsOpen(settings?.is_open ?? false);
      if (candidatesRes.error) throw candidatesRes.error;
      setCandidates(candidatesRes.data?.candidates ?? []);
      setCurrentVote(myVote?.candidate_id ?? null);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitVote = async () => {
    if (!pendingId) return;
    setSubmitting(true);
    try {
      if (currentVote) {
        const { error } = await supabase
          .from('public_votes')
          .update({ candidate_id: pendingId })
          .eq('voter_token', token);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('public_votes')
          .insert({ voter_token: token, candidate_id: pendingId });
        if (error) throw error;
      }
      setCurrentVote(pendingId);
      setPendingId(null);
      setEditing(false);
      toast.success('Votre vote a été enregistré');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Impossible d'enregistrer le vote");
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCandidate = pendingId ? candidates.find((c) => c.id === pendingId) : null;
  const showBar = pendingId && pendingId !== currentVote;
  const showGrid = !currentVote || editing;

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
            Votez pour votre candidat favori
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Concours International de Chant Sumi Jo — Édition 2026
          </p>
        </header>


        {!isOpen ? (
          <Card className="max-w-xl mx-auto p-6 md:p-10 text-center">
            <h2 className="font-display text-xl md:text-2xl text-foreground mb-2 md:mb-3">
              Les votes sont actuellement fermés
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Revenez pendant la période d'ouverture pour voter pour votre candidat favori.
            </p>
          </Card>
        ) : (
          <>
            {currentVote && !editing && (
              <Card className="max-w-2xl mx-auto p-4 md:p-6 mb-6 md:mb-8 bg-primary/5 border-primary/30">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base md:text-lg text-foreground mb-1">
                      Merci, votre vote a été enregistré
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                      Vous avez voté pour{' '}
                      <strong className="text-foreground">
                        {(() => {
                          const c = candidates.find((c) => c.id === currentVote);
                          return c ? `${c.prenom} ${c.nom}` : '—';
                        })()}
                      </strong>
                      . Vous pouvez modifier votre choix jusqu'à la clôture des votes.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        setEditing(true);
                        setPendingId(currentVote);
                      }}
                    >
                      Modifier mon vote
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {showGrid && (
              <>
                <p className="text-center text-lg md:text-2xl text-foreground font-medium mb-4 md:mb-6">
                  Touchez une photo pour sélectionner votre candidat.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {candidates.map((c) => {
                    const isPending = pendingId === c.id;
                    const isCurrent = currentVote === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setPendingId(c.id)}
                        className={`text-left rounded-lg overflow-hidden bg-card border transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          isPending
                            ? 'ring-2 ring-primary border-primary shadow-lg'
                            : isCurrent
                            ? 'border-primary/40'
                            : 'border-border hover:shadow-md'
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
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>

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
              ) : currentVote ? (
                'Modifier'
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
