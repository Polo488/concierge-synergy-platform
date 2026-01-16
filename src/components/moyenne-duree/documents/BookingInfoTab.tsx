
import { Booking, BookingSource, BookingStatus, StatusInfo } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Euro, Briefcase } from "lucide-react";
import { isAfter, parseISO } from "date-fns";

interface BookingInfoTabProps {
  booking: Booking;
  formatter: {
    date: (date: string) => string;
    currency: (amount: number) => string;
  };
  statusInfo: StatusInfo<BookingStatus>;
  getSourceLabel: (source: BookingSource) => string;
  onViewPaymentSchedule?: () => void;
}

export const BookingInfoTab = ({
  booking,
  formatter,
  statusInfo,
  getSourceLabel,
  onViewPaymentSchedule,
}: BookingInfoTabProps) => {
  const hasOverduePayment = booking.payments?.some(
    (p) => p.status === "pending" && isAfter(new Date(), parseISO(p.dueDate))
  );
  const pendingPaymentsCount = booking.payments?.filter((p) => p.status === "pending").length || 0;

  return (
    <div className="space-y-6">
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

      <Card>
        <CardContent className="pt-6">
          <h4 className="font-medium mb-4">Détails de la commission</h4>
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
              <p>{formatter.currency(booking.commission.bnbLyon)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Part Hamac</p>
              <p>{formatter.currency(booking.commission.hamac)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {booking.monthlyPayment && booking.payments && booking.payments.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Paiements</h4>
              {pendingPaymentsCount > 0 && (
                <Badge variant={hasOverduePayment ? "destructive" : "outline"}>
                  {pendingPaymentsCount} en attente
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              {booking.payments.slice(0, 3).map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatter.date(payment.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{formatter.currency(payment.amount)}</span>
                    <Badge variant={payment.status === "paid" ? "outline" : "destructive"}>
                      {payment.status === "paid" ? "Payé" : "En attente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            {booking.payments.length > 3 && onViewPaymentSchedule && (
              <Button variant="outline" onClick={onViewPaymentSchedule} className="mt-4 w-full">
                Voir l'échéancier complet
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
