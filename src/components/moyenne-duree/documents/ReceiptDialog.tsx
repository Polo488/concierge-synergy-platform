
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileCheck, Send, Download } from "lucide-react";
import { toast } from "sonner";
import { Booking, RentReceipt } from "../types";
import { formatMonth, getDocumentStatusInfo } from "../hooks/useRentDocuments";
import { generateReceiptPDF, downloadPDF } from "../utils/pdfGenerator";

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: RentReceipt | null;
  booking: Booking;
  formatter: {
    date: (date: string) => string;
    currency: (amount: number) => string;
  };
}

export const ReceiptDialog = ({
  open,
  onOpenChange,
  receipt,
  booking,
  formatter,
}: ReceiptDialogProps) => {
  if (!receipt) return null;

  const { label: statusLabel, color: statusColor } = getDocumentStatusInfo(receipt.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Quittance de loyer - {formatMonth(receipt.month)}
            </DialogTitle>
            <Badge className={statusColor}>{statusLabel}</Badge>
          </div>
          <DialogDescription>
            Quittance de loyer pour {booking.property}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Document Preview */}
          <div className="border rounded-lg p-6 bg-white">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">QUITTANCE DE LOYER</h2>
              <p className="text-muted-foreground">{formatMonth(receipt.month)}</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bailleur :</span>
                <span className="font-medium">BNB Lyon</span>
              </div>
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
                <span className="font-medium">{formatMonth(receipt.month)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date de paiement :</span>
                <span className="font-medium">{formatter.date(receipt.paymentDate)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-medium">Montant reçu :</span>
                <span className="font-bold text-green-600">{formatter.currency(receipt.amount)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t text-center text-sm text-muted-foreground">
              <p>Cette quittance est délivrée sous réserve de l'encaissement définitif du paiement.</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <h4 className="font-medium">Historique</h4>
            <div className="space-y-2 text-sm">
              {receipt.generatedAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileCheck className="h-4 w-4" />
                  <span>Générée le {formatter.date(receipt.generatedAt)}</span>
                </div>
              )}
              {receipt.sentAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Send className="h-4 w-4" />
                  <span>Envoyée le {formatter.date(receipt.sentAt)}</span>
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
              const doc = generateReceiptPDF(receipt, booking);
              downloadPDF(doc, `quittance-${receipt.month}`);
              toast.success("PDF téléchargé");
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
          {receipt.status !== "sent" && (
            <Button className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Envoyer par email
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
