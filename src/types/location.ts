// Location-related types for Stats module

export interface PropertyLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  area?: string; // neighborhood
  lat: number;
  lng: number;
  groupId?: string;
}

export interface PropertyGroup {
  id: string;
  name: string;
  color?: string;
  description?: string;
}

export interface LocationProperty extends PropertyLocation {
  group?: PropertyGroup;
  // Stats data
  stats: {
    bookedNights: number;
    occupancyRate: number;
    revenue: number;
    reservations: number;
    incidents: number;
    repasseRate: number;
    avgRating: number;
  };
}

export interface LocationFilters {
  groups: string[];
  cities: string[];
  areas: string[];
  channels: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface ViewportBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface ViewportKPIs {
  totalRevenue: number;
  occupancyRate: number;
  bookedNights: number;
  reservations: number;
  incidents: number;
  repasseRate: number;
  propertyCount: number;
}

export type HeatmapLayer = 
  | 'properties' 
  | 'booked-nights' 
  | 'occupancy' 
  | 'revenue' 
  | 'incidents' 
  | 'repasse';

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}
