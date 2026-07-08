import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Check, Vote } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

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
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState<string | null>(null);

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
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitVote = async (candidateId: string) => {
    setSubmitting(candidateId);
    try {
      if (currentVote) {
        const { error } = await supabase
          .from('public_votes')
          .update({ candidate_id: candidateId })
          .eq('voter_token', token);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('public_votes')
          .insert({ voter_token: token, candidate_id: candidateId });
        if (error) throw error;
      }
      setCurrentVote(candidateId);
      setEditing(false);
      toast.success('Votre vote a été enregistré');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Impossible d'enregistrer le vote");
    } finally {
      setSubmitting(null);
    }
  };

  if (loading || isOpen === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-10 px-4">
      <Helmet>
        <title>Prix du public — Concours Sumi Jo</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Vote className="w-4 h-4" />
            Prix du public
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3">
            Votez pour votre candidat préféré
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Concours International de Chant Sumi Jo — Édition 2026
          </p>
        </header>

        {!isOpen ? (
          <Card className="max-w-xl mx-auto p-10 text-center">
            <h2 className="font-display text-2xl text-foreground mb-3">
              Les votes sont actuellement fermés
            </h2>
            <p className="text-muted-foreground">
              Revenez pendant la période d'ouverture pour voter pour votre candidat préféré.
            </p>
          </Card>
        ) : (
          <>
            {currentVote && !editing && (
              <Card className="max-w-2xl mx-auto p-6 mb-8 bg-primary/5 border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg text-foreground mb-1">
                      Merci, votre vote a été enregistré
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Vous avez voté pour{' '}
                      <strong className="text-foreground">
                        {(() => {
                          const c = candidates.find((c) => c.id === currentVote);
                          return c ? `${c.prenom} ${c.nom}` : '—';
                        })()}
                      </strong>
                      . Vous pouvez modifier votre choix jusqu'à la clôture des votes.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      Modifier mon vote
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {(!currentVote || editing) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {candidates.map((c) => {
                  const isSelected = currentVote === c.id;
                  return (
                    <Card
                      key={c.id}
                      className={`overflow-hidden transition-all hover:shadow-lg group ${
                        isSelected ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <div className="aspect-[3/4] bg-muted overflow-hidden">
                        {c.photoUrl ? (
                          <img
                            src={c.photoUrl}
                            alt={`${c.prenom} ${c.nom}`}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            Photo
                          </div>
                        )}
                      </div>
                      <div className="p-3 md:p-4">
                        <h3 className="font-display text-sm md:text-base text-foreground leading-tight">
                          {c.prenom} {c.nom}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {c.pays}
                          {c.typeVoix ? ` — ${c.typeVoix}` : ''}
                        </p>
                        <Button
                          size="sm"
                          className="w-full mt-3"
                          onClick={() => submitVote(c.id)}
                          disabled={submitting !== null}
                          variant={isSelected ? 'secondary' : 'default'}
                        >
                          {submitting === c.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isSelected ? (
                            <>
                              <Check className="w-4 h-4 mr-1" /> Choix actuel
                            </>
                          ) : (
                            'Voter'
                          )}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VotePage;
