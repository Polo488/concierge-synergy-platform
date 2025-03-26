
import { useState } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  addMonths 
} from 'date-fns';

export const useCalendarNavigation = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Calculate the current days of the month
  const currentMonthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(addMonths(currentDate, direction === 'prev' ? -1 : 1));
  };

  return {
    currentDate,
    setCurrentDate,
    currentMonthDays,
    navigateMonth
  };
};
