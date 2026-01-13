import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  AlertTriangle, 
  TrendingDown, 
  Calendar, 
  Lock, 
  Check, 
  Archive, 
  Filter,
  X,
  ChevronRight,
  Settings,
  Bell
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { 
  PropertyInsight, 
  InsightType, 
  INSIGHT_TYPE_LABELS, 
  INSIGHT_SEVERITY_CONFIG 
} from '@/types/insights';

interface InsightsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insights: PropertyInsight[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onArchive: (id: string) => void;
  onAction: (action: string, propertyId: number) => void;
  disabledTypes: InsightType[];
  onToggleType: (type: InsightType) => void;
}

const InsightIcon = ({ type }: { type: InsightType }) => {
  switch (type) {
    case 'occupancy':
      return <TrendingDown className="h-4 w-4" />;
    case 'pricing':
      return <span className="text-sm font-bold">€</span>;
    case 'availability':
      return <Calendar className="h-4 w-4" />;
    case 'restriction':
      return <Lock className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

const InsightCard = ({ 
  insight, 
  onMarkAsRead, 
  onArchive, 
  onAction 
}: { 
  insight: PropertyInsight;
  onMarkAsRead: () => void;
  onArchive: () => void;
  onAction: (action: string) => void;
}) => {
  const severityConfig = INSIGHT_SEVERITY_CONFIG[insight.severity];
  const isUnread = insight.status === 'unread';

  return (
    <div className={`p-4 rounded-lg border transition-colors ${
      isUnread ? 'bg-muted/50 border-primary/20' : 'bg-background border-border'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-full ${severityConfig.bgColor} ${severityConfig.color}`}>
            <InsightIcon type={insight.type} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-sm">{insight.title}</h4>
              <Badge variant="outline" className="text-xs">
                {INSIGHT_TYPE_LABELS[insight.type]}
              </Badge>
              {isUnread && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {insight.propertyName}
            </p>
            <p className="text-sm mt-2">{insight.message}</p>
            
            {/* Metric display */}
            <div className="mt-3 p-2 bg-muted/50 rounded-md">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{insight.metricLabel}</span>
                <span className="font-medium">
                  Période: {insight.comparisonPeriod === '7d' ? '7 jours' : 
                           insight.comparisonPeriod === '14d' ? '14 jours' : '30 jours'}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <div>
                  <span className="text-lg font-bold">{insight.metric.propertyValue}</span>
                  <span className="text-xs text-muted-foreground ml-1">ce bien</span>
                </div>
                <span className="text-muted-foreground">vs</span>
                <div>
                  <span className="text-lg font-bold">{insight.metric.portfolioAverage}</span>
                  <span className="text-xs text-muted-foreground ml-1">moyenne</span>
                </div>
                <Badge 
                  variant={insight.metric.difference < 0 ? "destructive" : "secondary"}
                  className="ml-auto"
                >
                  {insight.metric.difference > 0 ? '+' : ''}{insight.metric.differencePercent.toFixed(1)}%
                </Badge>
              </div>
            </div>

            {/* Suggestion */}
            <p className="text-sm text-primary mt-3 font-medium">
              💡 {insight.suggestion}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {insight.actions.map(action => (
                <Button 
                  key={action.id} 
                  variant="outline" 
                  size="sm"
                  onClick={() => onAction(action.action)}
                  className="text-xs"
                >
                  {action.label}
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(insight.createdAt, { addSuffix: true, locale: fr })}
              </span>
              <div className="flex items-center gap-1">
                {isUnread && (
                  <Button variant="ghost" size="sm" onClick={onMarkAsRead} className="h-7 px-2">
                    <Check className="h-3 w-3 mr-1" />
                    <span className="text-xs">Lu</span>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onArchive} className="h-7 px-2">
                  <Archive className="h-3 w-3 mr-1" />
                  <span className="text-xs">Archiver</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function InsightsPanel({
  open,
  onOpenChange,
  insights,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onArchive,
  onAction,
  disabledTypes,
  onToggleType,
}: InsightsPanelProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  
  const filteredInsights = insights.filter(i => {
    if (i.status === 'archived') return false;
    if (disabledTypes.includes(i.type)) return false;
    if (activeTab === 'unread') return i.status === 'unread';
    return true;
  });

  const sortedInsights = [...filteredInsights].sort((a, b) => {
    // Unread first
    if (a.status === 'unread' && b.status !== 'unread') return -1;
    if (a.status !== 'unread' && b.status === 'unread') return 1;
    // Then by severity
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    // Then by date
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <SheetTitle>Insights & Alertes</SheetTitle>
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="flex items-center justify-between mb-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'unread')}>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs px-3">Tous</TabsTrigger>
              <TabsTrigger value="unread" className="text-xs px-3">
                Non lus ({unreadCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-3 w-3 mr-1" />
                  <span className="text-xs">Filtres</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">Types d'alertes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(INSIGHT_TYPE_LABELS) as InsightType[]).map(type => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={!disabledTypes.includes(type)}
                    onCheckedChange={() => onToggleType(type)}
                  >
                    {INSIGHT_TYPE_LABELS[type]}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="h-8">
                <Check className="h-3 w-3 mr-1" />
                <span className="text-xs">Tout marquer lu</span>
              </Button>
            )}
          </div>
        </div>

        <Separator className="mb-4" />

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-3 pr-4">
            {sortedInsights.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune alerte à afficher</p>
              </div>
            ) : (
              sortedInsights.map(insight => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onMarkAsRead={() => onMarkAsRead(insight.id)}
                  onArchive={() => onArchive(insight.id)}
                  onAction={(action) => onAction(action, insight.propertyId)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
