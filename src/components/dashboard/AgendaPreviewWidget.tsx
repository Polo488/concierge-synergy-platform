import { useNavigate } from 'react-router-dom';
import { format, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, Home, ChevronRight, Plus, StickyNote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AgendaEntry } from '@/types/agenda';

interface Property {
  id: string;
  name: string;
}

interface AgendaPreviewWidgetProps {
  todayEntries: AgendaEntry[];
  tomorrowEntries: AgendaEntry[];
  properties: Property[];
}

const DaySection = ({ 
  title, 
  entries, 
  properties,
  isToday: isTodaySection,
}: { 
  title: string; 
  entries: AgendaEntry[];
  properties: Property[];
  isToday?: boolean;
}) => {
  const navigate = useNavigate();

  // Sort entries by time
  const sortedEntries = [...entries].sort((a, b) => {
    if (!a.startTime && !b.startTime) return 0;
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;
    return a.startTime.localeCompare(b.startTime);
  });

  const getLinkedPropertyNames = (entry: AgendaEntry): string[] => {
    return entry.linkedPropertyIds
      .map(id => properties.find(p => p.id === id)?.name)
      .filter((name): name is string => !!name);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className={cn(
          "text-sm font-semibold",
          isTodaySection ? "text-primary" : "text-muted-foreground"
        )}>
          {title}
        </h4>
        {entries.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {entries.length}
          </Badge>
        )}
      </div>

      {sortedEntries.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2">
          Aucune note prévue
        </p>
      ) : (
        <div className="space-y-2">
          {sortedEntries.slice(0, 3).map(entry => {
            const propertyNames = getLinkedPropertyNames(entry);

            return (
              <div
                key={entry.id}
                onClick={() => navigate('/agenda')}
                className={cn(
                  "p-2 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors",
                  "flex items-start gap-3"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-md mt-0.5",
                  "bg-primary/10 text-primary"
                )}>
                  <StickyNote className="h-3.5 w-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{entry.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                    {entry.startTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {entry.startTime}
                        {entry.endTime && ` - ${entry.endTime}`}
                      </span>
                    )}
                    {propertyNames.length > 0 && (
                      <span className="flex items-center gap-1 truncate">
                        <Home className="h-3 w-3 flex-shrink-0" />
                        {propertyNames.length === 1 
                          ? propertyNames[0] 
                          : `${propertyNames.length} propriétés`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {sortedEntries.length > 3 && (
            <button
              onClick={() => navigate('/agenda')}
              className="text-xs text-primary hover:underline w-full text-center py-1"
            >
              +{sortedEntries.length - 3} autres notes
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const AgendaPreviewWidget = ({
  todayEntries,
  tomorrowEntries,
  properties,
}: AgendaPreviewWidgetProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Agenda
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/agenda')}
            className="gap-1"
          >
            Voir tout
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <DaySection 
          title="Aujourd'hui" 
          entries={todayEntries}
          properties={properties}
          isToday
        />
        
        <div className="border-t pt-4">
          <DaySection 
            title="Demain" 
            entries={tomorrowEntries}
            properties={properties}
          />
        </div>
      </div>

      {todayEntries.length === 0 && tomorrowEntries.length === 0 && (
        <div className="text-center py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/agenda')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Créer une note
          </Button>
        </div>
      )}
    </Card>
  );
};
