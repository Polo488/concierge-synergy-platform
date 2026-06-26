import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type AssignmentMode = 'priority' | 'rotation' | 'dedicated';

export interface CleaningAgency {
  id: string;
  name: string;
  email: string;
  external: boolean;
  workDays: number[]; // 0=D, 1=L … 6=S
  maxPerDay: number | null;
  color?: string;
}

export interface PropertyAssignment {
  /** Property name (unique key in mock) */
  property: string;
  mode: AssignmentMode;
  agencyIds: string[]; // ordered for priority, list for rotation, single for dedicated
}

interface TeamState {
  autoAssign: boolean;
  agencies: CleaningAgency[];
  assignments: PropertyAssignment[];
  /** All known properties (mock catalog) */
  catalog: string[];
}

interface TeamCtx extends TeamState {
  setAutoAssign: (v: boolean) => void;
  upsertAgency: (a: CleaningAgency) => void;
  removeAgency: (id: string) => void;
  setAgencies: (a: CleaningAgency[]) => void;
  setAssignmentsForProperties: (props: string[], mode: AssignmentMode, agencyIds: string[]) => void;
  clearAssignment: (property: string) => void;
  resetAll: () => void;
  isSetupComplete: boolean;
  setupSteps: { agencies: boolean; mode: boolean; properties: boolean };
}

const STORAGE_KEY = 'noe.cleaning.team.v1';

const DEFAULT_CATALOG = [
  'Coeur de Lyon - Stendhal',
  "L'Annexe",
  'La Meurice - Jardin',
  'La Monnaie',
  'Le Stendhal',
  'Hamac Suites - Lafayette',
  'Maison 23 Rue de la Paix',
  'Appartement 45 Boulevard Central',
  'Studio 15 Rue des Lilas',
  'Appartement 28 Avenue Victor Hugo',
  'La Petite Cour',
  'Le Lumineux',
  'Le Charme Croix-Rousse',
  'Le Loft de Fourvière',
  'Le Vieux Lyon',
  'Bellecour Nord',
  'Bellecour Sud',
  'Confluence View',
  'Terreaux Cosy',
  'Brotteaux Élégance',
  'Part-Dieu Express',
  'Guillotière Loft',
  'Jean Macé',
  'Monchat Vue',
  'Tête d\'Or Garden',
  'Ainay Élégant',
  'Saxe Gambetta',
  'Vaise Riverside',
  'Croix-Paquet Cosy',
  'Saint-Just Belvédère',
];

// Default seed so the screen never starts empty in demo
const DEFAULT_AGENCIES: CleaningAgency[] = [
  { id: 'a1', name: 'Sihem', email: 'sihem@noe.fr', external: true, workDays: [1, 2, 3, 4, 5, 6], maxPerDay: 12, color: '#6B7AE8' },
  { id: 'a2', name: 'Amel', email: 'a.kasraoui@icloud.com', external: true, workDays: [0, 1, 2, 3, 4, 5, 6], maxPerDay: 15, color: '#F5C842' },
  { id: 'a3', name: 'Axel', email: 'axelch698@gmail.com', external: true, workDays: [0, 1, 2, 3, 4, 5, 6], maxPerDay: null, color: '#22c55e' },
  { id: 'a4', name: 'Serpolet', email: 'contact@serpolet.fr', external: false, workDays: [1, 2, 3, 4, 5], maxPerDay: 10, color: '#ef4444' },
];

const seedAssignments = (catalog: string[]): PropertyAssignment[] => {
  // 25 in priority (split across agencies), 5 free
  const agencyIds = ['a1', 'a2', 'a3', 'a4'];
  return catalog.slice(0, 25).map((p, i) => ({
    property: p,
    mode: 'priority',
    agencyIds: [agencyIds[i % agencyIds.length]],
  }));
};

const loadState = (): TeamState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    autoAssign: true,
    agencies: DEFAULT_AGENCIES,
    assignments: seedAssignments(DEFAULT_CATALOG),
    catalog: DEFAULT_CATALOG,
  };
};

const CleaningTeamContext = createContext<TeamCtx | null>(null);

export const CleaningTeamProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TeamState>(() => loadState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const api = useMemo<TeamCtx>(() => {
    const setAutoAssign = (v: boolean) => setState((s) => ({ ...s, autoAssign: v }));

    const upsertAgency = (a: CleaningAgency) =>
      setState((s) => {
        const exists = s.agencies.some((x) => x.id === a.id);
        return {
          ...s,
          agencies: exists ? s.agencies.map((x) => (x.id === a.id ? a : x)) : [...s.agencies, a],
        };
      });

    const removeAgency = (id: string) =>
      setState((s) => ({
        ...s,
        agencies: s.agencies.filter((a) => a.id !== id),
        assignments: s.assignments
          .map((p) => ({ ...p, agencyIds: p.agencyIds.filter((aid) => aid !== id) }))
          .filter((p) => p.agencyIds.length > 0),
      }));

    const setAgencies = (agencies: CleaningAgency[]) => setState((s) => ({ ...s, agencies }));

    const setAssignmentsForProperties = (props: string[], mode: AssignmentMode, agencyIds: string[]) =>
      setState((s) => {
        const others = s.assignments.filter((a) => !props.includes(a.property));
        const next: PropertyAssignment[] = [
          ...others,
          ...props.map((p) => ({ property: p, mode, agencyIds: mode === 'dedicated' ? agencyIds.slice(0, 1) : agencyIds })),
        ];
        return { ...s, assignments: next };
      });

    const clearAssignment = (property: string) =>
      setState((s) => ({ ...s, assignments: s.assignments.filter((a) => a.property !== property) }));

    const resetAll = () =>
      setState({
        autoAssign: true,
        agencies: [],
        assignments: [],
        catalog: DEFAULT_CATALOG,
      });

    const setupSteps = {
      agencies: state.agencies.length > 0,
      mode: state.assignments.length > 0,
      properties: state.assignments.length > 0,
    };
    const isSetupComplete = setupSteps.agencies && setupSteps.mode && setupSteps.properties;

    return {
      ...state,
      setAutoAssign,
      upsertAgency,
      removeAgency,
      setAgencies,
      setAssignmentsForProperties,
      clearAssignment,
      resetAll,
      isSetupComplete,
      setupSteps,
    };
  }, [state]);

  return <CleaningTeamContext.Provider value={api}>{children}</CleaningTeamContext.Provider>;
};

export const useCleaningTeam = () => {
  const ctx = useContext(CleaningTeamContext);
  if (!ctx) throw new Error('useCleaningTeam must be used within CleaningTeamProvider');
  return ctx;
};

export const getModeMeta = (mode: AssignmentMode) => {
  switch (mode) {
    case 'priority':
      return { label: 'Priorité', cls: 'bg-[hsl(213,100%,96%)] text-[hsl(213,84%,40%)] border-[hsl(213,100%,90%)]' };
    case 'rotation':
      return { label: 'Rotation', cls: 'bg-[hsl(280,60%,96%)] text-[hsl(280,60%,40%)] border-[hsl(280,60%,90%)]' };
    case 'dedicated':
      return { label: 'Dédié', cls: 'bg-[hsl(142,71%,93%)] text-[hsl(142,71%,30%)] border-[hsl(142,71%,85%)]' };
  }
};
