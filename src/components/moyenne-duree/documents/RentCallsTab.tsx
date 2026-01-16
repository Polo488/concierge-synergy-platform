
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  FileText, 
  Send, 
  Download, 
  Check, 
  Plus, 
  MoreHorizontal,
  Mail,
  Calendar,
  Euro,
  Clock
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
import { toast } from "sonner";
import { Booking, RentCall, DocumentStatus } from "../types";
import { 
  useRentCalls, 
  formatMonth, 
  getDocumentStatusInfo,
  getBookingMonths 
} from "../hooks/useRentDocuments";
import { generateRentCallPDF, downloadPDF } from "../utils/pdfGenerator";
import { RentCallDialog } from "./RentCallDialog";

interface RentCallsTabProps {
  booking: Booking;
  formatter: {
    date: (date: string) => string;
    currency: (amount: number) => string;
  };
}

export const RentCallsTab = ({ booking, formatter }: RentCallsTabProps) => {
  const {
    getRentCallsForBooking,
    generateRentCall,
    generateAllRentCalls,
    markAsSent,
    markAsPaid,
    deleteRentCall,
  } = useRentCalls();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRentCall, setSelectedRentCall] = useState<RentCall | null>(null);

  const rentCalls = getRentCallsForBooking(booking.id);
  const bookingMonths = getBookingMonths(booking.startDate, booking.endDate);
  
  // Calculate monthly amount
  const monthsCount = bookingMonths.length;
  const monthlyAmount = monthsCount > 0 ? booking.amount / monthsCount : booking.amount;

  // Find months without rent calls
  const missingMonths = bookingMonths.filter(
    (month) => !rentCalls.some((rc) => rc.month === month)
  );

  const handleGenerateAll = () => {
    const newCalls = generateAllRentCalls(
      booking.id,
      booking.startDate,
      booking.endDate,
      monthlyAmount,
      1
    );
    if (newCalls.length > 0) {
      toast.success(`${newCalls.length} appel(s) de loyer généré(s)`);
    } else {
      toast.info("Tous les appels de loyer sont déjà générés");
    }
  };

  const handleGenerateSingle = (month: string) => {
    const dueDate = `${month}-01`;
    generateRentCall(booking.id, month, monthlyAmount, dueDate);
    toast.success(`Appel de loyer généré pour ${formatMonth(month)}`);
  };

  const handleSend = (rentCall: RentCall) => {
    markAsSent(rentCall.id);
    toast.success(`Appel de loyer envoyé pour ${formatMonth(rentCall.month)}`);
  };

  const handleMarkPaid = (rentCall: RentCall) => {
    markAsPaid(rentCall.id);
    toast.success(`Loyer marqué comme payé pour ${formatMonth(rentCall.month)}`);
  };

  const handleDownload = (rentCall: RentCall) => {
    const doc = generateRentCallPDF(rentCall, booking);
    const filename = `appel-loyer-${booking.property.replace(/\s+/g, "-")}-${rentCall.month}`;
    downloadPDF(doc, filename);
    toast.success("PDF téléchargé avec succès");
  };

  const handleDelete = (rentCall: RentCall) => {
    deleteRentCall(rentCall.id);
    toast.success("Appel de loyer supprimé");
  };

  const getStatusBadge = (status: DocumentStatus) => {
    const { label, color } = getDocumentStatusInfo(status);
    return <Badge className={color}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Appels de loyer</CardTitle>
            <CardDescription>
              Générez et envoyez les appels de loyer pour cette réservation
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {missingMonths.length > 0 && (
              <Button onClick={handleGenerateAll} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Générer tous
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {rentCalls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun appel de loyer généré</p>
              <p className="text-sm mt-1">
                Cliquez sur "Générer tous" pour créer les appels de loyer automatiquement
              </p>
              {missingMonths.length > 0 && (
                <Button onClick={handleGenerateAll} className="mt-4" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Générer {missingMonths.length} appel(s) de loyer
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Période</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentCalls
                  .sort((a, b) => a.month.localeCompare(b.month))
                  .map((rentCall) => (
                    <TableRow key={rentCall.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatMonth(rentCall.month)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Euro className="h-4 w-4 text-muted-foreground" />
                          {formatter.currency(rentCall.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatter.date(rentCall.dueDate)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(rentCall.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownload(rentCall)}>
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger PDF
                            </DropdownMenuItem>
                            {rentCall.status === "draft" || rentCall.status === "generated" ? (
                              <DropdownMenuItem onClick={() => handleSend(rentCall)}>
                                <Send className="h-4 w-4 mr-2" />
                                Envoyer par email
                              </DropdownMenuItem>
                            ) : null}
                            {rentCall.status !== "paid" && (
                              <DropdownMenuItem onClick={() => handleMarkPaid(rentCall)}>
                                <Check className="h-4 w-4 mr-2" />
                                Marquer payé
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(rentCall)}
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

          {/* Missing months */}
          {missingMonths.length > 0 && rentCalls.length > 0 && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-3">Mois non générés</h4>
              <div className="flex flex-wrap gap-2">
                {missingMonths.map((month) => (
                  <Button
                    key={month}
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateSingle(month)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {formatMonth(month)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{rentCalls.length}</div>
            <p className="text-sm text-muted-foreground">Appels générés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {rentCalls.filter((rc) => rc.status === "sent").length}
            </div>
            <p className="text-sm text-muted-foreground">Envoyés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {rentCalls.filter((rc) => rc.status === "paid").length}
            </div>
            <p className="text-sm text-muted-foreground">Payés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {formatter.currency(
                rentCalls
                  .filter((rc) => rc.status === "paid")
                  .reduce((sum, rc) => sum + rc.amount, 0)
              )}
            </div>
            <p className="text-sm text-muted-foreground">Total perçu</p>
          </CardContent>
        </Card>
      </div>

      <RentCallDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rentCall={selectedRentCall}
        booking={booking}
        formatter={formatter}
      />
    </div>
  );
};
