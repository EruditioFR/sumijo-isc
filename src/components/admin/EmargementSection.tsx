import { useEffect, useMemo, useState } from 'react';
import { Clock, CheckCircle2, RotateCcw, Hourglass } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

interface EmargementCandidate {
  id: string;
  nom: string;
  prenom: string;
  heureArrivee: string | null;
}

const STORAGE_KEY = 'admin:emargement:present:v1';

/** Parse Airtable arrival value into a comparable Date (today in Paris) + display string. */
const parseArrival = (
  raw: string | null,
): { date: Date | null; display: string } => {
  if (!raw) return { date: null, display: '—' };
  const s = String(raw).trim();
  if (!s) return { date: null, display: '—' };

  // Full ISO datetime
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

  // Time only "HH:MM" or "HH:MM:SS" or "HHhMM"
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
  const [present, setPresent] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return new Set(JSON.parse(raw) as string[]);
    } catch {}
    return new Set();
  });

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(present)));
    } catch {}
  }, [present]);

  const toggle = (id: string) => {
    setPresent((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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
                      <Checkbox
                        checked={false}
                        onCheckedChange={() => toggle(c.id)}
                        aria-label={`Marquer ${c.prenom} ${c.nom} comme arrivé`}
                      />
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
                    <Checkbox
                      checked={false}
                      onCheckedChange={() => toggle(c.id)}
                      aria-label={`Marquer ${c.prenom} ${c.nom} comme arrivé`}
                    />
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
              onClick={() => setPresent(new Set())}
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
                    <Checkbox
                      checked
                      onCheckedChange={() => toggle(c.id)}
                      aria-label={`Retirer ${c.prenom} ${c.nom} des présents`}
                    />
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
