
export interface TutorialStep {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export interface ModuleTutorial {
  moduleId: string;
  moduleName: string;
  steps: TutorialStep[];
}

export type TutorialModuleId = 
  | 'dashboard'
  | 'calendar'
  | 'cleaning'
  | 'maintenance'
  | 'properties'
  | 'messaging'
  | 'billing'
  | 'inventory'
  | 'upsell'
  | 'quality'
  | 'moyenne-duree'
  | 'insights';

export interface TutorialState {
  seenModules: TutorialModuleId[];
  isActive: boolean;
  currentModule: TutorialModuleId | null;
  currentStep: number;
}
