
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Define the interface for a booking
interface Booking {
  id: string;
  property: string;
  tenant: string;
  startDate: string;
  endDate: string;
  amount: number;
  commission: {
    total: number;
    bnbLyon: number;
    hamac: number;
  };
  status: "upcoming" | "active" | "completed";
}

// Mock data for demonstration
const mockBookings: Booking[] = [
  {
    id: "MD-2023-001",
    property: "Appartement Bellecour",
    tenant: "Marie Dupont",
    startDate: "2023-10-15",
    endDate: "2023-12-15",
    amount: 3000,
    commission: {
      total: 600,
      bnbLyon: 300,
      hamac: 300
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
    commission: {
      total: 480,
      bnbLyon: 240,
      hamac: 240
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
    commission: {
      total: 720,
      bnbLyon: 360,
      hamac: 360
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
    commission: {
      total: 640,
      bnbLyon: 320,
      hamac: 320
    },
    status: "upcoming"
  }
];

const MoyenneDuree = () => {
  useEffect(() => {
    document.title = "Moyenne Durée - GESTION BNB LYON";
  }, []);

  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [newBooking, setNewBooking] = useState({
    property: "",
    tenant: "",
    startDate: "",
    endDate: "",
    amount: ""
  });
  const [openDialog, setOpenDialog] = useState(false);

  const calculateCommission = (amount: number) => {
    const totalCommission = amount * 0.2;
    return {
      total: totalCommission,
      bnbLyon: totalCommission / 2,
      hamac: totalCommission / 2
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBooking = () => {
    // Validate form
    if (!newBooking.property || !newBooking.tenant || !newBooking.startDate || 
        !newBooking.endDate || !newBooking.amount) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const amount = parseFloat(newBooking.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Le montant doit être un nombre positif");
      return;
    }

    // Determine status based on dates
    const now = new Date();
    const startDate = new Date(newBooking.startDate);
    const endDate = new Date(newBooking.endDate);
    
    let status: "upcoming" | "active" | "completed" = "upcoming";
    if (now > endDate) {
      status = "completed";
    } else if (now >= startDate && now <= endDate) {
      status = "active";
    }

    // Create new booking
    const newId = `MD-${new Date().getFullYear()}-${(bookings.length + 1).toString().padStart(3, '0')}`;
    const commission = calculateCommission(amount);
    
    const booking: Booking = {
      id: newId,
      property: newBooking.property,
      tenant: newBooking.tenant,
      startDate: newBooking.startDate,
      endDate: newBooking.endDate,
      amount: amount,
      commission: commission,
      status: status
    };

    setBookings([booking, ...bookings]);
    setNewBooking({
      property: "",
      tenant: "",
      startDate: "",
      endDate: "",
      amount: ""
    });
    setOpenDialog(false);
    toast.success("Réservation ajoutée avec succès");
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

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Ajouter une location
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nouvelle location moyenne durée</DialogTitle>
              <DialogDescription>
                Entrez les détails de la nouvelle location directe. Les commissions (20%) seront calculées automatiquement.
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
                  value={newBooking.property}
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
                  value={newBooking.tenant}
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
                  value={newBooking.startDate}
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
                  value={newBooking.endDate}
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
                  value={newBooking.amount}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddBooking}>Ajouter</Button>
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
            <BookingCard key={booking.id} booking={booking} formatter={{ date: formatDate, currency: formatCurrency }} statusInfo={{ getColor: getStatusColor, getLabel: getStatusLabel }} />
          ))}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {bookings
            .filter((booking) => booking.status === "upcoming")
            .map((booking) => (
              <BookingCard key={booking.id} booking={booking} formatter={{ date: formatDate, currency: formatCurrency }} statusInfo={{ getColor: getStatusColor, getLabel: getStatusLabel }} />
            ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4 mt-4">
          {bookings
            .filter((booking) => booking.status === "active")
            .map((booking) => (
              <BookingCard key={booking.id} booking={booking} formatter={{ date: formatDate, currency: formatCurrency }} statusInfo={{ getColor: getStatusColor, getLabel: getStatusLabel }} />
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          {bookings
            .filter((booking) => booking.status === "completed")
            .map((booking) => (
              <BookingCard key={booking.id} booking={booking} formatter={{ date: formatDate, currency: formatCurrency }} statusInfo={{ getColor: getStatusColor, getLabel: getStatusLabel }} />
            ))}
        </TabsContent>
      </Tabs>
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
}

const BookingCard = ({ booking, formatter, statusInfo }: BookingCardProps) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{booking.property}</CardTitle>
            <CardDescription>Locataire: {booking.tenant}</CardDescription>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.getColor(booking.status)}`}>
            {statusInfo.getLabel(booking.status)}
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
