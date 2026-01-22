import { useMemo, useState, useCallback } from 'react';
import { subDays } from 'date-fns';
import { 
  PropertyGroup, 
  LocationProperty, 
  LocationFilters, 
  ViewportBounds, 
  ViewportKPIs,
  HeatmapPoint,
  HeatmapLayer
} from '@/types/location';

// Mock groups
const mockGroups: PropertyGroup[] = [
  { id: 'grp-1', name: 'Centre-Ville', color: '#3b82f6', description: 'Propriétés du centre historique' },
  { id: 'grp-2', name: 'Bord de Mer', color: '#10b981', description: 'Locations en front de mer' },
  { id: 'grp-3', name: 'Montagne', color: '#8b5cf6', description: 'Chalets et appartements montagne' },
  { id: 'grp-4', name: 'Périphérie', color: '#f97316', description: 'Logements en périphérie' },
];

// Mock properties with location data (France-focused)
const mockProperties: LocationProperty[] = [
  // Paris area
  { id: 'prop-1', name: 'Studio Marais', address: '15 Rue des Rosiers', city: 'Paris', zipCode: '75004', country: 'France', area: 'Le Marais', lat: 48.8566, lng: 2.3602, groupId: 'grp-1', stats: { bookedNights: 24, occupancyRate: 80, revenue: 4800, reservations: 8, incidents: 1, repasseRate: 4.2, avgRating: 4.7 } },
  { id: 'prop-2', name: 'Appartement Bastille', address: '42 Rue de la Roquette', city: 'Paris', zipCode: '75011', country: 'France', area: 'Bastille', lat: 48.8534, lng: 2.3741, groupId: 'grp-1', stats: { bookedNights: 28, occupancyRate: 93, revenue: 6720, reservations: 7, incidents: 0, repasseRate: 0, avgRating: 4.9 } },
  { id: 'prop-3', name: 'Loft Montmartre', address: '8 Rue Lepic', city: 'Paris', zipCode: '75018', country: 'France', area: 'Montmartre', lat: 48.8847, lng: 2.3328, groupId: 'grp-1', stats: { bookedNights: 22, occupancyRate: 73, revenue: 5280, reservations: 6, incidents: 2, repasseRate: 9.1, avgRating: 4.5 } },
  
  // Nice / Côte d'Azur
  { id: 'prop-4', name: 'Vue Mer Promenade', address: '120 Promenade des Anglais', city: 'Nice', zipCode: '06000', country: 'France', area: 'Promenade', lat: 43.6947, lng: 7.2656, groupId: 'grp-2', stats: { bookedNights: 30, occupancyRate: 100, revenue: 9000, reservations: 5, incidents: 0, repasseRate: 0, avgRating: 5.0 } },
  { id: 'prop-5', name: 'Studio Vieux Nice', address: '5 Cours Saleya', city: 'Nice', zipCode: '06300', country: 'France', area: 'Vieux Nice', lat: 43.6958, lng: 7.2757, groupId: 'grp-2', stats: { bookedNights: 26, occupancyRate: 87, revenue: 5200, reservations: 9, incidents: 1, repasseRate: 3.8, avgRating: 4.6 } },
  { id: 'prop-6', name: 'Terrasse Cimiez', address: '22 Avenue des Arènes', city: 'Nice', zipCode: '06000', country: 'France', area: 'Cimiez', lat: 43.7196, lng: 7.2753, groupId: 'grp-2', stats: { bookedNights: 18, occupancyRate: 60, revenue: 3600, reservations: 4, incidents: 0, repasseRate: 0, avgRating: 4.8 } },
  
  // Lyon
  { id: 'prop-7', name: 'T2 Presqu\'île', address: '45 Rue de la République', city: 'Lyon', zipCode: '69002', country: 'France', area: 'Presqu\'île', lat: 45.7640, lng: 4.8357, groupId: 'grp-1', stats: { bookedNights: 20, occupancyRate: 67, revenue: 3400, reservations: 5, incidents: 1, repasseRate: 5.0, avgRating: 4.4 } },
  { id: 'prop-8', name: 'Vue Rhône', address: '12 Quai Claude Bernard', city: 'Lyon', zipCode: '69007', country: 'France', area: 'Guillotière', lat: 45.7532, lng: 4.8426, groupId: 'grp-4', stats: { bookedNights: 15, occupancyRate: 50, revenue: 2250, reservations: 3, incidents: 2, repasseRate: 13.3, avgRating: 4.1 } },
  
  // Chamonix (Mountain)
  { id: 'prop-9', name: 'Chalet Mont Blanc', address: '89 Route du Bouchet', city: 'Chamonix', zipCode: '74400', country: 'France', area: 'Les Bossons', lat: 45.9237, lng: 6.8694, groupId: 'grp-3', stats: { bookedNights: 28, occupancyRate: 93, revenue: 11200, reservations: 4, incidents: 0, repasseRate: 0, avgRating: 4.9 } },
  { id: 'prop-10', name: 'Appart Ski-in', address: '15 Place Balmat', city: 'Chamonix', zipCode: '74400', country: 'France', area: 'Centre', lat: 45.9236, lng: 6.8699, groupId: 'grp-3', stats: { bookedNights: 25, occupancyRate: 83, revenue: 7500, reservations: 5, incidents: 1, repasseRate: 4.0, avgRating: 4.7 } },
  
  // Bordeaux
  { id: 'prop-11', name: 'Chartrons Chic', address: '28 Rue Notre Dame', city: 'Bordeaux', zipCode: '33000', country: 'France', area: 'Chartrons', lat: 44.8536, lng: -0.5700, groupId: 'grp-1', stats: { bookedNights: 22, occupancyRate: 73, revenue: 4400, reservations: 6, incidents: 0, repasseRate: 0, avgRating: 4.6 } },
  { id: 'prop-12', name: 'Place de la Bourse', address: '3 Place de la Bourse', city: 'Bordeaux', zipCode: '33000', country: 'France', area: 'Centre', lat: 44.8412, lng: -0.5696, groupId: 'grp-1', stats: { bookedNights: 27, occupancyRate: 90, revenue: 6750, reservations: 9, incidents: 1, repasseRate: 3.7, avgRating: 4.8 } },
  
  // Marseille
  { id: 'prop-13', name: 'Vieux Port View', address: '55 Quai du Port', city: 'Marseille', zipCode: '13002', country: 'France', area: 'Vieux Port', lat: 43.2951, lng: 5.3740, groupId: 'grp-2', stats: { bookedNights: 21, occupancyRate: 70, revenue: 4200, reservations: 7, incidents: 2, repasseRate: 9.5, avgRating: 4.3 } },
  { id: 'prop-14', name: 'Calanques Escape', address: '12 Avenue des Goudes', city: 'Marseille', zipCode: '13008', country: 'France', area: 'Les Goudes', lat: 43.2165, lng: 5.3501, groupId: 'grp-2', stats: { bookedNights: 16, occupancyRate: 53, revenue: 4000, reservations: 4, incidents: 0, repasseRate: 0, avgRating: 4.9 } },
  
  // Toulouse
  { id: 'prop-15', name: 'Capitole Central', address: '8 Rue du Taur', city: 'Toulouse', zipCode: '31000', country: 'France', area: 'Capitole', lat: 43.6047, lng: 1.4442, groupId: 'grp-1', stats: { bookedNights: 19, occupancyRate: 63, revenue: 2850, reservations: 5, incidents: 1, repasseRate: 5.3, avgRating: 4.5 } },
];

export function useLocationData() {
  const [filters, setFilters] = useState<LocationFilters>({
    groups: [],
    cities: [],
    areas: [],
    channels: [],
    dateRange: {
      start: subDays(new Date(), 30),
      end: new Date(),
    },
  });

  const [activeLayer, setActiveLayer] = useState<HeatmapLayer>('properties');

  // Get unique cities and areas
  const availableCities = useMemo(() => {
    const cities = [...new Set(mockProperties.map(p => p.city))];
    return cities.sort();
  }, []);

  const availableAreas = useMemo(() => {
    const areas = [...new Set(mockProperties.filter(p => p.area).map(p => p.area!))];
    return areas.sort();
  }, []);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return mockProperties
      .map(prop => ({
        ...prop,
        group: mockGroups.find(g => g.id === prop.groupId),
      }))
      .filter(prop => {
        if (filters.groups.length > 0 && prop.groupId && !filters.groups.includes(prop.groupId)) {
          return false;
        }
        if (filters.cities.length > 0 && !filters.cities.includes(prop.city)) {
          return false;
        }
        if (filters.areas.length > 0 && prop.area && !filters.areas.includes(prop.area)) {
          return false;
        }
        return true;
      });
  }, [filters]);

  // Properties without geolocation
  const nonGeolocatedCount = useMemo(() => {
    return mockProperties.filter(p => !p.lat || !p.lng).length;
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<LocationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Calculate viewport KPIs
  const getViewportKPIs = useCallback((bounds: ViewportBounds): ViewportKPIs => {
    const visibleProperties = filteredProperties.filter(prop => 
      prop.lat >= bounds.south &&
      prop.lat <= bounds.north &&
      prop.lng >= bounds.west &&
      prop.lng <= bounds.east
    );

    if (visibleProperties.length === 0) {
      return {
        totalRevenue: 0,
        occupancyRate: 0,
        bookedNights: 0,
        reservations: 0,
        incidents: 0,
        repasseRate: 0,
        propertyCount: 0,
      };
    }

    const totalRevenue = visibleProperties.reduce((sum, p) => sum + p.stats.revenue, 0);
    const bookedNights = visibleProperties.reduce((sum, p) => sum + p.stats.bookedNights, 0);
    const reservations = visibleProperties.reduce((sum, p) => sum + p.stats.reservations, 0);
    const incidents = visibleProperties.reduce((sum, p) => sum + p.stats.incidents, 0);
    const avgOccupancy = visibleProperties.reduce((sum, p) => sum + p.stats.occupancyRate, 0) / visibleProperties.length;
    const avgRepasse = visibleProperties.reduce((sum, p) => sum + p.stats.repasseRate, 0) / visibleProperties.length;

    return {
      totalRevenue,
      occupancyRate: avgOccupancy,
      bookedNights,
      reservations,
      incidents,
      repasseRate: avgRepasse,
      propertyCount: visibleProperties.length,
    };
  }, [filteredProperties]);

  // Generate heatmap data
  const getHeatmapData = useCallback((layer: HeatmapLayer): HeatmapPoint[] => {
    if (layer === 'properties') return [];

    // Find max value for normalization
    let maxValue = 0;
    filteredProperties.forEach(p => {
      let value = 0;
      switch (layer) {
        case 'booked-nights': value = p.stats.bookedNights; break;
        case 'occupancy': value = p.stats.occupancyRate; break;
        case 'revenue': value = p.stats.revenue; break;
        case 'incidents': value = p.stats.incidents; break;
        case 'repasse': value = p.stats.repasseRate; break;
      }
      if (value > maxValue) maxValue = value;
    });

    if (maxValue === 0) return [];

    return filteredProperties.map(p => {
      let value = 0;
      switch (layer) {
        case 'booked-nights': value = p.stats.bookedNights; break;
        case 'occupancy': value = p.stats.occupancyRate; break;
        case 'revenue': value = p.stats.revenue; break;
        case 'incidents': value = p.stats.incidents; break;
        case 'repasse': value = p.stats.repasseRate; break;
      }

      return {
        lat: p.lat,
        lng: p.lng,
        intensity: value / maxValue, // Normalize 0-1
      };
    });
  }, [filteredProperties]);

  // Calculate aggregated stats for all filtered properties
  const aggregatedStats = useMemo(() => {
    if (filteredProperties.length === 0) {
      return {
        totalRevenue: 0,
        avgOccupancy: 0,
        totalBookedNights: 0,
        totalReservations: 0,
        totalIncidents: 0,
        avgRepasseRate: 0,
        propertyCount: 0,
      };
    }

    return {
      totalRevenue: filteredProperties.reduce((sum, p) => sum + p.stats.revenue, 0),
      avgOccupancy: filteredProperties.reduce((sum, p) => sum + p.stats.occupancyRate, 0) / filteredProperties.length,
      totalBookedNights: filteredProperties.reduce((sum, p) => sum + p.stats.bookedNights, 0),
      totalReservations: filteredProperties.reduce((sum, p) => sum + p.stats.reservations, 0),
      totalIncidents: filteredProperties.reduce((sum, p) => sum + p.stats.incidents, 0),
      avgRepasseRate: filteredProperties.reduce((sum, p) => sum + p.stats.repasseRate, 0) / filteredProperties.length,
      propertyCount: filteredProperties.length,
    };
  }, [filteredProperties]);

  return {
    groups: mockGroups,
    properties: filteredProperties,
    filters,
    updateFilters,
    availableCities,
    availableAreas,
    nonGeolocatedCount,
    getViewportKPIs,
    getHeatmapData,
    activeLayer,
    setActiveLayer,
    aggregatedStats,
  };
}
