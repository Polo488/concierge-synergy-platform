import { PropertyQualityStats } from '@/types/quality';
import { Star, TrendingDown, TrendingUp, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyRankingTableProps {
  properties: PropertyQualityStats[];
  onSelectProperty: (propertyId: string) => void;
}

function ratingClass(rating: number) {
  if (rating >= 4) return 'text-[hsl(var(--status-success))]';
  if (rating >= 3) return 'text-[hsl(var(--status-warning))]';
  return 'text-[hsl(var(--status-error))]';
}

function repasseChip(rate: number) {
  if (rate > 15)
    return 'bg-[hsl(var(--status-error)/0.12)] text-[hsl(var(--status-error))]';
  if (rate > 5)
    return 'bg-[hsl(var(--status-warning)/0.12)] text-[hsl(var(--status-warning))]';
  return 'bg-[hsl(var(--status-success)/0.12)] text-[hsl(var(--status-success))]';
}

export function PropertyRankingTable({ properties, onSelectProperty }: PropertyRankingTableProps) {
  const sortedProperties = [...properties].sort(
    (a, b) => a.average_cleaning_rating_overall - b.average_cleaning_rating_overall
  );

  return (
    <div className="glass-surface rounded-2xl p-4 md:p-5">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <div className="h-7 w-7 rounded-full bg-[hsl(var(--status-error)/0.12)] flex items-center justify-center">
          <TrendingDown className="h-3.5 w-3.5 text-[hsl(var(--status-error))]" strokeWidth={2.2} />
        </div>
        <div>
          <h3 className="text-[15px] md:text-[16px] font-semibold tracking-[-0.015em] text-[hsl(var(--label-1))]">
            Propriétés par note
          </h3>
          <p className="text-[11px] text-[hsl(240_6%_25%/0.6)] tracking-[-0.005em]">
            Triées par ordre croissant
          </p>
        </div>
      </div>

      <ul className="divide-y divide-[hsl(var(--separator))]">
        {sortedProperties.map((property, index) => {
          const trendUp =
            property.average_cleaning_rating_last_30_days > property.average_cleaning_rating_overall;
          return (
            <li key={property.property_id}>
              <button
                onClick={() => onSelectProperty(property.property_id)}
                className="w-full flex items-center gap-3 py-3 text-left transition-colors duration-200 hover:bg-[hsl(var(--ios-orange)/0.04)] active:bg-[hsl(var(--ios-orange)/0.08)] rounded-xl px-2 -mx-2"
              >
                <div className="h-7 w-7 rounded-full bg-[hsl(240_6%_25%/0.06)] flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-semibold text-[hsl(240_6%_25%/0.7)] tabular-nums">
                    {index + 1}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[hsl(var(--label-1))] tracking-[-0.01em] truncate">
                    {property.property_name}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="inline-flex items-center gap-1 text-[12px] text-[hsl(240_6%_25%/0.6)]">
                      {trendUp ? (
                        <TrendingUp className="h-3 w-3 text-[hsl(var(--status-success))]" strokeWidth={2.2} />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-[hsl(var(--status-error))]" strokeWidth={2.2} />
                      )}
                      <span className="tabular-nums">
                        {property.average_cleaning_rating_last_30_days.toFixed(1)} sur 30 j
                      </span>
                    </span>
                    <span className="text-[12px] text-[hsl(240_6%_25%/0.5)] tabular-nums">
                      {property.issues_per_stay.toFixed(2)} pb/séjour
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 text-[15px] font-semibold tabular-nums tracking-[-0.01em]',
                      ratingClass(property.average_cleaning_rating_overall)
                    )}
                  >
                    <Star className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                    {property.average_cleaning_rating_overall.toFixed(1)}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums',
                      repasseChip(property.repasse_rate)
                    )}
                  >
                    {property.repasse_rate.toFixed(0)}%
                  </span>
                  <ChevronRight className="h-4 w-4 text-[hsl(240_6%_25%/0.35)]" strokeWidth={2} />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
