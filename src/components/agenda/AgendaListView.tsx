import { format, isToday, isTomorrow, isPast, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AgendaEntry } from '@/types/agenda';
import { AgendaEntryCard } from './AgendaEntryCard';

interface Property {
  id: string;
  name: string;
}

interface AgendaListViewProps {
  entries: AgendaEntry[];
  properties: Property[];
  onEntryClick: (entry: AgendaEntry) => void;
  onAddClick: () => void;
}

interface GroupedEntries {
  date: Date;
  label: string;
  entries: AgendaEntry[];
}

export const AgendaListView = ({
  entries,
  properties,
  onEntryClick,
  onAddClick,
}: AgendaListViewProps) => {
  // Group entries by start date
  const groupedEntries = entries.reduce((groups, entry) => {
    const dateKey = format(entry.startDate, 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(entry);
    return groups;
  }, {} as Record<string, AgendaEntry[]>);

  // Convert to array and sort
  const sortedGroups: GroupedEntries[] = Object.entries(groupedEntries)
    .map(([dateKey, entries]) => {
      const date = new Date(dateKey);
      let label = format(date, "EEEE d MMMM yyyy", { locale: fr });
      if (isToday(date)) label = "Aujourd'hui";
      else if (isTomorrow(date)) label = "Demain";
      
      return {
        date,
        label,
        entries: entries.sort((a, b) => {
          if (!a.startTime && !b.startTime) return 0;
          if (!a.startTime) return 1;
          if (!b.startTime) return -1;
          return a.startTime.localeCompare(b.startTime);
        }),
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const today = startOfDay(new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Liste chronologique</h2>
          <p className="text-sm text-muted-foreground">
            {entries.length} {entries.length === 1 ? 'entrée' : 'entrées'}
          </p>
        </div>
        <Button onClick={onAddClick} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle note
        </Button>
      </div>

      {sortedGroups.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Aucune note à afficher</p>
          <Button variant="link" onClick={onAddClick}>
            Créer une note
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedGroups.map(group => {
            const isPastDate = group.date < today && !isToday(group.date);

            return (
              <div key={group.date.toISOString()} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className={cn(
                    "font-medium capitalize",
                    isPastDate && "text-muted-foreground"
                  )}>
                    {group.label}
                  </h3>
                  {isToday(group.date) && (
                    <Badge variant="default" className="text-xs">
                      Aujourd'hui
                    </Badge>
                  )}
                  {isTomorrow(group.date) && (
                    <Badge variant="secondary" className="text-xs">
                      Demain
                    </Badge>
                  )}
                  {isPastDate && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      Passé
                    </Badge>
                  )}
                </div>

                <div className={cn(
                  "space-y-2 pl-4 border-l-2",
                  isToday(group.date) ? "border-primary" : "border-border"
                )}>
                  {group.entries.map(entry => (
                    <AgendaEntryCard
                      key={entry.id}
                      entry={entry}
                      properties={properties}
                      onClick={() => onEntryClick(entry)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
