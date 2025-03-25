
import { useEffect, useState } from "react";
import { Plus, TrendingUp, ChartBar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Checkbox } from "@/components/ui/checkbox";
import ClientsManager from "@/components/moyenne-duree/ClientsManager";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Import refactored components
import { MandatsList } from "@/components/moyenne-duree/mandats/MandatsList";
import { MandatFormDialog } from "@/components/moyenne-duree/mandats/MandatFormDialog";
import { MandatDetailsDialog } from "@/components/moyenne-duree/mandats/MandatDetailsDialog";
import { BookingsList } from "@/components/moyenne-duree/bookings/BookingsList";
import { BookingFormDialog } from "@/components/moyenne-duree/bookings/BookingFormDialog";
import { BookingDetailsDialog } from "@/components/moyenne-duree/bookings/BookingDetailsDialog";
import { PaymentScheduleDialog } from "@/components/moyenne-duree/payments/PaymentScheduleDialog";
import { 
  useMandats, 
  useBookings,
  calculateCommission,
  generatePaymentSchedule,
  getSourceLabel 
} from "@/components/moyenne-duree/hooks/useMoyenneDuree";
import type { 
  Mandat, 
  MandatStatus, 
  Booking, 
  BookingSource, 
  Payment 
} from "@/components/moyenne-duree/types";

const MoyenneDuree = () => {
  useEffect(() => {
    document.title = "Moyenne Durée - GESTION BNB LYON";
  }, []);

  const [activeTab, setActiveTab] = useState("locations");
  
  // Use the custom hooks for state management
  const { 
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
  } = useMandats();
  
  const {
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
  } = useBookings();
  
  // Formatters
  const formatter = {
    date: (dateString: string) => {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    },
    currency: (amount: number) => {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    }
  };
  
  // Mandat status helpers
  const mandatStatusInfo = {
    getColor: (status: MandatStatus) => {
      switch (status) {
        case 'active':
          return 'bg-green-100 text-green-800';
        case 'expired':
          return 'bg-yellow-100 text-yellow-800';
        case 'terminated':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    },
    getLabel: (status: MandatStatus) => {
      switch (status) {
        case 'active':
          return 'Actif';
        case 'expired':
          return 'Expiré';
        case 'terminated':
          return 'Résilié';
        default:
          return status;
      }
    }
  };
  
  // Booking status helpers
  const bookingStatusInfo = {
    getColor: (status: string) => {
      switch (status) {
        case 'upcoming':
          return 'bg-blue-100 text-blue-800';
        case 'active':
          return 'bg-green-100 text-green-800';
        case 'completed':
          return 'bg-purple-100 text-purple-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    },
    getLabel: (status: string) => {
      switch (status) {
        case 'upcoming':
          return 'À venir';
        case 'active':
          return 'En cours';
        case 'completed':
          return 'Terminé';
        default:
          return status;
      }
    }
  };
  
  // Commission split info
  const getCommissionSplitInfo = (booking: Booking) => {
    const bnbLyonPercent = booking.commissionSplit.bnbLyon;
    
    if (bnbLyonPercent === 100) {
      return { label: "100% BnB Lyon", color: "bg-blue-100 text-blue-800" };
    } else if (bnbLyonPercent === 0) {
      return { label: "100% Hamac", color: "bg-orange-100 text-orange-800" };
    } else {
      return { 
        label: `${bnbLyonPercent}% BnB / ${booking.commissionSplit.hamac}% Hamac`, 
        color: "bg-purple-100 text-purple-800" 
      };
    }
  };
  
  // Add or Update a mandat
  const handleAddOrUpdateMandat = () => {
    // Valider le formulaire
    if (!mandatForm.property || !mandatForm.owner || !mandatForm.startDate || 
        !mandatForm.endDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Determine status based on dates
    const now = new Date();
    const endDate = new Date(mandatForm.endDate);
    
    let status: MandatStatus = "active";
    if (now > endDate) {
      status = "expired";
    }

    if (isEditingMandat && mandatForm.id) {
      // Update existing mandat
      updateMandat({
        id: mandatForm.id,
        property: mandatForm.property,
        owner: mandatForm.owner,
        startDate: mandatForm.startDate,
        endDate: mandatForm.endDate,
        notes: mandatForm.notes,
        status: status
      });
      toast.success("Mandat mis à jour avec succès");
    } else {
      // Create new mandat
      const newId = `MANDAT-${new Date().getFullYear()}-${(mandats.length + 1).toString().padStart(3, '0')}`;
      
      addMandat({
        id: newId,
        property: mandatForm.property,
        owner: mandatForm.owner,
        startDate: mandatForm.startDate,
        endDate: mandatForm.endDate,
        notes: mandatForm.notes,
        status: status
      });
      toast.success("Mandat ajouté avec succès");
    }

    resetMandatForm();
    setMandatDialogOpen(false);
  };
  
  // Logic for handling booking form submission
  const handleAddOrUpdateBooking = () => {
    if (!bookingForm.property || !bookingForm.tenant || !bookingForm.startDate || 
        !bookingForm.endDate || !bookingForm.amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Parse numeric values
    const amount = parseFloat(bookingForm.amount);
    const cleaningFee = parseFloat(bookingForm.cleaningFee || "0");
    const commissionRate = parseInt(bookingForm.commissionRate);
    const bnbLyonSplit = parseInt(bookingForm.bnbLyonSplit);
    const hamacSplit = parseInt(bookingForm.hamacSplit);

    // Calculate commission
    const commission = calculateCommission(
      amount,
      cleaningFee,
      commissionRate,
      { bnbLyon: bnbLyonSplit, hamac: hamacSplit }
    );

    // Determine status based on dates
    const now = new Date();
    const startDate = new Date(bookingForm.startDate);
    const endDate = new Date(bookingForm.endDate);
    
    let status: "upcoming" | "active" | "completed" = "upcoming";
    if (now >= startDate && now <= endDate) {
      status = "active";
    } else if (now > endDate) {
      status = "completed";
    }

    // Generate payment schedule if monthly payment is checked
    let payments: Payment[] | undefined;
    if (bookingForm.monthlyPayment) {
      payments = generatePaymentSchedule(
        bookingForm.startDate,
        bookingForm.endDate,
        amount,
        bookingForm.paymentDay || ""
      );
    }

    if (isEditingBooking && bookingForm.id) {
      // Update existing booking
      updateBooking({
        id: bookingForm.id,
        property: bookingForm.property,
        tenant: bookingForm.tenant,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        amount: amount,
        cleaningFee: cleaningFee,
        commissionRate: commissionRate,
        commissionSplit: {
          bnbLyon: bnbLyonSplit,
          hamac: hamacSplit
        },
        commission: commission,
        source: bookingForm.source as BookingSource,
        monthlyPayment: bookingForm.monthlyPayment,
        payments: payments,
        status: status
      });
      toast.success("Réservation mise à jour avec succès");
    } else {
      // Create new booking
      const newId = `MD-${new Date().getFullYear()}-${(bookings.length + 1).toString().padStart(3, '0')}`;
      
      addBooking({
        id: newId,
        property: bookingForm.property,
        tenant: bookingForm.tenant,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        amount: amount,
        cleaningFee: cleaningFee,
        commissionRate: commissionRate,
        commissionSplit: {
          bnbLyon: bnbLyonSplit,
          hamac: hamacSplit
        },
        commission: commission,
        source: bookingForm.source as BookingSource,
        monthlyPayment: bookingForm.monthlyPayment,
        payments: payments,
        status: status
      });
      toast.success("Réservation ajoutée avec succès");
    }

    resetBookingForm();
    setBookingDialogOpen(false);
  };

  const calculateStats = () => {
    // Calculate total active bookings
    const activeBookings = bookings.filter(b => b.status === "active").length;
    
    // Calculate total revenue
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
    
    // Calculate total commission
    const totalCommission = bookings.reduce((sum, booking) => sum + booking.commission.total, 0);
    
    // Calculate BnB Lyon's commission
    const bnbLyonCommission = bookings.reduce((sum, booking) => sum + booking.commission.bnbLyon, 0);
    
    return {
      activeBookings,
      totalRevenue,
      totalCommission,
      bnbLyonCommission
    };
  };

  const stats = calculateStats();

  // Available commission rates
  const commissionRates = [
    { value: "15", label: "15%" },
    { value: "20", label: "20%" },
    { value: "25", label: "25%" },
    { value: "30", label: "30%" },
  ];

  // Available commission splits
  const commissionSplits = [
    { value: "0", label: "0%" },
    { value: "10", label: "10%" },
    { value: "20", label: "20%" },
    { value: "30", label: "30%" },
    { value: "40", label: "40%" },
    { value: "50", label: "50%" },
    { value: "60", label: "60%" },
    { value: "70", label: "70%" },
    { value: "80", label: "80%" },
    { value: "90", label: "90%" },
    { value: "100", label: "100%" },
  ];

  // Available booking sources
  const bookingSources = [
    { value: "airbnb", label: "Airbnb" },
    { value: "booking", label: "Booking.com" },
    { value: "homelike", label: "Homelike" },
    { value: "wunderflats", label: "Wunderflats" },
    { value: "direct", label: "Direct" },
    { value: "relocation", label: "Agence relocation" },
    { value: "other", label: "Autre" },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Moyenne Durée</h1>
          <p className="text-muted-foreground">
            Gestion des mandats et des réservations moyenne durée
          </p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Réservations actives"
          value={stats.activeBookings.toString()}
          icon={<ChartBar className="text-blue-500" />}
        />
        <StatCard
          title="Revenus totaux"
          value={formatter.currency(stats.totalRevenue)}
          icon={<TrendingUp className="text-green-500" />}
        />
        <StatCard
          title="Commissions totales"
          value={formatter.currency(stats.totalCommission)}
          icon={<TrendingUp className="text-purple-500" />}
        />
        <StatCard
          title="Part BnB Lyon"
          value={formatter.currency(stats.bnbLyonCommission)}
          icon={<TrendingUp className="text-indigo-500" />}
        />
      </div>

      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-[400px] mb-4">
          <TabsTrigger value="mandats">Mandats</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        {/* Mandats Tab */}
        <TabsContent value="mandats" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mandats de gestion</h2>
            <Button onClick={() => {
              resetMandatForm();
              setMandatDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Nouveau mandat
            </Button>
          </div>

          <MandatsList 
            mandats={mandats}
            formatter={formatter}
            statusInfo={mandatStatusInfo}
            onEdit={(mandat) => {
              setMandatForm({
                id: mandat.id,
                property: mandat.property,
                owner: mandat.owner,
                startDate: mandat.startDate,
                endDate: mandat.endDate,
                notes: mandat.notes || "",
              });
              setIsEditingMandat(true);
              setMandatDialogOpen(true);
            }}
            onDelete={(id) => setMandatToDelete(id)}
            onViewDetails={(mandat) => {
              setSelectedMandat(mandat);
              setMandatDetailsDialogOpen(true);
            }}
            setDeleteMandatConfirmOpen={setDeleteMandatConfirmOpen}
          />

          {/* Mandat Form Dialog */}
          <MandatFormDialog
            open={mandatDialogOpen}
            onOpenChange={setMandatDialogOpen}
            isEditing={isEditingMandat}
            mandatForm={mandatForm}
            onInputChange={handleMandatInputChange}
            onSubmit={handleAddOrUpdateMandat}
            onCancel={() => {
              resetMandatForm();
              setMandatDialogOpen(false);
            }}
          />

          {/* Mandat Details Dialog */}
          <MandatDetailsDialog
            open={mandatDetailsDialogOpen}
            onOpenChange={setMandatDetailsDialogOpen}
            mandat={selectedMandat}
            formatter={formatter}
            statusInfo={mandatStatusInfo}
          />

          {/* Delete Mandat Confirmation */}
          <MandatDetailsDialog
            open={deleteMandatConfirmOpen}
            onOpenChange={setDeleteMandatConfirmOpen}
            mandat={mandats.find(m => m.id === mandatToDelete) || null}
            formatter={formatter}
            statusInfo={mandatStatusInfo}
            isDeleteConfirm={true}
            onConfirmDelete={confirmDeleteMandat}
          />
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Réservations moyenne durée</h2>
            <Button onClick={() => {
              resetBookingForm();
              setBookingDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Nouvelle réservation
            </Button>
          </div>

          <BookingsList 
            bookings={bookings}
            formatter={formatter}
            statusInfo={bookingStatusInfo}
            getCommissionSplitInfo={getCommissionSplitInfo}
            onEdit={(booking) => {
              setBookingForm({
                id: booking.id,
                property: booking.property,
                tenant: booking.tenant,
                startDate: booking.startDate,
                endDate: booking.endDate,
                amount: booking.amount.toString(),
                cleaningFee: booking.cleaningFee.toString(),
                commissionRate: booking.commissionRate.toString(),
                bnbLyonSplit: booking.commissionSplit.bnbLyon.toString(),
                hamacSplit: booking.commissionSplit.hamac.toString(),
                source: booking.source,
                monthlyPayment: booking.monthlyPayment,
                paymentDay: booking.payments && booking.payments.length > 0 
                  ? new Date(booking.payments[0].dueDate).getDate().toString() 
                  : ""
              });
              setIsEditingBooking(true);
              setBookingDialogOpen(true);
            }}
            onDelete={(id) => {
              setBookingToDelete(id);
              setDeleteConfirmOpen(true);
            }}
            onViewDetails={(booking) => {
              setSelectedBooking(booking);
              setBookingDetailsDialogOpen(true);
            }}
            getSourceLabel={getSourceLabel}
          />

          {/* Booking Form Dialog */}
          <BookingFormDialog
            open={bookingDialogOpen}
            onOpenChange={setBookingDialogOpen}
            isEditing={isEditingBooking}
            bookingForm={bookingForm}
            onInputChange={handleBookingInputChange}
            onSubmit={handleAddOrUpdateBooking}
            onCancel={() => {
              resetBookingForm();
              setBookingDialogOpen(false);
            }}
            commissionRates={commissionRates}
            commissionSplits={commissionSplits}
            bookingSources={bookingSources}
          />

          {/* Booking Details Dialog */}
          <BookingDetailsDialog
            open={bookingDetailsDialogOpen}
            onOpenChange={setBookingDetailsDialogOpen}
            booking={selectedBooking}
            formatter={formatter}
            statusInfo={bookingStatusInfo}
            getSourceLabel={getSourceLabel}
            onViewPaymentSchedule={() => {
              setPaymentScheduleOpen(true);
            }}
          />

          {/* Payment Schedule Dialog */}
          <PaymentScheduleDialog
            open={paymentScheduleOpen}
            onOpenChange={setPaymentScheduleOpen}
            booking={selectedBooking}
            formatter={formatter}
            onUpdatePaymentStatus={updatePaymentStatus}
          />

          {/* Delete Booking Confirmation */}
          <BookingDetailsDialog
            open={deleteConfirmOpen}
            onOpenChange={setDeleteConfirmOpen}
            booking={bookings.find(b => b.id === bookingToDelete) || null}
            formatter={formatter}
            statusInfo={bookingStatusInfo}
            getSourceLabel={getSourceLabel}
            isDeleteConfirm={true}
            onConfirmDelete={() => {
              if (bookingToDelete) {
                deleteBooking(bookingToDelete);
                toast.success("Réservation supprimée avec succès");
                setDeleteConfirmOpen(false);
                setBookingToDelete(null);
              }
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Client Management Section */}
      <DashboardCard title="Gestion des clients">
        <ClientsManager />
      </DashboardCard>
    </div>
  );
};

export default MoyenneDuree;
