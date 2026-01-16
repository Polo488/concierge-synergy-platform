
import { useState } from "react";
import { format, parseISO, addMonths, startOfMonth, endOfMonth, differenceInMonths } from "date-fns";
import { fr } from "date-fns/locale";
import {
  RentCall,
  RentReceipt,
  DocumentStatus,
  TimelineEntry,
  TimelineEntryType,
  ExtendedBooking,
} from "../types";

// Mock rent calls
const mockRentCalls: RentCall[] = [
  {
    id: "RC-001",
    bookingId: "MD-2023-002",
    month: "2023-11",
    amount: 800,
    dueDate: "2023-11-01",
    status: "paid",
    generatedAt: "2023-10-25",
    sentAt: "2023-10-25",
    paidAt: "2023-11-01",
  },
  {
    id: "RC-002",
    bookingId: "MD-2023-002",
    month: "2023-12",
    amount: 800,
    dueDate: "2023-12-01",
    status: "paid",
    generatedAt: "2023-11-25",
    sentAt: "2023-11-25",
    paidAt: "2023-12-02",
  },
  {
    id: "RC-003",
    bookingId: "MD-2023-002",
    month: "2024-01",
    amount: 800,
    dueDate: "2024-01-01",
    status: "sent",
    generatedAt: "2023-12-25",
    sentAt: "2023-12-26",
  },
];

// Mock rent receipts
const mockRentReceipts: RentReceipt[] = [
  {
    id: "RR-001",
    bookingId: "MD-2023-002",
    rentCallId: "RC-001",
    month: "2023-11",
    amount: 800,
    paymentDate: "2023-11-01",
    status: "sent",
    generatedAt: "2023-11-02",
    sentAt: "2023-11-02",
  },
  {
    id: "RR-002",
    bookingId: "MD-2023-002",
    rentCallId: "RC-002",
    month: "2023-12",
    amount: 800,
    paymentDate: "2023-12-02",
    status: "sent",
    generatedAt: "2023-12-03",
    sentAt: "2023-12-03",
  },
];

// Generate timeline from rent calls and receipts
const generateTimeline = (
  rentCalls: RentCall[],
  rentReceipts: RentReceipt[],
  bookingId: string
): TimelineEntry[] => {
  const entries: TimelineEntry[] = [];

  rentCalls
    .filter((rc) => rc.bookingId === bookingId)
    .forEach((rc) => {
      if (rc.generatedAt) {
        entries.push({
          id: `TL-${rc.id}-created`,
          bookingId,
          type: "rent_call_created",
          date: rc.generatedAt,
          description: `Appel de loyer créé pour ${format(parseISO(`${rc.month}-01`), "MMMM yyyy", { locale: fr })}`,
          documentId: rc.id,
        });
      }
      if (rc.sentAt) {
        entries.push({
          id: `TL-${rc.id}-sent`,
          bookingId,
          type: "rent_call_sent",
          date: rc.sentAt,
          description: `Appel de loyer envoyé pour ${format(parseISO(`${rc.month}-01`), "MMMM yyyy", { locale: fr })}`,
          documentId: rc.id,
        });
      }
      if (rc.paidAt) {
        entries.push({
          id: `TL-${rc.id}-paid`,
          bookingId,
          type: "rent_call_paid",
          date: rc.paidAt,
          description: `Loyer payé pour ${format(parseISO(`${rc.month}-01`), "MMMM yyyy", { locale: fr })}`,
          documentId: rc.id,
        });
      }
    });

  rentReceipts
    .filter((rr) => rr.bookingId === bookingId)
    .forEach((rr) => {
      if (rr.generatedAt) {
        entries.push({
          id: `TL-${rr.id}-created`,
          bookingId,
          type: "receipt_created",
          date: rr.generatedAt,
          description: `Quittance créée pour ${format(parseISO(`${rr.month}-01`), "MMMM yyyy", { locale: fr })}`,
          documentId: rr.id,
        });
      }
      if (rr.sentAt) {
        entries.push({
          id: `TL-${rr.id}-sent`,
          bookingId,
          type: "receipt_sent",
          date: rr.sentAt,
          description: `Quittance envoyée pour ${format(parseISO(`${rr.month}-01`), "MMMM yyyy", { locale: fr })}`,
          documentId: rr.id,
        });
      }
    });

  // Sort by date descending
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Calculate months covered by a booking
export const getBookingMonths = (startDate: string, endDate: string): string[] => {
  const start = startOfMonth(parseISO(startDate));
  const end = endOfMonth(parseISO(endDate));
  const months: string[] = [];
  
  let current = start;
  while (current <= end) {
    months.push(format(current, "yyyy-MM"));
    current = addMonths(current, 1);
  }
  
  return months;
};

// Hook for managing rent calls
export const useRentCalls = () => {
  const [rentCalls, setRentCalls] = useState<RentCall[]>(mockRentCalls);
  const [selectedRentCall, setSelectedRentCall] = useState<RentCall | null>(null);
  const [rentCallDialogOpen, setRentCallDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const getRentCallsForBooking = (bookingId: string) => {
    return rentCalls.filter((rc) => rc.bookingId === bookingId);
  };

  const generateRentCall = (
    bookingId: string,
    month: string,
    amount: number,
    dueDate: string
  ): RentCall => {
    const newRentCall: RentCall = {
      id: `RC-${Date.now()}`,
      bookingId,
      month,
      amount,
      dueDate,
      status: "draft",
      generatedAt: format(new Date(), "yyyy-MM-dd"),
    };
    
    setRentCalls((prev) => [...prev, newRentCall]);
    return newRentCall;
  };

  const generateAllRentCalls = (
    bookingId: string,
    startDate: string,
    endDate: string,
    monthlyAmount: number,
    paymentDay: number = 1
  ): RentCall[] => {
    const months = getBookingMonths(startDate, endDate);
    const newCalls: RentCall[] = [];
    
    months.forEach((month) => {
      // Check if already exists
      const exists = rentCalls.some(
        (rc) => rc.bookingId === bookingId && rc.month === month
      );
      
      if (!exists) {
        const dueDate = `${month}-${String(paymentDay).padStart(2, "0")}`;
        const rentCall = generateRentCall(bookingId, month, monthlyAmount, dueDate);
        newCalls.push(rentCall);
      }
    });
    
    return newCalls;
  };

  const updateRentCallStatus = (
    rentCallId: string,
    status: DocumentStatus,
    additionalData?: Partial<RentCall>
  ) => {
    setRentCalls((prev) =>
      prev.map((rc) =>
        rc.id === rentCallId
          ? {
              ...rc,
              status,
              ...additionalData,
              ...(status === "sent" && !rc.sentAt ? { sentAt: format(new Date(), "yyyy-MM-dd") } : {}),
              ...(status === "paid" && !rc.paidAt ? { paidAt: format(new Date(), "yyyy-MM-dd") } : {}),
            }
          : rc
      )
    );
  };

  const markAsSent = (rentCallId: string) => {
    updateRentCallStatus(rentCallId, "sent");
  };

  const markAsPaid = (rentCallId: string, paymentDate?: string) => {
    updateRentCallStatus(rentCallId, "paid", {
      paidAt: paymentDate || format(new Date(), "yyyy-MM-dd"),
    });
  };

  const deleteRentCall = (rentCallId: string) => {
    setRentCalls((prev) => prev.filter((rc) => rc.id !== rentCallId));
  };

  return {
    rentCalls,
    selectedRentCall,
    setSelectedRentCall,
    rentCallDialogOpen,
    setRentCallDialogOpen,
    isGenerating,
    getRentCallsForBooking,
    generateRentCall,
    generateAllRentCalls,
    updateRentCallStatus,
    markAsSent,
    markAsPaid,
    deleteRentCall,
  };
};

// Hook for managing rent receipts
export const useRentReceipts = () => {
  const [rentReceipts, setRentReceipts] = useState<RentReceipt[]>(mockRentReceipts);
  const [selectedReceipt, setSelectedReceipt] = useState<RentReceipt | null>(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);

  const getReceiptsForBooking = (bookingId: string) => {
    return rentReceipts.filter((rr) => rr.bookingId === bookingId);
  };

  const getReceiptForRentCall = (rentCallId: string) => {
    return rentReceipts.find((rr) => rr.rentCallId === rentCallId);
  };

  const generateReceipt = (
    bookingId: string,
    rentCall: RentCall,
    paymentDate: string
  ): RentReceipt => {
    const newReceipt: RentReceipt = {
      id: `RR-${Date.now()}`,
      bookingId,
      rentCallId: rentCall.id,
      month: rentCall.month,
      amount: rentCall.amount,
      paymentDate,
      status: "generated",
      generatedAt: format(new Date(), "yyyy-MM-dd"),
    };
    
    setRentReceipts((prev) => [...prev, newReceipt]);
    return newReceipt;
  };

  const updateReceiptStatus = (
    receiptId: string,
    status: DocumentStatus,
    additionalData?: Partial<RentReceipt>
  ) => {
    setRentReceipts((prev) =>
      prev.map((rr) =>
        rr.id === receiptId
          ? {
              ...rr,
              status,
              ...additionalData,
              ...(status === "sent" && !rr.sentAt ? { sentAt: format(new Date(), "yyyy-MM-dd") } : {}),
            }
          : rr
      )
    );
  };

  const markAsSent = (receiptId: string) => {
    updateReceiptStatus(receiptId, "sent");
  };

  const deleteReceipt = (receiptId: string) => {
    setRentReceipts((prev) => prev.filter((rr) => rr.id !== receiptId));
  };

  return {
    rentReceipts,
    selectedReceipt,
    setSelectedReceipt,
    receiptDialogOpen,
    setReceiptDialogOpen,
    getReceiptsForBooking,
    getReceiptForRentCall,
    generateReceipt,
    updateReceiptStatus,
    markAsSent,
    deleteReceipt,
  };
};

// Hook for combined document timeline
export const useDocumentTimeline = (bookingId: string) => {
  const { rentCalls } = useRentCalls();
  const { rentReceipts } = useRentReceipts();

  const timeline = generateTimeline(rentCalls, rentReceipts, bookingId);

  return { timeline };
};

// Format month for display
export const formatMonth = (month: string): string => {
  return format(parseISO(`${month}-01`), "MMMM yyyy", { locale: fr });
};

// Get status label and color
export const getDocumentStatusInfo = (status: DocumentStatus) => {
  switch (status) {
    case "draft":
      return { label: "Brouillon", color: "bg-gray-100 text-gray-800" };
    case "generated":
      return { label: "Généré", color: "bg-blue-100 text-blue-800" };
    case "sent":
      return { label: "Envoyé", color: "bg-yellow-100 text-yellow-800" };
    case "paid":
      return { label: "Payé", color: "bg-green-100 text-green-800" };
    default:
      return { label: status, color: "bg-gray-100 text-gray-800" };
  }
};
