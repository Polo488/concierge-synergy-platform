
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, UserPlus, Mail, Phone, Calendar, Clipboard, Euro, User } from "lucide-react";
import { Client, ClientStatus, ClientType } from "@/types/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Données de démonstration
const mockClients: Client[] = [
  {
    id: "CL-2023-001",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    phone: "06 12 34 56 78",
    type: "particulier",
    status: "signe",
    notes: "Recherche un T3 pour 6 mois",
    contactDate: "2023-10-15",
    lastContactDate: "2023-11-02",
    assignedTo: "Sophie Martin",
    potentialValue: 12000
  },
  {
    id: "CL-2023-002",
    name: "Entreprise ABC",
    email: "contact@abc.com",
    phone: "04 78 90 12 34",
    type: "entreprise",
    status: "negociation",
    notes: "Besoin de logements pour 3 salariés expatriés",
    contactDate: "2023-09-22",
    lastContactDate: "2023-10-30",
    assignedTo: "Thomas Roux",
    potentialValue: 45000
  },
  {
    id: "CL-2023-003",
    name: "Reloc'Express",
    email: "info@relocexpress.fr",
    phone: "01 23 45 67 89",
    type: "agence_relocation",
    status: "proposition_envoyee",
    notes: "Partenariat potentiel pour leurs clients internationaux",
    contactDate: "2023-11-05",
    lastContactDate: "2023-11-10",
    potentialValue: 30000
  },
  {
    id: "CL-2023-004",
    name: "Marie Lefebvre",
    email: "marie.l@example.com",
    phone: "07 65 43 21 09",
    type: "particulier",
    status: "prospection",
    notes: "Première prise de contact suite au salon de l'immobilier",
    contactDate: "2023-11-12",
    lastContactDate: "2023-11-12"
  },
  {
    id: "CL-2023-005",
    name: "Lyon Habitat Partenaires",
    email: "partenariats@lyonhabitat.fr",
    phone: "04 72 10 20 30",
    type: "partenaire",
    status: "signe",
    notes: "Convention de partenariat signée pour 2 ans",
    contactDate: "2023-08-01",
    lastContactDate: "2023-11-05",
    assignedTo: "Sophie Martin",
    potentialValue: 60000
  }
];

const statusLabels: Record<ClientStatus, string> = {
  prospection: "Prospection",
  contact_initial: "Contact initial",
  proposition_envoyee: "Proposition envoyée",
  negociation: "Négociation",
  signe: "Signé",
  termine: "Terminé",
  abandonne: "Abandonné"
};

const statusColors: Record<ClientStatus, string> = {
  prospection: "bg-blue-100 text-blue-800",
  contact_initial: "bg-purple-100 text-purple-800",
  proposition_envoyee: "bg-indigo-100 text-indigo-800",
  negociation: "bg-yellow-100 text-yellow-800",
  signe: "bg-green-100 text-green-800",
  termine: "bg-gray-100 text-gray-800",
  abandonne: "bg-red-100 text-red-800"
};

const typeLabels: Record<ClientType, string> = {
  particulier: "Particulier",
  entreprise: "Entreprise",
  agence_relocation: "Agence de relocation",
  partenaire: "Partenaire"
};

const typeColors: Record<ClientType, string> = {
  particulier: "bg-sky-100 text-sky-800",
  entreprise: "bg-emerald-100 text-emerald-800",
  agence_relocation: "bg-violet-100 text-violet-800",
  partenaire: "bg-amber-100 text-amber-800"
};

const ClientsManager: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [clientForm, setClientForm] = useState<Partial<Client>>({
    name: "",
    email: "",
    phone: "",
    type: "particulier",
    status: "prospection",
    notes: "",
    contactDate: new Date().toISOString().split('T')[0],
    lastContactDate: new Date().toISOString().split('T')[0],
    assignedTo: "",
    potentialValue: undefined
  });
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [filter, setFilter] = useState("all"); // Pour filtrer par statut
  const [typeFilter, setTypeFilter] = useState("all"); // Pour filtrer par type

  const resetForm = () => {
    setClientForm({
      name: "",
      email: "",
      phone: "",
      type: "particulier",
      status: "prospection",
      notes: "",
      contactDate: new Date().toISOString().split('T')[0],
      lastContactDate: new Date().toISOString().split('T')[0],
      assignedTo: "",
      potentialValue: undefined
    });
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setClientForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateClient = () => {
    // Valider le formulaire
    if (!clientForm.name || !clientForm.email || !clientForm.type || !clientForm.status) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (isEditing && clientForm.id) {
      // Mettre à jour un client existant
      const updatedClients = clients.map(client => 
        client.id === clientForm.id ? { 
          ...client, 
          ...clientForm,
          // Fix for the TypeScript error - convert string to number for potentialValue if it exists
          potentialValue: clientForm.potentialValue ? Number(clientForm.potentialValue) : undefined
        } as Client : client
      );
      setClients(updatedClients);
      toast.success("Client mis à jour avec succès");
    } else {
      // Créer un nouveau client
      const newId = `CL-${new Date().getFullYear()}-${(clients.length + 1).toString().padStart(3, '0')}`;
      
      const client: Client = {
        id: newId,
        name: clientForm.name!,
        email: clientForm.email!,
        phone: clientForm.phone,
        type: clientForm.type as ClientType,
        status: clientForm.status as ClientStatus,
        notes: clientForm.notes,
        contactDate: clientForm.contactDate!,
        lastContactDate: clientForm.lastContactDate!,
        assignedTo: clientForm.assignedTo,
        potentialValue: clientForm.potentialValue ? Number(clientForm.potentialValue) : undefined
      };

      setClients([client, ...clients]);
      toast.success("Client ajouté avec succès");
    }

    resetForm();
    setOpenDialog(false);
  };

  const handleDeleteClient = (id: string) => {
    setClientToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      const updatedClients = clients.filter(client => client.id !== clientToDelete);
      setClients(updatedClients);
      toast.success("Client supprimé avec succès");
      setDeleteConfirmOpen(false);
      setClientToDelete(null);
    }
  };

  const openEditDialog = (client: Client) => {
    setClientForm({
      ...client,
      potentialValue: client.potentialValue?.toString()
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const openDetailsDialog = (client: Client) => {
    setSelectedClient(client);
    setDetailsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "N/A";
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Filtrer les clients par statut
  const filteredClients = clients.filter(client => {
    const statusMatch = filter === "all" || client.status === filter;
    const typeMatch = typeFilter === "all" || client.type === typeFilter;
    return statusMatch && typeMatch;
  });

  // Calculer les statistiques
  const calculateStats = () => {
    const totalClients = clients.length;
    const signedClients = clients.filter(c => c.status === "signe").length;
    const prospectingClients = clients.filter(c => ["prospection", "contact_initial"].includes(c.status)).length;
    
    const totalPotentialValue = clients
      .filter(c => c.potentialValue !== undefined)
      .reduce((sum, client) => sum + (client.potentialValue || 0), 0);
    
    const signedValue = clients
      .filter(c => c.status === "signe" && c.potentialValue !== undefined)
      .reduce((sum, client) => sum + (client.potentialValue || 0), 0);
    
    const clientsByType = clients.reduce((acc, client) => {
      acc[client.type] = (acc[client.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalClients,
      signedClients,
      prospectingClients,
      totalPotentialValue,
      signedValue,
      clientsByType
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Clients</h2>
          <p className="text-muted-foreground">
            Suivez vos clients et prospects pour les locations moyenne durée
          </p>
        </div>

        <Dialog open={openDialog} onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <UserPlus className="h-4 w-4" />
              Ajouter un client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Modifier le client" : "Nouveau client"}</DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Modifiez les informations du client."
                  : "Entrez les informations du nouveau client."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom / Société
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={clientForm.name || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={clientForm.email || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={clientForm.phone || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type de client
                </Label>
                <Select 
                  value={clientForm.type} 
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Statut
                </Label>
                <Select 
                  value={clientForm.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contactDate" className="text-right">
                  Date 1er contact
                </Label>
                <Input
                  id="contactDate"
                  name="contactDate"
                  type="date"
                  value={clientForm.contactDate || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastContactDate" className="text-right">
                  Dernier contact
                </Label>
                <Input
                  id="lastContactDate"
                  name="lastContactDate"
                  type="date"
                  value={clientForm.lastContactDate || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignedTo" className="text-right">
                  Assigné à
                </Label>
                <Input
                  id="assignedTo"
                  name="assignedTo"
                  value={clientForm.assignedTo || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="potentialValue" className="text-right">
                  Valeur potentielle (€)
                </Label>
                <Input
                  id="potentialValue"
                  name="potentialValue"
                  type="number"
                  value={clientForm.potentialValue || ""}
                  onChange={handleInputChange}
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
                  value={clientForm.notes || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddOrUpdateClient}>
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.totalClients}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Signés</p>
                <p className="text-2xl font-bold text-green-600">{stats.signedClients}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">En prospection</p>
                <p className="text-2xl font-bold text-blue-600">{stats.prospectingClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Valeur business</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Potentiel total</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalPotentialValue)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Valeur signée</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.signedValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Types de clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(typeLabels).map(([type, label]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${typeColors[type as ClientType].replace("text-", "bg-").replace("-100", "-600")}`}></div>
                  <span className="text-xs">{label}: {stats.clientsByType[type] || 0}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {Object.entries(typeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des clients */}
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Valeur</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow 
                key={client.id} 
                className="cursor-pointer hover:bg-muted/80"
                onClick={() => openDetailsDialog(client)}
              >
                <TableCell>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-muted-foreground">{client.id}</div>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${typeColors[client.type]}`}>
                    {typeLabels[client.type]}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[client.status]}`}>
                    {statusLabels[client.status]}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{formatDate(client.lastContactDate)}</div>
                  <div className="text-xs text-muted-foreground">
                    {client.assignedTo ? `Assigné à: ${client.assignedTo}` : "Non assigné"}
                  </div>
                </TableCell>
                <TableCell>{client.potentialValue ? formatCurrency(client.potentialValue) : "N/A"}</TableCell>
                <TableCell className="text-right">
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
                        openEditDialog(client);
                      }} className="cursor-pointer">
                        <Edit2 className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClient(client.id);
                      }} className="cursor-pointer text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Boîtes de dialogue */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Détails du client</DialogTitle>
                <div className="flex gap-2 mt-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[selectedClient.type]}`}>
                    {typeLabels[selectedClient.type]}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedClient.status]}`}>
                    {statusLabels[selectedClient.status]}
                  </div>
                </div>
              </DialogHeader>
              
              <div className="py-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  {selectedClient.name}
                  <span className="text-sm font-normal text-muted-foreground ml-2">({selectedClient.id})</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-muted-foreground">Coordonnées</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedClient.email}</span>
                      </div>
                      {selectedClient.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedClient.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-muted-foreground">Dates</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Premier contact: {formatDate(selectedClient.contactDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Dernier contact: {formatDate(selectedClient.lastContactDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-sm mb-2 text-muted-foreground">Informations commerciales</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Assigné à: {selectedClient.assignedTo || "Non assigné"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <span>Valeur potentielle: {selectedClient.potentialValue ? formatCurrency(selectedClient.potentialValue) : "Non définie"}</span>
                    </div>
                  </div>
                </div>
                
                {selectedClient.notes && (
                  <div className="mt-6">
                    <h4 className="font-medium text-sm mb-2 text-muted-foreground">Notes</h4>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Clipboard className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm">{selectedClient.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      openEditDialog(selectedClient);
                    }}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      handleDeleteClient(selectedClient.id);
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
              Cette action supprimera définitivement ce client. Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setClientToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsManager;
