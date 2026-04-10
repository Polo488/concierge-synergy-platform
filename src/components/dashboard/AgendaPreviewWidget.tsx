import { useNavigate } from 'react-router-dom';
import { format, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, Home, ChevronRight, Plus, StickyNote } from 'lucide-react';
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
          "text-[13px] font-bold font-heading",
          isTodaySection ? "text-primary" : "text-muted-foreground"
        )}>
          {title}
        </h4>
        {entries.length > 0 && (
          <span className="text-[11px] font-medium text-primary-foreground rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 bg-primary">
            {entries.length}
          </span>
        )}
      </div>

      {sortedEntries.length === 0 ? (
        <p className="text-sm py-2 text-muted-foreground">
          Aucune note prévue
        </p>
      ) : (
        <div className="space-y-2">
          {sortedEntries.slice(0, 3).map(entry => {
            const propertyNames = getLinkedPropertyNames(entry);

            return (
              <div
                key={entry.id}
                onClick={() => navigate('/app/agenda')}
                className="p-2 rounded-[10px] cursor-pointer transition-colors flex items-start gap-3 border border-border hover:bg-accent/50"
              >
                <div className="p-1.5 rounded-md mt-0.5 bg-accent">
                  <StickyNote className="h-3.5 w-3.5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate font-heading text-foreground">{entry.title}</p>
                  <div className="flex items-center gap-2 text-xs mt-0.5 flex-wrap text-muted-foreground">
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
              onClick={() => navigate('/app/agenda')}
              className="text-xs font-medium w-full text-center py-1 hover:underline text-primary"
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
    <div className="bg-card rounded-2xl p-5 shadow-soft">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[17px] font-bold flex items-center gap-2 font-heading text-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          Agenda
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/agenda')}
            className="gap-1 text-[13px] font-medium text-primary"
          >
            Voir tout
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mb-4 border-b border-border" />

      <div className="space-y-4">
        <DaySection 
          title="Aujourd'hui" 
          entries={todayEntries}
          properties={properties}
          isToday
        />
        
        <div className="pt-4 border-t border-border">
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
            onClick={() => navigate('/app/agenda')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Créer une note
          </Button>
        </div>
      )}
    </div>
  );
};
