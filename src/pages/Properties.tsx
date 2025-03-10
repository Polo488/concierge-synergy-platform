import { useState, useEffect } from 'react';
import { 
  Home, PlusCircle, Search, Filter, 
  Building, User, MapPin, BedDouble, List, Grid3X3, SlidersHorizontal,
  ChevronRight, Camera, Thermometer, Wifi, Radio, Tv, Car, 
  Wind, CigaretteOff, Waves, UtensilsCrossed, Globe, ExternalLink
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

const generateProperties = () => {
  // ... keep existing code (generateProperties function)
};

const Properties = () => {
  const [properties] = useState(generateProperties);
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="equipment">Équipements</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="platforms">Plateformes</TabsTrigger>
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
              
              <TabsContent value="photos" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Photos du logement</h3>
                  <Select value={selectedPhotoCategory} onValueChange={setSelectedPhotoCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrer par catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Toutes">Toutes les photos</SelectItem>
                      <SelectItem value="Extérieur">Extérieur</SelectItem>
                      <SelectItem value="Salon">Salon</SelectItem>
                      <SelectItem value="Cuisine">Cuisine</SelectItem>
                      <SelectItem value="Chambre">Chambre</SelectItem>
                      <SelectItem value="Salle de bain">Salle de bain</SelectItem>
                      <SelectItem value="Chauffage">Chauffage</SelectItem>
                      <SelectItem value="Radiateur">Radiateur</SelectItem>
                      <SelectItem value="Équipement">Équipement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {filteredPhotos.map((photo) => (
                    <Card key={photo.id} className="overflow-hidden">
                      <div className="relative aspect-video bg-muted">
                        <img 
                          src={photo.url} 
                          alt={photo.caption} 
                          className="object-cover w-full h-full" 
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-white">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{photo.caption}</span>
                            <Badge variant="outline" className="text-xs bg-black/20 text-white border-white/20">
                              {photo.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="platforms" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-lg mb-4">Liens vers les plateformes</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {platformLinks.map((platform, index) => (
                        <a 
                          key={index}
                          href={platform.url(selectedProperty.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {platform.icon}
                            <span className="font-medium">{platform.name}</span>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Liens personnalisés</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Input placeholder="Nom de la plateforme" className="flex-1" />
                          <Input placeholder="URL" className="flex-1" />
                          <Button variant="outline" size="sm">Ajouter</Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Note: Les liens personnalisés ne sont pas encore fonctionnels. Ils seront implémentés dans une future mise à jour.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Properties;

