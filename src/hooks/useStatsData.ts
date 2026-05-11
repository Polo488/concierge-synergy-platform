import { useMemo } from 'react';
import { subDays, format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SparklinePoint {
  day: string;
  value: number;
}

interface FinanceData {
  kpis: {
    totalRevenue: number;
    totalRevenueChange: number;
    totalRevenueChangeN1: number;
    totalRevenueChangeYTD: number;
    adr: number;
    adrChange: number;
    adrChangeN1: number;
    adrChangeYTD: number;
    avgRevenuePerStay: number;
    avgRevenuePerStayChange: number;
    avgRevenuePerStayChangeN1: number;
    avgRevenuePerStayChangeYTD: number;
    revpar: number;
    revparChange: number;
    revparChangeN1: number;
    revparChangeYTD: number;
    occupancyRate: number;
    occupancyRateChange: number;
    occupancyRateChangeN1: number;
    occupancyRateChangeYTD: number;
    availableNights: number;
    bookedNights: number;
    avgBookingValue: number;
    avgBookingValueChange: number;
    avgBookingValueChangeN1: number;
    avgBookingValueChangeYTD: number;
  };
  revenueTrend: { date: string; value: number }[];
  occupancyTrend: { date: string; value: number }[];
  revenuePerStayTrend: { date: string; value: number }[];
  channelData: { channel: string; revenue: number; bookings: number; color: string }[];
  comparison: {
    currentMonth: number;
    previousMonth: number;
    currentYear: number;
    previousYear: number;
  };
}

interface OverviewData {
  activityKpis: {
    reservations: number;
    reservationsChange: number;
    reservationsChangeN1: number;
    reservationsChangeYTD: number;
    reservationsTrend: SparklinePoint[];
    nightsBooked: number;
    nightsBookedChange: number;
    nightsBookedChangeN1: number;
    nightsBookedChangeYTD: number;
    occupancyRate: number;
    occupancyRateChange: number;
    occupancyRateChangeN1: number;
    occupancyRateChangeYTD: number;
    occupancyTrend: SparklinePoint[];
    avgStayDuration: number;
    avgStayDurationChange: number;
    avgStayDurationChangeN1: number;
    avgStayDurationChangeYTD: number;
    avgBookingWindow: number;
    avgBookingWindowChange: number;
    avgBookingWindowChangeN1: number;
    avgBookingWindowChangeYTD: number;
  };
  revenueKpis: {
    monthlyRevenue: number;
    monthlyRevenueChange: number;
    monthlyRevenueChangeN1: number;
    monthlyRevenueChangeYTD: number;
    revenueTrend: SparklinePoint[];
    avgRevenuePerStay: number;
    avgRevenuePerStayChange: number;
    avgRevenuePerStayChangeN1: number;
    avgRevenuePerStayChangeYTD: number;
    avgRevenuePerNight: number;
    avgRevenuePerNightChange: number;
    avgRevenuePerNightChangeN1: number;
    avgRevenuePerNightChangeYTD: number;
    revpar: number;
    revparChange: number;
    revparChangeN1: number;
    revparChangeYTD: number;
    revparTrend: SparklinePoint[];
  };
  operationsKpis: {
    cleaningsCount: number;
    cleaningsCountChange: number;
    cleaningsCountChangeN1: number;
    cleaningsCountChangeYTD: number;
    repasseRate: number;
    repasseRateChange: number;
    repasseRateChangeN1: number;
    repasseRateChangeYTD: number;
    avgCleaningRating: number;
    avgCleaningRatingChange: number;
    avgCleaningRatingChangeN1: number;
    avgCleaningRatingChangeYTD: number;
    incidentsCount: number;
    incidentsCountChange: number;
    incidentsCountChangeN1: number;
    incidentsCountChangeYTD: number;
  };
  monthlyComparison: {
    currentMonth: {
      revenue: number;
      occupancy: number;
      reservations: number;
      adr: number;
      revpar: number;
      cleanings: number;
    };
    previousMonth: {
      revenue: number;
      occupancy: number;
      reservations: number;
      adr: number;
      revpar: number;
      cleanings: number;
    };
  };
}

// Generate 7-day sparkline data
function generateSparklineData(baseValue: number, variance: number, trend: 'up' | 'down' | 'stable' = 'up'): SparklinePoint[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const trendFactor = trend === 'up' ? i * 0.03 : trend === 'down' ? -i * 0.03 : 0;
    const randomVariance = (Math.random() - 0.5) * variance;
    return {
      day: format(date, 'EEE', { locale: fr }),
      value: Math.max(0, baseValue * (1 + trendFactor + randomVariance))
    };
  });
}

// Deterministic-but-distinct mock variants for N-1 (same period last year) and YTD
function comp(change: number, seed: number) {
  // N-1 typically more contrasted than M-1; YTD smoother
  const n1 = Math.round((change * 0.78 + (seed % 7) - 3) * 10) / 10;
  const ytd = Math.round((change * 0.62 + ((seed * 3) % 5) - 2) * 10) / 10;
  return { changeN1: n1, changeYTD: ytd };
}

// Mock data generation
function generateMockOverviewData(): OverviewData {
  const c = (change: number, seed: number) => comp(change, seed);
  return {
    activityKpis: {
      reservations: 48,
      reservationsChange: 12.5,
      ...{ reservationsChangeN1: c(12.5, 1).changeN1, reservationsChangeYTD: c(12.5, 1).changeYTD },
      reservationsTrend: generateSparklineData(7, 0.4, 'up'),
      nightsBooked: 186,
      nightsBookedChange: 8.3,
      ...{ nightsBookedChangeN1: c(8.3, 2).changeN1, nightsBookedChangeYTD: c(8.3, 2).changeYTD },
      occupancyRate: 78.4,
      occupancyRateChange: 5.2,
      ...{ occupancyRateChangeN1: c(5.2, 3).changeN1, occupancyRateChangeYTD: c(5.2, 3).changeYTD },
      occupancyTrend: generateSparklineData(78, 0.15, 'up'),
      avgStayDuration: 3.9,
      avgStayDurationChange: -2.1,
      ...{ avgStayDurationChangeN1: c(-2.1, 4).changeN1, avgStayDurationChangeYTD: c(-2.1, 4).changeYTD },
      avgBookingWindow: 21.3,
      avgBookingWindowChange: 15.4,
      ...{ avgBookingWindowChangeN1: c(15.4, 5).changeN1, avgBookingWindowChangeYTD: c(15.4, 5).changeYTD }
    },
    revenueKpis: {
      monthlyRevenue: 42580,
      monthlyRevenueChange: 18.7,
      ...{ monthlyRevenueChangeN1: c(18.7, 6).changeN1, monthlyRevenueChangeYTD: c(18.7, 6).changeYTD },
      revenueTrend: generateSparklineData(6000, 0.3, 'up'),
      avgRevenuePerStay: 887,
      avgRevenuePerStayChange: 5.4,
      ...{ avgRevenuePerStayChangeN1: c(5.4, 7).changeN1, avgRevenuePerStayChangeYTD: c(5.4, 7).changeYTD },
      avgRevenuePerNight: 229,
      avgRevenuePerNightChange: 9.8,
      ...{ avgRevenuePerNightChangeN1: c(9.8, 8).changeN1, avgRevenuePerNightChangeYTD: c(9.8, 8).changeYTD },
      revpar: 179,
      revparChange: 15.2,
      ...{ revparChangeN1: c(15.2, 9).changeN1, revparChangeYTD: c(15.2, 9).changeYTD },
      revparTrend: generateSparklineData(175, 0.2, 'up')
    },
    operationsKpis: {
      cleaningsCount: 52,
      cleaningsCountChange: 8.3,
      ...{ cleaningsCountChangeN1: c(8.3, 10).changeN1, cleaningsCountChangeYTD: c(8.3, 10).changeYTD },
      repasseRate: 3.8,
      repasseRateChange: -12.5,
      ...{ repasseRateChangeN1: c(-12.5, 11).changeN1, repasseRateChangeYTD: c(-12.5, 11).changeYTD },
      avgCleaningRating: 4.6,
      avgCleaningRatingChange: 2.2,
      ...{ avgCleaningRatingChangeN1: c(2.2, 12).changeN1, avgCleaningRatingChangeYTD: c(2.2, 12).changeYTD },
      incidentsCount: 7,
      incidentsCountChange: -22.2,
      ...{ incidentsCountChangeN1: c(-22.2, 13).changeN1, incidentsCountChangeYTD: c(-22.2, 13).changeYTD }
    },
    monthlyComparison: {
      currentMonth: { revenue: 42580, occupancy: 78.4, reservations: 48, adr: 229, revpar: 179, cleanings: 52 },
      previousMonth: { revenue: 35870, occupancy: 74.5, reservations: 43, adr: 215, revpar: 155, cleanings: 48 }
    }
  };
}

function generateMockFinanceData(): FinanceData {
  const today = new Date();
  const c = (change: number, seed: number) => comp(change, seed);

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(today, 11 - i);
    return format(date, 'MMM yy', { locale: fr });
  });

  const revenueTrend = months.map((date, idx) => ({
    date,
    value: 35000 + Math.random() * 15000 + idx * 500
  }));

  const occupancyTrend = months.map((date, idx) => ({
    date,
    value: 60 + Math.random() * 25 + (idx > 5 ? 5 : 0)
  }));

  const revenuePerStayTrend = months.map((date, idx) => ({
    date,
    value: 750 + Math.random() * 200 + idx * 10
  }));

  const channelData = [
    { channel: 'Airbnb', revenue: 28500, bookings: 32, color: '#FF5A5F' },
    { channel: 'Booking.com', revenue: 18200, bookings: 24, color: '#003580' },
    { channel: 'Direct', revenue: 12400, bookings: 15, color: '#10b981' },
    { channel: 'Abritel', revenue: 8600, bookings: 11, color: '#f97316' },
    { channel: 'Autres', revenue: 3200, bookings: 5, color: '#8b5cf6' }
  ];

  return {
    kpis: {
      totalRevenue: 70900,
      totalRevenueChange: 14.2,
      ...{ totalRevenueChangeN1: c(14.2, 21).changeN1, totalRevenueChangeYTD: c(14.2, 21).changeYTD },
      adr: 215,
      adrChange: 6.8,
      ...{ adrChangeN1: c(6.8, 22).changeN1, adrChangeYTD: c(6.8, 22).changeYTD },
      avgRevenuePerStay: 814,
      avgRevenuePerStayChange: 4.2,
      ...{ avgRevenuePerStayChangeN1: c(4.2, 23).changeN1, avgRevenuePerStayChangeYTD: c(4.2, 23).changeYTD },
      revpar: 168,
      revparChange: 11.5,
      ...{ revparChangeN1: c(11.5, 24).changeN1, revparChangeYTD: c(11.5, 24).changeYTD },
      occupancyRate: 78.1,
      occupancyRateChange: 4.3,
      ...{ occupancyRateChangeN1: c(4.3, 25).changeN1, occupancyRateChangeYTD: c(4.3, 25).changeYTD },
      availableNights: 420,
      bookedNights: 328,
      avgBookingValue: 814,
      avgBookingValueChange: 4.2,
      ...{ avgBookingValueChangeN1: c(4.2, 26).changeN1, avgBookingValueChangeYTD: c(4.2, 26).changeYTD }
    },
    revenueTrend,
    occupancyTrend,
    revenuePerStayTrend,
    channelData,
    comparison: {
      currentMonth: 42580,
      previousMonth: 35870,
      currentYear: 385420,
      previousYear: 342100
    }
  };
}

export function useStatsData() {
  const overviewData = useMemo(() => generateMockOverviewData(), []);
  const financeData = useMemo(() => generateMockFinanceData(), []);

  return {
    overviewData,
    financeData
  };
}
