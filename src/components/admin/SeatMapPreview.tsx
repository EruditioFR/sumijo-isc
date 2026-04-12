import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const TOTAL_SEATS = 300;
const SEATS_PER_ROW = 10;
const SEATS_PER_SIDE = 5;
const TOTAL_ROWS = TOTAL_SEATS / SEATS_PER_ROW;

// Color palette for categories
const CATEGORY_COLORS = [
  { bg: 'bg-primary', label: 'text-primary-foreground' },
  { bg: 'bg-chart-1', label: 'text-primary-foreground' },
  { bg: 'bg-chart-2', label: 'text-primary-foreground' },
  { bg: 'bg-chart-3', label: 'text-primary-foreground' },
  { bg: 'bg-chart-4', label: 'text-primary-foreground' },
  { bg: 'bg-chart-5', label: 'text-primary-foreground' },
];

interface AttendeeInfo {
  category: string;
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

  // Build color map
  const categoryColorMap = useMemo(() => {
    const map = new Map<string, typeof CATEGORY_COLORS[0]>();
    categories.forEach((cat, i) => {
      map.set(cat.name, CATEGORY_COLORS[i % CATEGORY_COLORS.length]);
    });
    return map;
  }, [categories]);

  // Filtered count
  const filteredAttendees = useMemo(
    () => selectedCategory
      ? activeAttendees.filter(a => a.category === selectedCategory)
      : activeAttendees,
    [activeAttendees, selectedCategory]
  );

  const soldCount = filteredAttendees.length;

  // Generate seat grid
  const seats = useMemo(() => {
    const result: ('sold' | 'available')[][] = [];
    let remaining = Math.min(soldCount, TOTAL_SEATS);

    for (let row = 0; row < TOTAL_ROWS; row++) {
      const rowSeats: ('sold' | 'available')[] = [];
      for (let seat = 0; seat < SEATS_PER_ROW; seat++) {
        rowSeats.push(remaining > 0 ? 'sold' : 'available');
        if (remaining > 0) remaining--;
      }
      result.push(rowSeats);
    }
    return result;
  }, [soldCount]);

  const occupancyPct = Math.round((soldCount / TOTAL_SEATS) * 100);
  const activeColor = selectedCategory
    ? categoryColorMap.get(selectedCategory)?.bg || 'bg-primary'
    : 'bg-primary';

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
            <Badge
              variant={selectedCategory === null ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              Toutes ({activeAttendees.length})
            </Badge>
            {categories.map(cat => {
              const color = categoryColorMap.get(cat.name);
              const isActive = selectedCategory === cat.name;
              return (
                <Badge
                  key={cat.name}
                  variant={isActive ? 'default' : 'outline'}
                  className={cn("cursor-pointer", isActive && color?.bg)}
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
                  {row.slice(0, SEATS_PER_SIDE).map((status, seatIdx) => (
                    <div
                      key={seatIdx}
                      className={cn(
                        "w-4 h-4 rounded-sm transition-colors",
                        status === 'sold' ? activeColor : "bg-muted border border-border"
                      )}
                      title={`Rang ${rowIdx + 1}, Place ${seatIdx + 1} — ${status === 'sold' ? 'Vendue' : 'Disponible'}`}
                    />
                  ))}
                  <div className="w-3" />
                  {row.slice(SEATS_PER_SIDE).map((status, seatIdx) => (
                    <div
                      key={seatIdx + SEATS_PER_SIDE}
                      className={cn(
                        "w-4 h-4 rounded-sm transition-colors",
                        status === 'sold' ? activeColor : "bg-muted border border-border"
                      )}
                      title={`Rang ${rowIdx + 1}, Place ${seatIdx + SEATS_PER_SIDE + 1} — ${status === 'sold' ? 'Vendue' : 'Disponible'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className={cn("w-3 h-3 rounded-sm", activeColor)} />
            Vendue{selectedCategory ? ` (${selectedCategory})` : ''}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-muted border border-border" />
            Disponible
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              occupancyPct > 80 ? "bg-destructive" : occupancyPct > 50 ? activeColor : "bg-emerald-500"
            )}
            style={{ width: `${occupancyPct}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SeatMapPreview;
