import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Euro, CalendarDays, User, TrendingUp, Database, Activity, ChartBar, BarChart, Briefcase } from "lucide-react";
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
import ClientsManager from "@/components/moyenne-duree/ClientsManager";

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
