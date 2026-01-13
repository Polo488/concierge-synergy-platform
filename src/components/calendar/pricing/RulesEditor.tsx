import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ChevronDown, 
  ChevronRight,
  Calendar,
  Hash,
  Percent,
  Ban,
  Tag,
  Filter,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { PricingRule, RuleType, PromotionType, Channel } from '@/types/pricing';
import type { CalendarProperty } from '@/types/calendar';
import { RULE_TYPE_LABELS, PROMOTION_LABELS } from '@/types/pricing';

interface RulesEditorProps {
  rules: PricingRule[];
  properties: CalendarProperty[];
  onAddRule: (rule: Omit<PricingRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateRule: (id: string, updates: Partial<PricingRule>) => void;
  onDeleteRule: (id: string) => void;
  onDuplicateRule: (id: string, targetPropertyIds: number[]) => void;
  onApplyToAll: (ruleId: string) => void;
}

const RULE_ICONS: Record<RuleType, React.ReactNode> = {
  min_stay: <Hash className="w-4 h-4" />,
  max_stay: <Hash className="w-4 h-4" />,
  closing_block: <Ban className="w-4 h-4" />,
  channel_restriction: <Filter className="w-4 h-4" />,
  promotion: <Tag className="w-4 h-4" />,
  price_override: <Percent className="w-4 h-4" />,
};

export const RulesEditor: React.FC<RulesEditorProps> = ({
  rules,
  properties,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
  onDuplicateRule,
  onApplyToAll,
}) => {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [isNewRuleDialogOpen, setIsNewRuleDialogOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<PricingRule>>({
    type: 'min_stay',
    enabled: true,
    priority: 10,
    propertyId: 'all',
  });

  const toggleExpand = (ruleId: string) => {
    setExpandedRules(prev => {
      const next = new Set(prev);
      if (next.has(ruleId)) {
        next.delete(ruleId);
      } else {
        next.add(ruleId);
      }
      return next;
    });
  };

  const handleCreateRule = () => {
    if (newRule.name && newRule.type) {
      onAddRule(newRule as Omit<PricingRule, 'id' | 'createdAt' | 'updatedAt'>);
      setIsNewRuleDialogOpen(false);
      setNewRule({
        type: 'min_stay',
        enabled: true,
        priority: 10,
        propertyId: 'all',
      });
    }
  };

  const getPropertyName = (propertyId: number | 'all') => {
    if (propertyId === 'all') return 'Tous les logements';
    const property = properties.find(p => p.id === propertyId);
    return property?.name || 'Logement inconnu';
  };

  // Group rules by type
  const rulesByType = rules.reduce((acc, rule) => {
    if (!acc[rule.type]) acc[rule.type] = [];
    acc[rule.type].push(rule);
    return acc;
  }, {} as Record<RuleType, PricingRule[]>);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Règles de tarification</h3>
            <p className="text-sm text-muted-foreground">
              {rules.length} règle{rules.length > 1 ? 's' : ''} configurée{rules.length > 1 ? 's' : ''}
            </p>
          </div>
          <Dialog open={isNewRuleDialogOpen} onOpenChange={setIsNewRuleDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Nouvelle règle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Créer une règle</DialogTitle>
                <DialogDescription>
                  Définissez une nouvelle règle de tarification ou restriction
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nom de la règle</Label>
                  <Input
                    placeholder="Ex: Minimum 3 nuits été"
                    value={newRule.name || ''}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type de règle</Label>
                  <Select
                    value={newRule.type}
                    onValueChange={(value: RuleType) => setNewRule({ ...newRule, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(RULE_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            {RULE_ICONS[value as RuleType]}
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Appliquer à</Label>
                  <Select
                    value={newRule.propertyId?.toString() || 'all'}
                    onValueChange={(value) => setNewRule({ 
                      ...newRule, 
                      propertyId: value === 'all' ? 'all' : parseInt(value) 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les logements</SelectItem>
                      {properties.map(property => (
                        <SelectItem key={property.id} value={property.id.toString()}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic fields based on type */}
                {(newRule.type === 'min_stay' || newRule.type === 'max_stay') && (
                  <div className="space-y-2">
                    <Label>Nombre de nuits</Label>
                    <Input
                      type="number"
                      min={1}
                      value={newRule.type === 'min_stay' ? newRule.minStay : newRule.maxStay || ''}
                      onChange={(e) => setNewRule({ 
                        ...newRule, 
                        [newRule.type === 'min_stay' ? 'minStay' : 'maxStay']: parseInt(e.target.value) 
                      })}
                    />
                  </div>
                )}

                {(newRule.type === 'price_override' || newRule.type === 'promotion') && (
                  <div className="space-y-2">
                    <Label>Ajustement de prix (%)</Label>
                    <Input
                      type="number"
                      placeholder="-10 pour -10%, 15 pour +15%"
                      value={newRule.priceAdjustment || ''}
                      onChange={(e) => setNewRule({ ...newRule, priceAdjustment: parseInt(e.target.value) })}
                    />
                  </div>
                )}

                {newRule.type === 'promotion' && (
                  <div className="space-y-2">
                    <Label>Type de promotion</Label>
                    <Select
                      value={newRule.promotionType}
                      onValueChange={(value: PromotionType) => setNewRule({ ...newRule, promotionType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PROMOTION_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Priorité (plus élevé = prioritaire)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={newRule.priority || 10}
                    onChange={(e) => setNewRule({ ...newRule, priority: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewRuleDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateRule} disabled={!newRule.name}>
                  Créer la règle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Rules list grouped by type */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {Object.entries(rulesByType).map(([type, typeRules]) => (
          <div key={type} className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {RULE_ICONS[type as RuleType]}
              <span>{RULE_TYPE_LABELS[type as RuleType]}</span>
              <Badge variant="secondary" className="ml-auto">{typeRules.length}</Badge>
            </div>
            
            <div className="space-y-2">
              {typeRules.map((rule) => (
                <Collapsible
                  key={rule.id}
                  open={expandedRules.has(rule.id)}
                  onOpenChange={() => toggleExpand(rule.id)}
                >
                  <div className={cn(
                    "border rounded-lg transition-colors",
                    rule.enabled ? "border-border" : "border-muted bg-muted/30"
                  )}>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50">
                        {expandedRules.has(rule.id) ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-medium text-sm truncate",
                              !rule.enabled && "text-muted-foreground"
                            )}>
                              {rule.name}
                            </span>
                            {!rule.enabled && (
                              <Badge variant="outline" className="text-xs">Désactivée</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {getPropertyName(rule.propertyId)}
                          </p>
                        </div>

                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(checked) => onUpdateRule(rule.id, { enabled: checked })}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-3 pb-3 pt-0 space-y-3 border-t">
                        <div className="grid grid-cols-2 gap-3 pt-3">
                          {rule.minStay && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Min. nuits</Label>
                              <p className="font-medium">{rule.minStay}</p>
                            </div>
                          )}
                          {rule.maxStay && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Max. nuits</Label>
                              <p className="font-medium">{rule.maxStay}</p>
                            </div>
                          )}
                          {rule.priceAdjustment && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Ajustement</Label>
                              <p className="font-medium">
                                {rule.priceAdjustment > 0 ? '+' : ''}{rule.priceAdjustment}%
                              </p>
                            </div>
                          )}
                          {rule.promotionType && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Type promo</Label>
                              <p className="font-medium">{PROMOTION_LABELS[rule.promotionType]}</p>
                            </div>
                          )}
                          {rule.channels && rule.channels.length > 0 && (
                            <div className="col-span-2">
                              <Label className="text-xs text-muted-foreground">Canaux</Label>
                              <div className="flex gap-1 mt-1">
                                {rule.channels.map(channel => (
                                  <Badge key={channel} variant="secondary" className="text-xs">
                                    {channel}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {rule.startDate && rule.endDate && (
                            <div className="col-span-2">
                              <Label className="text-xs text-muted-foreground">Période</Label>
                              <p className="font-medium text-sm">
                                {format(rule.startDate, 'd MMM', { locale: fr })} - {format(rule.endDate, 'd MMM yyyy', { locale: fr })}
                              </p>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => onApplyToAll(rule.id)}
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Appliquer à tous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const otherPropertyIds = properties
                                .filter(p => p.id !== rule.propertyId)
                                .map(p => p.id);
                              onDuplicateRule(rule.id, otherPropertyIds);
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => onDeleteRule(rule.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </div>
        ))}

        {rules.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune règle configurée</p>
            <p className="text-sm">Créez votre première règle pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
};
