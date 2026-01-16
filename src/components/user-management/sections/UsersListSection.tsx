
import { useState } from 'react';
import { ManagedUser, RoleDefinition } from '@/types/userManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  UserCog, 
  KeyRound, 
  UserX, 
  UserCheck,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { UserFormDialog } from '../dialogs/UserFormDialog';
import { UserDetailsSheet } from '../dialogs/UserDetailsSheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UsersListSectionProps {
  users: ManagedUser[];
  roles: RoleDefinition[];
  properties: { id: string; name: string }[];
  addUser: (userData: Omit<ManagedUser, 'id' | 'createdAt'>) => ManagedUser;
  updateUser: (userId: string, updates: Partial<ManagedUser>) => void;
  toggleUserStatus: (userId: string) => void;
  resetPassword: (userId: string) => void;
  updatePropertyAccess: (userId: string, propertyAccess: 'all' | 'selected', selectedProperties: string[]) => void;
  updateOperationalAssignments: (userId: string, propertyIds: string[]) => void;
}

export const UsersListSection = ({
  users,
  roles,
  properties,
  addUser,
  updateUser,
  toggleUserStatus,
  resetPassword,
  updatePropertyAccess,
  updateOperationalAssignments,
}: UsersListSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.roleId === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: 'active' | 'inactive') => {
    return status === 'active' 
      ? <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">Actif</Badge>
      : <Badge variant="secondary" className="bg-gray-100 text-gray-600">Inactif</Badge>;
  };

  const getRoleBadge = (roleId: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700',
      supervisor: 'bg-indigo-100 text-indigo-700',
      cityManager: 'bg-blue-100 text-blue-700',
      employee: 'bg-teal-100 text-teal-700',
      maintenance: 'bg-orange-100 text-orange-700',
      cleaning: 'bg-pink-100 text-pink-700',
    };
    const role = roles.find(r => r.id === roleId);
    return (
      <Badge className={`${colors[roleId] || 'bg-gray-100 text-gray-700'} hover:opacity-80`}>
        {role?.name || roleId}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <DashboardCard title="Liste des utilisateurs">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground -mt-2 mb-4">Gérez tous les utilisateurs et leurs accès</p>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-2 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher par nom ou email..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell 
                      className="font-medium"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.roleId)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {user.lastConnection 
                        ? format(user.lastConnection, 'dd MMM yyyy, HH:mm', { locale: fr })
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user);
                            setIsDetailsOpen(true);
                          }}>
                            <UserCog className="h-4 w-4 mr-2" />
                            Voir / Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => resetPassword(user.id)}>
                            <KeyRound className="h-4 w-4 mr-2" />
                            Réinitialiser mot de passe
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => toggleUserStatus(user.id)}
                            className={user.status === 'active' ? 'text-destructive' : 'text-green-600'}
                          >
                            {user.status === 'active' ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Désactiver
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activer
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DashboardCard>

      {/* Add User Dialog */}
      <UserFormDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        roles={roles}
        onSubmit={(data) => {
          addUser(data);
          setIsAddDialogOpen(false);
        }}
      />

      {/* User Details Sheet */}
      {selectedUser && (
        <UserDetailsSheet
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          user={selectedUser}
          roles={roles}
          properties={properties}
          onUpdateUser={updateUser}
          onUpdatePropertyAccess={updatePropertyAccess}
          onUpdateOperationalAssignments={updateOperationalAssignments}
        />
      )}
    </div>
  );
};
