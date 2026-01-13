import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  MoreHorizontal, 
  Pencil, 
  Copy, 
  Trash2, 
  Play, 
  Pause,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Lock,
  Calendar,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertRule,
  RuleCategory,
  RULE_CATEGORY_LABELS,
  METRIC_LABELS,
  BASELINE_LABELS,
  TIME_WINDOW_LABELS,
  PRIORITY_CONFIG,
} from '@/types/alertRules';

interface RulesTableProps {
  rules: AlertRule[];
  onEdit: (rule: AlertRule) => void;
  onDuplicate: (ruleId: string) => void;
  onDelete: (ruleId: string) => void;
  onToggleEnabled: (ruleId: string) => void;
  onTest: (ruleId: string) => void;
}

const CategoryIcon = ({ category }: { category: RuleCategory }) => {
  switch (category) {
    case 'occupancy':
      return <TrendingDown className="h-4 w-4" />;
    case 'pricing':
      return <DollarSign className="h-4 w-4" />;
    case 'restrictions':
      return <Lock className="h-4 w-4" />;
    case 'availability':
      return <Calendar className="h-4 w-4" />;
    case 'revenue':
      return <BarChart3 className="h-4 w-4" />;
    default:
      return <HelpCircle className="h-4 w-4" />;
  }
};

export function RulesTable({
  rules,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleEnabled,
  onTest,
}: RulesTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpanded = (ruleId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ruleId)) {
        newSet.delete(ruleId);
      } else {
        newSet.add(ruleId);
      }
      return newSet;
    });
  };

  const getThresholdDisplay = (rule: AlertRule) => {
    const operator = rule.thresholdOperator === 'below' ? '<' : '>';
    const suffix = rule.thresholdType === 'relative' ? '%' : '';
    const prefix = rule.thresholdType === 'relative' 
      ? (rule.thresholdOperator === 'below' ? '-' : '+')
      : '';
    return `${operator} ${prefix}${rule.thresholdValue}${suffix}`;
  };

  const getScopeDisplay = (rule: AlertRule) => {
    switch (rule.scope) {
      case 'all':
        return 'Tous les biens';
      case 'selected':
        return `${rule.selectedPropertyIds?.length || 0} bien(s)`;
      case 'group':
        return 'Groupe';
      default:
        return '-';
    }
  };

  const getFrequencyDisplay = (frequency: string) => {
    switch (frequency) {
      case 'realtime':
        return 'Temps réel';
      case 'daily':
        return 'Quotidien';
      case 'weekly':
        return 'Hebdomadaire';
      default:
        return frequency;
    }
  };

  if (rules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <AlertTriangle className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">Aucune règle configurée</p>
        <p className="text-sm">Créez votre première règle d'alerte pour commencer</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-8"></TableHead>
            <TableHead className="w-12">Actif</TableHead>
            <TableHead>Nom de la règle</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Seuil</TableHead>
            <TableHead>Période</TableHead>
            <TableHead>Fréquence</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead className="text-right">Déclenchements</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => {
            const isExpanded = expandedRows.has(rule.id);
            const priorityConfig = PRIORITY_CONFIG[rule.priority];

            return [
              (
                <TableRow 
                  key={rule.id}
                  className={`${!rule.enabled ? 'opacity-60' : ''} hover:bg-muted/30`}
                >
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => toggleRowExpanded(rule.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => onToggleEnabled(rule.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-muted">
                        <CategoryIcon category={rule.category} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{rule.name}</p>
                        {rule.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {rule.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {RULE_CATEGORY_LABELS[rule.category]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {getThresholdDisplay(rule)}
                          </code>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{METRIC_LABELS[rule.metric]} {getThresholdDisplay(rule)}</p>
                          <p className="text-xs text-muted-foreground">
                            vs {BASELINE_LABELS[rule.baseline]}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {TIME_WINDOW_LABELS[rule.timeWindow]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {getFrequencyDisplay(rule.triggerFrequency)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={`${priorityConfig.bgColor} ${priorityConfig.color} border-0`}
                    >
                      {priorityConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-medium">{rule.triggerCount}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onTest(rule.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Tester la règle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(rule)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicate(rule.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDelete(rule.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ),
              /* Expanded row details */
              isExpanded ? (
                <TableRow key={`${rule.id}-details`} className="bg-muted/20">
                    <TableCell colSpan={10} className="p-4">
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                            Configuration
                          </h4>
                          <dl className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Métrique:</dt>
                              <dd>{METRIC_LABELS[rule.metric]}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Référence:</dt>
                              <dd>{BASELINE_LABELS[rule.baseline]}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Scope:</dt>
                              <dd>{getScopeDisplay(rule)}</dd>
                            </div>
                          </dl>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                            Cycle de vie
                          </h4>
                          <dl className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Cooldown:</dt>
                              <dd>{rule.cooldownDays} jours</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Auto-archive:</dt>
                              <dd>{rule.autoArchiveDays} jours</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Biens en pause:</dt>
                              <dd>{rule.snoozedPropertyIds.length}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Biens muets:</dt>
                              <dd>{rule.mutedPropertyIds.length}</dd>
                            </div>
                          </dl>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                            Historique
                          </h4>
                          <dl className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Créée le:</dt>
                              <dd>{format(rule.createdAt, 'dd MMM yyyy', { locale: fr })}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Modifiée le:</dt>
                              <dd>{format(rule.updatedAt, 'dd MMM yyyy', { locale: fr })}</dd>
                            </div>
                            {rule.lastTriggeredAt && (
                              <div className="flex justify-between">
                                <dt className="text-muted-foreground">Dernier déclenchement:</dt>
                                <dd>{format(rule.lastTriggeredAt, 'dd MMM yyyy', { locale: fr })}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      </div>
                      
                      {/* Notification template preview */}
                      <div className="mt-4 p-3 bg-background rounded-lg border">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                          Aperçu de la notification
                        </h4>
                        <p className="font-medium text-sm">{rule.notificationTemplate.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rule.notificationTemplate.message}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null,
              ];
            })}
        </TableBody>
      </Table>
    </div>
  );
}
