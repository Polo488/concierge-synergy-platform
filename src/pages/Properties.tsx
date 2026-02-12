
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid3X3, Home, List, PlusCircle, Building, BedDouble, Calendar, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/StatCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { generateProperties, generateMaintenanceHistory } from '@/utils/propertyUtils';
import { PropertySearchFilters } from '@/components/properties/PropertySearchFilters';
import { PropertyList } from '@/components/properties/PropertyList';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { PropertyDetailsDialog } from '@/components/properties/PropertyDetailsDialog';
import { RepasseEvent } from '@/components/properties/details/PropertyRepasseTab';
import { CleaningTask, CleaningIssue } from '@/types/cleaning';
import { TutorialTrigger } from '@/components/tutorial/TutorialTrigger';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface OnboardingPrefillData {
  fromOnboarding: boolean;
  onboardingProcessId: string;
  propertyName: string;
  propertyAddress: string;
  propertyType: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  commission?: number;
  city?: string;
}

const Properties = () => {
  const location = useLocation();
  const [properties] = useState(generateProperties);
  const [maintenanceHistory] = useState(() => generateMaintenanceHistory(properties));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [prefillData, setPrefillData] = useState<OnboardingPrefillData | null>(null);

  useEffect(() => {
    const state = location.state as { prefillData?: OnboardingPrefillData } | null;
    if (state?.prefillData?.fromOnboarding) {
      setPrefillData(state.prefillData);
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Generate mock repasse events for demo
  const repasseEvents = useMemo<RepasseEvent[]>(() => {
    const events: RepasseEvent[] = [];
    
    // Create some mock repasse events for different properties
    properties.slice(0, 5).forEach((property, pIndex) => {
      const issueTypes: CleaningIssue['issueType'][] = ['dust', 'bathroom', 'linen', 'kitchen', 'floors'];
      const agents = ['Marie Dubois', 'Jean Martin', 'Sophie Bernard', 'Lucas Petit'];
      const statuses: CleaningTask['status'][] = ['completed', 'inProgress', 'todo', 'scheduled'];
      
      // Add 1-3 repasse events per property
      const numEvents = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numEvents; i++) {
        const taskId = pIndex * 10 + i + 1000;
        const issueId = pIndex * 10 + i + 2000;
        const originalTaskId = pIndex * 10 + i + 3000;
        
        const daysAgo = Math.floor(Math.random() * 60);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        
        const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
        const agent = agents[Math.floor(Math.random() * agents.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const issue: CleaningIssue = {
          id: issueId,
          propertyId: property.id,
          propertyName: property.name,
          linkedTaskId: originalTaskId,
          linkedAgentId: agent,
          linkedAgentName: agent,
          source: 'cleaning_task',
          issueType,
          description: getIssueDescription(issueType),
          photos: Math.random() > 0.5 ? [
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200',
            'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=200',
          ] : [],
          repasseRequired: true,
          repasseTaskId: taskId,
          status: status === 'completed' ? 'resolved' : 'open',
          createdAt: date.toISOString(),
          createdBy: agent,
        };
        
        const task: CleaningTask = {
          id: taskId,
          property: property.name,
          status,
          cleaningAgent: agent,
          startTime: '09:00',
          endTime: '11:00',
          date: date.toISOString().split('T')[0],
          linens: [],
          consumables: [],
          comments: '',
          problems: [],
          taskType: 'repasse',
          linkedIssueId: issueId,
          originalTaskId,
        };
        
        const originalTask: CleaningTask = {
          id: originalTaskId,
          property: property.name,
          status: 'completed',
          cleaningAgent: agent,
          startTime: '10:00',
          endTime: '12:00',
          date: new Date(date.getTime() - 86400000).toISOString().split('T')[0],
          linens: [],
          consumables: [],
          comments: '',
          problems: [],
          taskType: 'standard',
        };
        
        events.push({ task, issue, originalTask });
      }
    });
    
    return events;
  }, [properties]);

  function getIssueDescription(type: CleaningIssue['issueType']): string {
    const descriptions: Record<CleaningIssue['issueType'], string> = {
      dust: 'Poussière visible sur les surfaces hautes et les plinthes. Le client a signalé des traces sur les meubles.',
      bathroom: 'Traces de calcaire dans la douche et autour du lavabo. Joints à nettoyer.',
      linen: 'Taches sur les draps du lit principal. Serviettes avec odeur.',
      kitchen: 'Plan de travail pas assez propre. Intérieur du micro-ondes à nettoyer.',
      smell: 'Odeur persistante dans la chambre. Possible humidité.',
      floors: 'Sols collants dans la cuisine. Traces de pas dans le couloir.',
      missing_items: 'Manque des serviettes et du papier toilette.',
      windows: 'Vitres avec traces. Pas nettoyées depuis longtemps.',
      appliances: 'Intérieur du réfrigérateur sale. Four à nettoyer.',
      damage: 'Rayures sur le parquet. Trou dans le mur de la chambre.',
      guest_complaint: 'Le client a signalé un problème de propreté général.',
      other: 'Problème de nettoyage non catégorisé.',
    };
    return descriptions[type];
  }
  
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

  // Calculer les statistiques de résidence
  const principalCount = properties.filter(p => p.residenceType === 'principale').length;
  const secondaryCount = properties.filter(p => p.residenceType === 'secondaire').length;

  return (
    <div className="space-y-8">
      <TutorialTrigger moduleId="properties" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logements</h1>
          <p className="text-muted-foreground mt-1">
            Gestion des biens et des propriétaires
          </p>
        </div>
        <TutorialButton moduleId="properties" />
      </div>

      {prefillData && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <span className="font-semibold text-foreground text-sm">Données pré-remplies depuis l'onboarding</span>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">Auto</Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setPrefillData(null)}>
                <X size={14} />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {prefillData.propertyName && (
                <div>
                  <p className="text-[11px] text-muted-foreground">Nom du logement</p>
                  <p className="font-medium text-foreground">{prefillData.propertyName}</p>
                </div>
              )}
              {prefillData.propertyAddress && (
                <div>
                  <p className="text-[11px] text-muted-foreground">Adresse</p>
                  <p className="font-medium text-foreground">{prefillData.propertyAddress}</p>
                </div>
              )}
              {prefillData.propertyType && (
                <div>
                  <p className="text-[11px] text-muted-foreground">Type</p>
                  <p className="font-medium text-foreground">{prefillData.propertyType}</p>
                </div>
              )}
              {prefillData.ownerName && (
                <div>
                  <p className="text-[11px] text-muted-foreground">Propriétaire</p>
                  <p className="font-medium text-foreground">{prefillData.ownerName}</p>
                </div>
              )}
              {prefillData.ownerEmail && (
                <div>
                  <p className="text-[11px] text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{prefillData.ownerEmail}</p>
                </div>
              )}
              {prefillData.ownerPhone && (
                <div>
                  <p className="text-[11px] text-muted-foreground">Téléphone</p>
                  <p className="font-medium text-foreground">{prefillData.ownerPhone}</p>
                </div>
              )}
              {prefillData.commission && (
                <div>
                  <p className="text-[11px] text-muted-foreground">Commission</p>
                  <p className="font-medium text-foreground">{prefillData.commission}%</p>
                </div>
              )}
              {prefillData.city && (
                <div>
                  <p className="text-[11px] text-muted-foreground">Ville</p>
                  <p className="font-medium text-foreground">{prefillData.city}</p>
                </div>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => {
                toast.success('Logement créé avec les données de l\'onboarding !');
                setPrefillData(null);
              }}>
                <PlusCircle size={14} className="mr-1.5" />
                Créer le logement avec ces données
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard 
          title="Total logements" 
          value={properties.length.toString()} 
          icon={<Home className="h-5 w-5" />}
          className="stagger-1"
        />
        <StatCard 
          title="Appartements" 
          value={properties.filter(p => p.classification === 'Appartement').length.toString()} 
          icon={<Building className="h-5 w-5" />}
          className="stagger-2"
        />
        <StatCard 
          title="Maisons" 
          value={properties.filter(p => p.classification === 'Maison').length.toString()} 
          icon={<Home className="h-5 w-5" />}
          className="stagger-3"
        />
        <StatCard 
          title="Studios" 
          value={properties.filter(p => p.classification === 'Studio').length.toString()} 
          icon={<BedDouble className="h-5 w-5" />}
          className="stagger-4"
        />
        <StatCard 
          title="Rés. principales" 
          value={principalCount.toString()} 
          icon={<Calendar className="h-5 w-5" />}
          className="stagger-5"
        />
        <StatCard 
          title="Rés. secondaires" 
          value={secondaryCount.toString()} 
          icon={<Home className="h-5 w-5" />}
          className="stagger-6"
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
        repasseEvents={repasseEvents}
        onClose={handleClosePropertyDetails}
        onViewTask={(task) => console.log('View task:', task)}
        onViewIssue={(issue) => console.log('View issue:', issue)}
      />
    </div>
  );
};

export default Properties;
