import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const TOTAL_SEATS = 300;
const SEATS_PER_ROW = 10;
const SEATS_PER_SIDE = 5;
const PREMIUM_ROWS = 12;
const GAP_ROWS = 3;
const STANDARD_ROWS = 18;
const TOTAL_ROWS = PREMIUM_ROWS + GAP_ROWS + STANDARD_ROWS;

interface AttendeeInfo {
  category: string;
  ticket: string;
  disabled: string;
  isInvitation?: boolean;
}

interface AvailabilityCategory {
  name?: string;
  id?: string;
}

interface SeatMapPreviewProps {
  attendees?: AttendeeInfo[];
  allCategories?: AvailabilityCategory[];
}

// Parse date from category string like "Samedi 11 juillet 2026 - Concert de Gala"
const parseCategoryDate = (name: string): Date | null => {
  const months: Record<string, number> = {
    janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
    juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11,
  };
  const match = name.match(/(\d{1,2})\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i);
  if (!match) return null;
  return new Date(parseInt(match[3]), months[match[2].toLowerCase()], parseInt(match[1]));
};

export const SeatMapPreview = ({ attendees = [], allCategories = [] }: SeatMapPreviewProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const activeAttendees = useMemo(
    () => attendees.filter(a => a.disabled === '0'),
    [attendees]
  );

  // Build sorted list of all categories (from availability), with reservation counts
  const categories = useMemo(() => {
    const countMap = new Map<string, number>();
    activeAttendees.forEach(a => {
      countMap.set(a.category, (countMap.get(a.category) || 0) + 1);
    });

    // Use allCategories if available, otherwise fall back to attendee categories
    const names = allCategories.length > 0
      ? [...new Set(allCategories.map(c => c.name).filter(Boolean) as string[])]
      : [...countMap.keys()];

    return names
      .filter(name => name.toLowerCase() !== 'pass semaine')
      .map(name => ({ name, count: countMap.get(name) || 0, date: parseCategoryDate(name) }))
      .sort((a, b) => {
        if (a.date && b.date) return a.date.getTime() - b.date.getTime();
        if (a.date) return -1;
        if (b.date) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [activeAttendees, allCategories]);

  // Auto-select first category on load
  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0].name);
    }
  }, [categories, selectedCategory]);

  // Pass semaine : seuls les billets "Pass Semaine - Catégorie Premium" ou "Pass Semaine - Catégorie Classique" sont comptabilisés
  const { premiumInv, premiumPaid, standardInv, standardPaid } = useMemo(() => {
    const isPrem = (a: AttendeeInfo) => a.ticket.toLowerCase().includes('premium');
    const isPass = (a: AttendeeInfo) =>
      a.ticket === 'Pass Semaine - Catégorie Premium' ||
      a.ticket === 'Pass Semaine - Catégorie Classique';
    const passes = activeAttendees.filter(isPass);
    const dateSpecific = selectedCategory
      ? activeAttendees.filter(a => a.category === selectedCategory && !isPass(a))
      : activeAttendees.filter(a => !isPass(a));
    const source = [...dateSpecific, ...passes];
    return {
      premiumInv: source.filter(a => isPrem(a) && a.isInvitation).length,
      premiumPaid: source.filter(a => isPrem(a) && !a.isInvitation).length,
      standardInv: source.filter(a => !isPrem(a) && a.isInvitation).length,
      standardPaid: source.filter(a => !isPrem(a) && !a.isInvitation).length,
    };
  }, [activeAttendees, selectedCategory]);

  const soldCount = premiumInv + premiumPaid + standardInv + standardPaid;

  const PREMIUM_CAPACITY = PREMIUM_ROWS * SEATS_PER_ROW; // 100
  const STANDARD_CAPACITY = TOTAL_SEATS - PREMIUM_CAPACITY; // 200

  // Generate seat grid: invitations placed first, then paid
  const seats = useMemo(() => {
    const result: ('paid' | 'invitation' | 'available' | 'gap')[][] = [];
    let remPremInv = Math.min(premiumInv, PREMIUM_CAPACITY);
    let remPremPaid = Math.min(premiumPaid, PREMIUM_CAPACITY - remPremInv);
    let remStdInv = Math.min(standardInv, STANDARD_CAPACITY);
    let remStdPaid = Math.min(standardPaid, STANDARD_CAPACITY - remStdInv);

    for (let row = 0; row < TOTAL_ROWS; row++) {
      const isGapRow = row >= PREMIUM_ROWS && row < PREMIUM_ROWS + GAP_ROWS;
      if (isGapRow) {
        result.push(Array(SEATS_PER_ROW).fill('gap'));
        continue;
      }
      const rowSeats: ('paid' | 'invitation' | 'available' | 'gap')[] = [];
      const isPremiumRow = row < PREMIUM_ROWS;
      for (let seat = 0; seat < SEATS_PER_ROW; seat++) {
        if (isPremiumRow) {
          if (remPremInv > 0) { rowSeats.push('invitation'); remPremInv--; }
          else if (remPremPaid > 0) { rowSeats.push('paid'); remPremPaid--; }
          else rowSeats.push('available');
        } else {
          if (remStdInv > 0) { rowSeats.push('invitation'); remStdInv--; }
          else if (remStdPaid > 0) { rowSeats.push('paid'); remStdPaid--; }
          else rowSeats.push('available');
        }
      }
      result.push(rowSeats);
    }
    return result;
  }, [premiumInv, premiumPaid, standardInv, standardPaid, PREMIUM_CAPACITY, STANDARD_CAPACITY]);

  const occupancyPct = Math.round((soldCount / TOTAL_SEATS) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <span>Plan de salle — Aperçu remplissage</span>
          <span className="text-sm font-normal text-muted-foreground">
            {soldCount}/{TOTAL_SEATS} places ({occupancyPct}%)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Category dropdown */}
        {categories.length > 0 && (
          <div className="mb-4">
            <Select
              value={selectedCategory || ''}
              onValueChange={(val) => setSelectedCategory(val)}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Sélectionner une date…" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.name} {cat.count > 0 ? `(${cat.count} billets)` : '(aucune résa)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Summary table */}
        {categories.length > 0 && (() => {
          const isPrem = (a: AttendeeInfo) => a.ticket.toLowerCase().includes('premium');
          const isPass = (a: AttendeeInfo) =>
            a.ticket === 'Pass Semaine - Catégorie Premium' ||
            a.ticket === 'Pass Semaine - Catégorie Classique';
          // Pass semaine globals — valables tous les jours, affichés identiquement sur chaque ligne
          const passPremInv = activeAttendees.filter(a => isPass(a) && isPrem(a) && a.isInvitation).length;
          const passPremPaid = activeAttendees.filter(a => isPass(a) && isPrem(a) && !a.isInvitation).length;
          const passStdInv = activeAttendees.filter(a => isPass(a) && !isPrem(a) && a.isInvitation).length;
          const passStdPaid = activeAttendees.filter(a => isPass(a) && !isPrem(a) && !a.isInvitation).length;
          return (
          <div className="rounded-md border overflow-x-auto mb-4 text-xs">
            <Table>
              <TableHeader>
                <TableRow className="h-7 border-b-0 hover:bg-transparent">
                  <TableHead rowSpan={3} className="py-1.5 text-xs align-middle border-r">Date</TableHead>
                  <TableHead colSpan={5} className="py-1 text-xs text-center bg-amber-50 border-r font-semibold text-amber-900">
                    Premium <span className="font-normal text-muted-foreground">(cap. 120)</span>
                  </TableHead>
                  <TableHead colSpan={5} className="py-1 text-xs text-center bg-sky-50 border-r font-semibold text-sky-900">
                    Classique <span className="font-normal text-muted-foreground">(cap. 180)</span>
                  </TableHead>
                  <TableHead rowSpan={3} className="py-1.5 text-xs text-center w-20 align-middle">
                    Total<br/><span className="font-normal text-[10px] text-muted-foreground">/300</span>
                  </TableHead>
                </TableRow>
                <TableRow className="h-7 hover:bg-transparent">
                  <TableHead colSpan={2} className="py-1 text-xs text-center bg-amber-50/60 text-rose-700 border-l">Invitations</TableHead>
                  <TableHead colSpan={2} className="py-1 text-xs text-center bg-amber-50/60 text-emerald-700">Achetées</TableHead>
                  <TableHead rowSpan={2} className="py-1 text-xs text-center w-20 bg-amber-50/80 border-r border-l align-middle font-semibold">Occupé</TableHead>
                  <TableHead colSpan={2} className="py-1 text-xs text-center bg-sky-50/60 text-rose-700">Invitations</TableHead>
                  <TableHead colSpan={2} className="py-1 text-xs text-center bg-sky-50/60 text-emerald-700">Achetées</TableHead>
                  <TableHead rowSpan={2} className="py-1 text-xs text-center w-20 bg-sky-50/80 border-r border-l align-middle font-semibold">Occupé</TableHead>
                </TableRow>
                <TableRow className="h-7 hover:bg-transparent">
                  <TableHead className="py-1 text-[10px] text-center w-16 bg-amber-50/30 border-l font-normal">Journée</TableHead>
                  <TableHead className="py-1 text-[10px] text-center w-16 bg-amber-50/30 font-normal">Semaine</TableHead>
                  <TableHead className="py-1 text-[10px] text-center w-16 bg-amber-50/30 border-l font-normal">Journée</TableHead>
                  <TableHead className="py-1 text-[10px] text-center w-16 bg-amber-50/30 font-normal">Semaine</TableHead>
                  <TableHead className="py-1 text-[10px] text-center w-16 bg-sky-50/30 border-l font-normal">Journée</TableHead>
                  <TableHead className="py-1 text-[10px] text-center w-16 bg-sky-50/30 font-normal">Semaine</TableHead>
                  <TableHead className="py-1 text-[10px] text-center w-16 bg-sky-50/30 border-l font-normal">Journée</TableHead>
                  <TableHead className="py-1 text-[10px] text-center w-16 bg-sky-50/30 font-normal">Semaine</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(cat => {
                  // Billets journée propres à la date
                  const day = activeAttendees.filter(a => a.category === cat.name && !isPass(a));
                  const premInvDay = day.filter(a => isPrem(a) && a.isInvitation).length;
                  const premPaidDay = day.filter(a => isPrem(a) && !a.isInvitation).length;
                  const stdInvDay = day.filter(a => !isPrem(a) && a.isInvitation).length;
                  const stdPaidDay = day.filter(a => !isPrem(a) && !a.isInvitation).length;
                  // Pass semaine (constants — ajoutés à chaque date)
                  const premTotal = premInvDay + premPaidDay + passPremInv + passPremPaid;
                  const stdTotal = stdInvDay + stdPaidDay + passStdInv + passStdPaid;
                  const dayTotal = premTotal + stdTotal;
                  const isSelected = selectedCategory === cat.name;
                  const num = (n: number, cls = '') => n > 0
                    ? <span className={cn("font-medium", cls)}>{n}</span>
                    : <span className="text-muted-foreground">0</span>;
                  const occ = (used: number, cap: number, cls: string) => (
                    <span className={cn("font-bold", used > cap ? "text-destructive" : cls)}>
                      {used}<span className="font-normal text-muted-foreground">/{cap}</span>
                    </span>
                  );
                  return (
                    <TableRow
                      key={cat.name}
                      className={cn("cursor-pointer h-7", isSelected && "bg-muted")}
                      onClick={() => setSelectedCategory(cat.name)}
                    >
                      <TableCell className="py-1 text-xs border-r">{cat.name}</TableCell>
                      <TableCell className="py-1 text-center bg-amber-50/15 border-l">{num(premInvDay, "text-rose-700")}</TableCell>
                      <TableCell className="py-1 text-center bg-amber-50/15 italic">{num(passPremInv, "text-rose-700/80")}</TableCell>
                      <TableCell className="py-1 text-center bg-amber-50/15 border-l">{num(premPaidDay, "text-emerald-700")}</TableCell>
                      <TableCell className="py-1 text-center bg-amber-50/15 italic">{num(passPremPaid, "text-emerald-700/80")}</TableCell>
                      <TableCell className="py-1 text-center bg-amber-50/40 border-r border-l">{occ(premTotal, 120, "text-amber-800")}</TableCell>
                      <TableCell className="py-1 text-center bg-sky-50/15 border-l">{num(stdInvDay, "text-rose-700")}</TableCell>
                      <TableCell className="py-1 text-center bg-sky-50/15 italic">{num(passStdInv, "text-rose-700/80")}</TableCell>
                      <TableCell className="py-1 text-center bg-sky-50/15 border-l">{num(stdPaidDay, "text-emerald-700")}</TableCell>
                      <TableCell className="py-1 text-center bg-sky-50/15 italic">{num(passStdPaid, "text-emerald-700/80")}</TableCell>
                      <TableCell className="py-1 text-center bg-sky-50/40 border-r border-l">{occ(stdTotal, 180, "text-sky-800")}</TableCell>
                      <TableCell className="py-1 text-center">{occ(dayTotal, 300, "text-foreground")}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="flex flex-wrap gap-x-4 gap-y-1 px-3 py-2 text-[11px] text-muted-foreground border-t bg-muted/30">
              <span><span className="inline-block w-2 h-2 rounded-full bg-rose-600 mr-1 align-middle" />Invitations</span>
              <span><span className="inline-block w-2 h-2 rounded-full bg-emerald-600 mr-1 align-middle" />Achetées</span>
              <span className="italic">Colonnes « Semaine » en italique = pass semaine, valables tous les jours</span>
            </div>
          </div>
          );
        })()}

        <div className="flex flex-col gap-4 items-center">
          {/* Stage */}
          <div className="bg-muted border-2 border-primary/30 rounded-lg px-8 py-2 flex items-center justify-center w-fit">
            <span className="text-xs font-semibold text-primary/70 tracking-widest uppercase">
              SCÈNE
            </span>
          </div>

          {/* Seat grid */}
          <div className="overflow-x-auto">
            <div className="inline-flex flex-col gap-[3px] min-w-fit">
              {seats.map((row, rowIdx) => {
                const isGap = row[0] === 'gap';
                if (isGap) {
                  return <div key={rowIdx} className="h-2" />;
                }
                return (
                <div key={rowIdx} className="flex items-center gap-[3px]">
                  <span className="w-6 text-[10px] text-muted-foreground text-right shrink-0">
                    R{rowIdx + 1}
                  </span>
                  {row.slice(0, SEATS_PER_SIDE).map((status, seatIdx) => {
                    const isPremium = rowIdx < PREMIUM_ROWS;
                    const seatClass =
                      status === 'paid' ? (isPremium ? 'bg-amber-500' : 'bg-primary')
                      : status === 'invitation' ? (isPremium ? 'bg-orange-700' : 'bg-rose-600')
                      : (isPremium ? 'bg-amber-200/60 border border-amber-300' : 'bg-muted border border-border');
                    const label = status === 'paid' ? 'Payée' : status === 'invitation' ? 'Invitation' : 'Disponible';
                    return (
                      <div
                        key={seatIdx}
                        className={cn("w-4 h-4 rounded-sm transition-colors", seatClass)}
                        title={`Rang ${rowIdx + 1}${isPremium ? ' (Premium)' : ''}, Place ${seatIdx + 1} — ${label}`}
                      />
                    );
                  })}
                  <div className="w-3" />
                  {row.slice(SEATS_PER_SIDE).map((status, seatIdx) => {
                    const isPremium = rowIdx < PREMIUM_ROWS;
                    const seatClass =
                      status === 'paid' ? (isPremium ? 'bg-amber-500' : 'bg-primary')
                      : status === 'invitation' ? (isPremium ? 'bg-orange-700' : 'bg-rose-600')
                      : (isPremium ? 'bg-amber-200/60 border border-amber-300' : 'bg-muted border border-border');
                    const label = status === 'paid' ? 'Payée' : status === 'invitation' ? 'Invitation' : 'Disponible';
                    return (
                      <div
                        key={seatIdx + SEATS_PER_SIDE}
                        className={cn("w-4 h-4 rounded-sm transition-colors", seatClass)}
                        title={`Rang ${rowIdx + 1}${isPremium ? ' (Premium)' : ''}, Place ${seatIdx + SEATS_PER_SIDE + 1} — ${label}`}
                      />
                    );
                  })}
                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-500" />
            Premium payée
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-orange-700" />
            Premium invitation
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-200/60 border border-amber-300" />
            Premium dispo
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            Standard payée
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-rose-600" />
            Standard invitation
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-muted border border-border" />
            Standard dispo
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              occupancyPct > 80 ? "bg-destructive" : "bg-primary"
            )}
            style={{ width: `${occupancyPct}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SeatMapPreview;
