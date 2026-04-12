import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const TOTAL_SEATS = 300;
const SEATS_PER_ROW = 10;
const SEATS_PER_SIDE = 5;
const TOTAL_ROWS = TOTAL_SEATS / SEATS_PER_ROW;

interface SeatMapPreviewProps {
  soldCount?: number;
}

export const SeatMapPreview = ({ soldCount = 0 }: SeatMapPreviewProps) => {
  // Generate seat statuses — fill front rows first (closest to stage = right side)
  const seats = useMemo(() => {
    const result: ('sold' | 'available')[][] = [];
    let remaining = Math.min(soldCount, TOTAL_SEATS);

    for (let row = 0; row < TOTAL_ROWS; row++) {
      const rowSeats: ('sold' | 'available')[] = [];
      for (let seat = 0; seat < SEATS_PER_ROW; seat++) {
        if (remaining > 0) {
          rowSeats.push('sold');
          remaining--;
        } else {
          rowSeats.push('available');
        }
      }
      result.push(rowSeats);
    }
    return result;
  }, [soldCount]);

  const occupancyPct = Math.round((soldCount / TOTAL_SEATS) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Plan de salle — Aperçu remplissage</span>
          <span className="text-sm font-normal text-muted-foreground">
            {soldCount}/{TOTAL_SEATS} places ({occupancyPct}%)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-stretch">
          {/* Seat grid */}
          <div className="flex-1 overflow-x-auto">
            <div className="inline-flex flex-col gap-[3px] min-w-fit">
              {/* Row labels + seats */}
              {seats.map((row, rowIdx) => (
                <div key={rowIdx} className="flex items-center gap-[3px]">
                  <span className="w-6 text-[10px] text-muted-foreground text-right shrink-0">
                    R{rowIdx + 1}
                  </span>
                  {/* Left block (seats 1-5) */}
                  {row.slice(0, SEATS_PER_SIDE).map((status, seatIdx) => (
                    <div
                      key={seatIdx}
                      className={cn(
                        "w-4 h-4 rounded-sm transition-colors",
                        status === 'sold'
                          ? "bg-primary"
                          : "bg-muted border border-border"
                      )}
                      title={`Rang ${rowIdx + 1}, Place ${seatIdx + 1} — ${status === 'sold' ? 'Vendue' : 'Disponible'}`}
                    />
                  ))}
                  {/* Aisle */}
                  <div className="w-3" />
                  {/* Right block (seats 6-10) */}
                  {row.slice(SEATS_PER_SIDE).map((status, seatIdx) => (
                    <div
                      key={seatIdx + SEATS_PER_SIDE}
                      className={cn(
                        "w-4 h-4 rounded-sm transition-colors",
                        status === 'sold'
                          ? "bg-primary"
                          : "bg-muted border border-border"
                      )}
                      title={`Rang ${rowIdx + 1}, Place ${seatIdx + SEATS_PER_SIDE + 1} — ${status === 'sold' ? 'Vendue' : 'Disponible'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Stage indicator (right side) */}
          <div className="flex items-center justify-center">
            <div className="bg-muted border-2 border-primary/30 rounded-lg px-3 py-8 writing-mode-vertical flex items-center justify-center">
              <span
                className="text-xs font-semibold text-primary/70 tracking-widest uppercase"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              >
                SCÈNE
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            Vendue
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
              occupancyPct > 80 ? "bg-destructive" : occupancyPct > 50 ? "bg-primary" : "bg-emerald-500"
            )}
            style={{ width: `${occupancyPct}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SeatMapPreview;
