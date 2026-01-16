
// Enhanced User Management Types

export type UserRole = 'admin' | 'supervisor' | 'cityManager' | 'employee' | 'maintenance' | 'cleaning';

export type PermissionLevel = 'none' | 'read' | 'edit' | 'admin';

export interface ModulePermission {
  dashboard: PermissionLevel;
  calendar: PermissionLevel;
  properties: PermissionLevel;
  cleaning: PermissionLevel;
  maintenance: PermissionLevel;
  inventory: PermissionLevel;
  billing: PermissionLevel;
  qualityStats: PermissionLevel;
  guestExperience: PermissionLevel;
  insights: PermissionLevel;
  settings: PermissionLevel;
  moyenneDuree: PermissionLevel;
  upsell: PermissionLevel;
  userManagement: PermissionLevel;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: ModulePermission;
  isSystem: boolean; // System roles can't be deleted
  canManageUsers: boolean;
}

export interface PropertyAccess {
  propertyId: string;
  propertyName: string;
  hasAccess: boolean;
}

export interface OperationalAssignment {
  propertyId: string;
  propertyName: string;
  isAssigned: boolean;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roleId: string;
  roleName: string;
  status: 'active' | 'inactive';
  lastConnection?: Date;
  avatar?: string;
  propertyAccess: 'all' | 'selected';
  selectedProperties: string[];
  operationalAssignments: string[]; // Property IDs for cleaning/maintenance agents
  createdAt: Date;
}

// Default role configurations
export const DEFAULT_ROLES: RoleDefinition[] = [
  {
    id: 'admin',
    name: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
    isSystem: true,
    canManageUsers: true,
    permissions: {
      dashboard: 'admin',
      calendar: 'admin',
      properties: 'admin',
      cleaning: 'admin',
      maintenance: 'admin',
      inventory: 'admin',
      billing: 'admin',
      qualityStats: 'admin',
      guestExperience: 'admin',
      insights: 'admin',
      settings: 'admin',
      moyenneDuree: 'admin',
      upsell: 'admin',
      userManagement: 'admin',
    },
  },
  {
    id: 'supervisor',
    name: 'Superviseur',
    description: 'Gestion des équipes et opérations quotidiennes',
    isSystem: true,
    canManageUsers: true,
    permissions: {
      dashboard: 'admin',
      calendar: 'admin',
      properties: 'edit',
      cleaning: 'admin',
      maintenance: 'admin',
      inventory: 'edit',
      billing: 'read',
      qualityStats: 'admin',
      guestExperience: 'edit',
      insights: 'read',
      settings: 'read',
      moyenneDuree: 'edit',
      upsell: 'edit',
      userManagement: 'edit',
    },
  },
  {
    id: 'cityManager',
    name: 'City Manager',
    description: 'Gestion d\'un secteur géographique spécifique',
    isSystem: true,
    canManageUsers: false,
    permissions: {
      dashboard: 'read',
      calendar: 'edit',
      properties: 'edit',
      cleaning: 'edit',
      maintenance: 'edit',
      inventory: 'read',
      billing: 'none',
      qualityStats: 'read',
      guestExperience: 'edit',
      insights: 'read',
      settings: 'none',
      moyenneDuree: 'edit',
      upsell: 'edit',
      userManagement: 'none',
    },
  },
  {
    id: 'employee',
    name: 'Employé',
    description: 'Accès standard aux modules opérationnels',
    isSystem: true,
    canManageUsers: false,
    permissions: {
      dashboard: 'read',
      calendar: 'edit',
      properties: 'read',
      cleaning: 'edit',
      maintenance: 'edit',
      inventory: 'read',
      billing: 'none',
      qualityStats: 'read',
      guestExperience: 'read',
      insights: 'read',
      settings: 'none',
      moyenneDuree: 'read',
      upsell: 'read',
      userManagement: 'none',
    },
  },
  {
    id: 'maintenance',
    name: 'Agent de maintenance',
    description: 'Accès limité au module maintenance',
    isSystem: true,
    canManageUsers: false,
    permissions: {
      dashboard: 'none',
      calendar: 'none',
      properties: 'none',
      cleaning: 'none',
      maintenance: 'edit',
      inventory: 'read',
      billing: 'none',
      qualityStats: 'none',
      guestExperience: 'none',
      insights: 'none',
      settings: 'none',
      moyenneDuree: 'none',
      upsell: 'none',
      userManagement: 'none',
    },
  },
  {
    id: 'cleaning',
    name: 'Agent de ménage',
    description: 'Accès limité au module ménage',
    isSystem: true,
    canManageUsers: false,
    permissions: {
      dashboard: 'none',
      calendar: 'none',
      properties: 'none',
      cleaning: 'edit',
      maintenance: 'none',
      inventory: 'none',
      billing: 'none',
      qualityStats: 'none',
      guestExperience: 'none',
      insights: 'none',
      settings: 'none',
      moyenneDuree: 'none',
      upsell: 'none',
      userManagement: 'none',
    },
  },
];

// Mock users with enhanced data
export const MOCK_MANAGED_USERS: ManagedUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+33 6 12 34 56 78',
    roleId: 'admin',
    roleName: 'Administrateur',
    status: 'active',
    lastConnection: new Date(2024, 0, 15, 10, 30),
    avatar: 'https://i.pravatar.cc/150?u=1',
    propertyAccess: 'all',
    selectedProperties: [],
    operationalAssignments: [],
    createdAt: new Date(2023, 5, 1),
  },
  {
    id: '2',
    name: 'Marie Dupont',
    email: 'marie.dupont@example.com',
    phone: '+33 6 23 45 67 89',
    roleId: 'supervisor',
    roleName: 'Superviseur',
    status: 'active',
    lastConnection: new Date(2024, 0, 15, 9, 15),
    avatar: 'https://i.pravatar.cc/150?u=2',
    propertyAccess: 'all',
    selectedProperties: [],
    operationalAssignments: [],
    createdAt: new Date(2023, 6, 15),
  },
  {
    id: '3',
    name: 'Jean Martin',
    email: 'jean.martin@example.com',
    phone: '+33 6 34 56 78 90',
    roleId: 'cityManager',
    roleName: 'City Manager',
    status: 'active',
    lastConnection: new Date(2024, 0, 14, 18, 45),
    avatar: 'https://i.pravatar.cc/150?u=3',
    propertyAccess: 'selected',
    selectedProperties: ['1', '2', '3', '4'],
    operationalAssignments: [],
    createdAt: new Date(2023, 8, 1),
  },
  {
    id: '4',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@example.com',
    phone: '+33 6 45 67 89 01',
    roleId: 'employee',
    roleName: 'Employé',
    status: 'active',
    lastConnection: new Date(2024, 0, 15, 8, 0),
    avatar: 'https://i.pravatar.cc/150?u=4',
    propertyAccess: 'selected',
    selectedProperties: ['1', '2', '5', '6'],
    operationalAssignments: [],
    createdAt: new Date(2023, 9, 15),
  },
  {
    id: '5',
    name: 'Pierre Moreau',
    email: 'pierre.moreau@example.com',
    phone: '+33 6 56 78 90 12',
    roleId: 'maintenance',
    roleName: 'Agent de maintenance',
    status: 'active',
    lastConnection: new Date(2024, 0, 15, 7, 30),
    avatar: 'https://i.pravatar.cc/150?u=5',
    propertyAccess: 'selected',
    selectedProperties: ['1', '2', '3'],
    operationalAssignments: ['1', '2', '3'],
    createdAt: new Date(2023, 10, 1),
  },
  {
    id: '6',
    name: 'Fatima Benali',
    email: 'fatima.benali@example.com',
    phone: '+33 6 67 89 01 23',
    roleId: 'cleaning',
    roleName: 'Agent de ménage',
    status: 'active',
    lastConnection: new Date(2024, 0, 15, 6, 45),
    avatar: 'https://i.pravatar.cc/150?u=6',
    propertyAccess: 'selected',
    selectedProperties: ['1', '2', '4', '5'],
    operationalAssignments: ['1', '2', '4', '5'],
    createdAt: new Date(2023, 10, 15),
  },
  {
    id: '7',
    name: 'Carlos Silva',
    email: 'carlos.silva@example.com',
    phone: '+33 6 78 90 12 34',
    roleId: 'cleaning',
    roleName: 'Agent de ménage',
    status: 'inactive',
    lastConnection: new Date(2023, 11, 20, 14, 0),
    avatar: 'https://i.pravatar.cc/150?u=7',
    propertyAccess: 'selected',
    selectedProperties: ['3', '6', '7'],
    operationalAssignments: ['3', '6', '7'],
    createdAt: new Date(2023, 7, 1),
  },
];

// Simple property list for mock data
export const MOCK_PROPERTIES_LIST = [
  { id: '1', name: 'Appartement 12 Rue du Port' },
  { id: '2', name: 'Studio 8 Avenue des Fleurs' },
  { id: '3', name: 'Loft 72 Rue des Arts' },
  { id: '4', name: 'Maison 23 Rue de la Paix' },
  { id: '5', name: 'Appartement 45 Boulevard Central' },
  { id: '6', name: 'Studio 15 Rue des Lilas' },
  { id: '7', name: 'Appartement 28 Avenue Victor Hugo' },
  { id: '8', name: 'Duplex 5 Place de la République' },
  { id: '9', name: 'Studio 42 Rue Montmartre' },
];

export const MODULE_LABELS: Record<keyof ModulePermission, string> = {
  dashboard: 'Tableau de bord',
  calendar: 'Calendrier',
  properties: 'Logements',
  cleaning: 'Ménage',
  maintenance: 'Maintenance',
  inventory: 'Entrepôt',
  billing: 'Facturation',
  qualityStats: 'Statistiques',
  guestExperience: 'Communication Intelligente',
  insights: 'Insights & Alertes',
  settings: 'Paramètres',
  moyenneDuree: 'Moyenne Durée',
  upsell: 'Upsell',
  userManagement: 'Gestion Utilisateurs',
};

export const PERMISSION_LEVELS: { value: PermissionLevel; label: string; color: string }[] = [
  { value: 'none', label: 'Aucun', color: 'bg-gray-100 text-gray-600' },
  { value: 'read', label: 'Lecture', color: 'bg-blue-100 text-blue-700' },
  { value: 'edit', label: 'Édition', color: 'bg-amber-100 text-amber-700' },
  { value: 'admin', label: 'Administration', color: 'bg-green-100 text-green-700' },
];
