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
    adr: number;
    adrChange: number;
    avgRevenuePerStay: number;
    avgRevenuePerStayChange: number;
    revpar: number;
    revparChange: number;
    occupancyRate: number;
    occupancyRateChange: number;
    availableNights: number;
    bookedNights: number;
    avgBookingValue: number;
    avgBookingValueChange: number;
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
    reservationsTrend: SparklinePoint[];
    nightsBooked: number;
    nightsBookedChange: number;
    occupancyRate: number;
    occupancyRateChange: number;
    occupancyTrend: SparklinePoint[];
    avgStayDuration: number;
    avgStayDurationChange: number;
    avgBookingWindow: number;
    avgBookingWindowChange: number;
  };
  revenueKpis: {
    monthlyRevenue: number;
    monthlyRevenueChange: number;
    revenueTrend: SparklinePoint[];
    avgRevenuePerStay: number;
    avgRevenuePerStayChange: number;
    avgRevenuePerNight: number;
    avgRevenuePerNightChange: number;
    revpar: number;
    revparChange: number;
    revparTrend: SparklinePoint[];
  };
  operationsKpis: {
    cleaningsCount: number;
    cleaningsCountChange: number;
    repasseRate: number;
    repasseRateChange: number;
    avgCleaningRating: number;
    avgCleaningRatingChange: number;
    incidentsCount: number;
    incidentsCountChange: number;
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

// Mock data generation
function generateMockOverviewData(): OverviewData {
  return {
    activityKpis: {
      reservations: 48,
      reservationsChange: 12.5,
      reservationsTrend: generateSparklineData(7, 0.4, 'up'),
      nightsBooked: 186,
      nightsBookedChange: 8.3,
      occupancyRate: 78.4,
      occupancyRateChange: 5.2,
      occupancyTrend: generateSparklineData(78, 0.15, 'up'),
      avgStayDuration: 3.9,
      avgStayDurationChange: -2.1,
      avgBookingWindow: 21.3,
      avgBookingWindowChange: 15.4
    },
    revenueKpis: {
      monthlyRevenue: 42580,
      monthlyRevenueChange: 18.7,
      revenueTrend: generateSparklineData(6000, 0.3, 'up'),
      avgRevenuePerStay: 887,
      avgRevenuePerStayChange: 5.4,
      avgRevenuePerNight: 229,
      avgRevenuePerNightChange: 9.8,
      revpar: 179,
      revparChange: 15.2,
      revparTrend: generateSparklineData(175, 0.2, 'up')
    },
    operationsKpis: {
      cleaningsCount: 52,
      cleaningsCountChange: 8.3,
      repasseRate: 3.8,
      repasseRateChange: -12.5,
      avgCleaningRating: 4.6,
      avgCleaningRatingChange: 2.2,
      incidentsCount: 7,
      incidentsCountChange: -22.2
    },
    monthlyComparison: {
      currentMonth: {
        revenue: 42580,
        occupancy: 78.4,
        reservations: 48,
        adr: 229,
        revpar: 179,
        cleanings: 52
      },
      previousMonth: {
        revenue: 35870,
        occupancy: 74.5,
        reservations: 43,
        adr: 215,
        revpar: 155,
        cleanings: 48
      }
    }
  };
}

function generateMockFinanceData(): FinanceData {
  const today = new Date();
  
  // Generate trend data for last 12 months
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
      adr: 215,
      adrChange: 6.8,
      avgRevenuePerStay: 814,
      avgRevenuePerStayChange: 4.2,
      revpar: 168,
      revparChange: 11.5,
      occupancyRate: 78.1,
      occupancyRateChange: 4.3,
      availableNights: 420,
      bookedNights: 328,
      avgBookingValue: 814,
      avgBookingValueChange: 4.2
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
