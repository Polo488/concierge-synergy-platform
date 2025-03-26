import { MaintenanceTask } from './maintenance';

export type PropertyType = 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6+';
export type PropertyClassification = 'Appartement' | 'Studio' | 'Loft' | 'Maison' | 'Villa' | '';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type ResidenceType = 'principale' | 'secondaire';

export interface PropertyOwner {
  name: string;
  email: string;
  phone: string;
}

export interface PropertyBedding {
  bedding: string[];
  towels: string[];
  consumables: string[];
}

export interface PropertyEquipment {
  heating: string;
  kitchen: string[];
  bathroom: string[];
}

export interface PropertyPhoto {
  id: string;
  url: string;
  caption: string;
  category: string;
}

export interface PropertyUpsellItem {
  id: number;
  name: string;
  price: number;
  sold: number;
  salesLink?: string;
}

export interface PropertyUpsells {
  available: PropertyUpsellItem[];
  totalRevenue: number;
}

export interface PropertyAttachment {
  id: number;
  name: string;
  url: string;
  type: string;
}

export interface Property {
  id: string;
  number: string;
  name: string;
  type: PropertyType;
  classification: PropertyClassification;
  address: string;
  size: number;
  bedrooms: number;
  bedSizes: string[];
  bathrooms: number;
  amenities: string[];
  commission: number;
  photos: PropertyPhoto[];
  equipment: PropertyEquipment;
  linens: PropertyBedding;
  upsells: PropertyUpsells;
  owner: PropertyOwner;
  bacCode: string;
  digicode: string;
  wifiCode: string;
  youtubeLink: string;
  floor: string;
  agentNotes: string;
  attachments: PropertyAttachment[];
  residenceType: ResidenceType;
  nightsCount: number;
  nightsLimit: number;
}
