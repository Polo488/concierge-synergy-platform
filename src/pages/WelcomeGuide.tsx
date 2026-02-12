
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Eye, Settings, BarChart3, Plus, ExternalLink, Copy, CheckCircle2, XCircle, Clock, ShoppingCart, TrendingUp } from 'lucide-react';
import { useWelcomeGuide } from '@/hooks/useWelcomeGuide';
import { WelcomeGuideEditor } from '@/components/welcome-guide/WelcomeGuideEditor';
import { WelcomeGuidePreview } from '@/components/welcome-guide/WelcomeGuidePreview';
import { toast } from 'sonner';

const WelcomeGuide = () => {
  const { templates, sessions, analytics, selectedTemplate, setSelectedTemplate, toggleTemplate } = useWelcomeGuide();
  const [activeTab, setActiveTab] = useState('templates');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const previewTpl = templates.find(t => t.id === previewTemplate);

  if (previewTpl) {
    return <WelcomeGuidePreview template={previewTpl} onBack={() => setPreviewTemplate(null)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <BookOpen size={20} className="text-primary" />
            </div>
            Livret d'Accueil Interactif
          </h1>
          <p className="text-muted-foreground mt-1">Créez des parcours d'accueil gamifiés pour vos voyageurs</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Nouveau livret
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-panel">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Sessions totales</p>
                <p className="text-2xl font-bold text-foreground mt-1">{analytics.totalSessions}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Eye size={18} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Taux complétion</p>
                <p className="text-2xl font-bold text-foreground mt-1">{analytics.completionRate}%</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 size={18} className="text-emerald-500" />
              </div>
            </div>
            <Progress value={analytics.completionRate} className="mt-3 h-1.5" indicatorClassName="bg-emerald-500" />
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Conversion upsell</p>
                <p className="text-2xl font-bold text-foreground mt-1">{analytics.upsellConversionRate}%</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <ShoppingCart size={18} className="text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Revenu upsell</p>
                <p className="text-2xl font-bold text-foreground mt-1">{analytics.upsellRevenue} €</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp size={18} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="glass-panel">
          <TabsTrigger value="templates" className="gap-2"><Settings size={14} /> Templates</TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2"><Eye size={14} /> Sessions</TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2"><BarChart3 size={14} /> Analytique</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4 mt-4">
          {selectedTemplate ? (
            <WelcomeGuideEditor template={selectedTemplate} onBack={() => setSelectedTemplate(null)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(tpl => (
                <Card key={tpl.id} className="glass-panel hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{tpl.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{tpl.propertyName}</p>
                      </div>
                      <Badge variant={tpl.isActive ? 'default' : 'secondary'} className={tpl.isActive ? 'bg-emerald-500/10 text-emerald-600 border-0' : ''}>
                        {tpl.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{tpl.steps.filter(s => s.isActive).length} étapes</span>
                      <span>{tpl.upsells.filter(u => u.isActive).length} upsells</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => setPreviewTemplate(tpl.id)}>
                        <Eye size={14} /> Prévisualiser
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => setSelectedTemplate(tpl)}>
                        <Settings size={14} /> Configurer
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/welcome/${tpl.id}`);
                        toast.success('Lien copié !');
                      }}>
                        <Copy size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4 mt-4">
          <Card className="glass-panel">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">Voyageur</th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">Logement</th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">Check-in</th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">Progression</th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">Upsells</th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map(sess => {
                      const tpl = templates.find(t => t.id === sess.templateId);
                      const totalSteps = tpl?.steps.filter(s => s.isActive).length || 1;
                      const progressPct = Math.round((sess.completedSteps.length / totalSteps) * 100);
                      return (
                        <tr key={sess.id} className="border-b border-border/10 hover:bg-accent/30 transition-colors">
                          <td className="p-4 text-sm font-medium text-foreground">{sess.guestName}</td>
                          <td className="p-4 text-sm text-muted-foreground">{sess.propertyName}</td>
                          <td className="p-4 text-sm text-muted-foreground">{sess.checkIn.toLocaleDateString('fr-FR')}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Progress value={progressPct} className="h-1.5 w-20" />
                              <span className="text-xs text-muted-foreground">{progressPct}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            {sess.upsellsAccepted.length > 0 ? (
                              <Badge className="bg-amber-500/10 text-amber-600 border-0 text-xs">{sess.upsellsAccepted.length} accepté(s)</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="p-4">
                            {sess.completedAt ? (
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-xs gap-1"><CheckCircle2 size={10} /> Terminé</Badge>
                            ) : sess.abandonedAt ? (
                              <Badge variant="destructive" className="text-xs gap-1"><XCircle size={10} /> Abandonné</Badge>
                            ) : (
                              <Badge className="bg-blue-500/10 text-blue-600 border-0 text-xs gap-1"><Clock size={10} /> En cours</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-panel">
              <CardHeader><CardTitle className="text-base">Taux d'abandon par étape</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(analytics.stepDropoffRates).map(([step, rate]) => {
                  const labels: Record<string, string> = {
                    building_arrival: 'Arrivée bâtiment',
                    key_access: 'Récupération clés',
                    apartment_access: 'Accès logement',
                    welcome: 'Bienvenue',
                    upsell: 'Upsells',
                  };
                  return (
                    <div key={step}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{labels[step] || step}</span>
                        <span className="font-medium text-foreground">{rate}%</span>
                      </div>
                      <Progress value={rate} className="h-1.5" indicatorClassName={rate > 10 ? 'bg-amber-500' : 'bg-emerald-500'} />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
            <Card className="glass-panel">
              <CardHeader><CardTitle className="text-base">Performance upsells</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6">
                  <p className="text-4xl font-bold text-foreground">{analytics.upsellConversionRate}%</p>
                  <p className="text-sm text-muted-foreground mt-1">taux de conversion</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-xl bg-accent/30">
                    <p className="text-lg font-bold text-foreground">{analytics.upsellRevenue} €</p>
                    <p className="text-xs text-muted-foreground">revenu total</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-accent/30">
                    <p className="text-lg font-bold text-foreground">{analytics.averageCompletionTime} min</p>
                    <p className="text-xs text-muted-foreground">temps moyen</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WelcomeGuide;
