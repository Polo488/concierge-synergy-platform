
import { useState } from "react";
import jsPDF from "jspdf";
import { 
  FileText, 
  Edit, 
  Send, 
  Download, 
  Plus, 
  History,
  CheckCircle,
  Upload,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Booking, Lease, LeaseTemplate } from "../types";
import { 
  useLeases, 
  useLeaseTemplates,
  getLeaseStatusInfo,
  getSignatureStatusInfo,
  getLeaseTypeLabel,
  getTemplateVariables
} from "../hooks/useLeases";
import { generateLeasePDF, downloadPDF } from "../utils/pdfGenerator";
import { LeaseEditorDialog } from "./LeaseEditorDialog";
import { LeaseVersionsDialog } from "./LeaseVersionsDialog";
import { PDFPreviewModal } from "./PDFPreviewModal";

interface LeaseTabProps {
  booking: Booking;
  formatter: {
    date: (date: string) => string;
    currency: (amount: number) => string;
  };
}

export const LeaseTab = ({ booking, formatter }: LeaseTabProps) => {
  const { templates, getDefaultTemplate } = useLeaseTemplates();
  const {
    getLeaseForBooking,
    createLeaseFromTemplate,
    updateSignatureStatus,
    finalizeLease,
    uploadSignedPdf,
    deleteLease,
    setLeaseEditorOpen,
    leaseEditorOpen,
  } = useLeases();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    getDefaultTemplate()?.id || ""
  );
  const [versionsDialogOpen, setVersionsDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<jsPDF | null>(null);
  const [previewFilename, setPreviewFilename] = useState("");

  const lease = getLeaseForBooking(booking.id);

  const handleCreateLease = () => {
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (!template) {
      toast.error("Veuillez sélectionner un modèle de bail");
      return;
    }

    const variables = getTemplateVariables(booking);
    createLeaseFromTemplate(booking.id, template, variables);
    toast.success("Bail créé avec succès");
  };

  const handleEdit = () => {
    setLeaseEditorOpen(true);
  };

  const handleFinalize = () => {
    if (lease) {
      finalizeLease(lease.id);
      toast.success("Bail finalisé");
    }
  };

  const handleSend = () => {
    if (lease) {
      updateSignatureStatus(lease.id, "sent");
      toast.success("Bail envoyé pour signature");
    }
  };

  const handleUploadSigned = () => {
    // In a real app, this would open a file picker
    if (lease) {
      uploadSignedPdf(lease.id, "/signed-lease.pdf");
      toast.success("Bail signé téléchargé");
    }
  };

  const handlePreview = () => {
    if (lease) {
      const doc = generateLeasePDF(lease, booking);
      const filename = `bail-${booking.property.replace(/\s+/g, "-")}-${booking.tenant.replace(/\s+/g, "-")}`;
      setPreviewPdf(doc);
      setPreviewFilename(filename);
      setPreviewOpen(true);
    }
  };

  const handleDownload = () => {
    if (lease) {
      const doc = generateLeasePDF(lease, booking);
      const filename = `bail-${booking.property.replace(/\s+/g, "-")}-${booking.tenant.replace(/\s+/g, "-")}`;
      downloadPDF(doc, filename);
      toast.success("PDF téléchargé avec succès");
    }
  };

  const handleDelete = () => {
    if (lease) {
      deleteLease(lease.id);
      toast.success("Bail supprimé");
    }
  };

  if (!lease) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Créer un bail</CardTitle>
            <CardDescription>
              Sélectionnez un modèle pour créer le bail de cette location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sélectionner un modèle" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <span>{template.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {getLeaseTypeLabel(template.type)}
                        </Badge>
                        {template.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Par défaut
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreateLease}>
                <Plus className="h-4 w-4 mr-2" />
                Créer le bail
              </Button>
            </div>

            <div className="text-center py-8 text-muted-foreground border-t mt-6">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun bail créé pour cette réservation</p>
              <p className="text-sm mt-1">
                Sélectionnez un modèle et cliquez sur "Créer le bail"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { label: statusLabel, color: statusColor } = getLeaseStatusInfo(lease.status);
  const { label: signatureLabel, color: signatureColor } = getSignatureStatusInfo(lease.signatureStatus);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">Bail - {lease.templateName}</CardTitle>
              <Badge className={statusColor}>{statusLabel}</Badge>
            </div>
            <CardDescription>
              Version {lease.currentVersion} • Créé le {formatter.date(lease.createdAt)}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setVersionsDialogOpen(true)}>
              <History className="h-4 w-4 mr-2" />
              Versions
            </Button>
            {lease.status === "draft" && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Signature Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Statut de signature</p>
                <p className="text-sm text-muted-foreground">
                  {lease.signatureStatus === "signed"
                    ? "Le bail a été signé par toutes les parties"
                    : lease.signatureStatus === "sent"
                    ? "En attente de signature"
                    : "Le bail n'a pas encore été envoyé"}
                </p>
              </div>
            </div>
            <Badge className={signatureColor}>{signatureLabel}</Badge>
          </div>

          {/* Content Preview */}
          <div className="border rounded-lg">
            <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
              <span className="font-medium">Aperçu du contrat</span>
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                <Eye className="h-4 w-4 mr-2" />
                Voir le contenu complet
              </Button>
            </div>
            <div className="p-4 max-h-[300px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-sans">
                {lease.content.substring(0, 1000)}
                {lease.content.length > 1000 && "..."}
              </pre>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Aperçu PDF
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
            
            {lease.status === "draft" && (
              <Button variant="secondary" onClick={handleFinalize}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Finaliser le bail
              </Button>
            )}
            
            {lease.status === "finalized" && lease.signatureStatus === "not_sent" && (
              <Button onClick={handleSend}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer pour signature
              </Button>
            )}
            
            {lease.signatureStatus !== "signed" && (
              <Button variant="outline" onClick={handleUploadSigned}>
                <Upload className="h-4 w-4 mr-2" />
                Téléverser bail signé
              </Button>
            )}
          </div>

          {/* Signed PDF link */}
          {lease.signedPdfUrl && (
            <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Bail signé disponible
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Le document signé a été téléversé
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lease Editor Dialog */}
      <LeaseEditorDialog
        open={leaseEditorOpen}
        onOpenChange={setLeaseEditorOpen}
        lease={lease}
        booking={booking}
      />

      {/* Versions Dialog */}
      <LeaseVersionsDialog
        open={versionsDialogOpen}
        onOpenChange={setVersionsDialogOpen}
        lease={lease}
        formatter={formatter}
      />

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        pdf={previewPdf}
        title={`Bail - ${booking.property}`}
        filename={previewFilename}
      />
    </div>
  );
};
