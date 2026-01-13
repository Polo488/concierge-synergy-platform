
import { useState, useCallback, useRef } from 'react';
import { startOfDay, eachDayOfInterval, isAfter, isBefore, isSameDay } from 'date-fns';

export interface DaySelection {
  propertyId: number;
  date: Date;
}

export interface SelectionRange {
  propertyId: number;
  startDate: Date;
  endDate: Date;
}

interface UseMultiDaySelectionReturn {
  selectedDays: DaySelection[];
  selectionRange: SelectionRange | null;
  isSelecting: boolean;
  isDaySelected: (propertyId: number, date: Date) => boolean;
  handleDayMouseDown: (propertyId: number, date: Date, event: React.MouseEvent) => void;
  handleDayMouseEnter: (propertyId: number, date: Date) => void;
  handleDayMouseUp: () => void;
  handleDayClick: (propertyId: number, date: Date, event: React.MouseEvent) => void;
  clearSelection: () => void;
  hasSelection: boolean;
}

export const useMultiDaySelection = (): UseMultiDaySelectionReturn => {
  const [selectedDays, setSelectedDays] = useState<DaySelection[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const selectionStartRef = useRef<DaySelection | null>(null);
  const lastClickedRef = useRef<DaySelection | null>(null);

  const isDaySelected = useCallback((propertyId: number, date: Date): boolean => {
    const dayStart = startOfDay(date);
    return selectedDays.some(
      s => s.propertyId === propertyId && isSameDay(startOfDay(s.date), dayStart)
    );
  }, [selectedDays]);

  const getSelectionRange = useCallback((start: DaySelection, end: DaySelection): DaySelection[] => {
    if (start.propertyId !== end.propertyId) return [start];
    
    const startDate = startOfDay(start.date);
    const endDate = startOfDay(end.date);
    
    const [rangeStart, rangeEnd] = isBefore(startDate, endDate) 
      ? [startDate, endDate] 
      : [endDate, startDate];
    
    const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });
    return days.map(date => ({ propertyId: start.propertyId, date }));
  }, []);

  const handleDayMouseDown = useCallback((propertyId: number, date: Date, event: React.MouseEvent) => {
    // Prevent text selection during drag
    event.preventDefault();
    
    const dayStart = startOfDay(date);
    const selection: DaySelection = { propertyId, date: dayStart };
    
    // Start fresh selection on mouse down (unless shift is held)
    if (!event.shiftKey) {
      selectionStartRef.current = selection;
      setIsSelecting(true);
      setSelectedDays([selection]);
    }
  }, []);

  const handleDayMouseEnter = useCallback((propertyId: number, date: Date) => {
    if (!isSelecting || !selectionStartRef.current) return;
    
    // Only allow selection within same property
    if (selectionStartRef.current.propertyId !== propertyId) return;
    
    const dayStart = startOfDay(date);
    const currentSelection: DaySelection = { propertyId, date: dayStart };
    const newSelection = getSelectionRange(selectionStartRef.current, currentSelection);
    setSelectedDays(newSelection);
  }, [isSelecting, getSelectionRange]);

  const handleDayMouseUp = useCallback(() => {
    if (isSelecting) {
      setIsSelecting(false);
      // Keep selection start as the last clicked for shift+click
      if (selectedDays.length > 0) {
        lastClickedRef.current = selectedDays[0];
      }
    }
  }, [isSelecting, selectedDays]);

  const handleDayClick = useCallback((propertyId: number, date: Date, event: React.MouseEvent) => {
    const dayStart = startOfDay(date);
    const selection: DaySelection = { propertyId, date: dayStart };
    
    if (event.shiftKey && lastClickedRef.current) {
      // Shift+click: select range from last click
      if (lastClickedRef.current.propertyId === propertyId) {
        const rangeSelection = getSelectionRange(lastClickedRef.current, selection);
        setSelectedDays(rangeSelection);
      } else {
        // Different property - start new selection
        setSelectedDays([selection]);
        lastClickedRef.current = selection;
      }
    } else {
      // Regular click: select single day
      setSelectedDays([selection]);
      lastClickedRef.current = selection;
    }
  }, [getSelectionRange]);

  const clearSelection = useCallback(() => {
    setSelectedDays([]);
    selectionStartRef.current = null;
    lastClickedRef.current = null;
    setIsSelecting(false);
  }, []);

  const selectionRange: SelectionRange | null = selectedDays.length > 0 
    ? {
        propertyId: selectedDays[0].propertyId,
        startDate: selectedDays.reduce((min, s) => isBefore(s.date, min) ? s.date : min, selectedDays[0].date),
        endDate: selectedDays.reduce((max, s) => isAfter(s.date, max) ? s.date : max, selectedDays[0].date),
      }
    : null;

  return {
    selectedDays,
    selectionRange,
    isSelecting,
    isDaySelected,
    handleDayMouseDown,
    handleDayMouseEnter,
    handleDayMouseUp,
    handleDayClick,
    clearSelection,
    hasSelection: selectedDays.length > 0,
  };
};
