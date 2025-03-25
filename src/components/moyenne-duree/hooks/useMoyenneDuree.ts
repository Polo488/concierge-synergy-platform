
import { useState } from "react";
import { 
  Mandat, 
  MandatForm, 
  Booking, 
  BookingForm, 
  BookingSource, 
  Payment, 
  PaymentStatus,
  CommissionSplit, 
  Commission 
} from "../types";
import { format, isAfter, parseISO } from "date-fns";

// Mock data for mandats
const mockMandats: Mandat[] = [
  {
    id: "MANDAT-2023-001",
    property: "Appartement Bellecour",
    owner: "Jean Dupont",
    startDate: "2023-01-15",
    endDate: "2024-01-15",
    status: "active",
    notes: "Propriétaire très réactif. Immeuble avec gardien."
  },
  {
    id: "MANDAT-2023-002",
    property: "Studio Part-Dieu",
    owner: "Marie Martin",
    startDate: "2023-03-01",
    endDate: "2024-03-01",
    status: "active",
    notes: "Rénovation complète en 2022."
  },
  {
    id: "MANDAT-2023-003",
    property: "Loft Croix-Rousse",
    owner: "Pierre Bertrand",
    startDate: "2022-11-01",
    endDate: "2023-11-01",
    status: "expired",
    notes: "À renouveler rapidement. Propriétaire satisfait."
  },
  {
    id: "MANDAT-2024-001",
    property: "T2 Confluence",
    owner: "Sophie Blanc",
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    status: "active",
    notes: "Nouveau mandat. Première location pour ce propriétaire."
  }
];

// Mock data for bookings
const mockBookings: Booking[] = [
  {
    id: "MD-2023-001",
    property: "Appartement Bellecour",
    tenant: "Marie Dupont",
    startDate: "2023-10-15",
    endDate: "2023-12-15",
    amount: 3000,
    cleaningFee: 150,
    commissionRate: 20,
    commissionSplit: {
      bnbLyon: 50,
      hamac: 50
    },
    commission: {
      total: 570,
      bnbLyon: 285,
      hamac: 285
    },
    source: "airbnb",
    monthlyPayment: false,
    status: "active"
  },
  {
    id: "MD-2023-002",
    property: "Studio Part-Dieu",
    tenant: "Lucas Martin",
    startDate: "2023-11-01",
    endDate: "2024-01-31",
    amount: 2400,
    cleaningFee: 120,
    commissionRate: 20,
    commissionSplit: {
      bnbLyon: 50,
      hamac: 50
    },
    commission: {
      total: 456,
      bnbLyon: 228,
      hamac: 228
    },
    source: "homelike",
    monthlyPayment: true,
    payments: [
      {
        id: "PAY-001",
        dueDate: "2023-11-01",
        amount: 800,
        status: "paid",
        paymentDate: "2023-11-01"
      },
      {
        id: "PAY-002",
        dueDate: "2023-12-01",
        amount: 800,
        status: "paid",
        paymentDate: "2023-12-02"
      },
      {
        id: "PAY-003",
        dueDate: "2024-01-01",
        amount: 800,
        status: "pending"
      }
    ],
    status: "active"
  },
  {
    id: "MD-2023-003",
    property: "Loft Croix-Rousse",
    tenant: "Sophie Bertrand",
    startDate: "2023-09-01",
    endDate: "2023-11-30",
    amount: 3600,
    cleaningFee: 180,
    commissionRate: 20,
    commissionSplit: {
      bnbLyon: 50,
      hamac: 50
    },
    commission: {
      total: 684,
      bnbLyon: 342,
      hamac: 342
    },
    source: "direct",
    monthlyPayment: true,
    payments: [
      {
        id: "PAY-004",
        dueDate: "2023-09-01",
        amount: 1200,
        status: "paid",
        paymentDate: "2023-09-01"
      },
      {
        id: "PAY-005",
        dueDate: "2023-10-01",
        amount: 1200,
        status: "paid",
        paymentDate: "2023-10-01"
      },
      {
        id: "PAY-006",
        dueDate: "2023-11-01",
        amount: 1200,
        status: "paid",
        paymentDate: "2023-11-01"
      }
    ],
    status: "completed"
  },
  {
    id: "MD-2024-001",
    property: "T2 Confluence",
    tenant: "Thomas Roux",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    amount: 3200,
    cleaningFee: 160,
    commissionRate: 20,
    commissionSplit: {
      bnbLyon: 50,
      hamac: 50
    },
    commission: {
      total: 608,
      bnbLyon: 304,
      hamac: 304
    },
    source: "wunderflats",
    monthlyPayment: true,
    payments: [
      {
        id: "PAY-007",
        dueDate: "2024-01-01",
        amount: 1066.67,
        status: "paid",
        paymentDate: "2024-01-01"
      },
      {
        id: "PAY-008",
        dueDate: "2024-02-01",
        amount: 1066.67,
        status: "paid",
        paymentDate: "2024-02-01"
      },
      {
        id: "PAY-009",
        dueDate: "2024-03-01",
        amount: 1066.66,
        status: "pending"
      }
    ],
    status: "active"
  }
];

// Utility to calculate commission
export const calculateCommission = (
  amount: number,
  cleaningFee: number,
  commissionRate: number,
  commissionSplit: CommissionSplit
): Commission => {
  // Calculate total commission
  const totalAmount = amount + cleaningFee;
  const totalCommission = (totalAmount * commissionRate) / 100;
  
  // Calculate individual shares
  const bnbLyonCommission = (totalCommission * commissionSplit.bnbLyon) / 100;
  const hamacCommission = (totalCommission * commissionSplit.hamac) / 100;
  
  return {
    total: parseFloat(totalCommission.toFixed(2)),
    bnbLyon: parseFloat(bnbLyonCommission.toFixed(2)),
    hamac: parseFloat(hamacCommission.toFixed(2))
  };
};

// Utility to generate payment schedule
export const generatePaymentSchedule = (
  startDate: string,
  endDate: string,
  totalAmount: number,
  paymentDay: string
): Payment[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const payments: Payment[] = [];
  
  // Calculate number of months
  let currentDate = new Date(start);
  let monthCounter = 0;
  
  while (currentDate <= end) {
    monthCounter++;
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  // If less than a month, just one payment
  if (monthCounter <= 1) {
    return [{
      id: `PAY-${Date.now()}-1`,
      dueDate: format(start, 'yyyy-MM-dd'),
      amount: totalAmount,
      status: 'pending'
    }];
  }
  
  // Calculate monthly payment amount
  const monthlyAmount = parseFloat((totalAmount / monthCounter).toFixed(2));
  
  // Generate payment schedule
  currentDate = new Date(start);
  let paymentId = 1;
  
  // If payment day is specified, use it
  const usePaymentDay = paymentDay && !isNaN(parseInt(paymentDay));
  const specifiedDay = usePaymentDay ? parseInt(paymentDay) : start.getDate();
  
  for (let i = 0; i < monthCounter; i++) {
    let paymentDate = new Date(currentDate);
    
    // Set the payment day if specified
    if (usePaymentDay) {
      // Make sure the day exists in the current month
      const lastDayOfMonth = new Date(
        paymentDate.getFullYear(),
        paymentDate.getMonth() + 1,
        0
      ).getDate();
      
      paymentDate.setDate(Math.min(specifiedDay, lastDayOfMonth));
    }
    
    // Last payment might be different to match total amount
    const isLastPayment = i === monthCounter - 1;
    let paymentAmount = monthlyAmount;
    
    if (isLastPayment) {
      const totalPaid = monthlyAmount * (monthCounter - 1);
      paymentAmount = parseFloat((totalAmount - totalPaid).toFixed(2));
    }
    
    payments.push({
      id: `PAY-${Date.now()}-${paymentId}`,
      dueDate: format(paymentDate, 'yyyy-MM-dd'),
      amount: paymentAmount,
      status: 'pending'
    });
    
    paymentId++;
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return payments;
};

// Function to get source label
export const getSourceLabel = (source: BookingSource): string => {
  switch (source) {
    case 'airbnb':
      return 'Airbnb';
    case 'booking':
      return 'Booking.com';
    case 'homelike':
      return 'Homelike';
    case 'wunderflats':
      return 'Wunderflats';
    case 'direct':
      return 'Direct';
    case 'relocation':
      return 'Agence relocation';
    case 'other':
      return 'Autre';
    default:
      return source;
  }
};

// Custom hook for mandat management
export const useMandats = () => {
  const [mandats, setMandats] = useState<Mandat[]>(mockMandats);
  const [mandatDialogOpen, setMandatDialogOpen] = useState(false);
  const [selectedMandat, setSelectedMandat] = useState<Mandat | null>(null);
  const [isEditingMandat, setIsEditingMandat] = useState(false);
  const [mandatDetailsDialogOpen, setMandatDetailsDialogOpen] = useState(false);
  const [mandatToDelete, setMandatToDelete] = useState<string | null>(null);
  const [deleteMandatConfirmOpen, setDeleteMandatConfirmOpen] = useState(false);
  
  // Initialize mandat form state
  const [mandatForm, setMandatForm] = useState<MandatForm>({
    id: "",
    property: "",
    owner: "",
    startDate: "",
    endDate: "",
    notes: "",
  });
  
  // Reset mandat form
  const resetMandatForm = () => {
    setMandatForm({
      id: "",
      property: "",
      owner: "",
      startDate: "",
      endDate: "",
      notes: "",
    });
    setIsEditingMandat(false);
  };
  
  // Handle mandat form input changes
  const handleMandatInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMandatForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Add a new mandat
  const addMandat = (mandat: Mandat) => {
    setMandats([mandat, ...mandats]);
  };
  
  // Update an existing mandat
  const updateMandat = (mandat: Mandat) => {
    const updatedMandats = mandats.map(m => 
      m.id === mandat.id ? mandat : m
    );
    setMandats(updatedMandats);
  };
  
  // Delete a mandat
  const deleteMandat = (id: string) => {
    const updatedMandats = mandats.filter(mandat => mandat.id !== id);
    setMandats(updatedMandats);
  };
  
  // Confirm delete mandat
  const confirmDeleteMandat = () => {
    if (mandatToDelete) {
      deleteMandat(mandatToDelete);
      setDeleteMandatConfirmOpen(false);
      setMandatToDelete(null);
    }
  };
  
  return {
    mandats,
    addMandat,
    updateMandat,
    deleteMandat,
    mandatDialogOpen,
    setMandatDialogOpen,
    selectedMandat,
    setSelectedMandat,
    isEditingMandat,
    setIsEditingMandat,
    mandatForm,
    setMandatForm,
    mandatDetailsDialogOpen,
    setMandatDetailsDialogOpen,
    mandatToDelete,
    setMandatToDelete,
    deleteMandatConfirmOpen,
    setDeleteMandatConfirmOpen,
    resetMandatForm,
    handleMandatInputChange,
    confirmDeleteMandat
  };
};

// Custom hook for booking management
export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditingBooking, setIsEditingBooking] = useState(false);
  const [bookingDetailsDialogOpen, setBookingDetailsDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [paymentScheduleOpen, setPaymentScheduleOpen] = useState(false);
  
  // Initialize booking form state
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    id: "",
    property: "",
    tenant: "",
    startDate: "",
    endDate: "",
    amount: "",
    cleaningFee: "",
    commissionRate: "20",
    bnbLyonSplit: "50",
    hamacSplit: "50",
    source: "airbnb",
    monthlyPayment: false,
    paymentDay: "",
  });
  
  // Reset booking form
  const resetBookingForm = () => {
    setBookingForm({
      id: "",
      property: "",
      tenant: "",
      startDate: "",
      endDate: "",
      amount: "",
      cleaningFee: "",
      commissionRate: "20",
      bnbLyonSplit: "50",
      hamacSplit: "50",
      source: "airbnb",
      monthlyPayment: false,
      paymentDay: "",
    });
    setIsEditingBooking(false);
  };
  
  // Handle booking form input changes
  const handleBookingInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setBookingForm(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setBookingForm(prev => ({ ...prev, [name]: value }));
    }
    
    // If updating bnbLyonSplit, automatically update hamacSplit
    if (name === 'bnbLyonSplit') {
      const bnbLyonSplit = parseInt(value) || 0;
      setBookingForm(prev => ({ 
        ...prev, 
        hamacSplit: (100 - bnbLyonSplit).toString() 
      }));
    }
    
    // If updating hamacSplit, automatically update bnbLyonSplit
    if (name === 'hamacSplit') {
      const hamacSplit = parseInt(value) || 0;
      setBookingForm(prev => ({ 
        ...prev, 
        bnbLyonSplit: (100 - hamacSplit).toString() 
      }));
    }
  };
  
  // Add a new booking
  const addBooking = (booking: Booking) => {
    setBookings([booking, ...bookings]);
  };
  
  // Update an existing booking
  const updateBooking = (booking: Booking) => {
    const updatedBookings = bookings.map(b => 
      b.id === booking.id ? booking : b
    );
    setBookings(updatedBookings);
  };
  
  // Delete a booking
  const deleteBooking = (id: string) => {
    const updatedBookings = bookings.filter(booking => booking.id !== id);
    setBookings(updatedBookings);
  };
  
  // Update payment status
  const updatePaymentStatus = (bookingId: string, paymentId: string, status: PaymentStatus) => {
    setBookings(prevBookings => {
      return prevBookings.map(booking => {
        if (booking.id === bookingId && booking.payments) {
          const updatedPayments = booking.payments.map(payment => {
            if (payment.id === paymentId) {
              return {
                ...payment,
                status,
                paymentDate: status === 'paid' ? format(new Date(), 'yyyy-MM-dd') : payment.paymentDate
              };
            }
            return payment;
          });
          
          return {
            ...booking,
            payments: updatedPayments
          };
        }
        return booking;
      });
    });
    
    if (selectedBooking && selectedBooking.id === bookingId) {
      const updatedBooking = bookings.find(b => b.id === bookingId);
      if (updatedBooking) {
        setSelectedBooking(updatedBooking);
      }
    }
  };
  
  return {
    bookings,
    addBooking,
    updateBooking,
    deleteBooking,
    updatePaymentStatus,
    bookingDialogOpen,
    setBookingDialogOpen,
    selectedBooking,
    setSelectedBooking,
    isEditingBooking,
    setIsEditingBooking,
    bookingForm,
    setBookingForm,
    bookingDetailsDialogOpen,
    setBookingDetailsDialogOpen,
    bookingToDelete,
    setBookingToDelete,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    paymentScheduleOpen,
    setPaymentScheduleOpen,
    resetBookingForm,
    handleBookingInputChange
  };
};
