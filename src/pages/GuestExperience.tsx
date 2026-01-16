
import { useState } from 'react';
import { 
  MessageSquare, 
  Zap, 
  FileText, 
  Gift, 
  History, 
  Settings,
  TrendingUp
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagingRulesList } from '@/components/guest-experience/MessagingRulesList';
import { RuleBuilderDialog } from '@/components/guest-experience/RuleBuilderDialog';
import { MessageTemplatesList } from '@/components/guest-experience/MessageTemplatesList';
import { UpsellOffersList } from '@/components/guest-experience/UpsellOffersList';
import { MessageLogsList } from '@/components/guest-experience/MessageLogsList';
import { GuestExperienceSettings } from '@/components/guest-experience/GuestExperienceSettings';
import { useGuestExperience } from '@/hooks/useGuestExperience';
import { MessagingRule, MessageTemplate, UpsellOffer } from '@/types/guestExperience';
import { toast } from 'sonner';

export default function GuestExperience() {
  const [activeTab, setActiveTab] = useState('rules');
  const [isRuleBuilderOpen, setIsRuleBuilderOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<MessagingRule | null>(null);
  
  const {
    rules,
    templates,
    upsells,
    logs,
    settings,
    stats,
    createRule,
    updateRule,
    deleteRule,
    toggleRuleStatus,
    duplicateRule,
    deleteTemplate,
    deleteUpsell,
    toggleUpsellStatus,
    updateSettings,
  } = useGuestExperience();

  const handleCreateRule = () => {
    setEditingRule(null);
    setIsRuleBuilderOpen(true);
  };

  const handleEditRule = (rule: MessagingRule) => {
    setEditingRule(rule);
    setIsRuleBuilderOpen(true);
  };

  const handleSaveRule = (ruleData: Omit<MessagingRule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount'>) => {
    if (editingRule) {
      updateRule(editingRule.id, ruleData);
      toast.success('Règle mise à jour');
    } else {
      createRule(ruleData);
      toast.success('Règle créée');
    }
  };

  const handleDeleteRule = (id: string) => {
    deleteRule(id);
    toast.success('Règle supprimée');
  };

  const handleDuplicateRule = (id: string) => {
    duplicateRule(id);
    toast.success('Règle dupliquée');
  };

  const handleToggleRuleStatus = (id: string) => {
    toggleRuleStatus(id);
    const rule = rules.find(r => r.id === id);
    toast.success(rule?.status === 'active' ? 'Règle désactivée' : 'Règle activée');
  };

  const handleCreateTemplate = () => {
    toast.info('Éditeur de modèle à venir');
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    toast.info('Éditeur de modèle à venir');
  };

  const handleDeleteTemplate = (id: string) => {
    deleteTemplate(id);
    toast.success('Modèle supprimé');
  };

  const handleCreateUpsell = () => {
    toast.info('Éditeur d\'offre à venir');
  };

  const handleEditUpsell = (upsell: UpsellOffer) => {
    toast.info('Éditeur d\'offre à venir');
  };

  const handleDeleteUpsell = (id: string) => {
    deleteUpsell(id);
    toast.success('Offre supprimée');
  };

  const handleToggleUpsellStatus = (id: string) => {
    toggleUpsellStatus(id);
    const upsell = upsells.find(u => u.id === id);
    toast.success(upsell?.isActive ? 'Offre désactivée' : 'Offre activée');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            Communication Intelligente
          </h1>
          <p className="text-muted-foreground mt-1">
            Automatisez et personnalisez toutes vos communications avec les voyageurs
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Règles actives</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRules}</div>
            <p className="text-xs text-muted-foreground">
              sur {stats.totalRules} règles
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages envoyés</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSent}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalFailed} échecs, {stats.totalSkipped} ignorés
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modèles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTemplates}</div>
            <p className="text-xs text-muted-foreground">
              modèles actifs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Upsell</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upsellRevenue}€</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUpsells} offres actives
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Règles</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Modèles</span>
          </TabsTrigger>
          <TabsTrigger value="upsells" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">Upsells</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Historique</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Paramètres</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <MessagingRulesList
            rules={rules}
            onCreateRule={handleCreateRule}
            onEditRule={handleEditRule}
            onDeleteRule={handleDeleteRule}
            onDuplicateRule={handleDuplicateRule}
            onToggleStatus={handleToggleRuleStatus}
          />
        </TabsContent>

        <TabsContent value="templates">
          <MessageTemplatesList
            templates={templates}
            onCreateTemplate={handleCreateTemplate}
            onEditTemplate={handleEditTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        </TabsContent>

        <TabsContent value="upsells">
          <UpsellOffersList
            upsells={upsells}
            onCreateUpsell={handleCreateUpsell}
            onEditUpsell={handleEditUpsell}
            onDeleteUpsell={handleDeleteUpsell}
            onToggleStatus={handleToggleUpsellStatus}
          />
        </TabsContent>

        <TabsContent value="logs">
          <MessageLogsList logs={logs} />
        </TabsContent>

        <TabsContent value="settings">
          <GuestExperienceSettings
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        </TabsContent>
      </Tabs>

      {/* Rule Builder Dialog */}
      <RuleBuilderDialog
        open={isRuleBuilderOpen}
        onOpenChange={setIsRuleBuilderOpen}
        rule={editingRule}
        templates={templates}
        onSave={handleSaveRule}
      />
    </div>
  );
}
