
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  Sparkles, 
  Clock, 
  CalendarPlus, 
  ExternalLink,
  MessageSquare 
} from 'lucide-react';
import { LinkedOperationalTask } from '@/types/operations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface LinkedTasksListProps {
  tasks: LinkedOperationalTask[];
  onViewTask?: (task: LinkedOperationalTask) => void;
  onViewConversation?: (conversationId: string) => void;
  showConversationLink?: boolean;
  compact?: boolean;
}

const getTaskIcon = (type: LinkedOperationalTask['type']) => {
  switch (type) {
    case 'maintenance':
      return <Wrench className="h-3.5 w-3.5" />;
    case 'cleaning_issue':
      return <Sparkles className="h-3.5 w-3.5" />;
    case 'repasse':
      return <Clock className="h-3.5 w-3.5" />;
    case 'agenda_note':
      return <CalendarPlus className="h-3.5 w-3.5" />;
    default:
      return null;
  }
};

const getTaskTypeLabel = (type: LinkedOperationalTask['type']) => {
  switch (type) {
    case 'maintenance':
      return 'Maintenance';
    case 'cleaning_issue':
      return 'Problème';
    case 'repasse':
      return 'Repasse';
    case 'agenda_note':
      return 'Note';
    default:
      return type;
  }
};

const getSourceBadge = (source: LinkedOperationalTask['source']) => {
  if (source === 'guest_message') {
    return (
      <Badge variant="outline" className="text-xs gap-1">
        <MessageSquare className="h-2.5 w-2.5" />
        Voyageur
      </Badge>
    );
  }
  return null;
};

export const LinkedTasksList: React.FC<LinkedTasksListProps> = ({
  tasks,
  onViewTask,
  onViewConversation,
  showConversationLink = false,
  compact = false,
}) => {
  if (tasks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Aucune tâche liée
      </p>
    );
  }

  return (
    <div className={cn('space-y-2', compact && 'space-y-1')}>
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            'flex items-start justify-between p-2 bg-muted rounded-lg text-sm',
            compact && 'p-1.5'
          )}
        >
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="mt-0.5 text-muted-foreground">
              {getTaskIcon(task.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium truncate">{task.title}</span>
                {getSourceBadge(task.source)}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>{task.propertyName}</span>
                <span>•</span>
                <span>{format(task.createdAt, 'dd/MM HH:mm', { locale: fr })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <Badge 
              variant="outline" 
              className={cn(
                'text-xs whitespace-nowrap',
                task.status === 'En attente' && 'bg-yellow-50 text-yellow-700 border-yellow-200',
                task.status === 'Ouvert' && 'bg-red-50 text-red-700 border-red-200',
                task.status === 'Planifiée' && 'bg-blue-50 text-blue-700 border-blue-200',
                task.status === 'Terminée' && 'bg-green-50 text-green-700 border-green-200'
              )}
            >
              {task.status}
            </Badge>
            
            {task.canNavigateToTask && onViewTask && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onViewTask(task)}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
            
            {showConversationLink && task.canNavigateToConversation && onViewConversation && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onViewConversation(task.conversationId)}
              >
                <MessageSquare className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
