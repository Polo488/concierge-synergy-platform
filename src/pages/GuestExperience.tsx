
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
    <div className="space-y-6">
      {/* Header — Apple style: stack sur mobile, ligne sur desktop */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[hsl(var(--label-1))] flex items-center gap-2.5">
          <MessageSquare className="h-7 w-7 text-primary shrink-0" strokeWidth={2} />
          <span className="truncate">Communication Intelligente</span>
        </h1>
        <p className="text-[14px] text-[hsl(var(--label-2)/0.68)]">
          Automatisez et personnalisez toutes vos communications avec les voyageurs
        </p>
      </div>

      {/* Stats Overview — 2x2 mobile, 4 cols desktop */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card className="rounded-[18px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 pt-4">
            <CardTitle className="text-[12px] font-medium text-[hsl(var(--label-2))]">Règles actives</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-[22px] font-bold text-[hsl(var(--label-1))]">{stats.activeRules}</div>
            <p className="text-[11px] text-muted-foreground">sur {stats.totalRules} règles</p>
          </CardContent>
        </Card>
        <Card className="rounded-[18px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 pt-4">
            <CardTitle className="text-[12px] font-medium text-[hsl(var(--label-2))]">Messages envoyés</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-[22px] font-bold text-[hsl(var(--label-1))]">{stats.totalSent}</div>
            <p className="text-[11px] text-muted-foreground">{stats.totalFailed} échecs</p>
          </CardContent>
        </Card>
        <Card className="rounded-[18px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 pt-4">
            <CardTitle className="text-[12px] font-medium text-[hsl(var(--label-2))]">Modèles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-[22px] font-bold text-[hsl(var(--label-1))]">{stats.activeTemplates}</div>
            <p className="text-[11px] text-muted-foreground">modèles actifs</p>
          </CardContent>
        </Card>
        <Card className="rounded-[18px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 pt-4">
            <CardTitle className="text-[12px] font-medium text-[hsl(var(--label-2))]">Revenus Upsell</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-[22px] font-bold text-[hsl(var(--label-1))]">{stats.upsellRevenue}€</div>
            <p className="text-[11px] text-muted-foreground">{stats.activeUpsells} actives</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs — scroll horizontal silencieux mobile, grid desktop */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div
          className="overflow-x-auto -mx-1 px-1"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none' }}
        >
          <TabsList className="inline-flex w-auto sm:w-full sm:grid sm:grid-cols-5">
            <TabsTrigger value="rules" className="flex items-center gap-1.5 px-3">
              <Zap className="h-4 w-4" />
              <span>Règles</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1.5 px-3">
              <FileText className="h-4 w-4" />
              <span>Modèles</span>
            </TabsTrigger>
            <TabsTrigger value="upsells" className="flex items-center gap-1.5 px-3">
              <Gift className="h-4 w-4" />
              <span>Upsells</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-1.5 px-3">
              <History className="h-4 w-4" />
              <span>Historique</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1.5 px-3">
              <Settings className="h-4 w-4" />
              <span>Réglages</span>
            </TabsTrigger>
          </TabsList>
        </div>

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
