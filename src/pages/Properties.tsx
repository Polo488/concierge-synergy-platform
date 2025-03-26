import { useState, useEffect } from 'react';
import { Grid3X3, Home, List, PlusCircle, Building, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/StatCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { generateProperties, generateMaintenanceHistory } from '@/utils/propertyUtils';
import { PropertySearchFilters } from '@/components/properties/PropertySearchFilters';
import { PropertyList } from '@/components/properties/PropertyList';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { PropertyDetailsDialog } from '@/components/properties/PropertyDetailsDialog';

const Properties = () => {
  const [properties] = useState(generateProperties);
  const [maintenanceHistory] = useState(() => generateMaintenanceHistory(properties));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  useEffect(() => {
    document.title = 'Logements - GESTION BNB LYON';
  }, []);

  const filteredProperties = properties.filter(property => {
    const searchLower = searchTerm.toLowerCase();
    return (
      property.number.includes(searchTerm) ||
      property.address.toLowerCase().includes(searchLower) ||
      property.owner.name.toLowerCase().includes(searchLower)
    ) && (filterType === 'all' ? true : property.type === filterType);
  });

  const handleOpenPropertyDetails = (property) => {
    setSelectedProperty(property);
  };

  const handleClosePropertyDetails = () => {
    setSelectedProperty(null);
  };

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
          <PropertySearchFilters 
            searchTerm={searchTerm}
            filterType={filterType}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilterType}
          />
          
          {viewMode === 'list' ? (
            <PropertyList 
              properties={filteredProperties} 
              onSelectProperty={handleOpenPropertyDetails} 
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property, index) => (
                <PropertyCard 
                  key={property.id}
                  property={property}
                  index={index}
                  onClick={handleOpenPropertyDetails}
                />
              ))}
            </div>
          )}
        </div>
      </DashboardCard>

      <PropertyDetailsDialog 
        property={selectedProperty}
        maintenanceHistory={maintenanceHistory}
        onClose={handleClosePropertyDetails}
      />
    </div>
  );
};

export default Properties;
