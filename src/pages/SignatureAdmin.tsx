
import { useState } from 'react';
import { useSignatureContext } from '@/contexts/SignatureContext';
import { SignatureTemplatesList } from '@/components/signature/SignatureTemplatesList';
import { SignatureZoneEditor } from '@/components/signature/SignatureZoneEditor';
import { SignatureTemplate, SignatureSession, SESSION_STATUS_CONFIG } from '@/types/signature';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PenTool, FileText, BarChart3, Download, Eye, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';

export default function SignatureAdmin() {
  const { 
    templates, createTemplate, deleteTemplate, updateTemplate,
    addZone, updateZone, removeZone, sessions, signatureKPIs,
    getSessionZoneData,
  } = useSignatureContext();
  const [selectedTemplate, setSelectedTemplate] = useState<SignatureTemplate | null>(null);
  const [viewingSession, setViewingSession] = useState<SignatureSession | null>(null);

  const generateSignedPDF = (session: SignatureSession) => {
    const template = templates.find(t => t.id === session.templateId);
    if (!template) return;

    const zoneData = getSessionZoneData(session.id);
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    let y = 20;

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('MANDAT DE GESTION LOCATIVE', pageWidth / 2, y, { align: 'center' });
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120);
    doc.text('Conciergerie courte & moyenne durée', pageWidth / 2, y, { align: 'center' });
    doc.setTextColor(0);
    y += 12;

    // Body
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Entre les soussignés :', 20, y); y += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Le Mandant : ${session.ownerName || ''}`, 20, y); y += 5;
    doc.text(`Adresse du bien : ${session.propertyAddress || ''}`, 20, y); y += 7;
    doc.text('Et :', 20, y); y += 5;
    doc.text('La société Noé Conciergerie, SAS au capital de 10 000€,', 20, y); y += 5;
    doc.text('ci-après dénommée le Mandataire.', 20, y); y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Article 1 – Objet du mandat', 20, y); y += 6;
    doc.setFont('helvetica', 'normal');
    const art1 = doc.splitTextToSize('Le mandant confie au mandataire, qui accepte, la gestion locative de son bien immobilier sis à l\'adresse ci-dessus mentionnée, en vue de sa mise en location de courte et/ou moyenne durée sur les plateformes de réservation en ligne.', pageWidth - 40);
    doc.text(art1, 20, y); y += art1.length * 5 + 5;

    doc.setFont('helvetica', 'bold');
    doc.text('Article 2 – Commission', 20, y); y += 6;
    doc.setFont('helvetica', 'normal');
    const art2 = doc.splitTextToSize(`Le mandataire percevra une commission de ${session.commissionRate || '___'}% hors taxes sur les revenus locatifs bruts générés par la location du bien, prélevée directement sur les versements des plateformes.`, pageWidth - 40);
    doc.text(art2, 20, y); y += art2.length * 5 + 5;

    doc.setFont('helvetica', 'bold');
    doc.text('Article 3 – Durée', 20, y); y += 6;
    doc.setFont('helvetica', 'normal');
    const art3 = doc.splitTextToSize('Le présent mandat est conclu pour une durée d\'un an à compter de sa date de signature. Il est renouvelable par tacite reconduction pour des périodes successives d\'un an, sauf dénonciation par l\'une des parties avec un préavis de trois mois.', pageWidth - 40);
    doc.text(art3, 20, y); y += art3.length * 5 + 5;

    doc.setFont('helvetica', 'bold');
    doc.text('Article 4 – Obligations du Mandataire', 20, y); y += 6;
    doc.setFont('helvetica', 'normal');
    const art4 = doc.splitTextToSize('Le mandataire s\'engage à : gérer les réservations, accueillir les voyageurs, coordonner le ménage et la maintenance, assurer la communication avec les hôtes, et reverser les revenus selon les conditions convenues.', pageWidth - 40);
    doc.text(art4, 20, y); y += art4.length * 5 + 10;

    doc.text(`Fait en deux exemplaires.`, pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Zone data (text fields, dates)
    template.zones.forEach(zone => {
      const data = zoneData.find(d => d.zoneId === zone.id);
      if (!data) return;

      if (zone.zoneType === 'text' || zone.zoneType === 'date') {
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(`${zone.label} :`, 20, y);
        doc.setTextColor(0);
        doc.setFontSize(10);
        doc.text(data.value || '', 60, y);
        y += 7;
      }
    });

    y += 5;

    // Signatures
    const sigZones = template.zones.filter(z => z.zoneType === 'signature' || z.zoneType === 'initials');
    let sigX = 20;
    sigZones.forEach(zone => {
      const data = zoneData.find(d => d.zoneId === zone.id);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(zone.label, sigX, y);
      doc.setTextColor(0);

      if (data?.value?.startsWith('data:image')) {
        try {
          doc.addImage(data.value, 'PNG', sigX, y + 2, 50, 20);
        } catch (e) {
          doc.text('[Signature]', sigX, y + 10);
        }
      } else if (data?.value) {
        doc.setFontSize(10);
        doc.text(data.value, sigX, y + 10);
      }
      sigX += 80;
    });

    y += 30;

    // Signature proof footer
    doc.setDrawColor(200);
    doc.line(20, y, pageWidth - 20, y);
    y += 6;
    doc.setFontSize(7);
    doc.setTextColor(130);
    doc.text('PREUVE DE SIGNATURE ÉLECTRONIQUE', 20, y); y += 4;
    doc.text(`Signé le : ${session.signedAt ? format(new Date(session.signedAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr }) : 'N/A'}`, 20, y); y += 3.5;
    doc.text(`IP du signataire : ${session.signerIp || 'N/A'}`, 20, y); y += 3.5;
    doc.text(`Token de session : ${session.token}`, 20, y); y += 3.5;
    doc.text(`Document : ${template.name}`, 20, y); y += 3.5;
    doc.text('Noé Conciergerie – Signature électronique simple, horodatée et tracée', 20, y);

    doc.save(`mandat-signe-${session.ownerName?.replace(/\s+/g, '-').toLowerCase() || 'document'}.pdf`);
  };

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
          onUpdateTemplate={updateTemplate}
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
            onUpdateTemplate={updateTemplate}
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
              {sessions.map(s => {
                const cfg = SESSION_STATUS_CONFIG[s.status];
                return (
                  <Card key={s.id} className="border border-border/50">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{s.ownerName}</p>
                        <p className="text-xs text-muted-foreground">{s.propertyAddress}</p>
                        {s.signedAt && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Signé le {format(new Date(s.signedAt), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn(cfg.bgColor, cfg.color)}>
                          {cfg.label}
                        </Badge>
                        {s.status === 'signed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => generateSignedPDF(s)}
                          >
                            <Download size={14} className="mr-1" />
                            PDF
                          </Button>
                        )}
                        {(s.status === 'sent' || s.status === 'viewed') && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`/sign?token=${s.token}`, '_blank')}
                          >
                            <ExternalLink size={14} />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
