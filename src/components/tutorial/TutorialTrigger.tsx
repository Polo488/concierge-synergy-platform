
import { useEffect } from 'react';
import { useTutorial } from '@/contexts/TutorialContext';
import { TutorialModuleId } from '@/types/tutorial';

interface TutorialTriggerProps {
  moduleId: TutorialModuleId;
}

/**
 * A component that triggers the tutorial for a module on first visit.
 * Place this component inside any module page to auto-start the tutorial.
 */
export const TutorialTrigger = ({ moduleId }: TutorialTriggerProps) => {
  const { checkAndStartTutorial } = useTutorial();

  useEffect(() => {
    checkAndStartTutorial(moduleId);
  }, [moduleId, checkAndStartTutorial]);

  return null;
};
