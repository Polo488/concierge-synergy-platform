import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Define the interface for a booking
interface Booking {
  id: string;
  property: string;
  tenant: string;
  startDate: string;
  endDate: string;
  amount: number;
  cleaningFee: number; // Ajout des frais de ménage
  commission: {
    total: number;
    bnbLyon: number;
    hamac: number;
  };
  status: "upcoming" | "active" | "completed";
}

// Update mock data to include cleaningFee
const mockBookings: Booking[] = [
  {
    id: "MD-2023-001",
    property: "Appartement Bellecour",
    tenant: "Marie Dupont",
    startDate: "2023-10-15",
    endDate: "2023-12-15",
    amount: 3000,
    cleaningFee: 150,
    commission: {
      total: 570, // (3000 - 150) * 0.2
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
    commission: {
      total: 456, // (2400 - 120) * 0.2
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
    commission: {
      total: 684, // (3600 - 180) * 0.2
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
    commission: {
      total: 608, // (3200 - 160) * 0.2
      bnbLyon: 304,
      hamac: 304
    },
    status: "upcoming"
  }
];

const MoyenneDuree = () => {
  useEffect(() => {
    document.title = "Moyenne Durée - GESTION BNB LYON";
  }, []);

  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [bookingForm, setBookingForm] = useState({
    id: "",
    property: "",
    tenant: "",
    startDate: "",
    endDate: "",
    amount: "",
    cleaningFee: "", // Ajout des frais de ménage dans le formulaire
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const calculateCommission = (amount: number, cleaningFee: number) => {
    const totalCommission = (amount - cleaningFee) * 0.2;
    return {
      total: totalCommission,
      bnbLyon: totalCommission / 2,
      hamac: totalCommission / 2
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
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
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleAddOrUpdateBooking = () => {
    // Validate form
    if (!bookingForm.property || !bookingForm.tenant || !bookingForm.startDate || 
        !bookingForm.endDate || !bookingForm.amount || !bookingForm.cleaningFee) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const amount = parseFloat(bookingForm.amount);
    const cleaningFee = parseFloat(bookingForm.cleaningFee);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Le montant doit être un nombre positif");
      return;
    }
    if (isNaN(cleaningFee) || cleaningFee < 0) {
      toast.error("Les frais de ménage doivent être un nombre positif");
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

    const commission = calculateCommission(amount, cleaningFee);
    
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Moyenne Durée</h1>
          <p className="text-muted-foreground mt-1">
            Gestion des locations directes moyenne durée
          </p>
        </div>

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
                  ? "Modifiez les détails de la location. Les commissions (20%) seront recalculées automatiquement."
                  : "Entrez les détails de la nouvelle location directe. Les commissions (20%) seront calculées automatiquement."}
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
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddOrUpdateBooking}>
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
              onEdit={() => openEditDialog(booking)}
              onDelete={() => handleDeleteBooking(booking.id)}
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
                onEdit={() => openEditDialog(booking)}
                onDelete={() => handleDeleteBooking(booking.id)}
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
                onEdit={() => openEditDialog(booking)}
                onDelete={() => handleDeleteBooking(booking.id)}
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
                onEdit={() => openEditDialog(booking)}
                onDelete={() => handleDeleteBooking(booking.id)}
              />
            ))}
        </TabsContent>
      </Tabs>

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
    </div>
  );
};

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
  onEdit: () => void;
  onDelete: () => void;
}

const BookingCard = ({ booking, formatter, statusInfo, onEdit, onDelete }: BookingCardProps) => {
  return (
    <Card className="animate-fade-in">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-destructive">
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
            <p className="font-medium">
              {formatter.date(booking.startDate)} - {formatter.date(booking.endDate)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Montant total</p>
            <p className="font-medium">{formatter.currency(booking.amount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">ID Réservation</p>
            <p className="font-medium">{booking.id}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium mb-2">Détails des commissions</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Commission totale (20%)</p>
              <p className="font-medium">{formatter.currency(booking.commission.total)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Part BNB LYON</p>
              <p className="font-medium">{formatter.currency(booking.commission.bnbLyon)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Part HAMAC</p>
              <p className="font-medium">{formatter.currency(booking.commission.hamac)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoyenneDuree;
