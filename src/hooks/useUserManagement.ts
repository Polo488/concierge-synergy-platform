
import { useState, useCallback } from 'react';
import { 
  ManagedUser, 
  RoleDefinition, 
  DEFAULT_ROLES, 
  MOCK_MANAGED_USERS,
  MOCK_PROPERTIES_LIST 
} from '@/types/userManagement';
import { useToast } from '@/components/ui/use-toast';

export const useUserManagement = () => {
  const [users, setUsers] = useState<ManagedUser[]>(MOCK_MANAGED_USERS);
  const [roles, setRoles] = useState<RoleDefinition[]>(DEFAULT_ROLES);
  const [properties] = useState(MOCK_PROPERTIES_LIST);
  const { toast } = useToast();

  // User operations
  const addUser = useCallback((userData: Omit<ManagedUser, 'id' | 'createdAt'>) => {
    const newUser: ManagedUser = {
      ...userData,
      id: (Math.max(...users.map(u => parseInt(u.id)), 0) + 1).toString(),
      createdAt: new Date(),
    };
    setUsers(prev => [...prev, newUser]);
    toast({
      title: 'Utilisateur créé',
      description: `${newUser.name} a été ajouté avec succès`,
    });
    return newUser;
  }, [users, toast]);

  const updateUser = useCallback((userId: string, updates: Partial<ManagedUser>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
    toast({
      title: 'Utilisateur mis à jour',
      description: 'Les modifications ont été enregistrées',
    });
  }, [toast]);

  const toggleUserStatus = useCallback((userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        toast({
          title: newStatus === 'active' ? 'Utilisateur activé' : 'Utilisateur désactivé',
          description: `${user.name} est maintenant ${newStatus === 'active' ? 'actif' : 'inactif'}`,
        });
        return { ...user, status: newStatus };
      }
      return user;
    }));
  }, [toast]);

  const resetPassword = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: 'Mot de passe réinitialisé',
        description: `Un email de réinitialisation a été envoyé à ${user.email}`,
      });
    }
  }, [users, toast]);

  // Role operations
  const addRole = useCallback((roleData: Omit<RoleDefinition, 'id'>) => {
    const newRole: RoleDefinition = {
      ...roleData,
      id: `custom_${Date.now()}`,
    };
    setRoles(prev => [...prev, newRole]);
    toast({
      title: 'Rôle créé',
      description: `Le rôle "${newRole.name}" a été créé avec succès`,
    });
    return newRole;
  }, [toast]);

  const updateRole = useCallback((roleId: string, updates: Partial<RoleDefinition>) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId ? { ...role, ...updates } : role
    ));
    toast({
      title: 'Rôle mis à jour',
      description: 'Les permissions ont été enregistrées',
    });
  }, [toast]);

  const deleteRole = useCallback((roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      toast({
        variant: 'destructive',
        title: 'Action impossible',
        description: 'Les rôles système ne peuvent pas être supprimés',
      });
      return false;
    }
    
    // Check if any user has this role
    const usersWithRole = users.filter(u => u.roleId === roleId);
    if (usersWithRole.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Action impossible',
        description: `Ce rôle est assigné à ${usersWithRole.length} utilisateur(s)`,
      });
      return false;
    }
    
    setRoles(prev => prev.filter(r => r.id !== roleId));
    toast({
      title: 'Rôle supprimé',
      description: `Le rôle a été supprimé avec succès`,
    });
    return true;
  }, [roles, users, toast]);

  // Property access operations
  const updatePropertyAccess = useCallback((userId: string, propertyAccess: 'all' | 'selected', selectedProperties: string[]) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, propertyAccess, selectedProperties }
        : user
    ));
    toast({
      title: 'Accès mis à jour',
      description: 'Les accès aux logements ont été enregistrés',
    });
  }, [toast]);

  // Operational assignments
  const updateOperationalAssignments = useCallback((userId: string, propertyIds: string[]) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, operationalAssignments: propertyIds }
        : user
    ));
    toast({
      title: 'Attributions mises à jour',
      description: 'Les attributions opérationnelles ont été enregistrées',
    });
  }, [toast]);

  // Get users by role type (for operational views)
  const getCleaningAgents = useCallback(() => {
    return users.filter(u => u.roleId === 'cleaning' && u.status === 'active');
  }, [users]);

  const getMaintenanceAgents = useCallback(() => {
    return users.filter(u => u.roleId === 'maintenance' && u.status === 'active');
  }, [users]);

  const getAgentsForProperty = useCallback((propertyId: string, type: 'cleaning' | 'maintenance') => {
    return users.filter(u => 
      u.roleId === type && 
      u.status === 'active' && 
      u.operationalAssignments.includes(propertyId)
    );
  }, [users]);

  return {
    users,
    roles,
    properties,
    addUser,
    updateUser,
    toggleUserStatus,
    resetPassword,
    addRole,
    updateRole,
    deleteRole,
    updatePropertyAccess,
    updateOperationalAssignments,
    getCleaningAgents,
    getMaintenanceAgents,
    getAgentsForProperty,
  };
};
