
import { Booking, BookingStatus, StatusInfo, CommissionSplitInfo, BookingSource } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, BellRing, Bell } from "lucide-react";
import { isAfter, parseISO } from "date-fns";

interface BookingsListProps {
  bookings: Booking[];
  formatter: {
    date: (date: string) => string;
    currency: (amount: number) => string;
  };
  statusInfo: StatusInfo<BookingStatus>;
  getCommissionSplitInfo: (booking: Booking) => CommissionSplitInfo;
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
  onViewDetails: (booking: Booking) => void;
  getSourceLabel: (source: BookingSource) => string;
}

export const BookingsList = ({ 
  bookings, 
  formatter, 
  statusInfo, 
  getCommissionSplitInfo, 
  onEdit, 
  onDelete, 
  onViewDetails,
  getSourceLabel
}: BookingsListProps) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center p-8 bg-muted rounded-lg">
        <p className="text-muted-foreground">Aucune réservation trouvée</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          formatter={formatter}
          statusInfo={statusInfo}
          commissionSplitInfo={getCommissionSplitInfo(booking)}
          onEdit={() => onEdit(booking)}
          onDelete={() => onDelete(booking.id)}
          onViewDetails={() => onViewDetails(booking)}
          getSourceLabel={getSourceLabel}
        />
      ))}
    </div>
  );
};

// Booking Card Component
interface BookingCardProps {
  booking: Booking;
  formatter: {
    date: (date: string) => string;
    currency: (amount: number) => string;
  };
  statusInfo: StatusInfo<BookingStatus>;
  commissionSplitInfo: CommissionSplitInfo;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
  getSourceLabel: (source: BookingSource) => string;
}

const BookingCard = ({ 
  booking, 
  formatter, 
  statusInfo, 
  commissionSplitInfo, 
  onEdit, 
  onDelete, 
  onViewDetails,
  getSourceLabel
}: BookingCardProps) => {
  // Check for upcoming payments
  const hasUpcomingPayment = booking.monthlyPayment && 
    booking.payments?.some(p => p.status === "pending");
  
  // Find the next payment due
  const nextPayment = booking.payments?.find(p => p.status === "pending");
  
  // Check if any payment is overdue
  const hasOverduePayment = booking.payments?.some(p => 
    p.status === "pending" && isAfter(new Date(), parseISO(p.dueDate))
  );

  return (
    <Card className="animate-fade-in cursor-pointer hover:shadow-card transition-shadow" onClick={onViewDetails}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{booking.property}</CardTitle>
            <CardDescription>Locataire: {booking.tenant}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.getColor(booking.status)}`}>
              {statusInfo.getLabel(booking.status)}
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${commissionSplitInfo.color}`}>
              {commissionSplitInfo.label}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }} className="cursor-pointer">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }} className="cursor-pointer text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Période</p>
            <p>{formatter.date(booking.startDate)} - {formatter.date(booking.endDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Montant</p>
            <p className="font-medium">{formatter.currency(booking.amount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Source</p>
            <p className="font-medium">{getSourceLabel(booking.source)}</p>
          </div>
        </div>
        
        {booking.monthlyPayment && nextPayment && (
          <div className="mt-4 flex items-center justify-between p-2 rounded-md border border-gray-200">
            <div className="flex items-center gap-2">
              {hasOverduePayment ? (
                <BellRing className="text-red-500 h-5 w-5" />
              ) : (
                <Bell className="text-blue-500 h-5 w-5" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {hasOverduePayment ? 'Paiement en retard' : 'Prochain paiement'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatter.date(nextPayment.dueDate)} - {formatter.currency(nextPayment.amount)}
                </p>
              </div>
            </div>
            <Badge 
              variant={hasOverduePayment ? "destructive" : "outline"}
              className="ml-2"
            >
              {hasOverduePayment ? 'En retard' : 'À venir'}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
