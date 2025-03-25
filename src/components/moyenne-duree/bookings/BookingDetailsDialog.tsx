
import { Booking, BookingSource, BookingStatus, StatusInfo } from "../types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Euro, Briefcase } from "lucide-react";
import { isAfter, parseISO } from "date-fns";

interface BookingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  formatter: {
    date: (date: string) => string;
    currency: (amount: number) => string;
  };
  statusInfo: StatusInfo<BookingStatus>;
  getSourceLabel: (source: BookingSource) => string;
  isDeleteConfirm?: boolean;
  onConfirmDelete?: () => void;
  onViewPaymentSchedule?: () => void;
}

export const BookingDetailsDialog = ({
  open,
  onOpenChange,
  booking,
  formatter,
  statusInfo,
  getSourceLabel,
  isDeleteConfirm = false,
  onConfirmDelete,
  onViewPaymentSchedule
}: BookingDetailsDialogProps) => {
  if (!booking) return null;

  // If this is a delete confirmation dialog
  if (isDeleteConfirm) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de supprimer la réservation pour <strong>{booking.property}</strong> au nom de <strong>{booking.tenant}</strong>. 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Check if any payment is overdue
  const hasOverduePayment = booking.payments?.some(p => 
    p.status === "pending" && isAfter(new Date(), parseISO(p.dueDate))
  );

  // Count pending payments
  const pendingPaymentsCount = booking.payments?.filter(p => p.status === "pending").length || 0;

  // If this is a regular details dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de la réservation</DialogTitle>
          <DialogDescription>
            Informations complètes sur la réservation
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[calc(80vh-180px)] overflow-y-auto pr-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{booking.property}</h3>
              <p className="text-muted-foreground">Réservation #{booking.id}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.getColor(booking.status)}`}>
              {statusInfo.getLabel(booking.status)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Locataire</p>
                <p>{booking.tenant}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Période</p>
                <p>{formatter.date(booking.startDate)} - {formatter.date(booking.endDate)}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Montant total</p>
                <p className="font-medium">{formatter.currency(booking.amount)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Frais de ménage</p>
              <p>{formatter.currency(booking.cleaningFee)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Source</p>
              <p>{getSourceLabel(booking.source)}</p>
            </div>
          </div>
          
          <div className="border rounded-md p-4 space-y-3">
            <h4 className="font-medium">Détails de la commission</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Taux</p>
                <p>{booking.commissionRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p>{formatter.currency(booking.commission.total)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Part BnB Lyon</p>
                <p>{formatter.currency(booking.commission.bnbLyon)} ({booking.commissionSplit.bnbLyon}%)</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Part Hamac</p>
                <p>{formatter.currency(booking.commission.hamac)} ({booking.commissionSplit.hamac}%)</p>
              </div>
            </div>
          </div>
          
          {booking.monthlyPayment && booking.payments && booking.payments.length > 0 && (
            <div className="border rounded-md p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Paiements</h4>
                {pendingPaymentsCount > 0 && (
                  <Badge variant={hasOverduePayment ? "destructive" : "outline"}>
                    {pendingPaymentsCount} {pendingPaymentsCount > 1 ? 'paiements en attente' : 'paiement en attente'}
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {booking.payments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatter.date(payment.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{formatter.currency(payment.amount)}</span>
                      <Badge variant={
                        payment.status === 'paid' 
                          ? 'outline' 
                          : payment.status === 'overdue' || 
                            (payment.status === 'pending' && isAfter(new Date(), parseISO(payment.dueDate)))
                            ? 'destructive' 
                            : 'outline'
                      }>
                        {payment.status === 'paid' 
                          ? 'Payé' 
                          : payment.status === 'overdue' || 
                            (payment.status === 'pending' && isAfter(new Date(), parseISO(payment.dueDate)))
                            ? 'En retard' 
                            : 'En attente'}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {booking.payments.length > 3 && (
                  <Button variant="outline" onClick={onViewPaymentSchedule} className="mt-2">
                    Voir l'échéancier complet
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          {booking.monthlyPayment && booking.payments && booking.payments.length > 0 && (
            <Button variant="outline" onClick={onViewPaymentSchedule} className="mr-auto">
              Gérer les paiements
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
