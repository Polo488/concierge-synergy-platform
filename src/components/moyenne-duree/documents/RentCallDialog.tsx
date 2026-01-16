
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Euro, FileText, Send, Download, Check } from "lucide-react";
import { toast } from "sonner";
import { Booking, RentCall } from "../types";
import { formatMonth, getDocumentStatusInfo } from "../hooks/useRentDocuments";
import { generateRentCallPDF, downloadPDF } from "../utils/pdfGenerator";

interface RentCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rentCall: RentCall | null;
  booking: Booking;
  formatter: {
    date: (date: string) => string;
    currency: (amount: number) => string;
  };
}

export const RentCallDialog = ({
  open,
  onOpenChange,
  rentCall,
  booking,
  formatter,
}: RentCallDialogProps) => {
  if (!rentCall) return null;

  const { label: statusLabel, color: statusColor } = getDocumentStatusInfo(rentCall.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Appel de loyer - {formatMonth(rentCall.month)}
            </DialogTitle>
            <Badge className={statusColor}>{statusLabel}</Badge>
          </div>
          <DialogDescription>
            Détails de l'appel de loyer pour {booking.property}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Document Preview */}
          <div className="border rounded-lg p-6 bg-white">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">APPEL DE LOYER</h2>
              <p className="text-muted-foreground">{formatMonth(rentCall.month)}</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Locataire :</span>
                <span className="font-medium">{booking.tenant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Logement :</span>
                <span className="font-medium">{booking.property}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Période :</span>
                <span className="font-medium">{formatMonth(rentCall.month)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date d'échéance :</span>
                <span className="font-medium">{formatter.date(rentCall.dueDate)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-medium">Montant à payer :</span>
                <span className="font-bold text-primary">{formatter.currency(rentCall.amount)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <h4 className="font-medium">Historique</h4>
            <div className="space-y-2 text-sm">
              {rentCall.generatedAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Généré le {formatter.date(rentCall.generatedAt)}</span>
                </div>
              )}
              {rentCall.sentAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Send className="h-4 w-4" />
                  <span>Envoyé le {formatter.date(rentCall.sentAt)}</span>
                </div>
              )}
              {rentCall.paidAt && (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span>Payé le {formatter.date(rentCall.paidAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              const doc = generateRentCallPDF(rentCall, booking);
              downloadPDF(doc, `appel-loyer-${rentCall.month}`);
              toast.success("PDF téléchargé");
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
          {rentCall.status !== "sent" && rentCall.status !== "paid" && (
            <Button className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Envoyer par email
            </Button>
          )}
          {rentCall.status !== "paid" && (
            <Button variant="secondary" className="flex-1">
              <Check className="h-4 w-4 mr-2" />
              Marquer payé
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
