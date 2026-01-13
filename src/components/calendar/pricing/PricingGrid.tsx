import React, { useState } from 'react';
import { format, isSameDay, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Ban, Tag, Edit2, Percent } from 'lucide-react';
import type { CalendarProperty } from '@/types/calendar';
import type { DailyPricing, PricingRule } from '@/types/pricing';

interface PricingGridProps {
  properties: CalendarProperty[];
  days: Date[];
  getDailyPricing: (property: CalendarProperty, date: Date) => DailyPricing;
  onPriceEdit: (propertyId: number, date: Date, newPrice: number) => void;
  onCellRightClick: (propertyId: number, date: Date, event: React.MouseEvent) => void;
  rules: PricingRule[];
}

export const PricingGrid: React.FC<PricingGridProps> = ({
  properties,
  days,
  getDailyPricing,
  onPriceEdit,
  onCellRightClick,
  rules,
}) => {
  const today = startOfDay(new Date());
  const [editingCell, setEditingCell] = useState<{ propertyId: number; date: Date } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handlePriceClick = (propertyId: number, date: Date, currentPrice: number) => {
    setEditingCell({ propertyId, date });
    setEditValue(currentPrice.toString());
  };

  const handlePriceSave = () => {
    if (editingCell && editValue) {
      const newPrice = parseFloat(editValue);
      if (!isNaN(newPrice) && newPrice > 0) {
        onPriceEdit(editingCell.propertyId, editingCell.date, newPrice);
      }
    }
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePriceSave();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-auto bg-background" style={{ maxHeight: 'calc(100vh - 320px)' }}>
      <div className="min-w-max">
        {/* Header row with dates */}
        <div className="flex sticky top-0 z-30 bg-muted/80 backdrop-blur-sm border-b border-border">
          <div className="w-[200px] min-w-[200px] p-3 font-medium text-sm border-r border-border sticky left-0 bg-muted/80 z-40">
            Logement
          </div>
          {days.map((day, index) => {
            const isToday = isSameDay(day, today);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            
            return (
              <div
                key={index}
                className={cn(
                  "w-20 min-w-[80px] p-2 text-center border-r border-border",
                  isToday && "bg-primary/10",
                  isWeekend && !isToday && "bg-muted/50"
                )}
              >
                <p className="text-xs font-medium text-muted-foreground">
                  {format(day, 'EEE', { locale: fr })}
                </p>
                <p className={cn("text-sm font-semibold", isToday && "text-primary")}>
                  {format(day, 'd MMM', { locale: fr })}
                </p>
              </div>
            );
          })}
        </div>

        {/* Property rows */}
        <div className="divide-y divide-border">
          {properties.map((property) => (
            <div key={property.id} className="flex hover:bg-accent/10 transition-colors">
              {/* Property name column */}
              <div className="w-[200px] min-w-[200px] p-3 border-r border-border sticky left-0 bg-background z-20">
                <p className="text-sm font-medium truncate" title={property.name}>
                  {property.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Base: {property.pricePerNight}€
                </p>
              </div>

              {/* Price cells */}
              {days.map((day, dayIndex) => {
                const pricing = getDailyPricing(property, day);
                const isToday = isSameDay(day, today);
                const isPast = day < today;
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                const hasAdjustments = pricing.adjustments.length > 0;
                const isEditing = editingCell?.propertyId === property.id && isSameDay(editingCell.date, day);
                
                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "w-20 min-w-[80px] p-1 border-r border-border relative",
                      isToday && "bg-primary/5",
                      isPast && "bg-muted/30 opacity-60",
                      isWeekend && !isToday && "bg-muted/10",
                      pricing.isBlocked && "bg-destructive/10"
                    )}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      onCellRightClick(property.id, day, e);
                    }}
                  >
                    {pricing.isBlocked ? (
                      <div className="flex flex-col items-center justify-center h-full py-2">
                        <Ban className="w-4 h-4 text-destructive" />
                        <span className="text-[10px] text-destructive">Bloqué</span>
                      </div>
                    ) : isEditing ? (
                      <div className="p-1">
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handlePriceSave}
                          onKeyDown={handleKeyDown}
                          className="h-8 text-center text-sm p-1"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className={cn(
                              "w-full h-full flex flex-col items-center justify-center py-2 rounded hover:bg-accent/50 transition-colors",
                              hasAdjustments && "ring-1 ring-primary/30"
                            )}
                            onClick={() => !isPast && handlePriceClick(property.id, day, pricing.finalPrice)}
                            disabled={isPast}
                          >
                            <span className={cn(
                              "text-sm font-semibold",
                              pricing.finalPrice !== pricing.basePrice && "text-primary"
                            )}>
                              {pricing.finalPrice}€
                            </span>
                            {hasAdjustments && (
                              <span className="text-[10px] text-primary flex items-center gap-0.5">
                                <Percent className="w-2.5 h-2.5" />
                                {pricing.adjustments.length}
                              </span>
                            )}
                            {pricing.minStay > 1 && (
                              <span className="text-[10px] text-muted-foreground">
                                min {pricing.minStay}n
                              </span>
                            )}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3" align="start">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Prix de base</span>
                              <span>{pricing.basePrice}€</span>
                            </div>
                            {pricing.adjustments.map((adj, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{adj.ruleName}</span>
                                <Badge variant={adj.adjustment > 0 ? "default" : "secondary"} className="text-xs">
                                  {adj.adjustment > 0 ? '+' : ''}{adj.adjustment}%
                                </Badge>
                              </div>
                            ))}
                            <div className="border-t pt-2 flex justify-between items-center font-medium">
                              <span>Prix final</span>
                              <span className="text-primary">{pricing.finalPrice}€</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full mt-2"
                              onClick={() => handlePriceClick(property.id, day, pricing.finalPrice)}
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Modifier le prix
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
