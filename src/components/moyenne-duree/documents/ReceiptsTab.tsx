
import { useState } from "react";
import { 
  FileCheck, 
  Send, 
  Download, 
  Plus, 
  MoreHorizontal,
  Calendar,
  Euro,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { toast } from "sonner";
import { Booking, RentReceipt, DocumentStatus } from "../types";
import { 
  useRentReceipts, 
  useRentCalls,
  formatMonth, 
  getDocumentStatusInfo 
} from "../hooks/useRentDocuments";
import { generateReceiptPDF, downloadPDF } from "../utils/pdfGenerator";
import { ReceiptDialog } from "./ReceiptDialog";

interface ReceiptsTabProps {
  booking: Booking;
  formatter: {
    date: (date: string) => string;
    currency: (amount: number) => string;
  };
}

export const ReceiptsTab = ({ booking, formatter }: ReceiptsTabProps) => {
  const { getRentCallsForBooking } = useRentCalls();
  const {
    getReceiptsForBooking,
    getReceiptForRentCall,
    generateReceipt,
    markAsSent,
    deleteReceipt,
  } = useRentReceipts();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<RentReceipt | null>(null);

  const receipts = getReceiptsForBooking(booking.id);
  const rentCalls = getRentCallsForBooking(booking.id);
  
  // Find paid rent calls without receipts
  const paidCallsWithoutReceipts = rentCalls.filter(
    (rc) => rc.status === "paid" && !getReceiptForRentCall(rc.id)
  );

  const handleGenerateReceipt = (rentCallId: string) => {
    const rentCall = rentCalls.find((rc) => rc.id === rentCallId);
    if (rentCall && rentCall.paidAt) {
      generateReceipt(booking.id, rentCall, rentCall.paidAt);
      toast.success(`Quittance générée pour ${formatMonth(rentCall.month)}`);
    }
  };

  const handleSend = (receipt: RentReceipt) => {
    markAsSent(receipt.id);
    toast.success(`Quittance envoyée pour ${formatMonth(receipt.month)}`);
  };

  const handleDownload = (receipt: RentReceipt) => {
    const doc = generateReceiptPDF(receipt, booking);
    const filename = `quittance-${booking.property.replace(/\s+/g, "-")}-${receipt.month}`;
    downloadPDF(doc, filename);
    toast.success("PDF téléchargé avec succès");
  };

  const handleDelete = (receipt: RentReceipt) => {
    deleteReceipt(receipt.id);
    toast.success("Quittance supprimée");
  };

  const getStatusBadge = (status: DocumentStatus) => {
    const { label, color } = getDocumentStatusInfo(status);
    return <Badge className={color}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Alert for pending receipts */}
      {paidCallsWithoutReceipts.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Quittances à générer</AlertTitle>
          <AlertDescription>
            {paidCallsWithoutReceipts.length} loyer(s) payé(s) sans quittance générée.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Quittances de loyer</CardTitle>
            <CardDescription>
              Générez et envoyez les quittances après réception du paiement
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {receipts.length === 0 && paidCallsWithoutReceipts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune quittance générée</p>
              <p className="text-sm mt-1">
                Les quittances sont générées après le paiement d'un loyer
              </p>
            </div>
          ) : (
            <>
              {/* Paid calls without receipts */}
              {paidCallsWithoutReceipts.length > 0 && (
                <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3">Loyers payés - Générer les quittances</h4>
                  <div className="flex flex-wrap gap-2">
                    {paidCallsWithoutReceipts.map((rentCall) => (
                      <Button
                        key={rentCall.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateReceipt(rentCall.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {formatMonth(rentCall.month)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {receipts.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Période</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Date de paiement</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receipts
                      .sort((a, b) => a.month.localeCompare(b.month))
                      .map((receipt) => (
                        <TableRow key={receipt.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatMonth(receipt.month)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Euro className="h-4 w-4 text-muted-foreground" />
                              {formatter.currency(receipt.amount)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatter.date(receipt.paymentDate)}
                          </TableCell>
                          <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDownload(receipt)}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Télécharger PDF
                                </DropdownMenuItem>
                                {receipt.status !== "sent" && (
                                  <DropdownMenuItem onClick={() => handleSend(receipt)}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Envoyer par email
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(receipt)}
                                  className="text-destructive"
                                >
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{receipts.length}</div>
            <p className="text-sm text-muted-foreground">Quittances générées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {receipts.filter((r) => r.status === "sent").length}
            </div>
            <p className="text-sm text-muted-foreground">Envoyées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {formatter.currency(
                receipts.reduce((sum, r) => sum + r.amount, 0)
              )}
            </div>
            <p className="text-sm text-muted-foreground">Total quittancé</p>
          </CardContent>
        </Card>
      </div>

      <ReceiptDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        receipt={selectedReceipt}
        booking={booking}
        formatter={formatter}
      />
    </div>
  );
};
