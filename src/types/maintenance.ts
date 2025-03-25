
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  min: number;
  status: 'low' | 'ok';
}

export interface MaintenanceTask {
  id: string | number;
  title: string;
  property: string;
  propertyId?: string; // Added property ID for linking to properties
  internalName?: string; // Added internal name for the property
  urgency: UrgencyLevel;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  scheduledDate?: string; // Added scheduled date for the maintenance
  technician?: string;
  description: string;
  materials?: InventoryItem[];
  materialQuantities?: Record<number, number>; // id -> quantity
}

export interface NewMaintenanceFormData {
  title: string;
  property: string;
  internalName?: string; // Added internal name for the property
  urgency: UrgencyLevel;
  description: string;
  materials: InventoryItem[];
  materialQuantities: Record<number, number>; // id -> quantity
}
