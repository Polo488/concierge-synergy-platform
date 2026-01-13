
import { UserRole, PermissionMap, RoleDefinition } from '@/types/roles';

// Define permissions and default routes for each role
export const getRoleConfig = (role: UserRole): RoleDefinition => {
  switch (role) {
    case 'admin':
      return {
        name: 'Administrateur',
        permissions: {
          properties: true,
          inventory: true,
          maintenance: true,
          cleaning: true,
          calendar: true,
          billing: true,
          moyenneDuree: true,
          upsell: true,
          users: true,
          pricingRules: true,
        },
        defaultRoute: '/',
        canManageUsers: true,
      };
    
    case 'employee':
      return {
        name: 'Employé',
        permissions: {
          properties: true,
          inventory: true,
          maintenance: true,
          cleaning: true,
          calendar: true,
          billing: false,
          moyenneDuree: true,
          upsell: true,
          users: false,
          pricingRules: false,
        },
        defaultRoute: '/',
        canManageUsers: false,
      };
    
    case 'maintenance':
      return {
        name: 'Agent de maintenance',
        permissions: {
          properties: false,
          inventory: false,
          maintenance: true,
          cleaning: false,
          calendar: false,
          billing: false,
          moyenneDuree: false,
          upsell: false,
          users: false,
          pricingRules: false,
        },
        defaultRoute: '/maintenance',
        canManageUsers: false,
      };
    
    case 'cleaning':
      return {
        name: 'Agent de ménage',
        permissions: {
          properties: false,
          inventory: false,
          maintenance: false,
          cleaning: true,
          calendar: false,
          billing: false,
          moyenneDuree: false,
          upsell: false,
          users: false,
          pricingRules: false,
        },
        defaultRoute: '/cleaning',
        canManageUsers: false,
      };
    
    default:
      return {
        name: 'Utilisateur',
        permissions: {
          properties: false,
          inventory: false,
          maintenance: false,
          cleaning: false,
          calendar: false,
          billing: false,
          moyenneDuree: false,
          upsell: false,
          users: false,
          pricingRules: false,
        },
        defaultRoute: '/login',
        canManageUsers: false,
      };
  }
};
