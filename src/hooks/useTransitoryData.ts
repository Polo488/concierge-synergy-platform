
import { useState, useMemo } from 'react';
import type {
  TransitoryProperty,
  TransitoryBooking,
  TransitoryEvent,
  TransitoryNetworkKPIs,
  TransitoryMonthlyData,
  CommercializationStatus,
  TransitoryPropertyStatus,
} from '@/types/transitory';

const propertyNames = [
  'Appartement Haussmannien', 'Studio Bellecour', 'Loft Part-Dieu', 'T3 Confluence',
  'Maison Croix-Rousse', 'Duplex Presqu\'île', 'T2 Vieux Lyon', 'Penthouse Tête d\'Or',
  'Studio Gerland', 'T4 Monplaisir', 'Appartement Brotteaux', 'Loft Guillotière',
  'T2 Jean Macé', 'Studio Saxe-Gambetta', 'Maison Tassin', 'T3 Villeurbanne',
];

const agencies = ['Lyon Centre', 'Lyon Est', 'Lyon Ouest', 'Villeurbanne', 'Tassin'];
const regions = ['Rhône-Alpes', 'PACA', 'Île-de-France'];
const channels: ('airbnb' | 'booking' | 'vrbo' | 'direct')[] = ['airbnb', 'booking', 'vrbo', 'direct'];
const statuses: CommercializationStatus[] = ['vente', 'relocation', 'mixte'];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProperties(): TransitoryProperty[] {
  return propertyNames.map((name, i) => {
    const daysInComm = rand(15, 180);
    const nightsAvailable = daysInComm;
    const nightsOccupied = Math.floor(nightsAvailable * (0.3 + Math.random() * 0.5));
    const occupancyRate = Math.round((nightsOccupied / nightsAvailable) * 100);
    const totalRevenue = nightsOccupied * rand(60, 180);
    const netMargin = Math.round(totalRevenue * (0.15 + Math.random() * 0.15));
    const avgMonthlyRevenue = Math.round(totalRevenue / Math.max(1, daysInComm / 30));
    const vacancyWithoutLCD = totalRevenue + rand(500, 3000);
    const revenueRecovered = totalRevenue;
    const isActive = i < 10;
    const isSuspended = i >= 10 && i < 13;

    return {
      id: `trans-${i + 1}`,
      propertyName: name,
      propertyAddress: `${rand(1, 200)} rue de ${['la République', 'Lyon', 'Bellecour', 'la Liberté', 'Victor Hugo'][i % 5]}, Lyon`,
      agencyName: agencies[i % agencies.length],
      regionName: regions[i % regions.length],
      commercializationStatus: statuses[i % 3],
      transitoryStatus: isActive ? 'active' : isSuspended ? 'suspended' : 'completed',
      activatedAt: new Date(2025, rand(0, 6), rand(1, 28)).toISOString(),
      suspendedAt: isSuspended ? new Date(2025, rand(7, 11), rand(1, 28)).toISOString() : undefined,
      suspensionReason: isSuspended ? (['compromis_signe', 'offre_acceptee', 'bail_signe'] as const)[i % 3] : undefined,
      suspendedBy: isSuspended ? 'Agent Transaction' : undefined,
      activatedBy: 'Directeur Agence',
      minStayNights: rand(1, 3),
      noticePeriodDays: rand(1, 7),
      rollingHorizonDays: rand(14, 60),
      blockOnVisit: Math.random() > 0.3,
      totalRevenue,
      netMargin,
      nightsOccupied,
      nightsAvailable,
      occupancyRate,
      avgMonthlyRevenue,
      bookingsCount: rand(2, 15),
      daysInCommercialization: daysInComm,
      vacancyWithoutLCD,
      vacancyWithLCD: vacancyWithoutLCD - revenueRecovered,
      revenueRecovered,
    };
  });
}

function generateBookings(properties: TransitoryProperty[]): TransitoryBooking[] {
  const bookings: TransitoryBooking[] = [];
  properties.forEach(p => {
    const count = rand(2, 6);
    for (let j = 0; j < count; j++) {
      const checkIn = new Date(2025, rand(0, 10), rand(1, 25));
      const nights = rand(2, 7);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + nights);
      bookings.push({
        id: `tb-${p.id}-${j}`,
        propertyId: p.id,
        guestName: ['Marie D.', 'Lucas M.', 'Sophie B.', 'Thomas R.', 'Julie P.'][j % 5],
        channel: channels[j % 4],
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        amount: nights * rand(60, 180),
        commission: rand(30, 120),
        status: j === 0 ? 'confirmed' : 'completed',
      });
    }
  });
  return bookings;
}

function generateMonthlyData(): TransitoryMonthlyData[] {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  return months.map((month, i) => ({
    month,
    revenue: rand(8000, 45000),
    propertiesActive: rand(5, 16),
    revenueRecovered: rand(5000, 30000),
  }));
}

export const useTransitoryData = () => {
  const [statusFilter, setStatusFilter] = useState<TransitoryPropertyStatus | 'all'>('all');
  const [commercializationFilter, setCommercializationFilter] = useState<CommercializationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const properties = useMemo(() => generateProperties(), []);
  const bookings = useMemo(() => generateBookings(properties), [properties]);
  const monthlyData = useMemo(() => generateMonthlyData(), []);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (statusFilter !== 'all' && p.transitoryStatus !== statusFilter) return false;
      if (commercializationFilter !== 'all' && p.commercializationStatus !== commercializationFilter) return false;
      if (searchQuery && !p.propertyName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [properties, statusFilter, commercializationFilter, searchQuery]);

  const networkKPIs: TransitoryNetworkKPIs = useMemo(() => {
    const active = properties.filter(p => p.transitoryStatus === 'active');
    const withRevenue = properties.filter(p => p.totalRevenue > 0);
    return {
      totalActiveProperties: active.length,
      totalTransitoryRevenue: properties.reduce((s, p) => s + p.totalRevenue, 0),
      percentPropertiesGeneratingRevenue: Math.round((withRevenue.length / properties.length) * 100),
      avgRevenuePerProperty: Math.round(properties.reduce((s, p) => s + p.totalRevenue, 0) / properties.length),
      totalRevenueRecovered: properties.reduce((s, p) => s + p.revenueRecovered, 0),
      avgOccupancyRate: Math.round(properties.reduce((s, p) => s + p.occupancyRate, 0) / properties.length),
      avgDaysInCommercialization: Math.round(properties.reduce((s, p) => s + p.daysInCommercialization, 0) / properties.length),
    };
  }, [properties]);

  return {
    properties: filteredProperties,
    allProperties: properties,
    bookings,
    monthlyData,
    networkKPIs,
    statusFilter,
    setStatusFilter,
    commercializationFilter,
    setCommercializationFilter,
    searchQuery,
    setSearchQuery,
  };
};
