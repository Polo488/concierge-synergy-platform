
import { useState } from 'react';
import { ManagedUser, RoleDefinition } from '@/types/userManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Home,
  Eye,
  EyeOff,
  Save,
  Building,
} from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PropertyAccessSectionProps {
  users: ManagedUser[];
  roles: RoleDefinition[];
  properties: { id: string; name: string }[];
  updatePropertyAccess: (userId: string, propertyAccess: 'all' | 'selected', selectedProperties: string[]) => void;
}

export const PropertyAccessSection = ({
  users,
  roles,
  properties,
  updatePropertyAccess,
}: PropertyAccessSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [editAccessType, setEditAccessType] = useState<'all' | 'selected'>('all');
  const [editSelectedProperties, setEditSelectedProperties] = useState<string[]>([]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.roleId === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openEditSheet = (user: ManagedUser) => {
    setSelectedUser(user);
    setEditAccessType(user.propertyAccess);
    setEditSelectedProperties([...user.selectedProperties]);
  };

  const handleSave = () => {
    if (!selectedUser) return;
    updatePropertyAccess(selectedUser.id, editAccessType, editSelectedProperties);
    setSelectedUser(null);
  };

  const toggleProperty = (propertyId: string) => {
    setEditSelectedProperties(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const getAccessBadge = (user: ManagedUser) => {
    if (user.propertyAccess === 'all') {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <Eye className="h-3 w-3 mr-1" />
          Tous les logements
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Building className="h-3 w-3 mr-1" />
        {user.selectedProperties.length} logement(s)
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <DashboardCard title="Accès aux logements">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground -mt-2 mb-2">Définissez quels logements chaque utilisateur peut voir</p>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un utilisateur..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Accès aux logements</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.roleName}</Badge>
                    </TableCell>
                    <TableCell>{getAccessBadge(user)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditSheet(user)}
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DashboardCard>

      {/* Edit Property Access Sheet */}
      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Accès aux logements
            </SheetTitle>
            <SheetDescription>
              {selectedUser?.name} - Définir les logements accessibles
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Access Type Selection */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Type d'accès</Label>
              <RadioGroup 
                value={editAccessType} 
                onValueChange={(value: 'all' | 'selected') => setEditAccessType(value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Tous les logements</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      L'utilisateur peut voir tous les logements existants et futurs
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="selected" id="selected" />
                  <Label htmlFor="selected" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <EyeOff className="h-4 w-4 text-amber-600" />
                      <span className="font-medium">Sélection personnalisée</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      L'utilisateur ne voit que les logements sélectionnés ci-dessous
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Property Selection */}
            {editAccessType === 'selected' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Logements sélectionnés ({editSelectedProperties.length})
                  </Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      if (editSelectedProperties.length === properties.length) {
                        setEditSelectedProperties([]);
                      } else {
                        setEditSelectedProperties(properties.map(p => p.id));
                      }
                    }}
                  >
                    {editSelectedProperties.length === properties.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                  </Button>
                </div>
                <ScrollArea className="h-[300px] border rounded-lg p-3">
                  <div className="space-y-2">
                    {properties.map(property => (
                      <div 
                        key={property.id}
                        className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md"
                      >
                        <Checkbox 
                          id={`property-${property.id}`}
                          checked={editSelectedProperties.includes(property.id)}
                          onCheckedChange={() => toggleProperty(property.id)}
                        />
                        <Label 
                          htmlFor={`property-${property.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          {property.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Save Button */}
            <Button onClick={handleSave} className="w-full gap-2">
              <Save className="h-4 w-4" />
              Enregistrer les modifications
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
