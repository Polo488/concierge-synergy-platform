
import { Property } from '@/types/property';
import { generateProperties as generatePropertiesInternal } from './mockPropertyGenerator';
import { generateMaintenanceHistory as generateMaintenanceHistoryInternal } from './maintenanceGenerator';
import { getAmenityIcon, getUrgencyBadge, platformLinks } from './uiHelpers';

// Re-export the functions from the utility files
export { 
  getAmenityIcon, 
  getUrgencyBadge, 
  platformLinks 
};

// Export the proxy functions
export const generateProperties = generatePropertiesInternal;
export const generateMaintenanceHistory = generateMaintenanceHistoryInternal;

// Re-export the Property type
export type { Property };
