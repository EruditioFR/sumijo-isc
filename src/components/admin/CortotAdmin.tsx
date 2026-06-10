import { useEffect, useMemo, useState } from 'react';
import { Music, Loader2, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  pax: string;
  category: string;
  contactForInvitation: string;
  confirmed: string;
  invited: string;
  seatNumber: string;
  seatNumberPlus1: string;
  seatNumberPlus2: string;
  statutJourJ: boolean;
  paxArrived: number | null;
  priority: string;
}

const categoryColor = (cat: string) => {
  const c = (cat || '').toLowerCase();
  if (c.includes('vip')) return 'bg-rose-100 text-rose-800 border-rose-200';
  if (c.includes('press')) return 'bg-amber-100 text-amber-800 border-amber-200';
  if (c.includes('partner') || c.includes('sponsor')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (c.includes('jury')) return 'bg-purple-100 text-purple-800 border-purple-200';
  return 'bg-muted text-foreground border-border';
};

const CortotAdmin = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [onlyArrived, setOnlyArrived] = useState(false);
  const [onlyConfirmed, setOnlyConfirmed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchGuests = async (opts: { silent?: boolean } = {}) => {
    if (!opts.silent) setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('list-cortot-guests');
      if (error) throw error;
      setGuests(data?.guests ?? []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur inconnue';
      setError(msg);
      if (!opts.silent) {
        toast({ title: 'Erreur', description: msg, variant: 'destructive' });
      }
    } finally {
      if (!opts.silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const paxTotal = (g: Guest) => {
    const n = parseInt(g.pax, 10);
    return isNaN(n) ? 1 : Math.max(1, n);
  };

  const updateGuest = async (
    guest: Guest,
    changes: { statutJourJ?: boolean; paxArrived?: number | null },
  ) => {
    const prevSnapshot = { statutJourJ: guest.statutJourJ, paxArrived: guest.paxArrived };
    setGuests((prev) =>
      prev.map((g) => (g.id === guest.id ? { ...g, ...changes } : g)),
    );
    setUpdating((prev) => new Set(prev).add(guest.id));
    try {
      const { data, error } = await supabase.functions.invoke('update-cortot-guest', {
        body: { id: guest.id, ...changes },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
    } catch (e) {
      setGuests((prev) =>
        prev.map((g) => (g.id === guest.id ? { ...g, ...prevSnapshot } : g)),
      );
      const msg = e instanceof Error ? e.message : 'Erreur inconnue';
      toast({ title: 'Erreur', description: msg, variant: 'destructive' });
    } finally {
      setUpdating((prev) => {
        const n = new Set(prev);
        n.delete(guest.id);
        return n;
      });
    }
  };

  const toggleStatutJourJ = (guest: Guest) => {
    const next = !guest.statutJourJ;
    // When marking arrived, default paxArrived to total pax if not set
    const changes: { statutJourJ: boolean; paxArrived?: number | null } = { statutJourJ: next };
    if (next && (guest.paxArrived == null || guest.paxArrived === 0)) {
      changes.paxArrived = paxTotal(guest);
    }
    if (!next) {
      changes.paxArrived = 0;
    }
    updateGuest(guest, changes);
  };

  const setPaxArrived = (guest: Guest, value: number) => {
    const changes: { paxArrived: number; statutJourJ?: boolean } = { paxArrived: value };
    if (value > 0 && !guest.statutJourJ) changes.statutJourJ = true;
    if (value === 0 && guest.statutJourJ) changes.statutJourJ = false;
    updateGuest(guest, changes);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guests.filter((g) => {
      if (onlyArrived && !g.statutJourJ) return false;
      if (onlyConfirmed && !/yes/i.test(g.confirmed)) return false;
      if (selectedCategory !== 'all' && g.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        g.firstName.toLowerCase().includes(q) ||
        g.lastName.toLowerCase().includes(q) ||
        g.company.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.contactForInvitation.toLowerCase().includes(q)
      );
    });
  }, [guests, search, onlyArrived, onlyConfirmed, selectedCategory]);

  const categoryFiltered = useMemo(() => {
    if (selectedCategory === 'all') return guests;
    return guests.filter((g) => g.category === selectedCategory);
  }, [guests, selectedCategory]);

  const stats = useMemo(() => {
    const arrived = categoryFiltered.filter((g) => g.statutJourJ).length;
    const expectedPax = categoryFiltered.reduce((sum, g) => sum + paxTotal(g), 0);
    const arrivedPax = categoryFiltered.reduce((sum, g) => {
      if (g.paxArrived != null) return sum + g.paxArrived;
      if (g.statutJourJ) return sum + paxTotal(g);
      return sum;
    }, 0);
    return { arrived, total: categoryFiltered.length, arrivedPax, expectedPax };
  }, [categoryFiltered]);

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-display text-foreground mb-2 flex items-center gap-3">
            <Music className="w-8 h-8" />
            Cortot — Accueil des invités
          </h2>
          <p className="text-muted-foreground">
            Concert « Sumi Jo & Winners » — pointage des arrivées
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchGuests()} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats */}
      {!isLoading && !error && guests.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-background border rounded-lg p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Arrivés</div>
            <div className="text-2xl font-display text-foreground mt-1">
              {stats.arrived}<span className="text-base text-muted-foreground"> / {stats.total}</span>
            </div>
          </div>
          <div className="bg-background border rounded-lg p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Pax arrivés</div>
            <div className="text-2xl font-display text-foreground mt-1">
              {stats.arrivedPax}<span className="text-base text-muted-foreground"> / {stats.expectedPax}</span>
            </div>
          </div>
          <div className="bg-background border rounded-lg p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Confirmés</div>
            <div className="text-2xl font-display text-foreground mt-1">
              {guests.filter((g) => /yes/i.test(g.confirmed)).length}
            </div>
          </div>
          <div className="bg-background border rounded-lg p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Restants</div>
            <div className="text-2xl font-display text-foreground mt-1">
              {stats.total - stats.arrived}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un invité, société, catégorie, contact invitation…"
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v)}>
          <SelectTrigger className="h-10 w-44">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {Array.from(new Set(guests.map((g) => g.category).filter(Boolean))).sort().map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <Checkbox
            checked={onlyArrived}
            onCheckedChange={(v) => setOnlyArrived(Boolean(v))}
          />
          Arrivés uniquement
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <Checkbox
            checked={onlyConfirmed}
            onCheckedChange={(v) => setOnlyConfirmed(Boolean(v))}
          />
          Confirmés uniquement
        </label>
      </div>

      {isLoading ? (
        <div className="bg-background border rounded-xl p-12 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Chargement de la liste…</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/5 border border-destructive/30 rounded-xl p-8 text-center">
          <p className="text-destructive font-medium mb-2">Impossible de charger la liste des invités</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-background border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">Aucun invité ne correspond aux filtres.</p>
        </div>
      ) : (
        <div className="bg-background border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28 text-center">Jour J</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Société</TableHead>
                  <TableHead className="text-center">Pax arrivés</TableHead>
                  <TableHead className="text-center">Pax</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Contact invitation</TableHead>
                  <TableHead className="text-center">Confirmé</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((g) => {
                  const isUpdating = updating.has(g.id);
                  const seats = [
                    g.seatNumber && { label: 'Siège', value: g.seatNumber, color: 'text-primary' },
                    g.seatNumberPlus1 && { label: '+1', value: g.seatNumberPlus1, color: 'text-amber-600' },
                    g.seatNumberPlus2 && { label: '+2', value: g.seatNumberPlus2, color: 'text-emerald-600' },
                  ].filter(Boolean) as { label: string; value: string; color: string }[];
                  const confirmed = /yes/i.test(g.confirmed);
                  return (
                    <TableRow
                      key={g.id}
                      className={g.statutJourJ ? 'bg-emerald-50/60 hover:bg-emerald-50' : ''}
                    >
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          {isUpdating ? (
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          ) : (
                            <Checkbox
                              checked={g.statutJourJ}
                              onCheckedChange={() => toggleStatutJourJ(g)}
                              className="w-6 h-6"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {[g.firstName, g.lastName].filter(Boolean).join(' ') || '—'}
                        </div>
                        {seats.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] font-medium">
                            {seats.map((s, i) => (
                              <span key={i} className={s.color}>
                                {s.label} : {s.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{g.company || '—'}</TableCell>
                      <TableCell className="text-center">
                        {(() => {
                          const total = paxTotal(g);
                          const current = g.paxArrived ?? (g.statutJourJ ? total : 0);
                          if (total <= 1) {
                            return (
                              <span className="text-sm text-muted-foreground">
                                {g.statutJourJ ? '1 / 1' : '0 / 1'}
                              </span>
                            );
                          }
                          return (
                            <Select
                              value={String(current)}
                              onValueChange={(v) => setPaxArrived(g, parseInt(v, 10))}
                              disabled={isUpdating}
                            >
                              <SelectTrigger className="h-8 w-20 mx-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: total + 1 }, (_, i) => (
                                  <SelectItem key={i} value={String(i)}>
                                    {i} / {total}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="text-center font-medium">{g.pax || '—'}</TableCell>
                      <TableCell>
                        {g.category ? (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${categoryColor(g.category)}`}
                          >
                            {g.category}
                          </span>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {g.contactForInvitation || '—'}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                            confirmed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {g.confirmed || '—'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CortotAdmin;
