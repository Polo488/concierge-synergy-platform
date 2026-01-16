
import { useState } from 'react';
import { ManagedUser } from '@/types/userManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Home,
  Wrench,
  Sparkles,
  Save,
  AlertCircle,
} from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface OperationalAssignmentsSectionProps {
  users: ManagedUser[];
  properties: { id: string; name: string }[];
  updateOperationalAssignments: (userId: string, propertyIds: string[]) => void;
}

export const OperationalAssignmentsSection = ({
  users,
  properties,
  updateOperationalAssignments,
}: OperationalAssignmentsSectionProps) => {
  const [activeTab, setActiveTab] = useState('cleaning');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [editAssignments, setEditAssignments] = useState<string[]>([]);

  const cleaningAgents = users.filter(u => u.roleId === 'cleaning');
  const maintenanceAgents = users.filter(u => u.roleId === 'maintenance');

  const currentAgents = activeTab === 'cleaning' ? cleaningAgents : maintenanceAgents;

  const filteredAgents = currentAgents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditSheet = (user: ManagedUser) => {
    setSelectedUser(user);
    setEditAssignments([...user.operationalAssignments]);
  };

  const handleSave = () => {
    if (!selectedUser) return;
    updateOperationalAssignments(selectedUser.id, editAssignments);
    setSelectedUser(null);
  };

  const toggleProperty = (propertyId: string) => {
    setEditAssignments(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  // Get properties user has access to
  const getAccessibleProperties = (user: ManagedUser) => {
    if (user.propertyAccess === 'all') return properties;
    return properties.filter(p => user.selectedProperties.includes(p.id));
  };

  return (
    <div className="space-y-4">
      <DashboardCard title="Attributions opérationnelles">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground -mt-2 mb-2">Définissez les logements par défaut pour chaque agent</p>
          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Attribution structurelle</AlertTitle>
            <AlertDescription>
              Ces attributions définissent les logements sur lesquels chaque agent peut intervenir par défaut. 
              Les responsables d'équipe pourront ensuite redistribuer les missions quotidiennes 
              dans les modules Ménage et Maintenance.
            </AlertDescription>
          </Alert>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="cleaning" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Agents de ménage ({cleaningAgents.length})
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="gap-2">
                <Wrench className="h-4 w-4" />
                Agents maintenance ({maintenanceAgents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cleaning" className="mt-4">
              <AgentsList 
                agents={filteredAgents}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                properties={properties}
                onEdit={openEditSheet}
              />
            </TabsContent>

            <TabsContent value="maintenance" className="mt-4">
              <AgentsList 
                agents={filteredAgents}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                properties={properties}
                onEdit={openEditSheet}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardCard>

      {/* Edit Assignments Sheet */}
      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedUser?.roleId === 'cleaning' ? (
                <Sparkles className="h-5 w-5" />
              ) : (
                <Wrench className="h-5 w-5" />
              )}
              Attributions - {selectedUser?.name}
            </SheetTitle>
            <SheetDescription>
              Sélectionnez les logements sur lesquels cet agent peut intervenir par défaut
            </SheetDescription>
          </SheetHeader>

          {selectedUser && (
            <div className="mt-6 space-y-6">
              {/* Info about accessible properties */}
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p>
                  <strong>Note :</strong> Seuls les logements auxquels l'agent a accès 
                  (définis dans "Accès Logements") sont affichés.
                </p>
              </div>

              {/* Property Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Logements attribués ({editAssignments.length})
                  </Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      const accessibleProps = getAccessibleProperties(selectedUser);
                      if (editAssignments.length === accessibleProps.length) {
                        setEditAssignments([]);
                      } else {
                        setEditAssignments(accessibleProps.map(p => p.id));
                      }
                    }}
                  >
                    {editAssignments.length === getAccessibleProperties(selectedUser).length 
                      ? 'Tout désélectionner' 
                      : 'Tout sélectionner'}
                  </Button>
                </div>
                <ScrollArea className="h-[350px] border rounded-lg p-3">
                  <div className="space-y-2">
                    {getAccessibleProperties(selectedUser).map(property => (
                      <div 
                        key={property.id}
                        className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md"
                      >
                        <Checkbox 
                          id={`assign-${property.id}`}
                          checked={editAssignments.includes(property.id)}
                          onCheckedChange={() => toggleProperty(property.id)}
                        />
                        <Label 
                          htmlFor={`assign-${property.id}`}
                          className="flex-1 cursor-pointer flex items-center gap-2"
                        >
                          <Home className="h-4 w-4 text-muted-foreground" />
                          {property.name}
                        </Label>
                      </div>
                    ))}
                    {getAccessibleProperties(selectedUser).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Aucun logement accessible. Modifiez d'abord les accès de cet utilisateur.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Save Button */}
              <Button onClick={handleSave} className="w-full gap-2">
                <Save className="h-4 w-4" />
                Enregistrer les attributions
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Sub-component for agents list
interface AgentsListProps {
  agents: ManagedUser[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  properties: { id: string; name: string }[];
  onEdit: (user: ManagedUser) => void;
}

const AgentsList = ({ agents, searchTerm, setSearchTerm, properties, onEdit }: AgentsListProps) => {
  const getPropertyNames = (ids: string[]) => {
    return ids.map(id => properties.find(p => p.id === id)?.name || id);
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher un agent..." 
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Logements attribués</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map(agent => (
              <TableRow key={agent.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img 
                      src={agent.avatar || `https://i.pravatar.cc/150?u=${agent.id}`}
                      alt={agent.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-muted-foreground">{agent.phone || agent.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={agent.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'}
                  >
                    {agent.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {agent.operationalAssignments.length === 0 ? (
                    <span className="text-muted-foreground text-sm">Aucune attribution</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {getPropertyNames(agent.operationalAssignments).slice(0, 2).map((name, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {name}
                        </Badge>
                      ))}
                      {agent.operationalAssignments.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{agent.operationalAssignments.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(agent)}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {agents.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Aucun agent trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
