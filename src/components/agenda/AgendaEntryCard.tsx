import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, User, Home, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AgendaEntry } from '@/types/agenda';

interface Property {
  id: string;
  name: string;
}

interface AgendaEntryCardProps {
  entry: AgendaEntry;
  properties: Property[];
  onClick?: () => void;
  compact?: boolean;
}

export const AgendaEntryCard = ({
  entry,
  properties,
  onClick,
  compact = false,
}: AgendaEntryCardProps) => {
  const linkedProperties = properties.filter(p => 
    entry.linkedPropertyIds.includes(p.id)
  );

  const isMultiDay = !isSameDay(entry.startDate, entry.endDate);
  const hasTime = entry.startTime;

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "p-2 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors",
          "flex items-start gap-2"
        )}
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{entry.title}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            {hasTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {entry.startTime}
                {entry.endTime && ` - ${entry.endTime}`}
              </span>
            )}
            {linkedProperties.length > 0 && (
              <span className="flex items-center gap-1 truncate">
                <Home className="h-3 w-3 flex-shrink-0" />
                {linkedProperties.length === 1 
                  ? linkedProperties[0].name 
                  : `${linkedProperties.length} propriétés`}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-md",
        "border-l-4 border-l-primary/30"
      )}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium">{entry.title}</h4>
          {isMultiDay && (
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {format(entry.startDate, "d MMM", { locale: fr })} - {format(entry.endDate, "d MMM", { locale: fr })}
            </Badge>
          )}
        </div>

        {entry.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {entry.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {hasTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {entry.startTime}
              {entry.endTime && ` - ${entry.endTime}`}
            </span>
          )}

          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {entry.authorName}
          </span>
        </div>

        {linkedProperties.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Home className="h-4 w-4 text-muted-foreground" />
            {linkedProperties.map(property => (
              <Badge key={property.id} variant="secondary" className="text-xs">
                {property.name}
              </Badge>
            ))}
          </div>
        )}

        {entry.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {entry.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
