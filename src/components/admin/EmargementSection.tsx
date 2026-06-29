import { useEffect, useMemo, useRef, useState } from 'react';
import { Clock, CheckCircle2, RotateCcw, Hourglass, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmargementCandidate {
  id: string;
  nom: string;
  prenom: string;
  heureArrivee: string | null;
  arrive?: boolean;
}

/** Parse Airtable arrival value into a comparable Date (today in Paris) + display string. */
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
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
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

const EmargementSection = ({ candidates }: { candidates: EmargementCandidate[] }) => {
  const [now, setNow] = useState(new Date());
  const [present, setPresent] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Set<string>>(new Set());
  const initialized = useRef(false);

  // Hydrate from Airtable's "Arrivé ?" field
  useEffect(() => {
    if (initialized.current && candidates.length === 0) return;
    const initial = new Set<string>();
    for (const c of candidates) {
      if (c.arrive) initial.add(c.id);
    }
    setPresent((prev) => {
      // Merge: trust Airtable as source of truth on (re)load
      return initial;
    });
    if (candidates.length > 0) initialized.current = true;
  }, [candidates]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const toggle = async (id: string) => {
    const wasPresent = present.has(id);
    const nextValue = !wasPresent;

    // Optimistic update
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
      // Revert on failure
      setPresent((prev) => {
        const next = new Set(prev);
        wasPresent ? next.add(id) : next.delete(id);
        return next;
      });
      toast.error("Impossible de mettre à jour Airtable");
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
    () =>
      candidates.map((c) => ({
        ...c,
        parsed: parseArrival(c.heureArrivee),
      })),
    [candidates],
  );

  const upcoming = useMemo(
    () =>
      enriched
        .filter((c) => !present.has(c.id) && c.parsed.date)
        .sort((a, b) => (a.parsed.date!.getTime() - b.parsed.date!.getTime())),
    [enriched, present],
  );

  const unscheduled = useMemo(
    () => enriched.filter((c) => !present.has(c.id) && !c.parsed.date),
    [enriched, present],
  );

  const presentList = useMemo(
    () => enriched.filter((c) => present.has(c.id)),
    [enriched, present],
  );

  const parisTime = now.toLocaleTimeString('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parisDate = now.toLocaleDateString('fr-FR', {
    timeZone: 'Europe/Paris',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const renderCheckbox = (id: string, checked: boolean, label: string) => (
    <div className="inline-flex items-center justify-center">
      {pending.has(id) ? (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      ) : (
        <Checkbox
          checked={checked}
          onCheckedChange={() => toggle(id)}
          aria-label={label}
        />
      )}
    </div>
  );

  const resetAll = async () => {
    const ids = Array.from(present);
    if (ids.length === 0) return;
    if (!confirm(`Réinitialiser ${ids.length} émargement(s) ? Le champ "Arrivé ?" sera décoché dans Airtable.`)) return;
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

  return (
    <section className="mb-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-background border rounded-xl px-5 py-4">
        <div>
          <h3 className="text-xl font-display text-foreground flex items-center gap-2">
            <Hourglass className="w-5 h-5" />
            Émargement
          </h3>
          <p className="text-xs text-muted-foreground capitalize">{parisDate}</p>
        </div>
        <div className="flex items-center gap-2 text-2xl font-mono tabular-nums text-foreground">
          <Clock className="w-5 h-5 text-muted-foreground" />
          {parisTime}
          <span className="text-xs font-sans font-normal text-muted-foreground ml-1">(Paris)</span>
        </div>
      </div>

      {/* Arrivées à venir */}
      <div className="bg-background border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/40">
          <h4 className="font-semibold text-foreground">
            Arrivées à venir
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({upcoming.length}{unscheduled.length > 0 ? ` + ${unscheduled.length} sans horaire` : ''})
            </span>
          </h4>
        </div>
        {upcoming.length === 0 && unscheduled.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Aucune arrivée à venir.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Heure d'arrivée</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead className="w-28 text-center">Arrivé</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcoming.map((c) => {
                const passed = c.parsed.date && c.parsed.date.getTime() < now.getTime();
                return (
                  <TableRow key={c.id}>
                    <TableCell className={`font-mono tabular-nums ${passed ? 'text-destructive font-semibold' : ''}`}>
                      {c.parsed.display}
                    </TableCell>
                    <TableCell className="font-medium">{c.nom.toUpperCase()}</TableCell>
                    <TableCell>{c.prenom}</TableCell>
                    <TableCell className="text-center">
                      {renderCheckbox(c.id, false, `Marquer ${c.prenom} ${c.nom} comme arrivé`)}
                    </TableCell>
                  </TableRow>
                );
              })}
              {unscheduled.map((c) => (
                <TableRow key={c.id} className="text-muted-foreground">
                  <TableCell className="italic">—</TableCell>
                  <TableCell className="font-medium">{c.nom.toUpperCase()}</TableCell>
                  <TableCell>{c.prenom}</TableCell>
                  <TableCell className="text-center">
                    {renderCheckbox(c.id, false, `Marquer ${c.prenom} ${c.nom} comme arrivé`)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Candidats présents */}
      <div className="bg-background border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/40 flex items-center justify-between gap-2 flex-wrap">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Candidats présents
            <span className="text-sm font-normal text-muted-foreground">({presentList.length})</span>
          </h4>
          {presentList.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAll}
              className="text-muted-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Tout réinitialiser
            </Button>
          )}
        </div>
        {presentList.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Aucun candidat émargé pour le moment.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Heure d'arrivée</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead className="w-28 text-center">Présent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {presentList.map((c) => (
                <TableRow key={c.id} className="bg-emerald-50/40">
                  <TableCell className="font-mono tabular-nums">{c.parsed.display}</TableCell>
                  <TableCell className="font-medium">{c.nom.toUpperCase()}</TableCell>
                  <TableCell>{c.prenom}</TableCell>
                  <TableCell className="text-center">
                    {renderCheckbox(c.id, true, `Retirer ${c.prenom} ${c.nom} des présents`)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
};

export default EmargementSection;
