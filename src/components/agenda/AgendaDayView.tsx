import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AgendaEntry } from '@/types/agenda';
import { AgendaEntryCard } from './AgendaEntryCard';

interface Property {
  id: string;
  name: string;
}

interface AgendaDayViewProps {
  date: Date;
  entries: AgendaEntry[];
  properties: Property[];
  onEntryClick: (entry: AgendaEntry) => void;
  onAddClick: () => void;
}

export const AgendaDayView = ({
  date,
  entries,
  properties,
  onEntryClick,
  onAddClick,
}: AgendaDayViewProps) => {
  // Sort entries by time
  const sortedEntries = [...entries].sort((a, b) => {
    if (!a.startTime && !b.startTime) return 0;
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {format(date, "EEEE d MMMM yyyy", { locale: fr })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {entries.length} {entries.length === 1 ? 'entrée' : 'entrées'}
          </p>
        </div>
        <Button onClick={onAddClick} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle note
        </Button>
      </div>

      {sortedEntries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Aucune note pour cette date</p>
          <Button variant="link" onClick={onAddClick}>
            Créer une note
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedEntries.map(entry => (
            <AgendaEntryCard
              key={entry.id}
              entry={entry}
              properties={properties}
              onClick={() => onEntryClick(entry)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
