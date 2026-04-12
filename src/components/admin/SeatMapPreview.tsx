import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface SeatMapPreviewProps {
  attendees?: AttendeeInfo[];
}

export const SeatMapPreview = ({ attendees = [] }: SeatMapPreviewProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const activeAttendees = useMemo(
    () => attendees.filter(a => a.disabled === '0'),
    [attendees]
  );

  // Unique categories with counts
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    activeAttendees.forEach(a => {
      map.set(a.category, (map.get(a.category) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [activeAttendees]);

  // Split attendees into premium (category contains "Premium") and standard
  const { premiumAttendees, standardAttendees } = useMemo(() => {
    const source = selectedCategory
      ? activeAttendees.filter(a => a.category === selectedCategory)
      : activeAttendees;
    const premium = source.filter(a => a.category.toLowerCase().includes('premium'));
    const standard = source.filter(a => !a.category.toLowerCase().includes('premium'));
    console.log('[SeatMap] Categories found:', [...new Set(source.map(a => a.category))]);
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
        {/* Category filter chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(cat => {
              const isActive = selectedCategory === cat.name;
              return (
                <Badge
                  key={cat.name}
                  variant={isActive ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(isActive ? null : cat.name)}
                >
                  {cat.name} ({cat.count})
                </Badge>
              );
            })}
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
