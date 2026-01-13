import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Filter, 
  Lightbulb,
  Settings,
  Bell,
  TrendingDown,
  DollarSign,
  Lock,
  Calendar,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RulesTable } from '@/components/insights/RulesTable';
import { RuleBuilderDialog } from '@/components/insights/RuleBuilderDialog';
import { RuleTestDialog } from '@/components/insights/RuleTestDialog';
import { useAlertRules } from '@/hooks/useAlertRules';
import { 
  AlertRule, 
  RuleCategory, 
  RulePriority,
  RULE_CATEGORY_LABELS,
  PRIORITY_CONFIG,
} from '@/types/alertRules';

const InsightsAlertsPage = () => {
  const {
    rules,
    propertyGroups,
    addRule,
    updateRule,
    deleteRule,
    duplicateRule,
    toggleRuleEnabled,
    testRule,
  } = useAlertRules();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<RuleCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [priorityFilter, setPriorityFilter] = useState<RulePriority | 'all'>('all');

  // Dialog states
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [testingRule, setTestingRule] = useState<AlertRule | null>(null);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<'rules' | 'settings'>('rules');

  // Filter rules
  const filteredRules = useMemo(() => {
    let result = [...rules];
    
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(r => r.category === categoryFilter);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(r => r.enabled === (statusFilter === 'enabled'));
    }
    
    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(r => r.priority === priorityFilter);
    }
    
    // Sort by priority then by name
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    result.sort((a, b) => {
      const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (pDiff !== 0) return pDiff;
      return a.name.localeCompare(b.name);
    });
    
    return result;
  }, [rules, searchQuery, categoryFilter, statusFilter, priorityFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: rules.length,
    enabled: rules.filter(r => r.enabled).length,
    disabled: rules.filter(r => !r.enabled).length,
    byCategory: Object.fromEntries(
      (Object.keys(RULE_CATEGORY_LABELS) as RuleCategory[]).map(cat => [
        cat,
        rules.filter(r => r.category === cat).length,
      ])
    ),
    totalTriggers: rules.reduce((sum, r) => sum + r.triggerCount, 0),
  }), [rules]);

  const handleEdit = (rule: AlertRule) => {
    setEditingRule(rule);
    setIsBuilderOpen(true);
  };

  const handleSaveRule = (ruleData: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt' | 'triggerCount'>) => {
    if (editingRule) {
      updateRule(editingRule.id, ruleData);
      toast.success('Règle mise à jour');
    } else {
      addRule(ruleData);
      toast.success('Règle créée');
    }
    setEditingRule(null);
  };

  const handleDelete = (ruleId: string) => {
    deleteRule(ruleId);
    toast.success('Règle supprimée');
  };

  const handleTest = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      setTestingRule(rule);
      setIsTestDialogOpen(true);
    }
  };

  const getCategoryIcon = (category: RuleCategory) => {
    switch (category) {
      case 'occupancy': return TrendingDown;
      case 'pricing': return DollarSign;
      case 'restrictions': return Lock;
      case 'availability': return Calendar;
      case 'revenue': return BarChart3;
      default: return HelpCircle;
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            Insights & Alertes
          </h1>
          <p className="text-muted-foreground">
            Configurez les règles qui génèrent des alertes intelligentes
          </p>
        </div>
        
        <Button onClick={() => { setEditingRule(null); setIsBuilderOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Créer une règle
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total des règles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Règles actives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.enabled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Règles inactives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{stats.disabled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Déclenchements totaux</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalTriggers}</div>
          </CardContent>
        </Card>
        {/* Category breakdown - showing top 2 */}
        {(Object.entries(stats.byCategory) as [RuleCategory, number][])
          .filter(([_, count]) => count > 0)
          .slice(0, 2)
          .map(([category, count]) => {
            const Icon = getCategoryIcon(category);
            return (
              <Card key={category}>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1">
                    <Icon className="h-3 w-3" />
                    {RULE_CATEGORY_LABELS[category]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                </CardContent>
              </Card>
            );
          })
        }
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'rules' | 'settings')}>
        <TabsList>
          <TabsTrigger value="rules" className="gap-2">
            <Bell className="h-4 w-4" />
            Règles d'alertes
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une règle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as RuleCategory | 'all')}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {Object.entries(RULE_CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | 'enabled' | 'disabled')}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="enabled">Actives</SelectItem>
                <SelectItem value="disabled">Inactives</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as RulePriority | 'all')}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
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

            {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all') && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                }}
              >
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Rules table */}
          <RulesTable
            rules={filteredRules}
            onEdit={handleEdit}
            onDuplicate={duplicateRule}
            onDelete={handleDelete}
            onToggleEnabled={toggleRuleEnabled}
            onTest={handleTest}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Global settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Paramètres globaux</CardTitle>
                <CardDescription>
                  Configuration par défaut pour toutes les règles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cooldown par défaut</p>
                    <p className="text-sm text-muted-foreground">
                      Délai avant re-notification pour le même bien
                    </p>
                  </div>
                  <Badge variant="secondary">7 jours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-archivage par défaut</p>
                    <p className="text-sm text-muted-foreground">
                      Délai avant archivage automatique des alertes
                    </p>
                  </div>
                  <Badge variant="secondary">30 jours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Fréquence d'analyse par défaut</p>
                    <p className="text-sm text-muted-foreground">
                      Intervalle de vérification des règles
                    </p>
                  </div>
                  <Badge variant="secondary">Quotidien</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Notification settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>
                  Configuration de l'envoi des notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications in-app</p>
                    <p className="text-sm text-muted-foreground">
                      Afficher dans la cloche de notifications
                    </p>
                  </div>
                  <Badge variant="default">Activé</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications email</p>
                    <p className="text-sm text-muted-foreground">
                      Envoyer un résumé quotidien par email
                    </p>
                  </div>
                  <Badge variant="secondary">Désactivé</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertes critiques immédiates</p>
                    <p className="text-sm text-muted-foreground">
                      Notification immédiate pour les alertes critiques
                    </p>
                  </div>
                  <Badge variant="default">Activé</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Property groups */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Groupes de biens</CardTitle>
                    <CardDescription>
                      Créez des groupes pour appliquer des règles à des ensembles de biens
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nouveau groupe
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {propertyGroups.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Aucun groupe de biens configuré
                  </p>
                ) : (
                  <div className="space-y-3">
                    {propertyGroups.map((group) => (
                      <div 
                        key={group.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{group.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {group.propertyIds.length} bien(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">Modifier</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Rule Builder Dialog */}
      <RuleBuilderDialog
        open={isBuilderOpen}
        onOpenChange={(open) => {
          setIsBuilderOpen(open);
          if (!open) setEditingRule(null);
        }}
        editingRule={editingRule}
        onSave={handleSaveRule}
      />

      {/* Rule Test Dialog */}
      <RuleTestDialog
        open={isTestDialogOpen}
        onOpenChange={setIsTestDialogOpen}
        rule={testingRule}
        onTest={testRule}
      />
    </div>
  );
};

export default InsightsAlertsPage;
