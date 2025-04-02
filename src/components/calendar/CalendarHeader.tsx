
import React from 'react';
import { format, addMonths } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CalendarHeaderProps {
  currentDate: Date;
  navigateMonth: (direction: 'prev' | 'next') => void;
  setCurrentDate: (date: Date) => void;
}

export const CalendarHeader = ({
  currentDate,
  navigateMonth,
  setCurrentDate
}: CalendarHeaderProps) => {
  const { language, t } = useLanguage();
  const dateLocale = language === 'fr' ? fr : enUS;

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => navigateMonth('prev')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy', { locale: dateLocale })}</h2>
        <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => navigateMonth('next')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8" onClick={() => setCurrentDate(new Date())}>
          {t('calendar.today')}
        </Button>
      </div>
      
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>{t('status.confirmed')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>{t('status.pending')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span>{t('status.completed')}</span>
        </div>
      </div>
    </div>
  );
};
