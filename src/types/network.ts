export interface NetworkRegion {
  id: string;
  name: string;
  directorName: string;
  agencyCount: number;
  propertyCount: number;
  kpis: NetworkKPIs;
}

export interface NetworkAgency {
  id: string;
  name: string;
  regionId: string;
  city: string;
  managerName: string;
  propertyCount: number;
  kpis: NetworkKPIs;
  rank?: number;
  percentile?: number;
}

export interface NetworkKPIs {
  activeProperties: number;
  occupancyRate: number;
  occupancyRateChange: number;
  grossRevenue: number;
  grossRevenueChange: number;
  netRevenue: number;
  netRevenueChange: number;
  marginPerProperty: number;
  marginPerPropertyChange: number;
  revpar: number;
  revparChange: number;
  monthlyGrowth: number;
  criticalIncidents: number;
  npsGuests: number;
  npsOwners: number;
  cancellationRate: number;
  avgResponseTime: number; // hours
  avgResolutionTime: number; // hours
  qualityScore: number;
}

export interface NetworkNationalKPIs extends NetworkKPIs {
  totalAgencies: number;
  totalRegions: number;
}

export type NetworkLevel = 'national' | 'regional' | 'agency';

export interface NetworkBreadcrumb {
  level: NetworkLevel;
  id?: string;
  label: string;
}

export interface NetworkMonthlyTrend {
  month: string;
  revenue: number;
  occupancy: number;
  properties: number;
}
