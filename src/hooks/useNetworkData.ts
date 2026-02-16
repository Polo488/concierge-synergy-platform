import { useMemo } from 'react';
import { NetworkRegion, NetworkAgency, NetworkNationalKPIs, NetworkMonthlyTrend } from '@/types/network';

const REGION_NAMES = [
  'Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes',
  'Occitanie', 'Nouvelle-Aquitaine', 'Bretagne',
  'Normandie', 'Hauts-de-France', 'Grand Est',
  'Pays de la Loire', 'Centre-Val de Loire', 'Bourgogne-Franche-Comté'
];

const CITIES: Record<string, string[]> = {
  'Île-de-France': ['Paris', 'Boulogne', 'Neuilly', 'Versailles', 'Saint-Denis', 'Nanterre', 'Créteil', 'Montreuil', 'Vincennes', 'Levallois'],
  'Provence-Alpes-Côte d\'Azur': ['Marseille', 'Nice', 'Aix-en-Provence', 'Toulon', 'Cannes', 'Avignon', 'Antibes', 'Hyères'],
  'Auvergne-Rhône-Alpes': ['Lyon', 'Grenoble', 'Saint-Étienne', 'Clermont-Ferrand', 'Annecy', 'Villeurbanne', 'Chambéry', 'Valence'],
  'Occitanie': ['Toulouse', 'Montpellier', 'Nîmes', 'Perpignan', 'Béziers', 'Carcassonne', 'Albi'],
  'Nouvelle-Aquitaine': ['Bordeaux', 'Limoges', 'Poitiers', 'La Rochelle', 'Pau', 'Bayonne', 'Biarritz'],
  'Bretagne': ['Rennes', 'Brest', 'Quimper', 'Vannes', 'Saint-Malo', 'Lorient'],
  'Normandie': ['Rouen', 'Caen', 'Le Havre', 'Deauville', 'Honfleur', 'Dieppe'],
  'Hauts-de-France': ['Lille', 'Amiens', 'Dunkerque', 'Arras', 'Valenciennes', 'Calais'],
  'Grand Est': ['Strasbourg', 'Metz', 'Nancy', 'Reims', 'Mulhouse', 'Colmar'],
  'Pays de la Loire': ['Nantes', 'Angers', 'Le Mans', 'Saint-Nazaire', 'La Baule'],
  'Centre-Val de Loire': ['Tours', 'Orléans', 'Bourges', 'Chartres', 'Blois'],
  'Bourgogne-Franche-Comté': ['Dijon', 'Besançon', 'Auxerre', 'Mâcon', 'Chalon']
};

const DIRECTOR_NAMES = [
  'Marie Dupont', 'Pierre Martin', 'Sophie Bernard', 'Jean Lefebvre',
  'Isabelle Moreau', 'François Durand', 'Claire Petit', 'Nicolas Roux',
  'Catherine Simon', 'Thomas Laurent', 'Anne Michel', 'Philippe Garcia'
];

function randomBetween(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

function generateAgencyKPIs(tier: 'top' | 'mid' | 'low'): NetworkAgency['kpis'] {
  const base = {
    top: { occ: [78, 95], rev: [180000, 420000], margin: [850, 1500], nps: [72, 92] },
    mid: { occ: [60, 78], rev: [90000, 200000], margin: [500, 900], nps: [55, 75] },
    low: { occ: [35, 62], rev: [40000, 110000], margin: [200, 550], nps: [30, 58] },
  }[tier];

  const props = tier === 'top' ? randomBetween(25, 60) : tier === 'mid' ? randomBetween(12, 30) : randomBetween(5, 15);
  const grossRev = randomBetween(base.rev[0], base.rev[1]);

  return {
    activeProperties: Math.round(props),
    occupancyRate: randomBetween(base.occ[0], base.occ[1]),
    occupancyRateChange: randomBetween(-8, 15),
    grossRevenue: grossRev,
    grossRevenueChange: randomBetween(-10, 25),
    netRevenue: grossRev * randomBetween(0.65, 0.82),
    netRevenueChange: randomBetween(-8, 22),
    marginPerProperty: randomBetween(base.margin[0], base.margin[1]),
    marginPerPropertyChange: randomBetween(-12, 18),
    revpar: randomBetween(90, 260),
    revparChange: randomBetween(-5, 20),
    monthlyGrowth: randomBetween(-3, 8),
    criticalIncidents: Math.round(randomBetween(0, tier === 'low' ? 8 : 3)),
    npsGuests: randomBetween(base.nps[0], base.nps[1]),
    npsOwners: randomBetween(base.nps[0] - 5, base.nps[1] - 5),
    cancellationRate: randomBetween(tier === 'low' ? 8 : 2, tier === 'low' ? 18 : 8),
    avgResponseTime: randomBetween(tier === 'low' ? 4 : 0.5, tier === 'low' ? 12 : 4),
    avgResolutionTime: randomBetween(tier === 'low' ? 12 : 2, tier === 'low' ? 48 : 14),
    qualityScore: randomBetween(tier === 'low' ? 55 : tier === 'mid' ? 70 : 82, tier === 'low' ? 72 : tier === 'mid' ? 85 : 98),
  };
}

function generateMonthlyTrend(): NetworkMonthlyTrend[] {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  let rev = 1200000;
  return months.map((month) => {
    rev = rev * randomBetween(0.92, 1.12);
    return {
      month,
      revenue: Math.round(rev),
      occupancy: randomBetween(55, 92),
      properties: Math.round(randomBetween(380, 450)),
    };
  });
}

export function useNetworkData() {
  const { agencies, regions, nationalKPIs, monthlyTrend } = useMemo(() => {
    const allAgencies: NetworkAgency[] = [];
    const allRegions: NetworkRegion[] = [];

    REGION_NAMES.forEach((regionName, rIdx) => {
      const regionId = `region-${rIdx}`;
      const cities = CITIES[regionName] || ['Ville A', 'Ville B', 'Ville C'];
      const agencyCount = cities.length;
      const regionAgencies: NetworkAgency[] = [];

      cities.forEach((city, aIdx) => {
        const tier = aIdx < 2 ? 'top' : aIdx < agencyCount - 1 ? 'mid' : 'low';
        const kpis = generateAgencyKPIs(tier);
        regionAgencies.push({
          id: `agency-${rIdx}-${aIdx}`,
          name: `Agence ${city}`,
          regionId,
          city,
          managerName: `${['A.', 'B.', 'C.', 'D.', 'E.', 'F.'][aIdx % 6]} ${['Martin', 'Durand', 'Bernard', 'Petit', 'Robert', 'Richard'][aIdx % 6]}`,
          propertyCount: kpis.activeProperties,
          kpis,
        });
      });

      allAgencies.push(...regionAgencies);

      const regionKPIs: NetworkRegion['kpis'] = {
        activeProperties: regionAgencies.reduce((s, a) => s + a.kpis.activeProperties, 0),
        occupancyRate: regionAgencies.reduce((s, a) => s + a.kpis.occupancyRate, 0) / regionAgencies.length,
        occupancyRateChange: regionAgencies.reduce((s, a) => s + a.kpis.occupancyRateChange, 0) / regionAgencies.length,
        grossRevenue: regionAgencies.reduce((s, a) => s + a.kpis.grossRevenue, 0),
        grossRevenueChange: regionAgencies.reduce((s, a) => s + a.kpis.grossRevenueChange, 0) / regionAgencies.length,
        netRevenue: regionAgencies.reduce((s, a) => s + a.kpis.netRevenue, 0),
        netRevenueChange: regionAgencies.reduce((s, a) => s + a.kpis.netRevenueChange, 0) / regionAgencies.length,
        marginPerProperty: regionAgencies.reduce((s, a) => s + a.kpis.marginPerProperty, 0) / regionAgencies.length,
        marginPerPropertyChange: regionAgencies.reduce((s, a) => s + a.kpis.marginPerPropertyChange, 0) / regionAgencies.length,
        revpar: regionAgencies.reduce((s, a) => s + a.kpis.revpar, 0) / regionAgencies.length,
        revparChange: regionAgencies.reduce((s, a) => s + a.kpis.revparChange, 0) / regionAgencies.length,
        monthlyGrowth: regionAgencies.reduce((s, a) => s + a.kpis.monthlyGrowth, 0) / regionAgencies.length,
        criticalIncidents: regionAgencies.reduce((s, a) => s + a.kpis.criticalIncidents, 0),
        npsGuests: regionAgencies.reduce((s, a) => s + a.kpis.npsGuests, 0) / regionAgencies.length,
        npsOwners: regionAgencies.reduce((s, a) => s + a.kpis.npsOwners, 0) / regionAgencies.length,
        cancellationRate: regionAgencies.reduce((s, a) => s + a.kpis.cancellationRate, 0) / regionAgencies.length,
        avgResponseTime: regionAgencies.reduce((s, a) => s + a.kpis.avgResponseTime, 0) / regionAgencies.length,
        avgResolutionTime: regionAgencies.reduce((s, a) => s + a.kpis.avgResolutionTime, 0) / regionAgencies.length,
        qualityScore: regionAgencies.reduce((s, a) => s + a.kpis.qualityScore, 0) / regionAgencies.length,
      };

      allRegions.push({
        id: regionId,
        name: regionName,
        directorName: DIRECTOR_NAMES[rIdx],
        agencyCount,
        propertyCount: regionKPIs.activeProperties,
        kpis: regionKPIs,
      });
    });

    // Rank agencies
    const sorted = [...allAgencies].sort((a, b) => b.kpis.grossRevenue - a.kpis.grossRevenue);
    sorted.forEach((a, i) => {
      a.rank = i + 1;
      a.percentile = Math.round(((sorted.length - i) / sorted.length) * 100);
    });

    const nat: NetworkNationalKPIs = {
      totalAgencies: allAgencies.length,
      totalRegions: allRegions.length,
      activeProperties: allAgencies.reduce((s, a) => s + a.kpis.activeProperties, 0),
      occupancyRate: allAgencies.reduce((s, a) => s + a.kpis.occupancyRate, 0) / allAgencies.length,
      occupancyRateChange: allAgencies.reduce((s, a) => s + a.kpis.occupancyRateChange, 0) / allAgencies.length,
      grossRevenue: allAgencies.reduce((s, a) => s + a.kpis.grossRevenue, 0),
      grossRevenueChange: allAgencies.reduce((s, a) => s + a.kpis.grossRevenueChange, 0) / allAgencies.length,
      netRevenue: allAgencies.reduce((s, a) => s + a.kpis.netRevenue, 0),
      netRevenueChange: allAgencies.reduce((s, a) => s + a.kpis.netRevenueChange, 0) / allAgencies.length,
      marginPerProperty: allAgencies.reduce((s, a) => s + a.kpis.marginPerProperty, 0) / allAgencies.length,
      marginPerPropertyChange: allAgencies.reduce((s, a) => s + a.kpis.marginPerPropertyChange, 0) / allAgencies.length,
      revpar: allAgencies.reduce((s, a) => s + a.kpis.revpar, 0) / allAgencies.length,
      revparChange: allAgencies.reduce((s, a) => s + a.kpis.revparChange, 0) / allAgencies.length,
      monthlyGrowth: allAgencies.reduce((s, a) => s + a.kpis.monthlyGrowth, 0) / allAgencies.length,
      criticalIncidents: allAgencies.reduce((s, a) => s + a.kpis.criticalIncidents, 0),
      npsGuests: allAgencies.reduce((s, a) => s + a.kpis.npsGuests, 0) / allAgencies.length,
      npsOwners: allAgencies.reduce((s, a) => s + a.kpis.npsOwners, 0) / allAgencies.length,
      cancellationRate: allAgencies.reduce((s, a) => s + a.kpis.cancellationRate, 0) / allAgencies.length,
      avgResponseTime: allAgencies.reduce((s, a) => s + a.kpis.avgResponseTime, 0) / allAgencies.length,
      avgResolutionTime: allAgencies.reduce((s, a) => s + a.kpis.avgResolutionTime, 0) / allAgencies.length,
      qualityScore: allAgencies.reduce((s, a) => s + a.kpis.qualityScore, 0) / allAgencies.length,
    };

    return {
      agencies: allAgencies,
      regions: allRegions,
      nationalKPIs: nat,
      monthlyTrend: generateMonthlyTrend(),
    };
  }, []);

  const getRegionAgencies = (regionId: string) => agencies.filter(a => a.regionId === regionId);
  const getTopAgencies = (n = 10) => [...agencies].sort((a, b) => b.kpis.grossRevenue - a.kpis.grossRevenue).slice(0, n);
  const getBottomAgencies = (n = 10) => [...agencies].sort((a, b) => a.kpis.grossRevenue - b.kpis.grossRevenue).slice(0, n);

  return {
    agencies,
    regions,
    nationalKPIs,
    monthlyTrend,
    getRegionAgencies,
    getTopAgencies,
    getBottomAgencies,
  };
}
