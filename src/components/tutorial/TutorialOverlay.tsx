
import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTutorial } from '@/contexts/TutorialContext';
import { tutorialDefinitions } from '@/data/tutorialDefinitions';
import { cn } from '@/lib/utils';

interface HighlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TooltipPosition {
  top: number;
  left: number;
  arrowPosition: 'top' | 'bottom' | 'left' | 'right';
}

export const TutorialOverlay = () => {
  const { state, nextStep, prevStep, skipTutorial, closeTutorial } = useTutorial();
  const [highlightPosition, setHighlightPosition] = useState<HighlightPosition | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentTutorial = state.currentModule ? tutorialDefinitions[state.currentModule] : null;
  const currentStepData = currentTutorial?.steps[state.currentStep];
  const totalSteps = currentTutorial?.steps.length || 0;
  const isLastStep = state.currentStep === totalSteps - 1;
  const isFirstStep = state.currentStep === 0;

  const calculatePositions = useCallback(() => {
    if (!currentStepData) return;

    const element = document.querySelector(currentStepData.targetSelector);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      const padding = 8;
      
      setHighlightPosition({
        top: rect.top - padding + window.scrollY,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2
      });

      // Calculate tooltip position based on preferred position
      const tooltipWidth = 320;
      const tooltipHeight = 180;
      const gap = 16;
      
      let top = 0;
      let left = 0;
      let arrowPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

      const position = currentStepData.position || 'bottom';

      switch (position) {
        case 'bottom':
          top = rect.bottom + gap + window.scrollY;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          arrowPosition = 'top';
          break;
        case 'top':
          top = rect.top - tooltipHeight - gap + window.scrollY;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          arrowPosition = 'bottom';
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2 + window.scrollY;
          left = rect.right + gap;
          arrowPosition = 'left';
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2 + window.scrollY;
          left = rect.left - tooltipWidth - gap;
          arrowPosition = 'right';
          break;
      }

      // Keep tooltip within viewport
      left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
      top = Math.max(16, top);

      setTooltipPosition({ top, left, arrowPosition });
    } else {
      // Fallback: center tooltip if element not found
      setHighlightPosition(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 90,
        left: window.innerWidth / 2 - 160,
        arrowPosition: 'top'
      });
    }
  }, [currentStepData]);

  useEffect(() => {
    if (state.isActive && currentStepData) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        calculatePositions();
        setIsAnimating(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [state.isActive, state.currentStep, currentStepData, calculatePositions]);

  useEffect(() => {
    if (state.isActive) {
      const handleResize = () => calculatePositions();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [state.isActive, calculatePositions]);

  const handleNext = () => {
    if (isLastStep) {
      closeTutorial();
    } else {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      prevStep();
    }
  };

  if (!state.isActive || !currentTutorial || !currentStepData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Dimmed overlay with cutout */}
      <div className="absolute inset-0 pointer-events-auto">
        <svg className="w-full h-full" style={{ position: 'absolute' }}>
          <defs>
            <mask id="tutorial-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {highlightPosition && (
                <rect
                  x={highlightPosition.left}
                  y={highlightPosition.top}
                  width={highlightPosition.width}
                  height={highlightPosition.height}
                  rx="8"
                  fill="black"
                  className={cn(
                    "transition-all duration-300 ease-out",
                    isAnimating && "opacity-0"
                  )}
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.5)"
            mask="url(#tutorial-mask)"
          />
        </svg>
      </div>

      {/* Highlight border */}
      {highlightPosition && (
        <div
          className={cn(
            "absolute border-2 border-primary rounded-lg transition-all duration-300 ease-out pointer-events-none",
            "shadow-[0_0_0_4px_rgba(var(--primary),0.2)]",
            isAnimating && "opacity-0"
          )}
          style={{
            top: highlightPosition.top,
            left: highlightPosition.left,
            width: highlightPosition.width,
            height: highlightPosition.height
          }}
        />
      )}

      {/* Tooltip */}
      {tooltipPosition && (
        <div
          className={cn(
            "absolute w-80 bg-background border border-border rounded-xl shadow-2xl pointer-events-auto",
            "transition-all duration-300 ease-out",
            isAnimating && "opacity-0 scale-95"
          )}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left
          }}
        >
          {/* Arrow */}
          <div
            className={cn(
              "absolute w-3 h-3 bg-background border-border rotate-45",
              tooltipPosition.arrowPosition === 'top' && "top-[-7px] left-1/2 -translate-x-1/2 border-l border-t",
              tooltipPosition.arrowPosition === 'bottom' && "bottom-[-7px] left-1/2 -translate-x-1/2 border-r border-b",
              tooltipPosition.arrowPosition === 'left' && "left-[-7px] top-1/2 -translate-y-1/2 border-l border-b",
              tooltipPosition.arrowPosition === 'right' && "right-[-7px] top-1/2 -translate-y-1/2 border-r border-t"
            )}
          />

          {/* Close button */}
          <button
            onClick={closeTutorial}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Fermer le tutoriel"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Content */}
          <div className="p-5">
            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-primary">
                Étape {state.currentStep + 1} sur {totalSteps}
              </span>
              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((state.currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Title and description */}
            <h3 className="text-base font-semibold mb-2 pr-6">
              {currentStepData.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {currentStepData.description}
            </p>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTutorial}
                className="text-muted-foreground hover:text-foreground"
              >
                <SkipForward className="h-4 w-4 mr-1" />
                Passer
              </Button>
              
              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Précédent
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleNext}
                >
                  {isLastStep ? 'Terminer' : 'Suivant'}
                  {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
