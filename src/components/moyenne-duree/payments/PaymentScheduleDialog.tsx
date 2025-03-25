
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Booking, Payment, PaymentStatus } from "../types";
import { isAfter, parseISO } from "date-fns";

interface PaymentScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  formatter: {
    date: (date: string) => string;
    currency: (amount: number) => string;
  };
  onUpdatePaymentStatus: (bookingId: string, paymentId: string, status: PaymentStatus) => void;
}

export const PaymentScheduleDialog = ({
  open,
  onOpenChange,
  booking,
  formatter,
  onUpdatePaymentStatus
}: PaymentScheduleDialogProps) => {
  if (!booking || !booking.payments) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Échéancier de paiement</DialogTitle>
        </DialogHeader>
        <div className="py-4 max-h-[calc(80vh-180px)] overflow-y-auto pr-2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{booking.property}</h3>
            <p className="text-muted-foreground">Locataire: {booking.tenant}</p>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date d'échéance</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de paiement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {booking.payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatter.date(payment.dueDate)}</TableCell>
                  <TableCell>{formatter.currency(payment.amount)}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge payment={payment} />
                  </TableCell>
                  <TableCell>{payment.paymentDate ? formatter.date(payment.paymentDate) : '-'}</TableCell>
                  <TableCell className="text-right">
                    <PaymentActions 
                      payment={payment} 
                      booking={booking}
                      onUpdatePaymentStatus={onUpdatePaymentStatus}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-6 p-4 bg-muted rounded-md">
            <h4 className="font-medium mb-2">Récapitulatif</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-medium">{formatter.currency(booking.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payé</p>
                <p className="font-medium">
                  {formatter.currency(
                    booking.payments
                      .filter(p => p.status === 'paid')
                      .reduce((sum, p) => sum + p.amount, 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="font-medium">
                  {formatter.currency(
                    booking.payments
                      .filter(p => p.status === 'pending')
                      .reduce((sum, p) => sum + p.amount, 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En retard</p>
                <p className="font-medium">
                  {formatter.currency(
                    booking.payments
                      .filter(p => p.status === 'overdue' || 
                        (p.status === 'pending' && isAfter(new Date(), parseISO(p.dueDate))))
                      .reduce((sum, p) => sum + p.amount, 0)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface PaymentStatusBadgeProps {
  payment: Payment;
}

const PaymentStatusBadge = ({ payment }: PaymentStatusBadgeProps) => {
  const isOverdue = payment.status === 'pending' && isAfter(new Date(), parseISO(payment.dueDate));
  
  return (
    <Badge
      className={
        payment.status === 'paid' 
          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
          : payment.status === 'overdue' || isOverdue
            ? 'bg-red-100 text-red-800 hover:bg-red-200' 
            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      }
    >
      {payment.status === 'paid' 
        ? 'Payé' 
        : payment.status === 'overdue' || isOverdue
          ? 'En retard' 
          : 'En attente'}
    </Badge>
  );
};

interface PaymentActionsProps {
  payment: Payment;
  booking: Booking;
  onUpdatePaymentStatus: (bookingId: string, paymentId: string, status: PaymentStatus) => void;
}

const PaymentActions = ({ payment, booking, onUpdatePaymentStatus }: PaymentActionsProps) => {
  const isOverdue = payment.status === 'pending' && isAfter(new Date(), parseISO(payment.dueDate));
  
  if (payment.status === 'paid') {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => onUpdatePaymentStatus(booking.id, payment.id, 'pending')}
      >
        Marquer comme non payé
      </Button>
    );
  }
  
  return (
    <div className="flex gap-2 justify-end">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onUpdatePaymentStatus(booking.id, payment.id, 'paid')}
      >
        Marquer comme payé
      </Button>
      
      {payment.status === 'pending' && (
        <Button
          size="sm"
          variant={isOverdue ? "default" : "destructive"}
          onClick={() => onUpdatePaymentStatus(booking.id, payment.id, 'overdue')}
        >
          Marquer en retard
        </Button>
      )}
      
      {payment.status === 'overdue' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdatePaymentStatus(booking.id, payment.id, 'pending')}
        >
          Marquer en attente
        </Button>
      )}
    </div>
  );
};
