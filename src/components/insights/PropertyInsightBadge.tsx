import { AlertTriangle, TrendingDown, Calendar, Lock } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { PropertyInsight, InsightType, INSIGHT_SEVERITY_CONFIG } from '@/types/insights';

interface PropertyInsightBadgeProps {
  insights: PropertyInsight[];
  compact?: boolean;
  onClick?: () => void;
}

const InsightIcon = ({ type, className }: { type: InsightType; className?: string }) => {
  switch (type) {
    case 'occupancy':
      return <TrendingDown className={className} />;
    case 'pricing':
      return <span className={`font-bold ${className}`}>€</span>;
    case 'availability':
      return <Calendar className={className} />;
    case 'restriction':
      return <Lock className={className} />;
    default:
      return <AlertTriangle className={className} />;
  }
};

export function PropertyInsightBadge({ insights, compact = false, onClick }: PropertyInsightBadgeProps) {
  if (insights.length === 0) return null;

  // Get the most severe insight
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  const sortedInsights = [...insights].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );
  const mostSevere = sortedInsights[0];
  const severityConfig = INSIGHT_SEVERITY_CONFIG[mostSevere.severity];

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={onClick}
              className={`p-1 rounded-full ${severityConfig.bgColor} ${severityConfig.color} hover:opacity-80 transition-opacity`}
            >
              <AlertTriangle className="h-3 w-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-2">
              {sortedInsights.slice(0, 3).map(insight => (
                <div key={insight.id} className="text-xs">
                  <div className="font-medium">{insight.title}</div>
                  <div className="text-muted-foreground">{insight.suggestion}</div>
                </div>
              ))}
              {insights.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{insights.length - 3} autre(s) alerte(s)
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={onClick}
            className="flex items-center gap-1"
          >
            <Badge 
              variant="outline" 
              className={`${severityConfig.bgColor} ${severityConfig.color} border-0 gap-1`}
            >
              <AlertTriangle className="h-3 w-3" />
              {insights.length} alerte{insights.length > 1 ? 's' : ''}
            </Badge>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-sm">
          <div className="space-y-2">
            {sortedInsights.map(insight => (
              <div key={insight.id} className="text-xs border-b last:border-0 pb-2 last:pb-0">
                <div className="flex items-center gap-1">
                  <InsightIcon type={insight.type} className="h-3 w-3" />
                  <span className="font-medium">{insight.title}</span>
                </div>
                <div className="text-muted-foreground mt-0.5">{insight.suggestion}</div>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
