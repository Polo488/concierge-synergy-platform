
import { useState } from 'react';
import { useSignatureContext } from '@/contexts/SignatureContext';
import { SignatureTemplatesList } from '@/components/signature/SignatureTemplatesList';
import { SignatureZoneEditor } from '@/components/signature/SignatureZoneEditor';
import { SignatureTemplate } from '@/types/signature';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PenTool, FileText, BarChart3 } from 'lucide-react';

export default function SignatureAdmin() {
  const { 
    templates, createTemplate, deleteTemplate, updateTemplate,
    addZone, updateZone, removeZone, sessions, signatureKPIs 
  } = useSignatureContext();
  const [selectedTemplate, setSelectedTemplate] = useState<SignatureTemplate | null>(null);

  if (selectedTemplate) {
    const liveTemplate = templates.find(t => t.id === selectedTemplate.id);
    if (!liveTemplate) {
      setSelectedTemplate(null);
      return null;
    }
    return (
      <div className="space-y-6">
        <SignatureZoneEditor
          template={liveTemplate}
          onBack={() => setSelectedTemplate(null)}
          onAddZone={addZone}
          onUpdateZone={updateZone}
          onRemoveZone={removeZone}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <PenTool size={22} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Signature électronique</h1>
          <p className="text-sm text-muted-foreground">Gérez vos templates de documents et suivez les signatures</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{signatureKPIs.totalSessions}</p>
            <p className="text-xs text-muted-foreground">Sessions totales</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{signatureKPIs.signedCount}</p>
            <p className="text-xs text-muted-foreground">Signés</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{signatureKPIs.signatureRate}%</p>
            <p className="text-xs text-muted-foreground">Taux de signature</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{signatureKPIs.pendingCount}</p>
            <p className="text-xs text-muted-foreground">En attente</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">
            <FileText size={14} className="mr-1" />
            Modèles
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <PenTool size={14} className="mr-1" />
            Sessions
            {sessions.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-4 text-[10px]">{sessions.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <SignatureTemplatesList
            templates={templates}
            onCreateTemplate={createTemplate}
            onDeleteTemplate={deleteTemplate}
            onSelectTemplate={setSelectedTemplate}
          />
        </TabsContent>

        <TabsContent value="sessions">
          {sessions.length === 0 ? (
            <Card className="border border-dashed border-border/50">
              <CardContent className="p-8 text-center">
                <PenTool size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Aucune session de signature. Les sessions sont créées depuis le module d'onboarding.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {sessions.map(s => (
                <Card key={s.id} className="border border-border/50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{s.ownerName}</p>
                      <p className="text-xs text-muted-foreground">{s.propertyAddress}</p>
                    </div>
                    <Badge variant="outline" className={`${
                      s.status === 'signed' ? 'bg-emerald-500/10 text-emerald-600' :
                      s.status === 'sent' || s.status === 'viewed' ? 'bg-blue-500/10 text-blue-600' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {s.status === 'draft' ? 'Brouillon' : s.status === 'sent' ? 'Envoyé' : s.status === 'viewed' ? 'Vu' : s.status === 'signed' ? 'Signé' : 'Expiré'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
