
import { useEffect } from 'react';
import { 
  Home, PlusCircle, Search, Filter, 
  Building, User, MapPin, BedDouble
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatCard } from '@/components/dashboard/StatCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data
const properties = [
  {
    id: 1,
    name: 'Appartement Haussmannien',
    address: '12 Rue du Port, 75001 Paris',
    type: 'Appartement',
    bedrooms: 2,
    bathrooms: 1,
    size: 65,
    commission: 15,
    owner: {
      name: 'Thomas Dubois',
      email: 'thomas.dubois@example.com',
      phone: '+33 6 12 34 56 78'
    },
    amenities: ['Wifi', 'Climatisation', 'Machine à laver', 'Sèche-linge']
  },
  {
    id: 2,
    name: 'Studio Moderne',
    address: '8 Avenue des Fleurs, 69003 Lyon',
    type: 'Studio',
    bedrooms: 1,
    bathrooms: 1,
    size: 35,
    commission: 12,
    owner: {
      name: 'Sophie Moreau',
      email: 'sophie.moreau@example.com',
      phone: '+33 6 23 45 67 89'
    },
    amenities: ['Wifi', 'Télévision', 'Cuisine équipée']
  },
  {
    id: 3,
    name: 'Loft Industriel',
    address: '72 Rue des Arts, 13001 Marseille',
    type: 'Loft',
    bedrooms: 1,
    bathrooms: 1,
    size: 80,
    commission: 18,
    owner: {
      name: 'Marc Lefevre',
      email: 'marc.lefevre@example.com',
      phone: '+33 6 34 56 78 90'
    },
    amenities: ['Wifi', 'Parking', 'Terrasse', 'Vue mer']
  },
  {
    id: 4,
    name: 'Maison de Charme',
    address: '23 Rue de la Paix, 44000 Nantes',
    type: 'Maison',
    bedrooms: 3,
    bathrooms: 2,
    size: 120,
    commission: 20,
    owner: {
      name: 'Claire Durand',
      email: 'claire.durand@example.com',
      phone: '+33 6 45 67 89 01'
    },
    amenities: ['Wifi', 'Jardin', 'Barbecue', 'Parking', 'Climatisation']
  },
  {
    id: 5,
    name: 'Appartement Contemporain',
    address: '45 Boulevard Central, 33000 Bordeaux',
    type: 'Appartement',
    bedrooms: 2,
    bathrooms: 2,
    size: 70,
    commission: 15,
    owner: {
      name: 'Philippe Martin',
      email: 'philippe.martin@example.com',
      phone: '+33 6 56 78 90 12'
    },
    amenities: ['Wifi', 'Balcon', 'Ascenseur', 'Vue sur rivière']
  }
];

const Properties = () => {
  useEffect(() => {
    document.title = 'Logements - Concierge Synergy Platform';
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logements</h1>
        <p className="text-muted-foreground mt-1">
          Gestion des biens et des propriétaires
        </p>
      </div>
      
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total logements" 
          value="15" 
          icon={<Home className="h-5 w-5" />}
          className="stagger-1"
        />
        <StatCard 
          title="Appartements" 
          value="10" 
          icon={<Building className="h-5 w-5" />}
          className="stagger-2"
        />
        <StatCard 
          title="Maisons" 
          value="3" 
          icon={<Home className="h-5 w-5" />}
          className="stagger-3"
        />
        <StatCard 
          title="Studios" 
          value="2" 
          icon={<BedDouble className="h-5 w-5" />}
          className="stagger-4"
        />
      </div>
      
      {/* Properties management */}
      <DashboardCard 
        title="Liste des logements"
        actions={
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Ajouter un logement
          </Button>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 max-w-sm flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un logement..." className="h-9" />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <MapPin className="h-4 w-4" />
                Lieu
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Building className="h-4 w-4" />
                Type
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                Propriétaire
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Plus de filtres
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property, index) => (
              <Card key={property.id} className={`animate-slide-up stagger-${index + 1} border border-border/40 overflow-hidden card-hover`}>
                <div className="h-48 bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Home className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                </div>
                
                <div className="p-5">
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
                        <Badge key={i} variant="outline" className="text-xs rounded-full">
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
                      <span className="font-medium">Commission:</span>{' '}
                      {property.commission}%
                    </div>
                    <Button size="sm">Détails</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Properties;
