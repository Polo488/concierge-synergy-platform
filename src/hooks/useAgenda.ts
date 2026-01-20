import { useState, useMemo } from 'react';
import { AgendaEntry, AgendaFilters } from '@/types/agenda';
import { addDays, startOfDay, endOfDay, isWithinInterval, isSameDay, format } from 'date-fns';

// Mock data for demo purposes
const mockProperties = [
  { id: 'prop-1', name: 'Appartement Bellecour' },
  { id: 'prop-2', name: 'Studio Part-Dieu' },
  { id: 'prop-3', name: 'T3 Croix-Rousse' },
  { id: 'prop-4', name: 'Loft Confluence' },
  { id: 'prop-5', name: 'T2 Vieux Lyon' },
];

const today = startOfDay(new Date());

const mockEntries: AgendaEntry[] = [
  {
    id: 'agenda-1',
    title: 'Réunion équipe hebdo',
    description: 'Point sur les performances de la semaine et planification.',
    startDate: today,
    endDate: today,
    startTime: '09:00',
    endTime: '10:00',
    authorId: 'user-1',
    authorName: 'Marie Dupont',
    linkedPropertyIds: [],
    tags: ['réunion', 'équipe'],
    createdAt: addDays(today, -5),
    updatedAt: addDays(today, -5),
  },
  {
    id: 'agenda-2',
    title: 'Vérification chaudière',
    description: 'Rappel: contacter le technicien pour la révision annuelle.',
    startDate: today,
    endDate: today,
    startTime: '14:00',
    endTime: '15:30',
    authorId: 'user-2',
    authorName: 'Pierre Martin',
    linkedPropertyIds: ['prop-1', 'prop-3'],
    tags: ['maintenance', 'rappel'],
    createdAt: addDays(today, -2),
    updatedAt: addDays(today, -2),
  },
  {
    id: 'agenda-3',
    title: 'Appel propriétaire Mme Laurent',
    description: 'Discussion sur le renouvellement du mandat de gestion.',
    startDate: today,
    endDate: today,
    startTime: '16:00',
    authorId: 'user-1',
    authorName: 'Marie Dupont',
    linkedPropertyIds: ['prop-2'],
    tags: ['propriétaire', 'mandat'],
    createdAt: addDays(today, -1),
    updatedAt: addDays(today, -1),
  },
  {
    id: 'agenda-4',
    title: 'Formation nouvelles procédures',
    description: 'Session de formation pour les nouvelles procédures de check-in.',
    startDate: addDays(today, 1),
    endDate: addDays(today, 1),
    startTime: '10:00',
    endTime: '12:00',
    authorId: 'user-1',
    authorName: 'Marie Dupont',
    linkedPropertyIds: [],
    tags: ['formation', 'équipe'],
    createdAt: addDays(today, -3),
    updatedAt: addDays(today, -3),
  },
  {
    id: 'agenda-5',
    title: 'Inventaire photographique',
    description: 'Mise à jour des photos pour les annonces.',
    startDate: addDays(today, 1),
    endDate: addDays(today, 1),
    startTime: '14:00',
    endTime: '17:00',
    authorId: 'user-3',
    authorName: 'Sophie Bernard',
    linkedPropertyIds: ['prop-4', 'prop-5'],
    tags: ['photos', 'marketing'],
    createdAt: addDays(today, -4),
    updatedAt: addDays(today, -4),
  },
  {
    id: 'agenda-6',
    title: 'Contrôle qualité mensuel',
    description: 'Inspection des logements pour le rapport mensuel.',
    startDate: addDays(today, 3),
    endDate: addDays(today, 5),
    authorId: 'user-2',
    authorName: 'Pierre Martin',
    linkedPropertyIds: ['prop-1', 'prop-2', 'prop-3'],
    tags: ['qualité', 'inspection'],
    createdAt: addDays(today, -7),
    updatedAt: addDays(today, -7),
  },
  {
    id: 'agenda-7',
    title: 'Note: Clés perdues T2 Vieux Lyon',
    description: 'Un voyageur a signalé avoir perdu les clés. À suivre avec le serrurier.',
    startDate: addDays(today, -1),
    endDate: addDays(today, -1),
    authorId: 'user-1',
    authorName: 'Marie Dupont',
    linkedPropertyIds: ['prop-5'],
    tags: ['incident', 'urgent'],
    createdAt: addDays(today, -1),
    updatedAt: addDays(today, -1),
  },
];

export const useAgenda = () => {
  const [entries, setEntries] = useState<AgendaEntry[]>(mockEntries);
  const [filters, setFilters] = useState<AgendaFilters>({
    searchQuery: '',
    propertyIds: [],
    tags: [],
  });

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach(entry => entry.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          entry.title.toLowerCase().includes(query) ||
          entry.description.toLowerCase().includes(query) ||
          entry.authorName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Property filter
      if (filters.propertyIds.length > 0) {
        const hasProperty = entry.linkedPropertyIds.some(id => 
          filters.propertyIds.includes(id)
        );
        if (!hasProperty) return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasTag = entry.tags.some(tag => filters.tags.includes(tag));
        if (!hasTag) return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const entryStart = startOfDay(entry.startDate);
        const entryEnd = endOfDay(entry.endDate);
        const filterStart = startOfDay(filters.dateRange.start);
        const filterEnd = endOfDay(filters.dateRange.end);
        
        const overlaps = entryStart <= filterEnd && entryEnd >= filterStart;
        if (!overlaps) return false;
      }

      return true;
    });
  }, [entries, filters]);

  const getEntriesForDate = (date: Date): AgendaEntry[] => {
    return entries.filter(entry => {
      const entryStart = startOfDay(entry.startDate);
      const entryEnd = endOfDay(entry.endDate);
      const targetDate = startOfDay(date);
      return isWithinInterval(targetDate, { start: entryStart, end: entryEnd });
    });
  };

  const getEntriesForDateRange = (start: Date, end: Date): AgendaEntry[] => {
    return entries.filter(entry => {
      const entryStart = startOfDay(entry.startDate);
      const entryEnd = endOfDay(entry.endDate);
      const rangeStart = startOfDay(start);
      const rangeEnd = endOfDay(end);
      return entryStart <= rangeEnd && entryEnd >= rangeStart;
    });
  };

  const addEntry = (entry: Omit<AgendaEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: AgendaEntry = {
      ...entry,
      id: `agenda-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEntries(prev => [...prev, newEntry]);
    return newEntry;
  };

  const updateEntry = (id: string, updates: Partial<AgendaEntry>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, ...updates, updatedAt: new Date() }
        : entry
    ));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Today and tomorrow entries for dashboard widget
  const todayEntries = useMemo(() => getEntriesForDate(today), [entries]);
  const tomorrowEntries = useMemo(() => getEntriesForDate(addDays(today, 1)), [entries]);

  return {
    entries: filteredEntries,
    allEntries: entries,
    filters,
    setFilters,
    allTags,
    properties: mockProperties,
    getEntriesForDate,
    getEntriesForDateRange,
    addEntry,
    updateEntry,
    deleteEntry,
    todayEntries,
    tomorrowEntries,
  };
};
