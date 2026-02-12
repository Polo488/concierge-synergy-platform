
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

    if (template.documentContent) {
      // Resolve variables in HTML content
      const valueMap: Record<string, string> = {
        owner_name: session.ownerName || '',
        owner_address: '',
        property_address: session.propertyAddress || '',
        commission_rate: session.commissionRate != null ? `${session.commissionRate}%` : '',
        iban: '', bic: '',
        start_date: session.signedAt ? format(new Date(session.signedAt), 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy'),
        duration: '1 an',
      };
      const resolved = template.documentContent.replace(/\{\{([a-z_]+)\}\}/g, (_, key) => valueMap[key] || `[${key}]`);

      // Strip HTML tags for PDF text rendering, preserving structure
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = resolved;
      
      // Walk through elements to handle headings and formatting
      const renderNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || '';
          if (!text.trim()) return;
          const lines = doc.splitTextToSize(text.trim(), pageWidth - 40);
          for (const line of lines) {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.text(line, 20, y);
            y += 5;
          }
          return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();
        
        if (tag === 'h1') {
          if (y > 260) { doc.addPage(); y = 20; }
          y += 4;
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text(el.textContent || '', 20, y);
          y += 8;
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
        } else if (tag === 'h2') {
          if (y > 260) { doc.addPage(); y = 20; }
          y += 3;
          doc.setFontSize(13);
          doc.setFont('helvetica', 'bold');
          doc.text(el.textContent || '', 20, y);
          y += 7;
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
        } else if (tag === 'h3') {
          if (y > 260) { doc.addPage(); y = 20; }
          y += 2;
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text(el.textContent || '', 20, y);
          y += 6;
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
        } else if (tag === 'strong' || tag === 'b') {
          doc.setFont('helvetica', 'bold');
          const lines = doc.splitTextToSize(el.textContent || '', pageWidth - 40);
          for (const line of lines) {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.text(line, 20, y);
            y += 5;
          }
          doc.setFont('helvetica', 'normal');
        } else if (tag === 'hr') {
          y += 3;
          doc.setDrawColor(200);
          doc.line(20, y, pageWidth - 20, y);
          y += 5;
        } else if (tag === 'li') {
          const text = `• ${el.textContent || ''}`;
          const lines = doc.splitTextToSize(text, pageWidth - 45);
          for (const line of lines) {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.text(line, 25, y);
            y += 5;
          }
        } else if (tag === 'p') {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          // Handle inline bold/italic within paragraphs
          const text = el.textContent || '';
          if (text.trim()) {
            const lines = doc.splitTextToSize(text.trim(), pageWidth - 40);
            for (const line of lines) {
              if (y > 270) { doc.addPage(); y = 20; }
              doc.text(line, 20, y);
              y += 5;
            }
          }
          y += 2;
        } else {
          // Recurse for other containers
          el.childNodes.forEach(child => renderNode(child));
        }
      };

      tempDiv.childNodes.forEach(node => renderNode(node));
    } else {
      // Legacy hardcoded document
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
      const art2 = doc.splitTextToSize(`Le mandataire percevra une commission de ${session.commissionRate || '___'}% hors taxes sur les revenus locatifs bruts générés par la location du bien.`, pageWidth - 40);
      doc.text(art2, 20, y); y += art2.length * 5 + 5;

      doc.text(`Fait en deux exemplaires.`, pageWidth / 2, y, { align: 'center' });
      y += 15;
    }

    // Zone data (text fields, dates)
    y += 5;
    template.zones.forEach(zone => {
      const data = zoneData.find(d => d.zoneId === zone.id);
      if (!data) return;
      if (y > 270) { doc.addPage(); y = 20; }
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
    if (y > 240) { doc.addPage(); y = 20; }
    sigZones.forEach(zone => {
      const data = zoneData.find(d => d.zoneId === zone.id);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(zone.label, sigX, y);
      doc.setTextColor(0);
      if (data?.value?.startsWith('data:image')) {
        try { doc.addImage(data.value, 'PNG', sigX, y + 2, 50, 20); } catch (e) { doc.text('[Signature]', sigX, y + 10); }
      } else if (data?.value) {
        doc.setFontSize(10);
        doc.text(data.value, sigX, y + 10);
      }
      sigX += 80;
    });

    y += 30;
    if (y > 270) { doc.addPage(); y = 20; }

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
