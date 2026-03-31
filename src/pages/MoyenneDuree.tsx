
import { useEffect, useState } from "react";
import { Plus, TrendingUp, FileText, HelpCircle, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, differenceInMonths } from "date-fns";
import { fr } from "date-fns/locale";

// Import refactored components
import { MandatFormDialog } from "@/components/moyenne-duree/mandats/MandatFormDialog";
import { MandatDetailsDialog } from "@/components/moyenne-duree/mandats/MandatDetailsDialog";
import { BookingFormDialog } from "@/components/moyenne-duree/bookings/BookingFormDialog";
import { BookingDetailsDialog } from "@/components/moyenne-duree/bookings/BookingDetailsDialog";
import { PaymentScheduleDialog } from "@/components/moyenne-duree/payments/PaymentScheduleDialog";
import { BookingDetailsSheet } from "@/components/moyenne-duree/documents/BookingDetailsSheet";
import { LeaseTemplatesManager } from "@/components/moyenne-duree/documents/LeaseTemplatesManager";
import ClientsManager from "@/components/moyenne-duree/ClientsManager";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
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

// Demo data for mandats display
const demoMandatsDisplay = [
  {
    id: "m1",
    logement: "Appartement 12 Rue du Port",
    proprietaire: "Michel Lambert",
    dateDebut: "2025-09-01",
    dateFin: "2026-08-31",
    loyerMensuel: 850,
    commission: 8.5,
    statut: "Actif" as const,
    moisRestants: 5,
    dureeTotale: 12
  },
  {
    id: "m2",
    logement: "Studio 8 Avenue des Fleurs",
    proprietaire: "Julie Leroux",
    dateDebut: "2025-06-01",
    dateFin: "2026-05-31",
    loyerMensuel: 620,
    commission: 8.5,
    statut: "Expirant" as const,
    moisRestants: 2,
    dureeTotale: 12
  },
  {
    id: "m3",
    logement: "Loft 72 Rue des Arts",
    proprietaire: "Anne Rousseau",
    dateDebut: "2026-01-01",
    dateFin: "2026-12-31",
    loyerMensuel: 1100,
    commission: 9,
    statut: "Actif" as const,
    moisRestants: 9,
    dureeTotale: 12
  }
];

// Demo data for locations display
const demoLocationsDisplay = [
  {
    id: "l1",
    locataire: "Thomas Renard",
    logement: "Appartement 12 Rue du Port",
    dateDebut: "2026-01-15",
    dateFin: "2026-07-14",
    loyer: 850,
    charges: 80,
    statut: "En cours" as const
  },
  {
    id: "l2",
    locataire: "Emma Dupuis",
    logement: "Studio 8 Avenue des Fleurs",
    dateDebut: "2026-04-01",
    dateFin: "2026-09-30",
    loyer: 620,
    charges: 50,
    statut: "À venir" as const
  },
  {
    id: "l3",
    locataire: "Marc Leblanc",
    logement: "Loft 72 Rue des Arts",
    dateDebut: "2025-10-01",
    dateFin: "2026-03-31",
    loyer: 1100,
    charges: 120,
    statut: "Terminé" as const
  }
];

const MoyenneDuree = () => {
  useEffect(() => {
    document.title = "Moyenne Durée - GESTION BNB LYON";
  }, []);

  const [activeTab, setActiveTab] = useState<"mandats" | "locations" | "templates">("locations");
  
  const { 
    mandats, addMandat, updateMandat, deleteMandat,
    mandatDialogOpen, setMandatDialogOpen,
    selectedMandat, setSelectedMandat,
    isEditingMandat, setIsEditingMandat,
    mandatForm, setMandatForm,
    mandatDetailsDialogOpen, setMandatDetailsDialogOpen,
    mandatToDelete, setMandatToDelete,
    deleteMandatConfirmOpen, setDeleteMandatConfirmOpen,
    resetMandatForm, handleMandatInputChange, confirmDeleteMandat
  } = useMandats();
  
  const {
    bookings, addBooking, updateBooking, deleteBooking, updatePaymentStatus,
    bookingDialogOpen, setBookingDialogOpen,
    selectedBooking, setSelectedBooking,
    isEditingBooking, setIsEditingBooking,
    bookingForm, setBookingForm,
    bookingDetailsDialogOpen, setBookingDetailsDialogOpen,
    bookingToDelete, setBookingToDelete,
    deleteConfirmOpen, setDeleteConfirmOpen,
    paymentScheduleOpen, setPaymentScheduleOpen,
    resetBookingForm, handleBookingInputChange
  } = useBookings();
  
  const formatter = {
    date: (dateString: string) => format(new Date(dateString), 'dd MMM yyyy', { locale: fr }),
    currency: (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
  };

  const formatShortDate = (dateString: string) => format(new Date(dateString), 'dd MMM yyyy', { locale: fr });

  // Status helpers
  const mandatStatusInfo = {
    getColor: (status: MandatStatus) => {
      switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'expired': return 'bg-yellow-100 text-yellow-800';
        case 'terminated': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    },
    getLabel: (status: MandatStatus) => {
      switch (status) {
        case 'active': return 'Actif';
        case 'expired': return 'Expiré';
        case 'terminated': return 'Résilié';
        default: return status;
      }
    }
  };
  
  const bookingStatusInfo = {
    getColor: (status: string) => {
      switch (status) {
        case 'upcoming': return 'bg-blue-100 text-blue-800';
        case 'active': return 'bg-green-100 text-green-800';
        case 'completed': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    },
    getLabel: (status: string) => {
      switch (status) {
        case 'upcoming': return 'À venir';
        case 'active': return 'En cours';
        case 'completed': return 'Terminé';
        default: return status;
      }
    }
  };
  
  const getCommissionSplitInfo = (booking: Booking) => {
    const bnbLyonPercent = booking.commissionSplit.bnbLyon;
    if (bnbLyonPercent === 100) return { label: "100% BnB Lyon", color: "bg-blue-100 text-blue-800" };
    if (bnbLyonPercent === 0) return { label: "100% Hamac", color: "bg-orange-100 text-orange-800" };
    return { label: `${bnbLyonPercent}% BnB / ${booking.commissionSplit.hamac}% Hamac`, color: "bg-purple-100 text-purple-800" };
  };

  // Form handlers
  const handleAddOrUpdateMandat = () => {
    if (!mandatForm.property || !mandatForm.owner || !mandatForm.startDate || !mandatForm.endDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    const now = new Date();
    const endDate = new Date(mandatForm.endDate);
    let status: MandatStatus = "active";
    if (now > endDate) status = "expired";

    if (isEditingMandat && mandatForm.id) {
      updateMandat({ id: mandatForm.id, property: mandatForm.property, owner: mandatForm.owner, startDate: mandatForm.startDate, endDate: mandatForm.endDate, notes: mandatForm.notes, status });
      toast.success("Mandat mis à jour avec succès");
    } else {
      const newId = `MANDAT-${new Date().getFullYear()}-${(mandats.length + 1).toString().padStart(3, '0')}`;
      addMandat({ id: newId, property: mandatForm.property, owner: mandatForm.owner, startDate: mandatForm.startDate, endDate: mandatForm.endDate, notes: mandatForm.notes, status });
      toast.success("Mandat ajouté avec succès");
    }
    resetMandatForm();
    setMandatDialogOpen(false);
  };
  
  const handleAddOrUpdateBooking = () => {
    if (!bookingForm.property || !bookingForm.tenant || !bookingForm.startDate || !bookingForm.endDate || !bookingForm.amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    const amount = parseFloat(bookingForm.amount);
    const cleaningFee = parseFloat(bookingForm.cleaningFee || "0");
    const commissionRate = parseInt(bookingForm.commissionRate);
    const bnbLyonSplit = parseInt(bookingForm.bnbLyonSplit);
    const hamacSplit = parseInt(bookingForm.hamacSplit);
    const commission = calculateCommission(amount, cleaningFee, commissionRate, { bnbLyon: bnbLyonSplit, hamac: hamacSplit });
    const now = new Date();
    const startDate = new Date(bookingForm.startDate);
    const endDate = new Date(bookingForm.endDate);
    let status: "upcoming" | "active" | "completed" = "upcoming";
    if (now >= startDate && now <= endDate) status = "active";
    else if (now > endDate) status = "completed";
    let payments: Payment[] | undefined;
    if (bookingForm.monthlyPayment) {
      payments = generatePaymentSchedule(bookingForm.startDate, bookingForm.endDate, amount, bookingForm.paymentDay || "");
    }
    if (isEditingBooking && bookingForm.id) {
      updateBooking({ id: bookingForm.id, property: bookingForm.property, tenant: bookingForm.tenant, startDate: bookingForm.startDate, endDate: bookingForm.endDate, amount, cleaningFee, commissionRate, commissionSplit: { bnbLyon: bnbLyonSplit, hamac: hamacSplit }, commission, source: bookingForm.source as BookingSource, monthlyPayment: bookingForm.monthlyPayment, payments, status });
      toast.success("Réservation mise à jour avec succès");
    } else {
      const newId = `MD-${new Date().getFullYear()}-${(bookings.length + 1).toString().padStart(3, '0')}`;
      addBooking({ id: newId, property: bookingForm.property, tenant: bookingForm.tenant, startDate: bookingForm.startDate, endDate: bookingForm.endDate, amount, cleaningFee, commissionRate, commissionSplit: { bnbLyon: bnbLyonSplit, hamac: hamacSplit }, commission, source: bookingForm.source as BookingSource, monthlyPayment: bookingForm.monthlyPayment, payments, status });
      toast.success("Réservation ajoutée avec succès");
    }
    resetBookingForm();
    setBookingDialogOpen(false);
  };

  const stats = (() => {
    const activeBookings = bookings.filter(b => b.status === "active").length || demoLocationsDisplay.filter(l => l.statut === "En cours").length;
    const totalRevenue = bookings.reduce((s, b) => s + b.amount, 0) || demoLocationsDisplay.reduce((s, l) => s + l.loyer, 0);
    const totalCommission = bookings.reduce((s, b) => s + b.commission.total, 0) || Math.round(totalRevenue * 0.085);
    const bnbLyonCommission = bookings.reduce((s, b) => s + b.commission.bnbLyon, 0) || Math.round(totalCommission * 0.6);
    return { activeBookings, totalRevenue, totalCommission, bnbLyonCommission };
  })();

  const commissionRates = [{ value: "15", label: "15%" }, { value: "20", label: "20%" }, { value: "25", label: "25%" }, { value: "30", label: "30%" }];
  const commissionSplits = [{ value: "0", label: "0%" }, { value: "10", label: "10%" }, { value: "20", label: "20%" }, { value: "30", label: "30%" }, { value: "40", label: "40%" }, { value: "50", label: "50%" }, { value: "60", label: "60%" }, { value: "70", label: "70%" }, { value: "80", label: "80%" }, { value: "90", label: "90%" }, { value: "100", label: "100%" }];
  const bookingSources = [{ value: "airbnb", label: "Airbnb" }, { value: "booking", label: "Booking.com" }, { value: "homelike", label: "Homelike" }, { value: "wunderflats", label: "Wunderflats" }, { value: "direct", label: "Direct" }, { value: "relocation", label: "Agence relocation" }, { value: "other", label: "Autre" }];

  const getProgressColor = (remaining: number, total: number) => {
    const pct = remaining / total;
    if (pct > 0.5) return "bg-green-500";
    if (pct >= 0.2) return "bg-amber-500";
    return "bg-red-500";
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "Actif": return "bg-[#DCFCE7] text-[#15803D]";
      case "Expirant": return "bg-[#FEF3C7] text-[#92400E]";
      case "Expiré": return "bg-[#FEE2E2] text-[#DC2626]";
      case "En cours": return "bg-[#DCFCE7] text-[#15803D]";
      case "À venir": return "bg-[#EEF2FF] text-[#4F46E5]";
      case "Terminé": return "bg-[#F1F5F9] text-[#64748B]";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDurationMonths = (start: string, end: string) => {
    return differenceInMonths(new Date(end), new Date(start));
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Header */}
      <div className="relative p-4 w-full box-border">
        <h1 className="text-[22px] font-bold text-[#1A1A2E]">Moyenne Durée</h1>
        <p className="text-[13px] text-[#7A7A8C] mt-1">Gestion des mandats et réservations</p>
        <button className="absolute top-4 right-4 text-[#9A9AAF]">
          <HelpCircle size={20} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px] md:gap-3 px-4 mb-5">
        {[
          { label: "Réservations actives", value: stats.activeBookings.toString(), icon: FileText, bgIcon: "bg-[#EEF2FF]", colorIcon: "#4F46E5" },
          { label: "Revenus totaux", value: formatter.currency(stats.totalRevenue), icon: TrendingUp, bgIcon: "bg-[#F0FDF4]", colorIcon: "#16A34A" },
          { label: "Commissions", value: formatter.currency(stats.totalCommission), icon: TrendingUp, bgIcon: "bg-[#FFF7ED]", colorIcon: "#EA580C" },
          { label: "Part BnB Lyon", value: formatter.currency(stats.bnbLyonCommission), icon: TrendingUp, bgIcon: "bg-[#F5F3FF]", colorIcon: "#7C3AED" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-[14px] border border-[#EEEEEE] p-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div className={`w-9 h-9 rounded-[10px] ${kpi.bgIcon} flex items-center justify-center`}>
                <kpi.icon size={18} color={kpi.colorIcon} />
              </div>
            </div>
            <span className="text-[20px] font-bold text-[#1A1A2E] leading-none">{kpi.value}</span>
            <span className="text-[11px] text-[#7A7A8C] whitespace-nowrap overflow-hidden text-ellipsis">{kpi.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex w-full border-b-2 border-[#EEEEEE] px-4 mb-4">
        {[
          { key: "mandats" as const, label: "Mandats" },
          { key: "locations" as const, label: "Locations" },
          { key: "templates" as const, label: "Modèles" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-[10px] text-[14px] whitespace-nowrap flex-shrink-0 border-b-2 -mb-[2px] transition-colors ${
              activeTab === tab.key
                ? "text-[#FF5C1A] border-[#FF5C1A] font-semibold"
                : "text-[#7A7A8C] border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MANDATS TAB */}
      {activeTab === "mandats" && (
        <div className="space-y-3">
          {/* Section header */}
          <div className="flex justify-between items-center px-4 mb-3">
            <h2 className="text-[15px] font-bold text-[#1A1A2E]">Mandats de gestion</h2>
            <Button
              onClick={() => { resetMandatForm(); setMandatDialogOpen(true); }}
              className="h-9 rounded-lg bg-[#FF5C1A] hover:bg-[#E5500F] text-white px-3 text-[13px] font-semibold"
              size="sm"
            >
              <Plus size={14} className="mr-1" /> Nouveau mandat
            </Button>
          </div>

          {/* Mandat cards */}
          {demoMandatsDisplay.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4">
              <FileText size={48} className="text-[#CCCCCC] mb-4" />
              <p className="text-[14px] text-[#9A9AAF] text-center mb-4">Aucun mandat actif</p>
              <Button onClick={() => { resetMandatForm(); setMandatDialogOpen(true); }} className="bg-[#FF5C1A] hover:bg-[#E5500F] text-white">
                <Plus size={14} className="mr-1" /> Créer un mandat
              </Button>
            </div>
          ) : (
            <div className="px-4 space-y-[10px]">
              {demoMandatsDisplay.map((m) => (
                <div key={m.id} className="bg-white rounded-[14px] border border-[#EEEEEE] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] cursor-pointer" onClick={() => {
                  const matchingMandat = mandats.find(mandat => mandat.id === m.id);
                  if (matchingMandat) {
                    setSelectedMandat(matchingMandat);
                    setMandatDetailsDialogOpen(true);
                  }
                }}>
                  {/* Line 1 */}
                  <div className="flex justify-between items-start mb-[10px]">
                    <div className="min-w-0 flex-1 mr-3">
                      <p className="text-[15px] font-bold text-[#1A1A2E] truncate max-w-[200px]">{m.logement}</p>
                      <p className="text-[12px] text-[#7A7A8C] mt-[2px]">{m.proprietaire}</p>
                    </div>
                    <span className={`rounded-full px-[10px] py-1 text-[11px] font-semibold whitespace-nowrap ${getStatusBadge(m.statut)}`}>
                      {m.statut}
                    </span>
                  </div>

                  {/* Line 2 - Dates */}
                  <div className="flex gap-4 mb-[10px]">
                    <div className="flex flex-col gap-[2px]">
                      <span className="text-[10px] text-[#9A9AAF] uppercase">Début</span>
                      <span className="text-[13px] font-semibold text-[#1A1A2E]">{formatShortDate(m.dateDebut)}</span>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <span className="text-[10px] text-[#9A9AAF] uppercase">Fin</span>
                      <span className="text-[13px] font-semibold text-[#1A1A2E]">{formatShortDate(m.dateFin)}</span>
                    </div>
                  </div>

                  {/* Line 3 - Progress bar */}
                  <div className="mb-[10px]">
                    <p className="text-[11px] text-[#7A7A8C] mb-[6px]">{m.moisRestants} mois restants sur {m.dureeTotale}</p>
                    <div className="h-[6px] rounded-full bg-[#F0F0F0]">
                      <div
                        className={`h-full rounded-full ${getProgressColor(m.moisRestants, m.dureeTotale)}`}
                        style={{ width: `${(m.moisRestants / m.dureeTotale) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Line 4 - Financial */}
                  <div className="flex border-t border-[#F5F5F5] pt-[10px] mt-1">
                    <div className="flex-1 text-center">
                      <p className="text-[14px] font-bold text-[#1A1A2E]">{formatter.currency(m.loyerMensuel)}</p>
                      <p className="text-[10px] text-[#9A9AAF]">Loyer mensuel</p>
                    </div>
                    <div className="w-px bg-[#EEEEEE]" />
                    <div className="flex-1 text-center">
                      <p className="text-[14px] font-bold text-[#1A1A2E]">{m.commission}%</p>
                      <p className="text-[10px] text-[#9A9AAF]">Commission</p>
                    </div>
                    <div className="w-px bg-[#EEEEEE]" />
                    <div className="flex-1 text-center">
                      <p className="text-[14px] font-bold text-[#1A1A2E]">{m.dureeTotale} mois</p>
                      <p className="text-[10px] text-[#9A9AAF]">Durée</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dialogs */}
          <MandatFormDialog open={mandatDialogOpen} onOpenChange={setMandatDialogOpen} isEditing={isEditingMandat} mandatForm={mandatForm} onInputChange={handleMandatInputChange} onSubmit={handleAddOrUpdateMandat} onCancel={() => { resetMandatForm(); setMandatDialogOpen(false); }} />
          <MandatDetailsDialog open={mandatDetailsDialogOpen} onOpenChange={setMandatDetailsDialogOpen} mandat={selectedMandat} formatter={formatter} statusInfo={mandatStatusInfo} />
          <MandatDetailsDialog open={deleteMandatConfirmOpen} onOpenChange={setDeleteMandatConfirmOpen} mandat={mandats.find(m => m.id === mandatToDelete) || null} formatter={formatter} statusInfo={mandatStatusInfo} isDeleteConfirm={true} onConfirmDelete={confirmDeleteMandat} />
        </div>
      )}

      {/* LOCATIONS TAB */}
      {activeTab === "locations" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center px-4 mb-3">
            <h2 className="text-[15px] font-bold text-[#1A1A2E]">Locations</h2>
            <Button
              onClick={() => { resetBookingForm(); setBookingDialogOpen(true); }}
              className="h-9 rounded-lg bg-[#FF5C1A] hover:bg-[#E5500F] text-white px-3 text-[13px] font-semibold"
              size="sm"
            >
              <Plus size={14} className="mr-1" /> Nouvelle location
            </Button>
          </div>

          {demoLocationsDisplay.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4">
              <FileText size={48} className="text-[#CCCCCC] mb-4" />
              <p className="text-[14px] text-[#9A9AAF] text-center mb-4">Aucune location active</p>
              <Button onClick={() => { resetBookingForm(); setBookingDialogOpen(true); }} className="bg-[#FF5C1A] hover:bg-[#E5500F] text-white">
                <Plus size={14} className="mr-1" /> Créer une location
              </Button>
            </div>
          ) : (
            <div className="px-4 space-y-[10px]">
              {demoLocationsDisplay.map((loc) => (
                <div key={loc.id} className="bg-white rounded-[14px] border border-[#EEEEEE] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] cursor-pointer">
                  {/* Line 1 - Tenant + Status */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-[10px] min-w-0 flex-1 mr-3">
                      <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                        <span className="text-[14px] font-bold text-[#4F46E5]">{getInitials(loc.locataire)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-[#1A1A2E]">{loc.locataire}</p>
                        <p className="text-[12px] text-[#7A7A8C] truncate">{loc.logement}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-[10px] py-1 text-[11px] font-semibold whitespace-nowrap ${getStatusBadge(loc.statut)}`}>
                      {loc.statut}
                    </span>
                  </div>

                  {/* Line 2 - Period */}
                  <div className="flex items-center gap-2 mt-[10px] p-[8px_10px] bg-[#F7F7F9] rounded-lg">
                    <Calendar size={14} className="text-[#9A9AAF] flex-shrink-0" />
                    <span className="text-[13px] text-[#1A1A2E]">{formatShortDate(loc.dateDebut)} → {formatShortDate(loc.dateFin)}</span>
                    <span className="text-[12px] text-[#7A7A8C]">· {getDurationMonths(loc.dateDebut, loc.dateFin)} mois</span>
                  </div>

                  {/* Line 3 - Financial */}
                  <div className="flex border-t border-[#F5F5F5] pt-[10px] mt-[10px]">
                    <div className="flex-1 text-center">
                      <p className="text-[14px] font-bold text-[#1A1A2E]">{formatter.currency(loc.loyer)}</p>
                      <p className="text-[10px] text-[#9A9AAF]">Loyer</p>
                    </div>
                    <div className="w-px bg-[#EEEEEE]" />
                    <div className="flex-1 text-center">
                      <p className="text-[14px] font-bold text-[#1A1A2E]">{formatter.currency(loc.charges)}</p>
                      <p className="text-[10px] text-[#9A9AAF]">Charges</p>
                    </div>
                    <div className="w-px bg-[#EEEEEE]" />
                    <div className="flex-1 text-center">
                      <p className="text-[14px] font-bold text-[#1A1A2E]">{formatter.currency(loc.loyer + loc.charges)}</p>
                      <p className="text-[10px] text-[#9A9AAF]">Total mensuel</p>
                    </div>
                  </div>

                  {/* Line 4 - Actions */}
                  <div className="flex gap-2 mt-[10px]">
                    <button className="flex-1 h-9 rounded-lg border border-[#EEEEEE] bg-white text-[12px] text-[#1A1A2E] flex items-center justify-center gap-[6px]">
                      <Eye size={14} /> Voir détails
                    </button>
                    <button className="flex-1 h-9 rounded-lg bg-[#FF5C1A] text-white text-[12px] font-semibold flex items-center justify-center gap-[6px]">
                      <FileText size={14} /> Quittance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dialogs */}
          <BookingFormDialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen} isEditing={isEditingBooking} bookingForm={bookingForm} onInputChange={handleBookingInputChange} onSubmit={handleAddOrUpdateBooking} onCancel={() => { resetBookingForm(); setBookingDialogOpen(false); }} commissionRates={commissionRates} commissionSplits={commissionSplits} bookingSources={bookingSources} />
          <BookingDetailsSheet open={bookingDetailsDialogOpen} onOpenChange={setBookingDetailsDialogOpen} booking={selectedBooking} formatter={formatter} statusInfo={bookingStatusInfo} getSourceLabel={getSourceLabel} onViewPaymentSchedule={() => setPaymentScheduleOpen(true)} />
          <PaymentScheduleDialog open={paymentScheduleOpen} onOpenChange={setPaymentScheduleOpen} booking={selectedBooking} formatter={formatter} onUpdatePaymentStatus={updatePaymentStatus} />
          <BookingDetailsDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen} booking={bookings.find(b => b.id === bookingToDelete) || null} formatter={formatter} statusInfo={bookingStatusInfo} getSourceLabel={getSourceLabel} isDeleteConfirm={true} onConfirmDelete={() => { if (bookingToDelete) { deleteBooking(bookingToDelete); toast.success("Réservation supprimée avec succès"); setDeleteConfirmOpen(false); setBookingToDelete(null); } }} />
        </div>
      )}

      {/* TEMPLATES TAB */}
      {activeTab === "templates" && (
        <div className="px-4 space-y-4">
          <h2 className="text-[15px] font-bold text-[#1A1A2E]">Modèles de baux</h2>
          <LeaseTemplatesManager />
        </div>
      )}

      {/* Client Management */}
      <div className="px-4 mt-6">
        <DashboardCard title="Gestion des clients">
          <ClientsManager />
        </DashboardCard>
      </div>
    </div>
  );
};

export default MoyenneDuree;
