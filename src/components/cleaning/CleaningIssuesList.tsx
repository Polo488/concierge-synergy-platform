
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Home, User, Calendar, ArrowRight, RefreshCw } from 'lucide-react';
import { CleaningIssue, CleaningIssueType } from '@/types/cleaning';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CleaningIssuesListProps {
  issues: CleaningIssue[];
  onResolve?: (issueId: number) => void;
  onViewRepasseTask?: (taskId: number) => void;
}

const ISSUE_TYPE_LABELS: Record<CleaningIssueType, { label: string; emoji: string }> = {
  dust: { label: 'Poussière', emoji: '🧹' },
  bathroom: { label: 'Salle de bain', emoji: '🚿' },
  linen: { label: 'Linge', emoji: '🛏️' },
  kitchen: { label: 'Cuisine', emoji: '🍳' },
  smell: { label: 'Odeur', emoji: '👃' },
  floors: { label: 'Sols', emoji: '🧽' },
  missing_items: { label: 'Objets manquants', emoji: '📦' },
  windows: { label: 'Vitres', emoji: '🪟' },
  appliances: { label: 'Appareils', emoji: '🔌' },
  damage: { label: 'Dégât', emoji: '💥' },
  guest_complaint: { label: 'Plainte client', emoji: '😤' },
  other: { label: 'Autre', emoji: '📋' },
};

const SOURCE_LABELS = {
  cleaning_task: 'Tâche de ménage',
  reservation: 'Plainte client',
  quality_check: 'Contrôle qualité',
};

export const CleaningIssuesList = ({ issues, onResolve, onViewRepasseTask }: CleaningIssuesListProps) => {
  const openIssues = issues.filter(i => i.status === 'open');
  const resolvedIssues = issues.filter(i => i.status === 'resolved');

  if (issues.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p>Aucun problème signalé</p>
        <p className="text-sm mt-1">Les signalements de problèmes apparaîtront ici</p>
      </div>
    );
  }

  const renderIssueCard = (issue: CleaningIssue) => {
    const typeInfo = ISSUE_TYPE_LABELS[issue.issueType] || { label: 'Autre', emoji: '📋' };
    
    return (
      <Card 
        key={issue.id} 
        className={cn(
          'transition-all',
          issue.status === 'resolved' && 'opacity-60'
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              {/* Header with type and status */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={issue.status === 'open' ? 'destructive' : 'secondary'}>
                  {issue.status === 'open' ? 'Ouvert' : 'Résolu'}
                </Badge>
                <Badge variant="outline">
                  <span className="mr-1">{typeInfo.emoji}</span>
                  {typeInfo.label}
                </Badge>
                {issue.repasseRequired && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Repasse
                  </Badge>
                )}
              </div>

              {/* Property */}
              <div className="flex items-center gap-2 text-sm">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{issue.propertyName}</span>
              </div>

              {/* Agent if available */}
              {issue.linkedAgentName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{issue.linkedAgentName}</span>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {issue.description}
              </p>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(issue.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })}
                </div>
                <span>•</span>
                <span>{SOURCE_LABELS[issue.source]}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {issue.status === 'open' && onResolve && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onResolve(issue.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Résoudre
                </Button>
              )}
              {issue.repasseTaskId && onViewRepasseTask && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onViewRepasseTask(issue.repasseTaskId!)}
                >
                  Voir repasse
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Open issues */}
      {openIssues.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Problèmes ouverts ({openIssues.length})
          </h3>
          <div className="space-y-3">
            {openIssues.map(renderIssueCard)}
          </div>
        </div>
      )}

      {/* Resolved issues */}
      {resolvedIssues.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2 text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
            Problèmes résolus ({resolvedIssues.length})
          </h3>
          <div className="space-y-3">
            {resolvedIssues.map(renderIssueCard)}
          </div>
        </div>
      )}
    </div>
  );
};
