import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertRule,
  RuleCategory,
  MetricType,
  BaselineType,
  TimeWindow,
  TriggerFrequency,
  RulePriority,
  RuleScope,
  SuggestedAction,
  RULE_CATEGORY_LABELS,
  METRIC_LABELS,
  BASELINE_LABELS,
  TIME_WINDOW_LABELS,
  PRIORITY_CONFIG,
  TEMPLATE_VARIABLES,
} from '@/types/alertRules';
import { properties } from '@/hooks/calendar/mockData';
import { Plus, X, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';

interface RuleBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRule?: AlertRule | null;
  onSave: (rule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt' | 'triggerCount'>) => void;
}

const defaultRule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt' | 'triggerCount'> = {
  name: '',
  description: '',
  category: 'occupancy',
  enabled: true,
  priority: 'medium',
  metric: 'occupancy_rate',
  baseline: 'portfolio_average',
  thresholdType: 'relative',
  thresholdValue: 15,
  thresholdOperator: 'below',
  severityThresholds: { warning: 10, critical: 20 },
  timeWindow: '30d',
  timeDirection: 'past',
  triggerFrequency: 'daily',
  scope: 'all',
  selectedPropertyIds: [],
  notificationTemplate: {
    title: '',
    message: '',
    suggestedActions: [],
  },
  cooldownDays: 7,
  autoArchiveDays: 30,
  snoozedPropertyIds: [],
  mutedPropertyIds: [],
};

export function RuleBuilderDialog({
  open,
  onOpenChange,
  editingRule,
  onSave,
}: RuleBuilderDialogProps) {
  const [rule, setRule] = useState(defaultRule);
  const [activeTab, setActiveTab] = useState('basics');

  useEffect(() => {
    if (editingRule) {
      setRule({
        name: editingRule.name,
        description: editingRule.description,
        category: editingRule.category,
        enabled: editingRule.enabled,
        priority: editingRule.priority,
        metric: editingRule.metric,
        baseline: editingRule.baseline,
        customGroupId: editingRule.customGroupId,
        thresholdType: editingRule.thresholdType,
        thresholdValue: editingRule.thresholdValue,
        thresholdOperator: editingRule.thresholdOperator,
        severityThresholds: editingRule.severityThresholds,
        timeWindow: editingRule.timeWindow,
        timeDirection: editingRule.timeDirection,
        customStartDate: editingRule.customStartDate,
        customEndDate: editingRule.customEndDate,
        triggerFrequency: editingRule.triggerFrequency,
        scope: editingRule.scope,
        selectedPropertyIds: editingRule.selectedPropertyIds,
        propertyGroupId: editingRule.propertyGroupId,
        notificationTemplate: editingRule.notificationTemplate,
        cooldownDays: editingRule.cooldownDays,
        autoArchiveDays: editingRule.autoArchiveDays,
        snoozedPropertyIds: editingRule.snoozedPropertyIds,
        mutedPropertyIds: editingRule.mutedPropertyIds,
      });
    } else {
      setRule(defaultRule);
    }
    setActiveTab('basics');
  }, [editingRule, open]);

  const handleSave = () => {
    onSave(rule);
    onOpenChange(false);
  };

  const updateRule = (updates: Partial<typeof rule>) => {
    setRule(prev => ({ ...prev, ...updates }));
  };

  const updateNotificationTemplate = (updates: Partial<typeof rule.notificationTemplate>) => {
    setRule(prev => ({
      ...prev,
      notificationTemplate: { ...prev.notificationTemplate, ...updates },
    }));
  };

  const addSuggestedAction = () => {
    const newAction: SuggestedAction = {
      id: `action-${Date.now()}`,
      label: 'Nouvelle action',
      actionType: 'open_pricing',
    };
    updateNotificationTemplate({
      suggestedActions: [...rule.notificationTemplate.suggestedActions, newAction],
    });
  };

  const removeSuggestedAction = (actionId: string) => {
    updateNotificationTemplate({
      suggestedActions: rule.notificationTemplate.suggestedActions.filter(a => a.id !== actionId),
    });
  };

  const updateSuggestedAction = (actionId: string, updates: Partial<SuggestedAction>) => {
    updateNotificationTemplate({
      suggestedActions: rule.notificationTemplate.suggestedActions.map(a =>
        a.id === actionId ? { ...a, ...updates } : a
      ),
    });
  };

  const togglePropertySelection = (propertyId: number) => {
    const current = rule.selectedPropertyIds || [];
    const updated = current.includes(propertyId)
      ? current.filter(id => id !== propertyId)
      : [...current, propertyId];
    updateRule({ selectedPropertyIds: updated });
  };

  const insertVariable = (variable: string, field: 'title' | 'message') => {
    const current = field === 'title' 
      ? rule.notificationTemplate.title 
      : rule.notificationTemplate.message;
    updateNotificationTemplate({
      [field]: current + variable,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {editingRule ? 'Modifier la règle' : 'Créer une nouvelle règle'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="basics">Général</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="notification">Notification</TabsTrigger>
            <TabsTrigger value="lifecycle">Cycle de vie</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4 pr-4">
            {/* Basics Tab */}
            <TabsContent value="basics" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom de la règle *</Label>
                  <Input
                    id="name"
                    value={rule.name}
                    onChange={(e) => updateRule({ name: e.target.value })}
                    placeholder="Ex: Occupation basse vs portefeuille"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={rule.description || ''}
                    onChange={(e) => updateRule({ description: e.target.value })}
                    placeholder="Description optionnelle de la règle..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Catégorie</Label>
                    <Select 
                      value={rule.category} 
                      onValueChange={(v) => updateRule({ category: v as RuleCategory })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(RULE_CATEGORY_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Priorité</Label>
                    <Select 
                      value={rule.priority} 
                      onValueChange={(v) => updateRule({ priority: v as RulePriority })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${config.bgColor}`} />
                              {config.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <Label>Règle activée</Label>
                    <p className="text-xs text-muted-foreground">
                      Les règles désactivées ne génèrent pas d'alertes
                    </p>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) => updateRule({ enabled: checked })}
                  />
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Label>Scope</Label>
                  <Select 
                    value={rule.scope} 
                    onValueChange={(v) => updateRule({ scope: v as RuleScope })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les biens</SelectItem>
                      <SelectItem value="selected">Biens sélectionnés</SelectItem>
                      <SelectItem value="group">Groupe de biens</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {rule.scope === 'selected' && (
                  <div className="grid gap-2">
                    <Label>Sélectionner les biens</Label>
                    <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                      {properties.map((property) => (
                        <div key={property.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`property-${property.id}`}
                            checked={rule.selectedPropertyIds?.includes(property.id)}
                            onCheckedChange={() => togglePropertySelection(property.id)}
                          />
                          <label 
                            htmlFor={`property-${property.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {property.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Conditions Tab */}
            <TabsContent value="conditions" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Métrique</Label>
                  <Select 
                    value={rule.metric} 
                    onValueChange={(v) => updateRule({ metric: v as MetricType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(METRIC_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Référence de comparaison</Label>
                  <Select 
                    value={rule.baseline} 
                    onValueChange={(v) => updateRule({ baseline: v as BaselineType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(BASELINE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Label>Type de seuil</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={rule.thresholdType === 'relative' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateRule({ thresholdType: 'relative' })}
                    >
                      Relatif (%)
                    </Button>
                    <Button
                      variant={rule.thresholdType === 'absolute' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateRule({ thresholdType: 'absolute' })}
                    >
                      Absolu
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Opérateur</Label>
                    <Select 
                      value={rule.thresholdOperator} 
                      onValueChange={(v) => updateRule({ thresholdOperator: v as 'above' | 'below' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="below">En dessous de</SelectItem>
                        <SelectItem value="above">Au-dessus de</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Valeur du seuil</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={rule.thresholdValue}
                        onChange={(e) => updateRule({ thresholdValue: parseFloat(e.target.value) || 0 })}
                      />
                      {rule.thresholdType === 'relative' && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          %
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Label>Seuils de sévérité</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Définissez des seuils pour classifier la sévérité des alertes
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-amber-600">Avertissement (%)</Label>
                      <Input
                        type="number"
                        value={rule.severityThresholds?.warning || 10}
                        onChange={(e) => updateRule({
                          severityThresholds: {
                            ...rule.severityThresholds!,
                            warning: parseFloat(e.target.value) || 0,
                          },
                        })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-red-600">Critique (%)</Label>
                      <Input
                        type="number"
                        value={rule.severityThresholds?.critical || 20}
                        onChange={(e) => updateRule({
                          severityThresholds: {
                            ...rule.severityThresholds!,
                            critical: parseFloat(e.target.value) || 0,
                          },
                        })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Fenêtre temporelle</Label>
                    <Select 
                      value={rule.timeWindow} 
                      onValueChange={(v) => updateRule({ timeWindow: v as TimeWindow })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(TIME_WINDOW_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Direction</Label>
                    <Select 
                      value={rule.timeDirection} 
                      onValueChange={(v) => updateRule({ timeDirection: v as 'past' | 'future' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="past">Passé (derniers X jours)</SelectItem>
                        <SelectItem value="future">Futur (prochains X jours)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Fréquence de déclenchement</Label>
                  <Select 
                    value={rule.triggerFrequency} 
                    onValueChange={(v) => updateRule({ triggerFrequency: v as TriggerFrequency })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Temps réel</SelectItem>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Notification Tab */}
            <TabsContent value="notification" className="space-y-4">
              <div className="grid gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-xs text-muted-foreground uppercase">
                    Variables disponibles
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {TEMPLATE_VARIABLES.map((v) => (
                      <TooltipProvider key={v.key}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant="outline" 
                              className="cursor-pointer hover:bg-primary/10"
                              onClick={() => insertVariable(v.key, 'message')}
                            >
                              {v.key}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{v.label}</p>
                            <p className="text-xs text-muted-foreground">Ex: {v.example}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Titre de la notification *</Label>
                  <Input
                    value={rule.notificationTemplate.title}
                    onChange={(e) => updateNotificationTemplate({ title: e.target.value })}
                    placeholder="Ex: Taux d'occupation bas détecté"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Message de la notification *</Label>
                  <Textarea
                    value={rule.notificationTemplate.message}
                    onChange={(e) => updateNotificationTemplate({ message: e.target.value })}
                    placeholder="Utilisez les variables ci-dessus..."
                    rows={4}
                  />
                </div>

                <Separator />

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Actions suggérées</Label>
                    <Button variant="outline" size="sm" onClick={addSuggestedAction}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {rule.notificationTemplate.suggestedActions.map((action) => (
                      <div key={action.id} className="flex items-center gap-2 p-2 border rounded-lg">
                        <Input
                          value={action.label}
                          onChange={(e) => updateSuggestedAction(action.id, { label: e.target.value })}
                          placeholder="Libellé du bouton"
                          className="flex-1"
                        />
                        <Select
                          value={action.actionType}
                          onValueChange={(v) => updateSuggestedAction(action.id, { actionType: v as SuggestedAction['actionType'] })}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open_pricing">Calendrier tarifaire</SelectItem>
                            <SelectItem value="open_rules">Gestionnaire de règles</SelectItem>
                            <SelectItem value="open_availability">Vue disponibilité</SelectItem>
                            <SelectItem value="open_property">Fiche du bien</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSuggestedAction(action.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Lifecycle Tab */}
            <TabsContent value="lifecycle" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Label>Période de cooldown</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Ne pas re-notifier pour le même bien pendant X jours
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        value={rule.cooldownDays}
                        onChange={(e) => updateRule({ cooldownDays: parseInt(e.target.value) || 0 })}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        jours
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Label>Auto-archivage</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Archiver automatiquement les alertes après X jours
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        value={rule.autoArchiveDays}
                        onChange={(e) => updateRule({ autoArchiveDays: parseInt(e.target.value) || 0 })}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        jours
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Gestion des conflits</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Si plusieurs règles déclenchent des alertes pour le même bien au même moment :
                  </p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Les alertes sont ordonnées par priorité (haute → basse)</li>
                    <li>• Les alertes similaires sont fusionnées</li>
                    <li>• La période de cooldown empêche la duplication</li>
                  </ul>
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Label>Biens en pause (snooze)</Label>
                  <p className="text-xs text-muted-foreground">
                    Les alertes sont temporairement suspendues pour ces biens
                  </p>
                  <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
                    {rule.snoozedPropertyIds.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucun bien en pause</p>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {rule.snoozedPropertyIds.map((id) => {
                          const property = properties.find(p => p.id === id);
                          return (
                            <Badge key={id} variant="secondary">
                              {property?.name || `Bien #${id}`}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Biens muets</Label>
                  <p className="text-xs text-muted-foreground">
                    Cette règle ne s'applique jamais à ces biens
                  </p>
                  <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
                    {rule.mutedPropertyIds.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucun bien muet</p>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {rule.mutedPropertyIds.map((id) => {
                          const property = properties.find(p => p.id === id);
                          return (
                            <Badge key={id} variant="outline">
                              {property?.name || `Bien #${id}`}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={!rule.name || !rule.notificationTemplate.title}>
            {editingRule ? 'Enregistrer' : 'Créer la règle'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
