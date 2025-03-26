import { useState, useEffect } from 'react';
import { 
  Home, PlusCircle, Search, Filter, 
  Building, User, MapPin, BedDouble, List, Grid3X3, SlidersHorizontal,
  ChevronRight, Camera, Thermometer, Wifi, Radio, Tv, Car, 
  Wind, CigaretteOff, Waves, UtensilsCrossed, Globe, ExternalLink,
  Wrench, Clock, CheckCircle, AlertTriangle, Key, FileText, Video, StickyNote, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatCard } from '@/components/dashboard/StatCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from "@/hooks/use-toast";
import { MaintenanceTask, UrgencyLevel } from '@/types/maintenance';

const generateProperties = () => {
  const propertyTypes = ['Appartement', 'Studio', 'Loft', 'Maison', 'Villa'];
  const ownerNames = [
    'Thomas Dubois', 'Marie Lefevre', 'Jean Martin', 'Sophie Bernard', 'Pierre Durand',
    'Isabelle Moreau', 'Michel Lambert', 'Anne Rousseau', 'Philippe Girard', 'Julie Leroy'
  ];
  
  return Array.from({ length: 400 }, (_, i) => {
    const id = (i + 1).toString();
    const number = id.padStart(2, '0');
    const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const ownerName = ownerNames[Math.floor(Math.random() * ownerNames.length)];
    const commission = Math.floor(Math.random() * 10) + 10;
    const bedrooms = Math.floor(Math.random() * 5) + 1;
    const bathrooms = Math.floor(Math.random() * 3) + 1;
    const size = Math.floor(Math.random() * 100) + 30;
    
    const possibleAmenities = [
      'Wifi', 'Climatisation', 'Parking', 'Télévision', 'Vue mer', 
      'Cuisine équipée', 'Piscine', 'Jardin', 'Balcon', 'Terrasse', 
      'Salle de sport', 'Non-fumeur', 'Animaux acceptés'
    ];
    
    const amenities = [];
    const amenitiesCount = Math.floor(Math.random() * 6) + 3;
    for (let j = 0; j < amenitiesCount; j++) {
      const randomIndex = Math.floor(Math.random() * possibleAmenities.length);
      if (!amenities.includes(possibleAmenities[randomIndex])) {
        amenities.push(possibleAmenities[randomIndex]);
      }
    }
    
    const streetNames = [
      'Rue de la République', 'Avenue des Champs-Élysées', 'Boulevard Saint-Michel',
      'Rue de Rivoli', 'Avenue Montaigne', 'Place de la Concorde', 'Rue du Faubourg Saint-Honoré'
    ];
    const cities = ['Lyon', 'Paris', 'Marseille', 'Bordeaux', 'Nice', 'Toulouse', 'Strasbourg'];
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const streetNumber = Math.floor(Math.random() * 100) + 1;
    const city = cities[Math.floor(Math.random() * cities.length)];
    const address = `${streetNumber} ${streetName}, ${city}`;
    
    const equipmentItems = {
      heating: ["Chauffage central", "Radiateurs électriques", "Chauffage au sol", "Pompe à chaleur"][Math.floor(Math.random() * 4)],
      kitchen: [
        "Four", "Micro-ondes", "Lave-vaisselle", "Réfrigérateur", "Plaques de cuisson", 
        "Cafetière", "Grille-pain", "Bouilloire"
      ].slice(0, Math.floor(Math.random() * 5) + 3),
      bathroom: [
        "Douche", "Baignoire", "Sèche-cheveux", "Machine à laver", "Sèche-linge"
      ].slice(0, Math.floor(Math.random() * 3) + 2)
    };
    
    const linens = {
      bedding: [
        `${bedrooms} jeux de draps`, 
        `${bedrooms * 2} taies d'oreiller`, 
        `${bedrooms} couettes`
      ],
      towels: [
        `${bedrooms * 2} grandes serviettes`, 
        `${bedrooms * 2} petites serviettes`, 
        `${bathrooms} tapis de bain`
      ],
      consumables: [
        "Papier toilette (4 rouleaux)", 
        "Savon liquide", 
        "Shampoing", 
        "Gel douche"
      ]
    };
    
    const photoCategories = ["Extérieur", "Salon", "Cuisine", "Chambre", "Salle de bain", "Chauffage", "Radiateur", "Équipement"];
    
    const photosCount = Math.floor(Math.random() * 5) + 8;
    const photos = Array.from({ length: photosCount }, (_, photoIndex) => {
      const category = photoCategories[Math.floor(Math.random() * photoCategories.length)];
      return {
        id: `${id}-photo-${photoIndex + 1}`,
        url: `https://placehold.co/600x400/008000/FFFFFF/png?text=Photo+${photoIndex + 1}`,
        caption: `${category} ${number}`,
        category: category
      };
    });
    
    return {
      id,
      number,
      name: `Logement ${number}`,
      type,
      address,
      size,
      bedrooms,
      bathrooms,
      amenities,
      commission,
      photos,
      equipment: equipmentItems,
      linens,
      owner: {
        name: ownerName,
        email: `${ownerName.toLowerCase().replace(' ', '.')}@example.com`,
        phone: `+33 ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
      },
      bacCode: Math.random().toString(36).substring(2, 7).toUpperCase(),
      digicode: Math.floor(Math.random() * 9000 + 1000).toString(),
      wifiCode: `WIFI-${Math.floor(Math.random() * 1000)}`,
      youtubeLink: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
      floor: `${Math.floor(Math.random() * 10) + 1}ème étage`,
      agentNotes: `Parking gratuit à 50m. Four à micro-ondes Samsung ref. M1234.`,
      attachments: [
        { id: 1, name: 'Manuel du four', url: 'https://example.com/manuel_four.pdf', type: 'manual' },
        { id: 2, name: 'Contrat de location', url: 'https://example.com/contrat.pdf', type: 'contract' }
      ]
    };
  });
};

// Add sample maintenance tasks for demo purposes
const generateMaintenanceHistory = (properties) => {
  // Using the same urgency levels and maintenance types as in the Maintenance page
  const urgencyLevels: UrgencyLevel[] = ['low', 'medium', 'high', 'critical'];
  const maintenanceTypes = [
    'Fuite robinet', 'Remplacement ampoule', 'Serrure bloquée', 'Problème chauffage',
    'Volet roulant bloqué', 'Chasse d\'eau défectueuse', 'Réparation mur', 'Nettoyage ventilation'
  ];
  const technicians = ['Martin Dupont', 'Sophie Moreau', 'Jean Mercier', 'Emma Laurent'];
  
  // Generate some maintenance history
  const maintenanceHistory: MaintenanceTask[] = [];
  
  properties.forEach(property => {
    // Each property gets 0-5 maintenance tasks
    const tasksCount = Math.floor(Math.random() * 6);
    
    for (let i = 0; i < tasksCount; i++) {
      const id = `maint-${property.id}-${i}`;
      const createdDate = new Date();
      // Set the date to be between 1 and 180 days in the past
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 180) - 1);
      const createdAt = createdDate.toISOString().split('T')[0];
      
      const urgency = urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];
      const title = `${maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)]} - ${property.type}`;
      const technician = technicians[Math.floor(Math.random() * technicians.length)];
      
      // Some tasks are completed, some in progress, some pending
      const status = Math.random();
      let startedAt, completedAt;
      
      if (status > 0.3) { // 70% chance of being started
        const startDate = new Date(createdDate);
        startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days after creation
        startedAt = startDate.toISOString().split('T')[0];
        
        if (status > 0.6) { // 40% chance of being completed (out of all tasks)
          const completeDate = new Date(startDate);
          completeDate.setDate(completeDate.getDate() + Math.floor(Math.random() * 14) + 1); // 1-14 days after starting
          completedAt = completeDate.toISOString().split('T')[0];
        }
      }
      
      maintenanceHistory.push({
        id,
        propertyId: property.id,
        title,
        property: `${property.type} ${property.number} - ${property.address}`,
        urgency,
        createdAt,
        startedAt,
        completedAt,
        technician: startedAt ? technician : undefined,
        description: `Intervention de maintenance pour ${title.toLowerCase()} dans le logement ${property.number}.`
      });
    }
  });
  
  return maintenanceHistory;
};

const Properties = () => {
  const [properties] = useState(generateProperties);
  const [maintenanceHistory] = useState(() => generateMaintenanceHistory(properties));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState('Toutes');
  
  useEffect(() => {
    document.title = 'Logements - GESTION BNB LYON';
  }, []);

  const filteredProperties = properties.filter(property => {
    const searchLower = searchTerm.toLowerCase();
    return (
      property.number.includes(searchTerm) ||
      property.address.toLowerCase().includes(searchLower) ||
      property.owner.name.toLowerCase().includes(searchLower)
    ) && (filterType ? property.type === filterType : true);
  });

  const handleOpenPropertyDetails = (property) => {
    setSelectedProperty(property);
  };

  const handleClosePropertyDetails = () => {
    setSelectedProperty(null);
    setSelectedPhotoCategory('Toutes');
  };

  // Function to get property maintenance history
  const getPropertyMaintenanceHistory = (propertyId) => {
    return maintenanceHistory.filter(task => task.propertyId === propertyId);
  };

  // Function to get urgency badge for maintenance tasks
  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch(urgency) {
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full">Faible</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-full">Moyenne</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 rounded-full">Élevée</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 rounded-full">Critique</Badge>;
      default:
        return null;
    }
  };

  // Function to get status icon for maintenance tasks
  const getStatusIcon = (task: MaintenanceTask) => {
    if (task.completedAt) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (task.startedAt) {
      return <Clock className="h-4 w-4 text-amber-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  // Function to get status text for maintenance tasks
  const getStatusText = (task: MaintenanceTask) => {
    if (task.completedAt) {
      return <span className="text-green-600">Terminée</span>;
    } else if (task.startedAt) {
      return <span className="text-amber-600">En cours</span>;
    } else {
      return <span className="text-red-600">En attente</span>;
    }
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'climatisation': return <Wind className="h-4 w-4" />;
      case 'parking': return <Car className="h-4 w-4" />;
      case 'télévision': return <Tv className="h-4 w-4" />;
      case 'vue mer': return <Waves className="h-4 w-4" />;
      case 'cuisine équipée': return <UtensilsCrossed className="h-4 w-4" />;
      default: return null;
    }
  };

  const filteredPhotos = selectedProperty?.photos.filter(photo => 
    selectedPhotoCategory === 'Toutes' || photo.category === selectedPhotoCategory
  );

  const platformLinks = [
    { 
      name: "Airbnb", 
      url: (propertyId) => `https://airbnb.com/rooms/${propertyId}`, 
      icon: <Globe className="h-4 w-4" /> 
    },
    { 
      name: "Booking.com", 
      url: (propertyId) => `https://booking.com/hotel/${propertyId}`, 
      icon: <Globe className="h-4 w-4" /> 
    },
    { 
      name: "Abritel", 
      url: (propertyId) => `https://abritel.fr/location/${propertyId}`, 
      icon: <Globe className="h-4 w-4" /> 
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logements</h1>
        <p className="text-muted-foreground mt-1">
          Gestion des biens et des propriétaires
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total logements" 
          value={properties.length.toString()} 
          icon={<Home className="h-5 w-5" />}
          className="stagger-1"
        />
        <StatCard 
          title="Appartements" 
          value={properties.filter(p => p.type === 'Appartement').length.toString()} 
          icon={<Building className="h-5 w-5" />}
          className="stagger-2"
        />
        <StatCard 
          title="Maisons" 
          value={properties.filter(p => p.type === 'Maison').length.toString()} 
          icon={<Home className="h-5 w-5" />}
          className="stagger-3"
        />
        <StatCard 
          title="Studios" 
          value={properties.filter(p => p.type === 'Studio').length.toString()} 
          icon={<BedDouble className="h-5 w-5" />}
          className="stagger-4"
        />
      </div>
      
      <DashboardCard 
        title="Liste des logements"
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            >
              {viewMode === 'list' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
              {viewMode === 'list' ? 'Grille' : 'Liste'}
            </Button>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Ajouter un logement
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 max-w-sm flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher par numéro, adresse ou propriétaire..." 
                className="h-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Type de bien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="Appartement">Appartement</SelectItem>
                  <SelectItem value="Studio">Studio</SelectItem>
                  <SelectItem value="Loft">Loft</SelectItem>
                  <SelectItem value="Maison">Maison</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="gap-1">
                <SlidersHorizontal className="h-4 w-4" />
                Filtres avancés
              </Button>
            </div>
          </div>
          
          {viewMode === 'list' ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">N°</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Propriétaire</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow 
                      key={property.id}
                      className="cursor-pointer hover:bg-muted/80"
                      onClick={() => handleOpenPropertyDetails(property)}
                    >
                      <TableCell className="font-medium">{property.number}</TableCell>
                      <TableCell>{property.address}</TableCell>
                      <TableCell>
                        <Badge className="rounded-full">{property.type}</Badge>
                      </TableCell>
                      <TableCell>{property.owner.name}</TableCell>
                      <TableCell>{property.commission}%</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="gap-1">
                          Détails <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property, index) => (
                <Card 
                  key={property.id} 
                  className={`animate-slide-up stagger-${(index % 5) + 1} border border-border/40 overflow-hidden card-hover`}
                  onClick={() => handleOpenPropertyDetails(property)}
                >
                  <div className="h-48 bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Home className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                    <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
                      N°{property.number}
                    </div>
                  </div>
                  
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2 rounded-full">{property.type}</Badge>
                        <h3 className="font-semibold text-lg">{property.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {property.address}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BedDouble className="h-4 w-4" />
                        {property.bedrooms} {property.bedrooms > 1 ? 'chambres' : 'chambre'}
                      </div>
                      <div>|</div>
                      <div>{property.size} m²</div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-xs font-medium mb-1.5">Équipements:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {property.amenities.slice(0, 3).map((amenity, i) => (
                          <Badge key={i} variant="outline" className="text-xs rounded-full flex items-center gap-1">
                            {getAmenityIcon(amenity)}
                            {amenity}
                          </Badge>
                        ))}
                        {property.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs rounded-full">
                            +{property.amenities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/30">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Propriétaire:</span>{' '}
                        <span className="font-medium">{property.owner.name}</span>
                      </div>
                      <div className="text-sm font-medium">
                        Commission: {property.commission}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardCard>

      {selectedProperty && (
        <Dialog open={!!selectedProperty} onOpenChange={handleClosePropertyDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-normal">
                  N°{selectedProperty.number}
                </span>
                {selectedProperty.name}
              </DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {selectedProperty.address}
                </div>
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="info" className="mt-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="equipment">Équipements</TabsTrigger>
                <TabsTrigger value="access" className="flex items-center gap-1">
                  <Key className="h-4 w-4" /> Accès
                </TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="platforms">Plateformes</TabsTrigger>
                <TabsTrigger value="maintenance" className="flex items-center gap-1">
                  <Wrench className="h-4 w-4" /> Maintenance
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium text-lg mb-4">Détails du logement</h3>
                      <dl className="space-y-3">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Type</dt>
                          <dd className="font-medium">{selectedProperty.type}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Surface</dt>
                          <dd className="font-medium">{selectedProperty.size} m²</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Chambres</dt>
                          <dd className="font-medium">{selectedProperty.bedrooms}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Salles de bain</dt>
                          <dd className="font-medium">{selectedProperty.bathrooms}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Commission</dt>
                          <dd className="font-medium">{selectedProperty.commission}%</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium text-lg mb-4">Propriétaire</h3>
                      <dl className="space-y-3">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Nom</dt>
                          <dd className="font-medium">{selectedProperty.owner.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Email</dt>
                          <dd className="font-medium">{selectedProperty.owner.email}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Téléphone</dt>
                          <dd className="font-medium">{selectedProperty.owner.phone}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-lg mb-4">Linge et consommables</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <h4 className="font-medium mb-2">Linge de lit</h4>
                        <ul className="list-disc ml-4 space-y-1 text-sm">
                          {selectedProperty.linens.bedding.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Serviettes</h4>
                        <ul className="list-disc ml-4 space-y-1 text-sm">
                          {selectedProperty.linens.towels.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Consommables</h4>
                        <ul className="list-disc ml-4 space-y-1 text-sm">
                          {selectedProperty.linens.consumables.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-lg mb-4">Aménités</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.amenities.map((amenity, index) => (
                        <Badge key={index} className="rounded-full">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="equipment" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-lg mb-4">Chauffage et climatisation</h3>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-primary" />
                      <span>{selectedProperty.equipment.heating}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-lg mb-4">Cuisine</h3>
                    <ul className="grid gap-2 md:grid-cols-2">
                      {selectedProperty.equipment.kitchen.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-lg mb-4">Salle de bain</h3>
                    <ul className="grid gap-2 md:grid-cols-2">
                      {selectedProperty.equipment.bathroom.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Waves className="h-4 w-4 text-muted-foreground" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Nouvel onglet Accès */}
              <TabsContent value="access" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-lg mb-4">Informations d'accès</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Key className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Code BAC</p>
                          <p className="text-muted-foreground font-mono">
                            {selectedProperty.bacCode || "Non renseigné"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Lock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Digicode</p>
                          <p className="text-muted-foreground font-mono">
                            {selectedProperty.digicode || "Non renseigné"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Wifi className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Code Wi-Fi</p>
                          <p className="text-muted-foreground font-mono">
                            {selectedProperty.wifiCode || "Non renseigné"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-lg mb-4">Emplacement</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Video className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Vidéo de présentation</
