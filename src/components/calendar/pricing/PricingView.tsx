import React, { useState } from 'react';
import { toast } from 'sonner';
import { PricingGrid } from './PricingGrid';
import { RulesEditor } from './RulesEditor';
import { usePricingRules } from '@/hooks/calendar/usePricingRules';
import type { CalendarProperty } from '@/types/calendar';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Ban, Tag, Hash, Percent, StickyNote } from 'lucide-react';

interface PricingViewProps {
  properties: CalendarProperty[];
  days: Date[];
}

export const PricingView: React.FC<PricingViewProps> = ({ properties, days }) => {
  const {
    rules,
    addRule,
    updateRule,
    deleteRule,
    duplicateRule,
    applyRuleToAll,
    getDailyPricing,
    notes,
    addNote,
  } = usePricingRules(properties);

  const [contextMenuCell, setContextMenuCell] = useState<{ propertyId: number; date: Date } | null>(null);

  const handlePriceEdit = (propertyId: number, date: Date, newPrice: number) => {
    // Create a price override rule for this specific date
    addRule({
      propertyId,
      name: `Prix manuel - ${date.toLocaleDateString('fr-FR')}`,
      type: 'price_override',
      enabled: true,
      priority: 100, // High priority to override other rules
      startDate: date,
      endDate: date,
      priceAdjustment: Math.round(((newPrice / properties.find(p => p.id === propertyId)!.pricePerNight) - 1) * 100),
    });
    toast.success('Prix mis à jour');
  };

  const handleCellRightClick = (propertyId: number, date: Date, event: React.MouseEvent) => {
    setContextMenuCell({ propertyId, date });
  };

  const handleQuickAction = (action: string) => {
    if (!contextMenuCell) return;
    const { propertyId, date } = contextMenuCell;
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    switch (action) {
      case 'block':
        addRule({
          propertyId,
          name: `Blocage - ${date.toLocaleDateString('fr-FR')}`,
          type: 'closing_block',
          enabled: true,
          priority: 100,
          startDate: date,
          endDate: date,
          blockReason: 'Blocage manuel',
        });
        toast.success('Date bloquée');
        break;
      case 'min2':
      case 'min3':
      case 'min7':
        const minNights = parseInt(action.replace('min', ''));
        addRule({
          propertyId,
          name: `Min ${minNights} nuits - ${date.toLocaleDateString('fr-FR')}`,
          type: 'min_stay',
          enabled: true,
          priority: 50,
          startDate: date,
          endDate: date,
          minStay: minNights,
        });
        toast.success(`Minimum ${minNights} nuits appliqué`);
        break;
      case 'promo10':
      case 'promo15':
      case 'promo20':
        const discount = parseInt(action.replace('promo', ''));
        addRule({
          propertyId,
          name: `Promo -${discount}% - ${date.toLocaleDateString('fr-FR')}`,
          type: 'promotion',
          enabled: true,
          priority: 60,
          startDate: date,
          endDate: date,
          priceAdjustment: -discount,
          promotionType: 'last_minute',
        });
        toast.success(`Promotion -${discount}% appliquée`);
        break;
      case 'note':
        const noteContent = prompt('Ajouter une note:');
        if (noteContent) {
          addNote(propertyId, date, noteContent);
          toast.success('Note ajoutée');
        }
        break;
    }
    setContextMenuCell(null);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="h-full">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={70} minSize={50}>
              <div className="h-full p-4">
                <PricingGrid
                  properties={properties}
                  days={days}
                  getDailyPricing={getDailyPricing}
                  onPriceEdit={handlePriceEdit}
                  onCellRightClick={handleCellRightClick}
                  rules={rules}
                />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={30} minSize={20}>
              <RulesEditor
                rules={rules}
                properties={properties}
                onAddRule={addRule}
                onUpdateRule={updateRule}
                onDeleteRule={deleteRule}
                onDuplicateRule={duplicateRule}
                onApplyToAll={applyRuleToAll}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={() => handleQuickAction('block')}>
          <Ban className="w-4 h-4 mr-2" />
          Bloquer cette date
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Hash className="w-4 h-4 mr-2" />
            Durée minimum
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => handleQuickAction('min2')}>2 nuits</ContextMenuItem>
            <ContextMenuItem onClick={() => handleQuickAction('min3')}>3 nuits</ContextMenuItem>
            <ContextMenuItem onClick={() => handleQuickAction('min7')}>7 nuits</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Percent className="w-4 h-4 mr-2" />
            Appliquer une promo
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => handleQuickAction('promo10')}>-10%</ContextMenuItem>
            <ContextMenuItem onClick={() => handleQuickAction('promo15')}>-15%</ContextMenuItem>
            <ContextMenuItem onClick={() => handleQuickAction('promo20')}>-20%</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={() => handleQuickAction('note')}>
          <StickyNote className="w-4 h-4 mr-2" />
          Ajouter une note
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
