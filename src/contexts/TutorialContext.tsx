
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { TutorialModuleId, TutorialState } from '@/types/tutorial';

interface TutorialContextType {
  state: TutorialState;
  startTutorial: (moduleId: TutorialModuleId) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  closeTutorial: () => void;
  isModuleSeen: (moduleId: TutorialModuleId) => boolean;
  replayTutorial: (moduleId: TutorialModuleId) => void;
  checkAndStartTutorial: (moduleId: TutorialModuleId) => void;
}

const STORAGE_KEY = 'tutorial_state';

const getInitialState = (): TutorialState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        seenModules: parsed.seenModules || [],
        isActive: false,
        currentModule: null,
        currentStep: 0
      };
    }
  } catch (e) {
    console.error('Error reading tutorial state:', e);
  }
  return {
    seenModules: [],
    isActive: false,
    currentModule: null,
    currentStep: 0
  };
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

export const TutorialProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TutorialState>(getInitialState);

  // Persist seen modules to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        seenModules: state.seenModules
      }));
    } catch (e) {
      console.error('Error saving tutorial state:', e);
    }
  }, [state.seenModules]);

  const markModuleAsSeen = useCallback((moduleId: TutorialModuleId) => {
    setState(prev => ({
      ...prev,
      seenModules: prev.seenModules.includes(moduleId) 
        ? prev.seenModules 
        : [...prev.seenModules, moduleId]
    }));
  }, []);

  const startTutorial = useCallback((moduleId: TutorialModuleId) => {
    setState(prev => ({
      ...prev,
      isActive: true,
      currentModule: moduleId,
      currentStep: 0
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }));
  }, []);

  const skipTutorial = useCallback(() => {
    if (state.currentModule) {
      markModuleAsSeen(state.currentModule);
    }
    setState(prev => ({
      ...prev,
      isActive: false,
      currentModule: null,
      currentStep: 0
    }));
  }, [state.currentModule, markModuleAsSeen]);

  const closeTutorial = useCallback(() => {
    if (state.currentModule) {
      markModuleAsSeen(state.currentModule);
    }
    setState(prev => ({
      ...prev,
      isActive: false,
      currentModule: null,
      currentStep: 0
    }));
  }, [state.currentModule, markModuleAsSeen]);

  const isModuleSeen = useCallback((moduleId: TutorialModuleId) => {
    return state.seenModules.includes(moduleId);
  }, [state.seenModules]);

  const replayTutorial = useCallback((moduleId: TutorialModuleId) => {
    setState(prev => ({
      ...prev,
      isActive: true,
      currentModule: moduleId,
      currentStep: 0
    }));
  }, []);

  const checkAndStartTutorial = useCallback((moduleId: TutorialModuleId) => {
    if (!state.seenModules.includes(moduleId) && !state.isActive) {
      // Small delay to let the page render first
      setTimeout(() => {
        startTutorial(moduleId);
      }, 500);
    }
  }, [state.seenModules, state.isActive, startTutorial]);

  return (
    <TutorialContext.Provider value={{
      state,
      startTutorial,
      nextStep,
      prevStep,
      skipTutorial,
      closeTutorial,
      isModuleSeen,
      replayTutorial,
      checkAndStartTutorial
    }}>
      {children}
    </TutorialContext.Provider>
  );
};
