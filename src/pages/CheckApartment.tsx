
import React, { useState } from 'react';
import { useCheckApartment } from '@/hooks/useCheckApartment';
import { useAuth } from '@/contexts/AuthContext';
import { PropertyCheck, InspectionSectionKey, SECTION_LABELS } from '@/types/checkApartment';
import { InspectionSection } from '@/components/check-apartment/InspectionSection';
import { NewCheckDialog } from '@/components/check-apartment/NewCheckDialog';
import { CreateActionDialog } from '@/components/check-apartment/CreateActionDialog';
import { CheckList } from '@/components/check-apartment/CheckList';
import { CheckSummary } from '@/components/check-apartment/CheckSummary';
import { CheckHistoryTimeline } from '@/components/check-apartment/CheckHistoryTimeline';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  ClipboardCheck,
  Plus,
  ArrowLeft,
  CheckCircle2,
  BarChart3,
  History,
  Target,
  AlertTriangle,
  Calendar,
} from 'lucide-react';

const CheckApartment: React.FC = () => {
  const { user } = useAuth();
  const {
    checks,
    activeCheck,
    setActiveCheck,
    properties,
    createCheck,
    updateSection,
    completeCheck,
    createActionFromSection,
    stats,
  } = useCheckApartment();

  const [showNewDialog, setShowNewDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; sectionKey: InspectionSectionKey }>({
    open: false,
    sectionKey: 'generalCondition',
  });
  const [viewingCheck, setViewingCheck] = useState<PropertyCheck | null>(null);

  const handleSelectCheck = (check: PropertyCheck) => {
    if (check.status === 'completed') {
      setViewingCheck(check);
    } else if (check.status === 'in_progress' || check.status === 'scheduled') {
      // Start or resume inspection
      setActiveCheck(check);
    }
  };

  const sectionKeys = Object.keys(SECTION_LABELS) as InspectionSectionKey[];

  // Active inspection form
  if (activeCheck) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setActiveCheck(null)}>
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{activeCheck.propertyName}</h1>
              <p className="text-sm text-muted-foreground">{activeCheck.propertyAddress}</p>
            </div>
          </div>
          <Button onClick={() => completeCheck(activeCheck.id)} className="gap-2">
            <CheckCircle2 size={16} />
            Terminer
          </Button>
        </div>

        {/* Inspection sections */}
        <div className="space-y-4">
          {sectionKeys.map((key) => (
            <InspectionSection
              key={key}
              sectionKey={key}
              status={activeCheck.sections[key].status}
              notes={activeCheck.sections[key].notes}
              photos={activeCheck.sections[key].photos}
              onStatusChange={(status) => updateSection(activeCheck.id, key, { status })}
              onNotesChange={(notes) => updateSection(activeCheck.id, key, { notes })}
              onPhotosChange={(photos) => updateSection(activeCheck.id, key, { photos })}
              onCreateAction={() => setActionDialog({ open: true, sectionKey: key })}
            />
          ))}
        </div>

        {/* Create action dialog */}
        <CreateActionDialog
          open={actionDialog.open}
          onOpenChange={(open) => setActionDialog((prev) => ({ ...prev, open }))}
          sectionKey={actionDialog.sectionKey}
          onCreateAction={(sectionKey, actionType, title, priority) =>
            createActionFromSection(activeCheck.id, sectionKey, actionType, title, priority)
          }
        />
      </div>
    );
  }

  // Viewing a completed check summary
  if (viewingCheck) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setViewingCheck(null)}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{viewingCheck.propertyName}</h1>
            <p className="text-sm text-muted-foreground">Résumé de l'inspection</p>
          </div>
        </div>
        <CheckSummary check={viewingCheck} />
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardCheck size={28} className="text-primary" />
            Check Apartment
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Inspections périodiques des propriétés</p>
        </div>
        <Button onClick={() => setShowNewDialog(true)} className="gap-2">
          <Plus size={16} />
          Nouvelle inspection
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="glass-panel rounded-2xl p-4 text-center">
          <Target size={20} className="mx-auto mb-1 text-primary" />
          <p className="text-xl font-bold text-foreground">{stats.avgScore}</p>
          <p className="text-xs text-muted-foreground">Score moyen</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 text-center">
          <CheckCircle2 size={20} className="mx-auto mb-1 text-status-success" />
          <p className="text-xl font-bold text-foreground">{stats.completedCount}</p>
          <p className="text-xs text-muted-foreground">Complétées</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 text-center">
          <Calendar size={20} className="mx-auto mb-1 text-status-info" />
          <p className="text-xl font-bold text-foreground">{stats.scheduled}</p>
          <p className="text-xs text-muted-foreground">Planifiées</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 text-center">
          <AlertTriangle size={20} className="mx-auto mb-1 text-status-warning" />
          <p className="text-xl font-bold text-foreground">{stats.totalIssues}</p>
          <p className="text-xs text-muted-foreground">Problèmes</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 text-center">
          <BarChart3 size={20} className="mx-auto mb-1 text-status-pending" />
          <p className="text-xl font-bold text-foreground">{stats.totalActions}</p>
          <p className="text-xs text-muted-foreground">Actions</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list" className="gap-1.5">
            <ClipboardCheck size={14} />
            Inspections
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-1.5">
            <History size={14} />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <CheckList checks={checks} onSelectCheck={handleSelectCheck} />
        </TabsContent>

        <TabsContent value="timeline">
          <CheckHistoryTimeline checks={checks} />
        </TabsContent>
      </Tabs>

      {/* New check dialog */}
      <NewCheckDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        properties={properties}
        inspectorName={user?.name || 'Inspecteur'}
        onCreateCheck={createCheck}
      />
    </div>
  );
};

export default CheckApartment;
