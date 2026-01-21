
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTutorial } from '@/contexts/TutorialContext';
import { TutorialModuleId } from '@/types/tutorial';

interface TutorialButtonProps {
  moduleId: TutorialModuleId;
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

export const TutorialButton = ({ moduleId, variant = 'icon', className }: TutorialButtonProps) => {
  const { replayTutorial } = useTutorial();

  const handleClick = () => {
    replayTutorial(moduleId);
  };

  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClick}
              className={className}
              aria-label="Voir le tutoriel"
            >
              <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Comment ça marche ?</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === 'text') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={className}
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Aide
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={className}
    >
      <HelpCircle className="h-4 w-4 mr-2" />
      Revoir le tutoriel
    </Button>
  );
};
