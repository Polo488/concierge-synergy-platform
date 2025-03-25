import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Euro, CalendarDays, User, TrendingUp, Database, Activity, ChartBar, BarChart, Briefcase, Clock, BellRing, Bell } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { addDays, format, isAfter, isBefore, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";

// Interface pour un mandat
interface Mandat {
  id: string;
  property: string;
  owner: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "terminated";
  notes?: string;
}

// Type pour la source de réservation
type BookingSource = 
  | "airbnb" 
  | "booking" 
  | "homelike" 
  | "wunderflats" 
  | "direct" 
  | "relocation" 
  | "other";

// Interface pour un paiement
interface Payment {
  id: string;
  dueDate: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  paymentDate?: string;
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
  source: BookingSource;
  monthlyPayment: boolean;
  payments?: Payment[];
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

// Update mock data to include new fields
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Période</p>
            <p>{formatter.date(mandat.startDate)} - {formatter.date(mandat.endDate)}</p>
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

// Function to get source label
const getSourceLabel = (source: BookingSource): string => {
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

// Component for payment schedule
const PaymentSchedule = ({ 
  payments, 
  formatter,
  onUpdatePaymentStatus 
}: { 
  payments: Payment[], 
  formatter: { date: (date: string) => string, currency: (amount: number) => string },
  onUpdatePaymentStatus?: (paymentId: string, status: Payment['status']) => void
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Échéancier de paiement</h3>
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
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{formatter.date(payment.dueDate)}</TableCell>
              <TableCell>{formatter.currency(payment.amount)}</TableCell>
              <TableCell>
                <Badge
                  className={
                    payment.status === 'paid' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : payment.status === 'overdue' 
                        ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }
                >
                  {payment.status === 'paid' ? 'Payé' : payment.status === 'overdue' ? 'En retard' : 'En attente'}
                </Badge>
              </TableCell>
              <TableCell>{payment.paymentDate ? formatter.date(payment.paymentDate) : '-'}</TableCell>
              <TableCell className="text-right">
                {payment.status !== 'paid' && onUpdatePaymentStatus && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdatePaymentStatus(payment.id, 'paid')}
                  >
                    Marquer comme payé
                  </Button>
                )}
                {payment.status === 'pending' && 
                 isAfter(new Date(), parseISO(payment.dueDate)) && 
                 onUpdatePaymentStatus && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="ml-2"
                    onClick={() => onUpdatePaymentStatus(payment.id, 'overdue')}
                  >
                    Marquer en retard
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
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
    source: "airbnb",
    monthlyPayment: false,
    paymentDay: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [paymentScheduleOpen, setPaymentScheduleOpen] = useState(false);

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

  // Gestion des mandats
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
      notes: mandat.notes || "",
    });
    setIsEditingMandat(true);
    setOpenMandatDialog(true);
  };

  const handleAddOrUpdateMandat = () => {
    // Valider le formulaire
    if (!mandatForm.property || !mandatForm.owner || !mandatForm.startDate || 
        !mandatForm.endDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
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

  // Generate payment schedule based on booking info
  const generatePaymentSchedule = (
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

  // Calculate commission based on amount, cleaning fee, commission rate, and the split between entities
  const calculateCommission = (
    amount: number, 
    cleaningFee: number, 
    commission
