
import { UserRole, PermissionMap, RoleDefinition } from '@/types/roles';

const allFalsePermissions: PermissionMap = {
  properties: false, inventory: false, maintenance: false, cleaning: false,
  calendar: false, billing: false, moyenneDuree: false, upsell: false,
  users: false, guestExperience: false, agenda: false, messaging: false,
  hrPlanning: false, onboarding: false, ownerPortal: false, legalWatch: false,
  welcomeGuide: false,
};

// Define permissions and default routes for each role
export const getRoleConfig = (role: UserRole): RoleDefinition => {
  switch (role) {
    case 'admin':
      return {
        name: 'Administrateur',
        permissions: {
          ...allFalsePermissions,
          properties: true, inventory: true, maintenance: true, cleaning: true,
          calendar: true, billing: true, moyenneDuree: true, upsell: true,
          users: true, guestExperience: true, agenda: true, messaging: true,
          hrPlanning: true, onboarding: true, legalWatch: true, welcomeGuide: true,
        },
        defaultRoute: '/app',
        canManageUsers: true,
      };
    
    case 'supervisor':
      return {
        name: 'Superviseur',
        permissions: {
          ...allFalsePermissions,
          properties: true, inventory: true, maintenance: true, cleaning: true,
          calendar: true, moyenneDuree: true, upsell: true, users: true,
          guestExperience: true, agenda: true, messaging: true, hrPlanning: true,
          onboarding: true, legalWatch: true, welcomeGuide: true,
        },
        defaultRoute: '/app',
        canManageUsers: true,
      };

    case 'cityManager':
      return {
        name: 'City Manager',
        permissions: {
          ...allFalsePermissions,
          properties: true, inventory: true, maintenance: true, cleaning: true,
          calendar: true, moyenneDuree: true, upsell: true, guestExperience: true,
          agenda: true, messaging: true, onboarding: true,
        },
        defaultRoute: '/app',
        canManageUsers: false,
      };
    
    case 'employee':
      return {
        name: 'Employé',
        permissions: {
          ...allFalsePermissions,
          properties: true, inventory: true, maintenance: true, cleaning: true,
          calendar: true, moyenneDuree: true, upsell: true, guestExperience: true,
          agenda: true, messaging: true,
        },
        defaultRoute: '/app',
        canManageUsers: false,
      };
    
    case 'maintenance':
      return {
        name: 'Agent de maintenance',
        permissions: { ...allFalsePermissions, maintenance: true },
        defaultRoute: '/app/maintenance',
        canManageUsers: false,
      };
    
    case 'cleaning':
      return {
        name: 'Agent de ménage',
        permissions: { ...allFalsePermissions, cleaning: true },
        defaultRoute: '/app/cleaning',
        canManageUsers: false,
      };

    case 'owner':
      return {
        name: 'Propriétaire',
        permissions: { ...allFalsePermissions, ownerPortal: true },
        defaultRoute: '/app/owner',
        canManageUsers: false,
      };
    
    default:
      return {
        name: 'Utilisateur',
        permissions: { ...allFalsePermissions },
        defaultRoute: '/login',
        canManageUsers: false,
      };
  }
};
