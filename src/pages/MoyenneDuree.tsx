
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Euro, CalendarDays, User, TrendingUp, Database, Activity, ChartBar, ListCheck, FileText, BarChart, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";

// Interface pour un mandat
interface Mandat {
  id: string;
  property: string;
  owner: string;
  startDate: string;
  endDate: string;
  fee: number; // Montant des honoraires annuels
  status: "active" | "expired" | "terminated";
  notes?: string;
}

// Define the interface for a booking
interface Booking {
  id: string;
  property: string;
  tenant: string;
  startDate: string;
  endDate: string;
  amount: number;
  cleaningFee: number;
  commissionRate: number; // Total commission rate as a percentage
  commissionSplit: {
    bnbLyon: number; // BNB Lyon's percentage of the total commission (0-100)
    hamac: number;   // Hamac's percentage of the total commission (0-100)
  };
  commission: {
    total: number;
    bnbLyon: number;
    hamac: number;
  };
  status: "upcoming" | "active" | "completed";
}

// Données de test pour les mandats
const mockMandats: Mandat[] = [
  {
    id: "MANDAT-2023-001",
    property: "Appartement Bellecour",
    owner: "Jean Dupont",
    startDate: "2023-01-15",
    endDate: "2024-01-15",
    fee: 480,
    status: "active",
    notes: "Propriétaire très réactif. Immeuble avec gardien."
  },
  {
    id: "MANDAT-2023-002",
    property: "Studio Part-Dieu",
    owner: "Marie Martin",
    startDate: "2023-03-01",
    endDate: "2024-03-01",
    fee: 360,
    status: "active",
    notes: "Rénovation complète en 2022."
  },
  {
    id: "MANDAT-2023-003",
    property: "Loft Croix-Rousse",
    owner: "Pierre Bertrand",
    startDate: "2022-11-01",
    endDate: "2023-11-01",
    fee: 540,
    status: "expired",
    notes: "À renouveler rapidement. Propriétaire satisfait."
  },
  {
    id: "MANDAT-2024-001",
    property: "T2 Confluence",
    owner: "Sophie Blanc",
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    fee: 420,
    status: "active",
    notes: "Nouveau mandat. Première location pour ce propriétaire."
  }
];

// Update mock data to include commissionSplit
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
    status: "upcoming"
  }
];

// Define the BookingCard props interface
interface BookingCardProps {
  booking: Booking;
  formatter: {
    date: (date: string) => string;
    currency: (amount: number) => string;
  };
  statusInfo: {
    getColor: (status: string) => string;
    getLabel: (status: string) => string;
  };
  commissionSplitInfo: {
    label: string;
    color: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

// Interface pour les props du composant MandatCard
interface MandatCardProps {
  mandat: Mandat;
  formatter: {
    date: (date: string) => string;
    currency: (amount: number) => string;
  };
  statusInfo: {
    getColor: (status: string) => string;
    getLabel: (status: string) => string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

// Composant MandatCard
const MandatCard = ({ mandat, formatter, statusInfo, onEdit, onDelete, onViewDetails }: MandatCardProps) => {
  return (
    <Card className="animate-fade-in cursor-pointer hover:shadow-card transition-shadow" onClick={onViewDetails}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{mandat.property}</CardTitle>
            <CardDescription>Propriétaire: {mandat.owner}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.getColor(mandat.status)}`}>
              {statusInfo.getLabel(mandat.status)}
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
            <p>{formatter.date(mandat.startDate)} - {formatter.date(mandat.endDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Honoraires annuels</p>
            <p className="font-medium">{formatter.currency(mandat.fee)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">ID Mandat</p>
            <p className="font-medium">{mandat.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// BookingCard component
const BookingCard = ({ booking, formatter, statusInfo, commissionSplitInfo, onEdit, onDelete, onViewDetails }: BookingCardProps) => {
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
            <p className="text-muted-foreground">Commission</p>
            <p className="font-medium">{formatter.currency(booking.commission.total)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MoyenneDuree = () => {
  useEffect(() => {
    document.title = "Moyenne Durée - GESTION BNB LYON";
  }, []);

  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [mandats, setMandats] = useState<Mandat[]>(mockMandats);
  const [activeTab, setActiveTab] = useState("locations");
  
  // États pour le formulaire de mandat
  const [mandatForm, setMandatForm] = useState({
    id: "",
    property: "",
    owner: "",
    startDate: "",
    endDate: "",
    fee: "",
    notes: "",
  });
  const [openMandatDialog, setOpenMandatDialog] = useState(false);
  const [isEditingMandat, setIsEditingMandat] = useState(false);
  const [mandatToDelete, setMandatToDelete] = useState<string | null>(null);
  const [deleteMandatConfirmOpen, setDeleteMandatConfirmOpen] = useState(false);
  const [mandatDetailsDialogOpen, setMandatDetailsDialogOpen] = useState(false);
  const [selectedMandat, setSelectedMandat] = useState<Mandat | null>(null);

  // États pour le formulaire de réservation
  const [bookingForm, setBookingForm] = useState({
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
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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

  // Gestion des mandats
  const resetMandatForm = () => {
    setMandatForm({
      id: "",
      property: "",
      owner: "",
      startDate: "",
      endDate: "",
      fee: "",
      notes: "",
    });
    setIsEditingMandat(false);
  };

  const handleMandatInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMandatForm(prev => ({ ...prev, [name]: value }));
  };

  const openEditMandatDialog = (mandat: Mandat) => {
    setMandatForm({
      id: mandat.id,
      property: mandat.property,
      owner: mandat.owner,
      startDate: mandat.startDate,
      endDate: mandat.endDate,
      fee: mandat.fee.toString(),
      notes: mandat.notes || "",
    });
    setIsEditingMandat(true);
    setOpenMandatDialog(true);
  };

  const handleAddOrUpdateMandat = () => {
    // Valider le formulaire
    if (!mandatForm.property || !mandatForm.owner || !mandatForm.startDate || 
        !mandatForm.endDate || !mandatForm.fee) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const fee = parseFloat(mandatForm.fee);
    
    if (isNaN(fee) || fee <= 0) {
      toast.error("Les honoraires doivent être un nombre positif");
      return;
    }

    // Déterminer le statut en fonction des dates
    const now = new Date();
    const endDate = new Date(mandatForm.endDate);
    
    let status: "active" | "expired" | "terminated" = "active";
    if (now > endDate) {
      status = "expired";
    }

    if (isEditingMandat) {
      // Mettre à jour un mandat existant
      const updatedMandats = mandats.map(mandat => 
        mandat.id === mandatForm.id ? {
          ...mandat,
          property: mandatForm.property,
          owner: mandatForm.owner,
          startDate: mandatForm.startDate,
          endDate: mandatForm.endDate,
          fee: fee,
          notes: mandatForm.notes,
          status: status
        } : mandat
      );
      setMandats(updatedMandats);
      toast.success("Mandat mis à jour avec succès");
    } else {
      // Créer un nouveau mandat
      const newId = `MANDAT-${new Date().getFullYear()}-${(mandats.length + 1).toString().padStart(3, '0')}`;
      
      const mandat: Mandat = {
        id: newId,
        property: mandatForm.property,
        owner: mandatForm.owner,
        startDate: mandatForm.startDate,
        endDate: mandatForm.endDate,
        fee: fee,
        notes: mandatForm.notes,
        status: status
      };

      setMandats([mandat, ...mandats]);
      toast.success("Mandat ajouté avec succès");
    }

    resetMandatForm();
    setOpenMandatDialog(false);
  };

  const handleDeleteMandat = (id: string) => {
    setMandatToDelete(id);
    setDeleteMandatConfirmOpen(true);
  };

  const confirmDeleteMandat = () => {
    if (mandatToDelete) {
      const updatedMandats = mandats.filter(mandat => mandat.id !== mandatToDelete);
      setMandats(updatedMandats);
      toast.success("Mandat supprimé avec succès");
      setDeleteMandatConfirmOpen(false);
      setMandatToDelete(null);
    }
  };

  const openMandatDetailsDialog = (mandat: Mandat) => {
    setSelectedMandat(mandat);
    setMandatDetailsDialogOpen(true);
  };

  const getMandatStatusColor = (status: string) => {
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
  };

  const getMandatStatusLabel = (status: string) => {
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
  };

  // Calculate commission based on amount, cleaning fee, commission rate, and the split between entities
  const calculateCommission = (
    amount: number, 
    cleaningFee: number, 
    commissionRate: number,
    bnbLyonSplit: number
  ) => {
    const totalCommission = (amount - cleaningFee) * (commissionRate / 100);
    const bnbLyonCommission = totalCommission * (bnbLyonSplit / 100);
    const hamacCommission = totalCommission - bnbLyonCommission;
    
    return {
      total: totalCommission,
      bnbLyon: bnbLyonCommission,
      hamac: hamacCommission
    };
  };

  // Update hamac split when bnbLyon split changes
  const updateHamacSplit = (bnbLyonSplit: string) => {
    const hamacSplit = (100 - parseInt(bnbLyonSplit)).toString();
    setBookingForm(prev => ({ ...prev, hamacSplit }));
  };

  // Update bnbLyon split when hamac split changes
  const updateBnbLyonSplit = (hamacSplit: string) => {
    const bnbLyonSplit = (100 - parseInt(hamacSplit)).toString();
    setBookingForm(prev => ({ ...prev, bnbLyonSplit }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setBookingForm(prev => ({ ...prev, [name]: value }));
    
    // Update the other split value when one changes
    if (name === "bnbLyonSplit") {
      updateHamacSplit(value);
    } else if (name === "hamacSplit") {
      updateBnbLyonSplit(value);
    }
  };

  const resetForm = () => {
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
    });
    setIsEditing(false);
  };

  const openEditDialog = (booking: Booking) => {
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
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleAddOrUpdateBooking = () => {
    // Validate form
    if (!bookingForm.property || !bookingForm.tenant || !bookingForm.startDate || 
        !bookingForm.endDate || !bookingForm.amount || !bookingForm.cleaningFee || 
        !bookingForm.commissionRate || !bookingForm.bnbLyonSplit || !bookingForm.hamacSplit) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const amount = parseFloat(bookingForm.amount);
    const cleaningFee = parseFloat(bookingForm.cleaningFee);
    const commissionRate = parseFloat(bookingForm.commissionRate);
    const bnbLyonSplit = parseFloat(bookingForm.bnbLyonSplit);
    const hamacSplit = parseFloat(bookingForm.hamacSplit);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error("Le montant doit être un nombre positif");
      return;
    }
    if (isNaN(cleaningFee) || cleaningFee < 0) {
      toast.error("Les frais de ménage doivent être un nombre positif");
      return;
    }
    if (isNaN(commissionRate) || commissionRate <= 0 || commissionRate > 100) {
      toast.error("Le taux de commission doit être compris entre 1 et 100");
      return;
    }
    if (bnbLyonSplit + hamacSplit !== 100) {
      toast.error("La répartition des commissions doit totaliser 100%");
      return;
    }

    // Determine status based on dates
    const now = new Date();
    const startDate = new Date(bookingForm.startDate);
    const endDate = new Date(bookingForm.endDate);
    
    let status: "upcoming" | "active" | "completed" = "upcoming";
    if (now > endDate) {
      status = "completed";
    } else if (now >= startDate && now <= endDate) {
      status = "active";
    }

    const commission = calculateCommission(amount, cleaningFee, commissionRate, bnbLyonSplit);
    
    if (isEditing) {
      // Update existing booking
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingForm.id ? {
          ...booking,
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
          status: status
        } : booking
      );
      setBookings(updatedBookings);
      toast.success("Réservation mise à jour avec succès");
    } else {
      // Create new booking
      const newId = `MD-${new Date().getFullYear()}-${(bookings.length + 1).toString().padStart(3, '0')}`;
      
      const booking: Booking = {
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
        status: status
      };

      setBookings([booking, ...bookings]);
      toast.success("Réservation ajoutée avec succès");
    }

    resetForm();
    setOpenDialog(false);
  };

  const handleDeleteBooking = (id: string) => {
    setBookingToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (bookingToDelete) {
      const updatedBookings = bookings.filter(booking => booking.id !== bookingToDelete);
      setBookings(updatedBookings);
      toast.success("Réservation supprimée avec succès");
      setDeleteConfirmOpen(false);
      setBookingToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'À venir';
      case 'active':
        return 'En cours';
      case 'completed':
        return 'Terminée';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const openDetailsDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailsDialogOpen(true);
  };

  const calculateRentalDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Fonction pour déterminer le type de partage de commission
  const getCommissionSplitType = (booking: Booking) => {
    if (booking.commissionSplit.bnbLyon === 100) {
      return {
        label: "BNB LYON exclusif",
        color: "bg-purple-100 text-purple-800"
      };
    } else if (booking.commissionSplit.hamac === 100) {
      return {
        label: "HAMAC exclusif",
        color: "bg-indigo-100 text-indigo-800"
      };
    } else {
      return {
        label: "Commission partagée",
        color: "bg-blue-100 text-blue-800"
      };
    }
  };

  // Calcul des statistiques
  const calculateStats = () => {
    // Valeurs totales
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => b.status === "active").length;
    const upcomingBookings = bookings.filter(b => b.status === "upcoming").length;
    
    // Statistiques mandats
    const totalMandats = mandats.length;
    const activeMandats = mandats.filter(m => m.status === "active").length;
    const expiredMandats = mandats.filter(m => m.status === "expired").length;
    const terminatedMandats = mandats.filter(m => m.status === "terminated").length;
    const annualMandatsRevenue = mandats
      .filter(m => m.status === "active")
      .reduce((sum, m) => sum + m.fee, 0);
    const monthlyMandatsRevenue = annualMandatsRevenue / 12;
    
    // Calcul du taux de renouvellement (approximation simple)
    const renewalRate = totalMandats > 0
      ? (totalMandats - terminatedMandats) / totalMandats * 100
      : 0;
    
    // Statistiques financières
    const totalAmount = bookings.reduce((acc, b) => acc + b.amount, 0);
    const totalCommission = bookings.reduce((acc, b) => acc + b.commission.total, 0);
    const bnbLyonCommission = bookings.reduce((acc, b) => acc + b.commission.bnbLyon, 0);
    const hamacCommission = bookings.reduce((acc, b) => acc + b.commission.hamac, 0);
    
    // Statistiques temporelles
    const avgDurationDays = bookings.length 
      ? bookings.reduce((acc, b) => {
          const start = new Date(b.startDate);
          const end = new Date(b.endDate);
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          return acc + days;
        }, 0) / bookings.length
      : 0;
      
    // Calcul du taux d'occupation (nombre de jours réservés / nombre total de jours sur la période)
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const daysSinceStartOfYear = Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    
    const totalPropertyDays = daysSinceStartOfYear * Math.max(1, activeMandats); // Nombre de propriétés actives
    const occupiedDays = bookings
      .filter(b => b.status === "active" || b.status === "completed")
      .reduce((acc, b) => {
        const start = new Date(Math.max(new Date(b.startDate).getTime(), startOfYear.getTime()));
        const end = new Date(Math.min(new Date(b.endDate).getTime(), now.getTime()));
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return acc + days;
      }, 0);
    
    const occupancyRate = totalPropertyDays > 0 ? (occupiedDays / totalPropertyDays) * 100 : 0;
    
    // Moyenne des revenus mensuels
    const monthsElapsed = now.getMonth() + 1;
    const avgMonthlyRevenue = monthsElapsed > 0 ? totalAmount / monthsElapsed : 0;
    const avgMonthlyCommission = monthsElapsed > 0 ? totalCommission / monthsElapsed : 0;

    // Répartition des statuts
    const statusDistribution = {
      active: (activeBookings / totalBookings) * 100 || 0,
      upcoming: (upcomingBookings / totalBookings) * 100 || 0,
      completed: ((totalBookings - activeBookings - upcomingBookings) / totalBookings) * 100 || 0
    };

    return {
      // Statistiques des réservations
      totalBookings,
      activeBookings,
      upcomingBookings,
      completedBookings: totalBookings - activeBookings - upcomingBookings,
      totalAmount,
      totalCommission,
      bnbLyonCommission,
      hamacCommission,
      avgDurationDays: Math.round(avgDurationDays),
      occupancyRate: Math.round(occupancyRate),
      statusDistribution,
      avgMonthlyRevenue,
      avgMonthlyCommission,
      
      // Statistiques des mandats
      totalMandats,
      activeMandats,
      expiredMandats,
      terminatedMandats,
      annualMandatsRevenue,
      monthlyMandatsRevenue,
      renewalRate: Math.round(renewalRate),
      avgBookingsPerMandat: activeMandats > 0 ? activeBookings / activeMandats : 0
    };
  };

  const stats = calculateStats();

  // État pour contrôler l'affichage des statistiques
  const [showStats, setShowStats] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Moyenne Durée</h1>
          <p className="text-muted-foreground mt-1">
            Gestion des locations directes moyenne durée et mandats
          </p>
        </div>

        <div className="flex gap-2">
          {activeTab === "mandats" ? (
            <Dialog open={openMandatDialog} onOpenChange={(open) => {
              setOpenMandatDialog(open);
              if (!open) resetMandatForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Ajouter un mandat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>{isEditingMandat ? "Modifier le mandat" : "Nouveau mandat de gestion"}</DialogTitle>
                  <DialogDescription>
                    {isEditingMandat 
                      ? "Modifiez les détails du mandat de gestion."
                      : "Entrez les détails du nouveau mandat de gestion."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="property" className="text-right">
                      Logement
                    </Label>
                    <Input
                      id="property"
                      name="property"
                      value={mandatForm.property}
                      onChange={handleMandatInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="owner" className="text-right">
                      Propriétaire
                    </Label>
                    <Input
                      id="owner"
                      name="owner"
                      value={mandatForm.owner}
                      onChange={handleMandatInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Date début
                    </Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={mandatForm.startDate}
                      onChange={handleMandatInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      Date fin
                    </Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={mandatForm.endDate}
                      onChange={handleMandatInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fee" className="text-right">
                      Honoraires annuels (€)
                    </Label>
                    <Input
                      id="fee"
                      name="fee"
                      type="number"
                      value={mandatForm.fee}
                      onChange={handleMandatInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="notes" className="text-right pt-2">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={mandatForm.notes}
                      onChange={handleMandatInputChange}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddOrUpdateMandat}>
                    {isEditingMandat ? "Mettre à jour" : "Ajouter"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={openDialog} onOpenChange={(open) => {
              setOpenDialog(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Ajouter une location
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? "Modifier la location" : "Nouvelle location moyenne durée"}</DialogTitle>
                  <DialogDescription>
                    {isEditing 
                      ? "Modifiez les détails de la location. Les commissions seront recalculées automatiquement."
                      : "Entrez les détails de la nouvelle location directe. Les commissions seront calculées automatiquement."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="property" className="text-right">
                      Logement
                    </Label>
                    <Input
                      id="property"
                      name="property"
                      value={bookingForm.property}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tenant" className="text-right">
                      Locataire
                    </Label>
                    <Input
                      id="tenant"
                      name="tenant"
                      value={bookingForm.tenant}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Date début
                    </Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={bookingForm.startDate}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      Date fin
                    </Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={bookingForm.endDate}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Montant (€)
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={bookingForm.amount}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cleaningFee" className="text-right">
                      Frais ménage (€)
                    </Label>
                    <Input
                      id="cleaningFee"
                      name="cleaningFee"
                      type="number"
                      value={bookingForm.cleaningFee}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="commissionRate" className="text-right">
                      Commission (%)
                    </Label>
                    <Select 
                      value={bookingForm.commissionRate} 
                      onValueChange={(value) => handleSelectChange("commissionRate", value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un taux" />
                      </SelectTrigger>
                      <SelectContent>
                        {commissionRates.map((rate) => (
                          <SelectItem key={rate.value} value={rate.value}>
                            {rate.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bnbLyonSplit" className="text-right">
                      Part BNB LYON (%)
                    </Label>
                    <Select 
                      value={bookingForm.bnbLyonSplit} 
                      onValueChange={(value) => handleSelectChange("bnbLyonSplit", value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Part BNB LYON" />
                      </SelectTrigger>
                      <SelectContent>
                        {commissionSplits.map((split) => (
                          <SelectItem key={split.value} value={split.value}>
                            {split.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="hamacSplit" className="text-right">
                      Part HAMAC (%)
                    </Label>
                    <Select 
                      value={bookingForm.hamacSplit} 
                      onValueChange={(value) => handleSelectChange("hamacSplit", value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Part HAMAC" />
                      </SelectTrigger>
                      <SelectContent>
                        {commissionSplits.map((split) => (
                          <SelectItem key={split.value} value={split.value}>
                            {split.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddOrUpdateBooking}>
                    {isEditing ? "Mettre à jour" : "Ajouter"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Section Statistiques */}
      <Collapsible open={showStats} onOpenChange={setShowStats} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tableau de bord</h2>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              {showStats ? "Masquer les statistiques" : "Afficher les statistiques"}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Locataires actifs"
              value={stats.activeBookings}
              icon={<Activity className="h-5 w-5" />}
              change={stats.activeBookings > 0 ? {
                value: Math.round((stats.activeBookings / stats.totalBookings) * 100),
                type: 'increase',
                label: 'du total'
              } : undefined}
              helpText={`Sur un total de ${stats.totalBookings} locations`}
            />
            
            <StatCard
              title="Mandats actifs"
              value={stats.activeMandats}
              icon={<FileText className="h-5 w-5" />}
              change={stats.activeMandats > 0 ? {
                value: Math.round((stats.activeMandats / stats.totalMandats) * 100),
                type: 'increase',
                label: 'du total'
              } : undefined}
              helpText={`Sur un total de ${stats.totalMandats} mandats`}
            />
            
            <StatCard
              title="Taux d'occupation"
              value={`${stats.occupancyRate}%`}
              icon={<Database className="h-5 w-5" />}
              helpText="Basé sur les jours occupés depuis le début de l'année"
            />
            
            <StatCard
              title="Honoraires mandats"
              value={formatCurrency(stats.monthlyMandatsRevenue)}
              icon={<Briefcase className="h-5 w-5" />}
              helpText="Revenu mensuel estimé des honoraires de gestion"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DashboardCard title="Chiffres financiers">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Revenus totaux</p>
                  <p className="text-xl font-medium">{formatCurrency(stats.totalAmount)}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Commissions totales</p>
                  <p className="text-xl font-medium">{formatCurrency(stats.totalCommission)}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Revenu mensuel moyen</p>
                  <p className="text-xl font-medium">{formatCurrency(stats.avgMonthlyRevenue)}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Commission mensuelle</p>
                  <p className="text-xl font-medium">{formatCurrency(stats.avgMonthlyCommission)}</p>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Répartition des commissions">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">BNB LYON</p>
                    <p className="text-sm font-medium">{formatCurrency(stats.bnbLyonCommission)}</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-purple-500 h-2.5 rounded-full" 
                      style={{ width: `${(stats.bnbLyonCommission / stats.totalCommission) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">HAMAC</p>
                    <p className="text-sm font-medium">{formatCurrency(stats.hamacCommission)}</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-indigo-500 h-2.5 rounded-full" 
                      style={{ width: `${(stats.hamacCommission / stats.totalCommission) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border/30 mt-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Total commissions</p>
                    <p className="text-sm font-medium">{formatCurrency(stats.totalCommission)}</p>
                  </div>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Statut des locations" className="md:col-span-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                  <div className="rounded-full bg-green-100 p-3 mb-2">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="font-medium text-lg">{stats.activeBookings}</p>
                  <p className="text-sm text-muted-foreground">En cours</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                  <div className="rounded-full bg-blue-100 p-3 mb-2">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="font-medium text-lg">{stats.upcomingBookings}</p>
                  <p className="text-sm text-muted-foreground">À venir</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                  <div className="rounded-full bg-gray-100 p-3 mb-2">
                    <ListCheck className="h-5 w-5 text-gray-600" />
                  </div>
                  <p className="font-medium text-lg">{stats.completedBookings}</p>
                  <p className="text-sm text-muted-foreground">Terminées</p>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Statut des mandats" className="md:col-span-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                  <div className="rounded-full bg-green-100 p-3 mb-2">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="font-medium text-lg">{stats.activeMandats}</p>
                  <p className="text-sm text-muted-foreground">Actifs</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                  <div className="rounded-full bg-yellow-100 p-3 mb-2">
                    <BarChart className="h-5 w-5 text-yellow-600" />
                  </div>
                  <p className="font-medium text-lg">{stats.expiredMandats}</p>
                  <p className="text-sm text-muted-foreground">Expirés</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                  <div className="rounded-full bg-red-100 p-3 mb-2">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="font-medium text-lg">{stats.terminatedMandats}</p>
                  <p className="text-sm text-muted-foreground">Résiliés</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Taux de renouvellement</span>
                  <span className="font-medium">{stats.renewalRate}%</span>
                </div>
              </div>
            </DashboardCard>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Tabs 
        defaultValue="locations" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="mandats">Mandats</TabsTrigger>
        </TabsList>

        <TabsContent value="locations" className="space-y-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="upcoming">À venir</TabsTrigger>
              <TabsTrigger value="active">En cours</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              {bookings.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  formatter={{ date: formatDate, currency: formatCurrency }} 
                  statusInfo={{ getColor: getStatusColor, getLabel: getStatusLabel }}
                  commissionSplitInfo={getCommissionSplitType(booking)}
                  onEdit={() => openEditDialog(booking)}
                  onDelete={() => handleDeleteBooking(booking.id)}
                  onViewDetails={() => openDetailsDialog(booking)}
                />
              ))}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4 mt-4">
              {bookings
                .filter((booking) => booking.status === "upcoming")
                .map((booking) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    formatter={{ date: formatDate, currency: formatCurrency }} 
                    statusInfo={{ getColor: getStatusColor, getLabel: getStatusLabel }}
                    commissionSplitInfo={getCommissionSplitType(booking)}
                    onEdit={() => openEditDialog(booking)}
                    onDelete={() => handleDeleteBooking(booking.id)}
                    onViewDetails={() => openDetailsDialog(booking)}
                  />
                ))}
            </TabsContent>

            <TabsContent value="active" className="space-y-4 mt-4">
              {bookings
                .filter((booking) => booking.status === "active")
                .map((booking) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    formatter={{ date: formatDate, currency: formatCurrency }} 
                    statusInfo={{ getColor: getStatusColor, getLabel: getStatusLabel }}
                    commissionSplitInfo={getCommissionSplitType(booking)}
                    onEdit={() => openEditDialog(booking)}
                    onDelete={() => handleDeleteBooking(booking.id)}
                    onViewDetails={() => openDetailsDialog(booking)}
                  />
                ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-4">
              {bookings
                .filter((booking) => booking.status === "completed")
                .map((booking) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    formatter={{ date: formatDate, currency: formatCurrency }} 
                    statusInfo={{ getColor: getStatusColor, getLabel: getStatusLabel }}
                    commissionSplitInfo={getCommissionSplitType(booking)}
                    onEdit={() => openEditDialog(booking)}
                    onDelete={() => handleDeleteBooking(booking.id)}
                    onViewDetails={() => openDetailsDialog(booking)}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="mandats" className="space-y-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="expired">Expirés</TabsTrigger>
              <TabsTrigger value="terminated">Résiliés</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              {mandats.map((mandat) => (
                <MandatCard 
                  key={mandat.id} 
                  mandat={mandat} 
                  formatter={{ date: formatDate, currency: formatCurrency }} 
                  statusInfo={{ getColor: getMandatStatusColor, getLabel: getMandatStatusLabel }}
                  onEdit={() => openEditMandatDialog(mandat)}
                  onDelete={() => handleDeleteMandat(mandat.id)}
                  onViewDetails={() => openMandatDetailsDialog(mandat)}
                />
              ))}
            </TabsContent>

            <TabsContent value="active" className="space-y-4 mt-4">
              {mandats
                .filter((mandat) => mandat.status === "active")
                .map((mandat) => (
                  <MandatCard 
                    key={mandat.id} 
                    mandat={mandat} 
                    formatter={{ date: formatDate, currency: formatCurrency }} 
                    statusInfo={{ getColor: getMandatStatusColor, getLabel: getMandatStatusLabel }}
                    onEdit={() => openEditMandatDialog(mandat)}
                    onDelete={() => handleDeleteMandat(mandat.id)}
                    onViewDetails={() => openMandatDetailsDialog(mandat)}
                  />
                ))}
            </TabsContent>

            <TabsContent value="expired" className="space-y-4 mt-4">
              {mandats
                .filter((mandat) => mandat.status === "expired")
                .map((mandat) => (
                  <MandatCard 
                    key={mandat.id} 
                    mandat={mandat} 
                    formatter={{ date: formatDate, currency: formatCurrency }} 
                    statusInfo={{ getColor: getMandatStatusColor, getLabel: getMandatStatusLabel }}
                    onEdit={() => openEditMandatDialog(mandat)}
                    onDelete={() => handleDeleteMandat(mandat.id)}
                    onViewDetails={() => openMandatDetailsDialog(mandat)}
                  />
                ))}
            </TabsContent>

            <TabsContent value="terminated" className="space-y-4 mt-4">
              {mandats
                .filter((mandat) => mandat.status === "terminated")
                .map((mandat) => (
                  <MandatCard 
                    key={mandat.id} 
                    mandat={mandat} 
                    formatter={{ date: formatDate, currency: formatCurrency }} 
                    statusInfo={{ getColor: getMandatStatusColor, getLabel: getMandatStatusLabel }}
                    onEdit={() => openEditMandatDialog(mandat)}
                    onDelete={() => handleDeleteMandat(mandat.id)}
                    onViewDetails={() => openMandatDetailsDialog(mandat)}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Boîtes de dialogue */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Détails de la réservation</DialogTitle>
                <DialogDescription className="pt-2 flex flex-col sm:flex-row gap-2 sm:gap-6">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    ID: <span className="font-medium">{selectedBooking.id}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Locataire: <span className="font-medium">{selectedBooking.tenant}</span>
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <h3 className="font-semibold text-lg mb-3">{selectedBooking.property}</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead colSpan={2}>Récapitulatif de la réservation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Statut</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                          {getStatusLabel(selectedBooking.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Période</TableCell>
                      <TableCell>{formatDate(selectedBooking.startDate)} au {formatDate(selectedBooking.endDate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Durée</TableCell>
                      <TableCell>{calculateRentalDays(selectedBooking.startDate, selectedBooking.endDate)} jours</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead colSpan={2}>Détail financier</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Montant total de la location</TableCell>
                        <TableCell className="text-right">{formatCurrency(selectedBooking.amount)}</TableCell>
                      </TableRow>
                      <TableRow className="border-b-2">
                        <TableCell className="font-medium">Frais de ménage</TableCell>
                        <TableCell className="text-right">- {formatCurrency(selectedBooking.cleaningFee)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Base de calcul commission</TableCell>
                        <TableCell className="text-right">{formatCurrency(selectedBooking.amount - selectedBooking.cleaningFee)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/30">
                        <TableCell className="font-medium">Commission totale ({selectedBooking.commissionRate}%)</TableCell>
                        <TableCell className="text-right">{formatCurrency(selectedBooking.commission.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead colSpan={2}>Répartition de la commission</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Part BNB LYON ({selectedBooking.commissionSplit.bnbLyon}%)</TableCell>
                        <TableCell className="text-right">{formatCurrency(selectedBooking.commission.bnbLyon)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Part HAMAC ({selectedBooking.commissionSplit.hamac}%)</TableCell>
                        <TableCell className="text-right">{formatCurrency(selectedBooking.commission.hamac)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg">Revenu net propriétaire</span>
                    <span className="font-bold text-lg">{formatCurrency(selectedBooking.amount - selectedBooking.commission.total)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={mandatDetailsDialogOpen} onOpenChange={setMandatDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedMandat && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Détails du mandat</DialogTitle>
                <DialogDescription className="pt-2 flex flex-col sm:flex-row gap-2 sm:gap-6">
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    ID: <span className="font-medium">{selectedMandat.id}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Propriétaire: <span className="font-medium">{selectedMandat.owner}</span>
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <h3 className="font-semibold text-lg mb-3">{selectedMandat.property}</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead colSpan={2}>Informations générales</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Statut</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMandatStatusColor(selectedMandat.status)}`}>
                          {getMandatStatusLabel(selectedMandat.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Période de validité</TableCell>
                      <TableCell>{formatDate(selectedMandat.startDate)} au {formatDate(selectedMandat.endDate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Durée</TableCell>
                      <TableCell>{calculateRentalDays(selectedMandat.startDate, selectedMandat.endDate)} jours</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Honoraires annuels</TableCell>
                      <TableCell>{formatCurrency(selectedMandat.fee)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Honoraires mensuels</TableCell>
                      <TableCell>{formatCurrency(selectedMandat.fee / 12)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                {selectedMandat.notes && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm">{selectedMandat.notes}</p>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setMandatDetailsDialogOpen(false);
                      openEditMandatDialog(selectedMandat);
                    }}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setMandatDetailsDialogOpen(false);
                      handleDeleteMandat(selectedMandat.id);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement la réservation. Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBookingToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteMandatConfirmOpen} onOpenChange={setDeleteMandatConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement le mandat de gestion. Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMandatToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMandat}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MoyenneDuree;
