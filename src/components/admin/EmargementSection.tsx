import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Clock, CheckCircle2, RotateCcw, Hourglass, Loader2, Users, UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EmargementCandidate {
  id: string;
  nom: string;
  prenom: string;
  heureArrivee: string | null;
  arrive?: boolean;
}

const parseArrival = (
  raw: string | null,
): { date: Date | null; display: string } => {
  if (!raw) return { date: null, display: '—' };
  const s = String(raw).trim();
  if (!s) return { date: null, display: '—' };

  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      const display = d.toLocaleTimeString('fr-FR', {
        timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit',
      });
      return { date: d, display };
    }
  }

  const m = s.match(/(\d{1,2})[:hH](\d{2})/);
  if (m) {
    const h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, min, 0);
    const display = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    return { date: d, display };
  }

  return { date: null, display: s };
};

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

type Tab = 'upcoming' | 'present';

const EmargementSection = ({ candidates }: { candidates: EmargementCandidate[] }) => {
  const [now, setNow] = useState(new Date());
  const [present, setPresent] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('upcoming');
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current && candidates.length === 0) return;
    const initial = new Set<string>();
    for (const c of candidates) if (c.arrive) initial.add(c.id);
    setPresent(initial);
    if (candidates.length > 0) initialized.current = true;
  }, [candidates]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const toggle = async (id: string) => {
    const wasPresent = present.has(id);
    const nextValue = !wasPresent;

    setPresent((prev) => {
      const next = new Set(prev);
      nextValue ? next.add(id) : next.delete(id);
      return next;
    });
    setPending((prev) => new Set(prev).add(id));

    try {
      const { error } = await supabase.functions.invoke('update-candidate-arrival', {
        body: { recordId: id, arrived: nextValue },
      });
      if (error) throw error;
    } catch (e) {
      setPresent((prev) => {
        const next = new Set(prev);
        wasPresent ? next.add(id) : next.delete(id);
        return next;
      });
      toast.error('Impossible de mettre à jour Airtable');
      console.error('update-candidate-arrival error', e);
    } finally {
      setPending((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const enriched = useMemo(
    () => candidates.map((c) => ({ ...c, parsed: parseArrival(c.heureArrivee) })),
    [candidates],
  );

  const filterFn = (c: (typeof enriched)[number]) => {
    if (!query.trim()) return true;
    const q = normalize(query);
    return (
      normalize(c.nom).includes(q) ||
      normalize(c.prenom).includes(q) ||
      normalize(`${c.prenom} ${c.nom}`).includes(q)
    );
  };

  const upcoming = useMemo(
    () =>
      enriched
        .filter((c) => !present.has(c.id) && c.parsed.date)
        .filter(filterFn)
        .sort((a, b) => a.parsed.date!.getTime() - b.parsed.date!.getTime()),
    [enriched, present, query],
  );

  const unscheduled = useMemo(
    () => enriched.filter((c) => !present.has(c.id) && !c.parsed.date).filter(filterFn),
    [enriched, present, query],
  );

  const presentList = useMemo(
    () =>
      enriched
        .filter((c) => present.has(c.id))
        .filter(filterFn)
        .sort((a, b) => {
          const ta = a.parsed.date?.getTime() ?? 0;
          const tb = b.parsed.date?.getTime() ?? 0;
          return ta - tb;
        }),
    [enriched, present, query],
  );

  const totalCount = candidates.length;
  const presentCount = present.size;
  const remainingCount = totalCount - presentCount;
  const progress = totalCount === 0 ? 0 : Math.round((presentCount / totalCount) * 100);

  const parisTime = now.toLocaleTimeString('fr-FR', {
    timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parisDate = now.toLocaleDateString('fr-FR', {
    timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric', month: 'long',
  });

  const resetAll = async () => {
    const ids = Array.from(present);
    if (ids.length === 0) return;
    if (!confirm(`Réinitialiser ${ids.length} émargement(s) ?`)) return;
    setPending((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
    setPresent(new Set());
    await Promise.all(
      ids.map((id) =>
        supabase.functions.invoke('update-candidate-arrival', {
          body: { recordId: id, arrived: false },
        }),
      ),
    );
    setPending(new Set());
  };

  const CandidateRow = ({
    c, checked, passed,
  }: {
    c: (typeof enriched)[number]; checked: boolean; passed?: boolean;
  }) => {
    const isPending = pending.has(c.id);
    return (
      <button
        type="button"
        onClick={() => !isPending && toggle(c.id)}
        disabled={isPending}
        className={cn(
          'w-full text-left flex items-center gap-3 px-3 sm:px-4 py-3 border-b last:border-b-0 transition-colors',
          'hover:bg-muted/50 active:bg-muted focus-visible:outline-none focus-visible:bg-muted',
          checked && 'bg-emerald-50/60 hover:bg-emerald-50',
          isPending && 'opacity-60 cursor-wait',
        )}
      >
        <div
          className={cn(
            'flex-shrink-0 w-14 sm:w-16 text-center rounded-md py-1.5 px-1 text-xs sm:text-sm font-mono tabular-nums font-semibold',
            checked
              ? 'bg-emerald-100 text-emerald-800'
              : passed
                ? 'bg-destructive/10 text-destructive'
                : c.parsed.date
                  ? 'bg-muted text-foreground'
                  : 'bg-muted/50 text-muted-foreground italic',
          )}
        >
          {c.parsed.display}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm sm:text-base text-foreground truncate">
            <span className="uppercase">{c.nom}</span>{' '}
            <span className="font-normal">{c.prenom}</span>
          </div>
          {passed && !checked && (
            <div className="text-xs text-destructive mt-0.5">En retard</div>
          )}
        </div>
        <div className="flex-shrink-0">
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : checked ? (
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary" />
          )}
        </div>
      </button>
    );
  };

  const EmptyList = ({ label }: { label: string }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">{label}</div>
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Sticky header */}
      <div className="flex-shrink-0 border-b bg-background">
        <div className="px-4 sm:px-6 pt-5 pb-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-display text-foreground flex items-center gap-2">
                <Hourglass className="w-5 h-5" />
                Émargement
              </h3>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">{parisDate}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xl sm:text-2xl font-mono tabular-nums text-foreground">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              {parisTime}
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>
                <span className="font-semibold text-foreground">{presentCount}</span> / {totalCount} présents
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un candidat…"
              className="pl-9 pr-9 h-10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
                aria-label="Effacer la recherche"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-6 flex gap-1 border-b -mb-px">
          <button
            type="button"
            onClick={() => setTab('upcoming')}
            className={cn(
              'flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
              tab === 'upcoming'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <Users className="w-4 h-4" />
            À venir
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded-full',
                tab === 'upcoming' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
              )}
            >
              {remainingCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab('present')}
            className={cn(
              'flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
              tab === 'present'
                ? 'border-emerald-600 text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <UserCheck className="w-4 h-4" />
            Présents
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded-full',
                tab === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground',
              )}
            >
              {presentCount}
            </span>
          </button>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        {tab === 'upcoming' ? (
          upcoming.length === 0 && unscheduled.length === 0 ? (
            <EmptyList label={query ? 'Aucun résultat.' : 'Aucune arrivée à venir.'} />
          ) : (
            <>
              {upcoming.map((c) => {
                const passed = !!c.parsed.date && c.parsed.date.getTime() < now.getTime();
                return <CandidateRow key={c.id} c={c} checked={false} passed={passed} />;
              })}
              {unscheduled.length > 0 && (
                <>
                  <div className="px-4 sm:px-6 py-2 text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40 border-y">
                    Sans horaire ({unscheduled.length})
                  </div>
                  {unscheduled.map((c) => (
                    <CandidateRow key={c.id} c={c} checked={false} />
                  ))}
                </>
              )}
            </>
          )
        ) : presentList.length === 0 ? (
          <EmptyList label={query ? 'Aucun résultat.' : 'Aucun candidat émargé.'} />
        ) : (
          presentList.map((c) => <CandidateRow key={c.id} c={c} checked />)
        )}
      </div>

      {/* Footer actions */}
      {tab === 'present' && presentCount > 0 && (
        <div className="flex-shrink-0 border-t bg-background px-4 sm:px-6 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={resetAll}
            className="w-full sm:w-auto text-muted-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Tout réinitialiser
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmargementSection;
