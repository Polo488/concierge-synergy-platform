
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
          guestExperience: true,
          agenda: true,
          messaging: true,
          hrPlanning: true,
          onboarding: true,
        },
        defaultRoute: '/app',
        canManageUsers: true,
      };
    
    case 'supervisor':
      return {
        name: 'Superviseur',
        permissions: {
          properties: true,
          inventory: true,
          maintenance: true,
          cleaning: true,
          calendar: true,
          billing: false,
          moyenneDuree: true,
          upsell: true,
          users: true,
          guestExperience: true,
          agenda: true,
          messaging: true,
          hrPlanning: true,
          onboarding: true,
        },
        defaultRoute: '/app',
        canManageUsers: true,
      };

    case 'cityManager':
      return {
        name: 'City Manager',
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
          guestExperience: true,
          agenda: true,
          messaging: true,
          hrPlanning: false,
          onboarding: true,
        },
        defaultRoute: '/app',
        canManageUsers: false,
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
          guestExperience: true,
          agenda: true,
          messaging: true,
          hrPlanning: false,
          onboarding: false,
        },
        defaultRoute: '/app',
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
          guestExperience: false,
          agenda: false,
          messaging: false,
          hrPlanning: false,
          onboarding: false,
        },
        defaultRoute: '/app/maintenance',
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
          guestExperience: false,
          agenda: false,
          messaging: false,
          hrPlanning: false,
          onboarding: false,
        },
        defaultRoute: '/app/cleaning',
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
          guestExperience: false,
          agenda: false,
          messaging: false,
          hrPlanning: false,
          onboarding: false,
        },
        defaultRoute: '/login',
        canManageUsers: false,
      };
  }
};
