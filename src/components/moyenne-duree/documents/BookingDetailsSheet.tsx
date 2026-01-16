
import { Booking, BookingSource, BookingStatus, StatusInfo } from "../types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, FileCheck, ScrollText, Info } from "lucide-react";
import { RentCallsTab } from "./RentCallsTab";
import { ReceiptsTab } from "./ReceiptsTab";
import { LeaseTab } from "./LeaseTab";
import { BookingInfoTab } from "./BookingInfoTab";

interface BookingDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  formatter: {
    date: (date: string) => string;
    currency: (amount: number) => string;
  };
  statusInfo: StatusInfo<BookingStatus>;
  getSourceLabel: (source: BookingSource) => string;
  onViewPaymentSchedule?: () => void;
}

export const BookingDetailsSheet = ({
  open,
  onOpenChange,
  booking,
  formatter,
  statusInfo,
  getSourceLabel,
  onViewPaymentSchedule,
}: BookingDetailsSheetProps) => {
  if (!booking) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[800px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle>{booking.property}</SheetTitle>
            <Badge className={statusInfo.getColor(booking.status)}>
              {statusInfo.getLabel(booking.status)}
            </Badge>
          </div>
          <SheetDescription>
            {booking.tenant} • {formatter.date(booking.startDate)} - {formatter.date(booking.endDate)}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Infos</span>
            </TabsTrigger>
            <TabsTrigger value="rent-calls" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Appels</span>
            </TabsTrigger>
            <TabsTrigger value="receipts" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Quittances</span>
            </TabsTrigger>
            <TabsTrigger value="lease" className="flex items-center gap-2">
              <ScrollText className="h-4 w-4" />
              <span className="hidden sm:inline">Bail</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <BookingInfoTab 
              booking={booking} 
              formatter={formatter}
              statusInfo={statusInfo}
              getSourceLabel={getSourceLabel}
              onViewPaymentSchedule={onViewPaymentSchedule}
            />
          </TabsContent>

          <TabsContent value="rent-calls">
            <RentCallsTab booking={booking} formatter={formatter} />
          </TabsContent>

          <TabsContent value="receipts">
            <ReceiptsTab booking={booking} formatter={formatter} />
          </TabsContent>

          <TabsContent value="lease">
            <LeaseTab booking={booking} formatter={formatter} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
