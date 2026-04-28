// Mocks Tableau de bord — 41 logements répartis Lyon + périphérie
// Statuts live : occupied, checkin (avec heure), free
// Données 100% client, polling simulé.

export type Channel = 'airbnb' | 'booking' | 'direct';
export type LogementStatus = 'occupied' | 'checkin' | 'free';

export interface Logement {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  photo: string; // emoji as fallback miniature
  status: LogementStatus;
  guestName?: string;
  guestUntil?: string; // libellé "dim. 12h"
  checkinAt?: string; // ISO datetime du check-in à venir
  channel?: Channel;
}

// Helper: now + N hours ISO
const inHours = (h: number) => {
  const d = new Date();
  d.setHours(d.getHours() + h, 0, 0, 0);
  return d.toISOString();
};

// 41 logements — Lyon centre, Part-Dieu, Confluence, Vaise, Croix-Rousse, Villeurbanne, Saint-Étienne
export const LOGEMENTS: Logement[] = [
  // === Lyon Presqu'île / Bellecour (centre) ===
  { id: 'l-01', name: 'Appartement Bellecour', address: '12 rue de la République, 69002', city: 'Lyon', lat: 45.7600, lng: 4.8357, photo: '🏛️', status: 'occupied', guestName: 'Marie Dubois', guestUntil: 'dim. 12h', channel: 'airbnb' },
  { id: 'l-02', name: 'Studio Cordeliers', address: '4 place des Cordeliers, 69002', city: 'Lyon', lat: 45.7641, lng: 4.8357, photo: '🏠', status: 'free' },
  { id: 'l-03', name: 'T2 Terreaux', address: '8 rue Édouard Herriot, 69001', city: 'Lyon', lat: 45.7676, lng: 4.8344, photo: '🏢', status: 'occupied', guestName: 'Thomas Laurent', guestUntil: 'sam. 11h', channel: 'booking' },
  { id: 'l-04', name: 'Loft Hôtel de Ville', address: '2 rue Joseph Serlin, 69001', city: 'Lyon', lat: 45.7672, lng: 4.8364, photo: '🏙️', status: 'checkin', checkinAt: inHours(2), channel: 'airbnb' },
  { id: 'l-05', name: 'T3 Ainay', address: '15 rue Auguste Comte, 69002', city: 'Lyon', lat: 45.7548, lng: 4.8294, photo: '🏠', status: 'free' },
  { id: 'l-06', name: 'Studio Perrache', address: '3 cours de Verdun, 69002', city: 'Lyon', lat: 45.7484, lng: 4.8267, photo: '🏢', status: 'free' },
  { id: 'l-07', name: 'Appartement Sala', address: '22 rue Sala, 69002', city: 'Lyon', lat: 45.7556, lng: 4.8324, photo: '🏛️', status: 'occupied', guestName: 'Sophie Bernard', guestUntil: 'lun. 10h', channel: 'direct' },
  { id: 'l-08', name: 'T2 Jacobins', address: '5 place des Jacobins, 69002', city: 'Lyon', lat: 45.7610, lng: 4.8333, photo: '🏠', status: 'free' },

  // === Lyon Part-Dieu ===
  { id: 'l-09', name: 'Studio Part-Dieu Tour', address: '129 rue Servient, 69003', city: 'Lyon', lat: 45.7607, lng: 4.8590, photo: '🏢', status: 'occupied', guestName: 'Lucas Moreau', guestUntil: 'ven. 11h', channel: 'airbnb' },
  { id: 'l-10', name: 'T2 Lafayette', address: '78 cours Lafayette, 69003', city: 'Lyon', lat: 45.7625, lng: 4.8523, photo: '🏠', status: 'checkin', checkinAt: inHours(7), channel: 'booking' },
  { id: 'l-11', name: 'Appartement Garibaldi', address: '210 rue Garibaldi, 69003', city: 'Lyon', lat: 45.7560, lng: 4.8512, photo: '🏛️', status: 'free' },
  { id: 'l-12', name: 'Studio Brotteaux', address: '15 cours Vitton, 69006', city: 'Lyon', lat: 45.7708, lng: 4.8527, photo: '🏢', status: 'occupied', guestName: 'Emma Petit', guestUntil: 'dim. 11h', channel: 'airbnb' },
  { id: 'l-13', name: 'T3 Foch', address: '40 avenue Maréchal Foch, 69006', city: 'Lyon', lat: 45.7705, lng: 4.8487, photo: '🏠', status: 'free' },
  { id: 'l-14', name: 'Loft Manufacture', address: '11 rue de la Part-Dieu, 69003', city: 'Lyon', lat: 45.7589, lng: 4.8550, photo: '🏙️', status: 'free' },
  { id: 'l-15', name: 'Studio Saxe', address: '92 avenue de Saxe, 69003', city: 'Lyon', lat: 45.7536, lng: 4.8501, photo: '🏢', status: 'free' },

  // === Lyon Confluence ===
  { id: 'l-16', name: 'T2 Confluence Quai', address: '8 cours Charlemagne, 69002', city: 'Lyon', lat: 45.7398, lng: 4.8175, photo: '🏠', status: 'occupied', guestName: 'Julien Roux', guestUntil: 'mar. 11h', channel: 'direct' },
  { id: 'l-17', name: 'Loft Sucrière', address: '49 quai Rambaud, 69002', city: 'Lyon', lat: 45.7415, lng: 4.8157, photo: '🏙️', status: 'checkin', checkinAt: inHours(15), channel: 'airbnb' },
  { id: 'l-18', name: 'Studio Musée', address: '86 quai Perrache, 69002', city: 'Lyon', lat: 45.7445, lng: 4.8195, photo: '🏢', status: 'free' },
  { id: 'l-19', name: 'T3 Hôtel-de-Région', address: '1 esplanade François Mitterrand, 69002', city: 'Lyon', lat: 45.7385, lng: 4.8200, photo: '🏠', status: 'free' },

  // === Lyon Vaise / 9e ===
  { id: 'l-20', name: 'Appartement Vaise', address: '32 rue Marietton, 69009', city: 'Lyon', lat: 45.7813, lng: 4.8059, photo: '🏛️', status: 'free' },
  { id: 'l-21', name: 'T2 Gorge de Loup', address: '12 rue Sergent Michel Berthet, 69009', city: 'Lyon', lat: 45.7790, lng: 4.8030, photo: '🏠', status: 'free' },
  { id: 'l-22', name: 'Studio Industrie', address: '5 quai Arloing, 69009', city: 'Lyon', lat: 45.7747, lng: 4.8094, photo: '🏢', status: 'free' },

  // === Lyon Croix-Rousse / 1er-4e ===
  { id: 'l-23', name: 'T2 Pentes', address: '21 rue des Tables Claudiennes, 69001', city: 'Lyon', lat: 45.7707, lng: 4.8341, photo: '🏠', status: 'occupied', guestName: 'Camille Lefèvre', guestUntil: 'mer. 10h', channel: 'booking' },
  { id: 'l-24', name: 'Appartement Boulevard', address: '8 boulevard de la Croix-Rousse, 69004', city: 'Lyon', lat: 45.7780, lng: 4.8336, photo: '🏛️', status: 'free' },
  { id: 'l-25', name: 'Studio Gros Caillou', address: '14 rue Belfort, 69004', city: 'Lyon', lat: 45.7785, lng: 4.8312, photo: '🏢', status: 'free' },
  { id: 'l-26', name: 'T3 Hénon', address: '3 rue Hénon, 69004', city: 'Lyon', lat: 45.7798, lng: 4.8276, photo: '🏠', status: 'free' },

  // === Lyon Vieux-Lyon ===
  { id: 'l-27', name: 'T2 Saint-Jean', address: '12 rue Saint-Jean, 69005', city: 'Lyon', lat: 45.7619, lng: 4.8275, photo: '🏛️', status: 'occupied', guestName: 'Antoine Martin', guestUntil: 'sam. 11h', channel: 'airbnb' },
  { id: 'l-28', name: 'Studio Fourvière', address: '8 montée du Chemin Neuf, 69005', city: 'Lyon', lat: 45.7611, lng: 4.8228, photo: '🏢', status: 'free' },
  { id: 'l-29', name: 'Appartement Saint-Georges', address: '32 rue Saint-Georges, 69005', city: 'Lyon', lat: 45.7558, lng: 4.8268, photo: '🏠', status: 'free' },

  // === Lyon 7e / Guillotière ===
  { id: 'l-30', name: 'T2 Guillotière', address: '40 cours Gambetta, 69007', city: 'Lyon', lat: 45.7530, lng: 4.8456, photo: '🏠', status: 'free' },
  { id: 'l-31', name: 'Studio Jean Macé', address: '18 rue de l\'Université, 69007', city: 'Lyon', lat: 45.7488, lng: 4.8418, photo: '🏢', status: 'free' },
  { id: 'l-32', name: 'T3 Gerland', address: '95 avenue Jean Jaurès, 69007', city: 'Lyon', lat: 45.7378, lng: 4.8389, photo: '🏠', status: 'checkin', checkinAt: inHours(22), channel: 'direct' },

  // === Villeurbanne ===
  { id: 'l-33', name: 'T2 Gratte-Ciel', address: '3 avenue Henri Barbusse, 69100', city: 'Villeurbanne', lat: 45.7672, lng: 4.8800, photo: '🏛️', status: 'free' },
  { id: 'l-34', name: 'Studio Charpennes', address: '12 cours Émile Zola, 69100', city: 'Villeurbanne', lat: 45.7706, lng: 4.8657, photo: '🏢', status: 'free' },
  { id: 'l-35', name: 'Appartement Tonkin', address: '28 rue du 4 Août 1789, 69100', city: 'Villeurbanne', lat: 45.7720, lng: 4.8730, photo: '🏠', status: 'free' },
  { id: 'l-36', name: 'T2 Flachet', address: '7 rue Léon Blum, 69100', city: 'Villeurbanne', lat: 45.7670, lng: 4.8896, photo: '🏠', status: 'free' },

  // === Saint-Étienne ===
  { id: 'l-37', name: 'T2 Hôtel de Ville', address: '5 rue de la République, 42000', city: 'Saint-Étienne', lat: 45.4385, lng: 4.3870, photo: '🏛️', status: 'free' },
  { id: 'l-38', name: 'Studio Centre-Deux', address: '16 cours Fauriel, 42100', city: 'Saint-Étienne', lat: 45.4280, lng: 4.3920, photo: '🏢', status: 'free' },
  { id: 'l-39', name: 'Appartement Bellevue', address: '22 rue Désiré Claude, 42100', city: 'Saint-Étienne', lat: 45.4221, lng: 4.3950, photo: '🏠', status: 'free' },
  { id: 'l-40', name: 'T3 Carnot', address: '40 rue Sadi Carnot, 42000', city: 'Saint-Étienne', lat: 45.4406, lng: 4.3895, photo: '🏠', status: 'free' },
  { id: 'l-41', name: 'Studio Châteaucreux', address: '8 place Châteaucreux, 42000', city: 'Saint-Étienne', lat: 45.4410, lng: 4.4001, photo: '🏢', status: 'free' },
];

// === KPI ===
export const DASHBOARD_KPIS = {
  checkInsToday: 4,
  checkOutsToday: 3,
  unreadMessages: 8,
  openTasks: 2,
};

// === Activité du jour ===
export type ActivityItem = {
  id: string;
  guestName: string;
  property: string;
  channel: Channel;
  time: string; // "15:00"
};

export const TODAY_CHECKINS: ActivityItem[] = [
  { id: 'in-1', guestName: 'Marie Dubois', property: 'Appartement Bellecour', channel: 'airbnb', time: '14:00' },
  { id: 'in-2', guestName: 'Pierre Lambert', property: 'Loft Hôtel de Ville', channel: 'booking', time: '15:30' },
  { id: 'in-3', guestName: 'Léa Garcia', property: 'T2 Lafayette', channel: 'airbnb', time: '17:00' },
  { id: 'in-4', guestName: 'Hugo Fernandez', property: 'Loft Sucrière', channel: 'direct', time: '19:30' },
];

export const TODAY_CHECKOUTS: ActivityItem[] = [
  { id: 'out-1', guestName: 'Thomas Laurent', property: 'T2 Terreaux', channel: 'booking', time: '10:00' },
  { id: 'out-2', guestName: 'Sophie Bernard', property: 'Appartement Sala', channel: 'direct', time: '11:00' },
  { id: 'out-3', guestName: 'Emma Petit', property: 'Studio Brotteaux', channel: 'airbnb', time: '11:00' },
];

export type DashboardTask = {
  id: string;
  title: string;
  property: string;
  due: string;
};

export const TODAY_TASKS: DashboardTask[] = [
  { id: 't-1', title: 'Réceptionner colis linge', property: 'T2 Confluence Quai', due: 'avant 14h' },
  { id: 't-2', title: 'Vérifier code BAC', property: 'Loft Sucrière', due: 'avant 17h' },
];

// === Agenda du jour / demain ===
export type AgendaItem = {
  id: string;
  title: string;
  type: 'task' | 'call' | 'maintenance';
  time: string;
  propertyCount?: number;
};

export const AGENDA_TODAY: AgendaItem[] = [
  { id: 'a-1', title: 'Réunion équipe hebdo', type: 'task', time: '09:00' },
  { id: 'a-2', title: 'Vérification chaudière', type: 'maintenance', time: '14:00', propertyCount: 2 },
  { id: 'a-3', title: 'Appel propriétaire Mme Laurent', type: 'call', time: '16:00', propertyCount: 1 },
];

export const AGENDA_TOMORROW: AgendaItem[] = [
  { id: 'a-4', title: 'État des lieux entrée', type: 'task', time: '10:30', propertyCount: 1 },
  { id: 'a-5', title: 'Appel Airbnb support', type: 'call', time: '15:00' },
];

// === Revenus 7 derniers jours ===
export type RevenuePoint = { day: string; value: number; date: string };

const today = new Date();
const dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export const REVENUE_7D: RevenuePoint[] = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (6 - i));
  // valeurs croissantes avec une bosse
  const base = [820, 940, 1120, 1380, 1180, 1510, 1620][i];
  return {
    day: dayLabels[d.getDay()],
    value: base,
    date: d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
  };
});

export const REVENUE_TOTAL = REVENUE_7D.reduce((s, p) => s + p.value, 0);
export const REVENUE_DELTA_PCT = 12; // vs 7 jours précédents
