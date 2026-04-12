import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const TOTAL_SEATS = 300;
const SEATS_PER_ROW = 10;
const SEATS_PER_SIDE = 5;
const PREMIUM_ROWS = 10;
const TOTAL_ROWS = TOTAL_SEATS / SEATS_PER_ROW;

interface AttendeeInfo {
  category: string;
  ticket: string;
  disabled: string;
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

  // Split attendees into premium (ticket name contains "Premium") and standard
  const { premiumAttendees, standardAttendees } = useMemo(() => {
    const source = selectedCategory
      ? activeAttendees.filter(a => a.category === selectedCategory)
      : activeAttendees;
    const premium = source.filter(a => a.ticket.toLowerCase().includes('premium'));
    const standard = source.filter(a => !a.ticket.toLowerCase().includes('premium'));
    console.log('[SeatMap] Ticket names:', [...new Set(source.map(a => a.ticket))]);
    console.log('[SeatMap] Premium:', premium.length, 'Standard:', standard.length);
    return { premiumAttendees: premium, standardAttendees: standard };
  }, [activeAttendees, selectedCategory]);

  const soldCount = premiumAttendees.length + standardAttendees.length;

  const PREMIUM_CAPACITY = PREMIUM_ROWS * SEATS_PER_ROW; // 100
  const STANDARD_CAPACITY = TOTAL_SEATS - PREMIUM_CAPACITY; // 200

  // Generate seat grid with premium in first 10 rows, standard in remaining 20
  const seats = useMemo(() => {
    const result: ('sold' | 'available')[][] = [];
    let remainingPremium = Math.min(premiumAttendees.length, PREMIUM_CAPACITY);
    let remainingStandard = Math.min(standardAttendees.length, STANDARD_CAPACITY);

    for (let row = 0; row < TOTAL_ROWS; row++) {
      const rowSeats: ('sold' | 'available')[] = [];
      const isPremiumRow = row < PREMIUM_ROWS;
      for (let seat = 0; seat < SEATS_PER_ROW; seat++) {
        if (isPremiumRow) {
          rowSeats.push(remainingPremium > 0 ? 'sold' : 'available');
          if (remainingPremium > 0) remainingPremium--;
        } else {
          rowSeats.push(remainingStandard > 0 ? 'sold' : 'available');
          if (remainingStandard > 0) remainingStandard--;
        }
      }
      result.push(rowSeats);
    }
    return result;
  }, [premiumAttendees.length, standardAttendees.length, PREMIUM_CAPACITY, STANDARD_CAPACITY]);

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
        {categories.length > 0 && (
          <div className="rounded-md border overflow-x-auto mb-4 text-xs">
            <Table>
              <TableHeader>
                <TableRow className="h-8">
                  <TableHead className="py-1.5 text-xs">Date</TableHead>
                  <TableHead className="py-1.5 text-xs text-center w-16">Prem.</TableHead>
                  <TableHead className="py-1.5 text-xs text-center w-16">Class.</TableHead>
                  <TableHead className="py-1.5 text-xs text-center w-16">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(cat => {
                  const catAttendees = activeAttendees.filter(a => a.category === cat.name);
                  const prem = catAttendees.filter(a => a.ticket.toLowerCase().includes('premium')).length;
                  const std = catAttendees.length - prem;
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <TableRow
                      key={cat.name}
                      className={cn("cursor-pointer h-7", isSelected && "bg-muted")}
                      onClick={() => setSelectedCategory(cat.name)}
                    >
                      <TableCell className="py-1 text-xs">{cat.name}</TableCell>
                      <TableCell className="py-1 text-center">
                        {prem > 0 ? <span className="text-amber-600 font-semibold">{prem}</span> : <span className="text-muted-foreground">0</span>}
                      </TableCell>
                      <TableCell className="py-1 text-center">
                        {std > 0 ? <span className="font-semibold">{std}</span> : <span className="text-muted-foreground">0</span>}
                      </TableCell>
                      <TableCell className="py-1 text-center font-bold">{cat.count}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="bg-muted/50 h-7">
                  <TableCell className="py-1 text-xs font-bold">Total</TableCell>
                  <TableCell className="py-1 text-center font-bold text-amber-600">{activeAttendees.filter(a => a.ticket.toLowerCase().includes('premium')).length}</TableCell>
                  <TableCell className="py-1 text-center font-bold">{activeAttendees.filter(a => !a.ticket.toLowerCase().includes('premium')).length}</TableCell>
                  <TableCell className="py-1 text-center font-bold">{activeAttendees.length}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

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
              {seats.map((row, rowIdx) => (
                <div key={rowIdx} className="flex items-center gap-[3px]">
                  <span className="w-6 text-[10px] text-muted-foreground text-right shrink-0">
                    R{rowIdx + 1}
                  </span>
                  {row.slice(0, SEATS_PER_SIDE).map((status, seatIdx) => {
                    const isPremium = rowIdx < PREMIUM_ROWS;
                    return (
                      <div
                        key={seatIdx}
                        className={cn(
                          "w-4 h-4 rounded-sm transition-colors",
                          status === 'sold'
                            ? isPremium ? "bg-amber-500" : "bg-primary"
                            : isPremium ? "bg-amber-200/60 border border-amber-300" : "bg-muted border border-border"
                        )}
                        title={`Rang ${rowIdx + 1}${isPremium ? ' (Premium)' : ''}, Place ${seatIdx + 1} — ${status === 'sold' ? 'Vendue' : 'Disponible'}`}
                      />
                    );
                  })}
                  <div className="w-3" />
                  {row.slice(SEATS_PER_SIDE).map((status, seatIdx) => {
                    const isPremium = rowIdx < PREMIUM_ROWS;
                    return (
                      <div
                        key={seatIdx + SEATS_PER_SIDE}
                        className={cn(
                          "w-4 h-4 rounded-sm transition-colors",
                          status === 'sold'
                            ? isPremium ? "bg-amber-500" : "bg-primary"
                            : isPremium ? "bg-amber-200/60 border border-amber-300" : "bg-muted border border-border"
                        )}
                        title={`Rang ${rowIdx + 1}${isPremium ? ' (Premium)' : ''}, Place ${seatIdx + SEATS_PER_SIDE + 1} — ${status === 'sold' ? 'Vendue' : 'Disponible'}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-500" />
            Premium réservée
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-200/60 border border-amber-300" />
            Premium disponible
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            Standard réservée{selectedCategory ? ` (${selectedCategory})` : ''}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-muted border border-border" />
            Standard disponible
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
