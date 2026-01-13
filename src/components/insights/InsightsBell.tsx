import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PropertyInsight, INSIGHT_SEVERITY_CONFIG } from '@/types/insights';

interface InsightsBellProps {
  insights: PropertyInsight[];
  unreadCount: number;
  onOpenPanel: () => void;
  onMarkAsRead: (id: string) => void;
}

export function InsightsBell({ 
  insights, 
  unreadCount, 
  onOpenPanel,
  onMarkAsRead 
}: InsightsBellProps) {
  const recentInsights = insights
    .filter(i => i.status !== 'archived')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground rounded-full min-w-[18px] h-[18px] text-xs flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-3 border-b flex items-center justify-between">
          <h4 className="font-medium text-sm">Insights & Alertes</h4>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
            </Badge>
          )}
        </div>
        
        <ScrollArea className="max-h-80">
          {recentInsights.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Aucune alerte récente
            </div>
          ) : (
            <div className="divide-y">
              {recentInsights.map(insight => {
                const severityConfig = INSIGHT_SEVERITY_CONFIG[insight.severity];
                return (
                  <button
                    key={insight.id}
                    onClick={() => {
                      if (insight.status === 'unread') {
                        onMarkAsRead(insight.id);
                      }
                      onOpenPanel();
                    }}
                    className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${
                      insight.status === 'unread' ? 'bg-muted/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        insight.status === 'unread' ? 'bg-primary' : 'bg-transparent'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${severityConfig.bgColor} ${severityConfig.color}`}>
                            {insight.severity === 'critical' ? '⚠️' : insight.severity === 'warning' ? '⚡' : 'ℹ️'}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {insight.propertyName}
                          </span>
                        </div>
                        <p className="text-sm font-medium mt-1 line-clamp-1">
                          {insight.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDistanceToNow(insight.createdAt, { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs"
            onClick={onOpenPanel}
          >
            Voir toutes les alertes
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
