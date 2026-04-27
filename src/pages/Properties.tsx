import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid3X3, Home, List, PlusCircle, Building, BedDouble, Calendar, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { toast } from '@/lib/toast';
import { TOAST_MESSAGES as M } from '@/lib/toastMessages';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
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
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Generate mock repasse events for demo
  const repasseEvents = useMemo<RepasseEvent[]>(() => {
    const events: RepasseEvent[] = [];
    properties.slice(0, 5).forEach((property, pIndex) => {
      const issueTypes: CleaningIssue['issueType'][] = ['dust', 'bathroom', 'linen', 'kitchen', 'floors'];
      const agents = ['Marie Dubois', 'Jean Martin', 'Sophie Bernard', 'Lucas Petit'];
      const statuses: CleaningTask['status'][] = ['completed', 'inProgress', 'todo', 'scheduled'];
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
          id: issueId, propertyId: property.id, propertyName: property.name,
          linkedTaskId: originalTaskId, linkedAgentId: agent, linkedAgentName: agent,
          source: 'cleaning_task', issueType, description: getIssueDescription(issueType),
          photos: Math.random() > 0.5 ? [
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200',
            'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=200',
          ] : [],
          repasseRequired: true, repasseTaskId: taskId,
          status: status === 'completed' ? 'resolved' : 'open',
          createdAt: date.toISOString(), createdBy: agent,
        };
        const task: CleaningTask = {
          id: taskId, property: property.name, status, cleaningAgent: agent,
          startTime: '09:00', endTime: '11:00', date: date.toISOString().split('T')[0],
          linens: [], consumables: [], comments: '', problems: [],
          taskType: 'repasse', linkedIssueId: issueId, originalTaskId,
        };
        const originalTask: CleaningTask = {
          id: originalTaskId, property: property.name, status: 'completed', cleaningAgent: agent,
          startTime: '10:00', endTime: '12:00',
          date: new Date(date.getTime() - 86400000).toISOString().split('T')[0],
          linens: [], consumables: [], comments: '', problems: [], taskType: 'standard',
        };
        events.push({ task, issue, originalTask });
      }
    });
    return events;
  }, [properties]);

  function getIssueDescription(type: CleaningIssue['issueType']): string {
    const descriptions: Record<CleaningIssue['issueType'], string> = {
      dust: 'Poussière visible sur les surfaces hautes et les plinthes.',
      bathroom: 'Traces de calcaire dans la douche et autour du lavabo.',
      linen: 'Taches sur les draps du lit principal.',
      kitchen: 'Plan de travail pas assez propre.',
      smell: 'Odeur persistante dans la chambre.',
      floors: 'Sols collants dans la cuisine.',
      missing_items: 'Manque des serviettes et du papier toilette.',
      windows: 'Vitres avec traces.',
      appliances: 'Intérieur du réfrigérateur sale.',
      damage: 'Rayures sur le parquet.',
      guest_complaint: 'Le client a signalé un problème de propreté.',
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

  const handleOpenPropertyDetails = (property: any) => setSelectedProperty(property);
  const handleClosePropertyDetails = () => setSelectedProperty(null);

  const principalCount = properties.filter(p => p.residenceType === 'principale').length;
  const secondaryCount = properties.filter(p => p.residenceType === 'secondaire').length;
  const appartCount = properties.filter(p => p.classification === 'Appartement').length;
  const maisonCount = properties.filter(p => p.classification === 'Maison').length;
  const studioCount = properties.filter(p => p.classification === 'Studio').length;

  const kpiCards = [
    { label: 'Total logements', value: properties.length, iconBg: 'bg-[hsl(239,84%,95%)]', iconColor: 'text-[hsl(239,84%,67%)]', Icon: Home, borderColor: 'border-[hsl(239,84%,85%)]', bg: 'bg-[hsl(239,84%,97%)]' },
    { label: 'Appartements', value: appartCount, iconBg: 'bg-[hsl(142,76%,94%)]', iconColor: 'text-[hsl(142,72%,29%)]', Icon: Building, borderColor: 'border-[hsl(142,76%,82%)]', bg: 'bg-[hsl(142,76%,97%)]' },
    { label: 'Maisons', value: maisonCount, iconBg: 'bg-[hsl(27,96%,94%)]', iconColor: 'text-[hsl(27,96%,44%)]', Icon: Home, borderColor: 'border-[hsl(27,96%,85%)]', bg: 'bg-[hsl(27,96%,97%)]' },
    { label: 'Studios', value: studioCount, iconBg: 'bg-[hsl(263,70%,94%)]', iconColor: 'text-[hsl(263,70%,50%)]', Icon: BedDouble, borderColor: 'border-[hsl(263,70%,85%)]', bg: 'bg-[hsl(263,70%,97%)]' },
    { label: 'Rés. principales', value: principalCount, iconBg: 'bg-[hsl(217,91%,94%)]', iconColor: 'text-[hsl(217,91%,60%)]', Icon: Calendar, borderColor: 'border-[hsl(217,91%,85%)]', bg: 'bg-[hsl(217,91%,97%)]' },
    { label: 'Rés. secondaires', value: secondaryCount, iconBg: 'bg-[hsl(289,68%,94%)]', iconColor: 'text-[hsl(289,68%,46%)]', Icon: Home, borderColor: 'border-[hsl(289,68%,85%)]', bg: 'bg-[hsl(289,68%,97%)]' },
  ];

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      <TutorialTrigger moduleId="properties" />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Logements</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestion des biens et des propriétaires</p>
        </div>
        <TutorialButton moduleId="properties" />
      </div>

      {/* Prefill from onboarding */}
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
              {prefillData.propertyName && <div><p className="text-[11px] text-muted-foreground">Nom</p><p className="font-medium text-foreground">{prefillData.propertyName}</p></div>}
              {prefillData.propertyAddress && <div><p className="text-[11px] text-muted-foreground">Adresse</p><p className="font-medium text-foreground">{prefillData.propertyAddress}</p></div>}
              {prefillData.propertyType && <div><p className="text-[11px] text-muted-foreground">Type</p><p className="font-medium text-foreground">{prefillData.propertyType}</p></div>}
              {prefillData.ownerName && <div><p className="text-[11px] text-muted-foreground">Propriétaire</p><p className="font-medium text-foreground">{prefillData.ownerName}</p></div>}
            </div>
            <div className="mt-3">
              <Button size="sm" onClick={() => { toast.success(M.properties.created); setPrefillData(null); }}>
                <PlusCircle size={14} className="mr-1.5" /> Créer le logement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
        {kpiCards.map(({ label, value, iconBg, iconColor, Icon, borderColor, bg }) => (
          <div key={label} className={`flex items-center gap-2.5 rounded-xl border ${borderColor} ${bg} p-3`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${iconBg}`}>
              <Icon className={`h-[18px] w-[18px] ${iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[22px] font-bold leading-none text-foreground">{value}</p>
              <p className="text-[11px] text-muted-foreground truncate">{label}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Section */}
      <div className="bg-card rounded-xl border border-border p-4">
        {/* Section header */}
        {isMobile ? (
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-foreground whitespace-nowrap">Liste des logements</h2>
              <Button variant="outline" size="sm" className="h-[34px] gap-1 text-xs" onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
                {viewMode === 'list' ? <Grid3X3 className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
                {viewMode === 'list' ? 'Grille' : 'Liste'}
              </Button>
            </div>
            <Button className="w-full h-11 gap-1.5 text-sm font-semibold rounded-xl" onClick={() => toast.info('Fonctionnalité disponible au lancement')}>
              <PlusCircle className="h-4 w-4" /> Ajouter un logement
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">Liste des logements</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
                {viewMode === 'list' ? <Grid3X3 className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
                {viewMode === 'list' ? 'Grille' : 'Liste'}
              </Button>
              <Button size="sm" className="gap-1 text-xs" onClick={() => toast.info('Fonctionnalité disponible au lancement')}>
                <PlusCircle className="h-3.5 w-3.5" /> Ajouter un logement
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <PropertySearchFilters 
          searchTerm={searchTerm}
          filterType={filterType}
          onSearchChange={setSearchTerm}
          onFilterChange={setFilterType}
        />
        
        {/* Content */}
        <div className="mt-4">
          {viewMode === 'list' ? (
            <PropertyList 
              properties={filteredProperties} 
              onSelectProperty={handleOpenPropertyDetails} 
            />
          ) : (
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
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
      </div>

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
