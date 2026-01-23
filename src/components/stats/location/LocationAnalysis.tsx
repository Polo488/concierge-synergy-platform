import { useState, useCallback } from 'react';
import { useLocationData } from '@/hooks/useLocationData';
import { LocationFiltersBar } from './LocationFiltersBar';
import { StatsMap } from './StatsMap';
import { ViewportKPIPanel } from './ViewportKPIPanel';
import { MonthlySnapshotCard } from './MonthlySnapshotCard';
import { ViewportBounds, ViewportKPIs } from '@/types/location';

export function LocationAnalysis() {
  const {
    groups,
    properties,
    filters,
    updateFilters,
    availableCities,
    availableAreas,
    nonGeolocatedCount,
    getViewportKPIs,
    getHeatmapData,
    activeLayer,
    setActiveLayer,
    visualizationMode,
    setVisualizationMode,
    aggregatedStats,
    monthlySnapshot,
    mainCity,
  } = useLocationData();

  const [viewportKPIs, setViewportKPIs] = useState<ViewportKPIs | null>(null);
  const [isViewportFiltered, setIsViewportFiltered] = useState(false);

  const handleViewportChange = useCallback((bounds: ViewportBounds) => {
    const kpis = getViewportKPIs(bounds);
    setViewportKPIs(kpis);
    
    // Check if viewport is filtering (not showing all properties)
    setIsViewportFiltered(kpis.propertyCount < properties.length);
  }, [getViewportKPIs, properties.length]);

  const heatmapData = getHeatmapData(activeLayer);

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <LocationFiltersBar
        filters={filters}
        onFiltersChange={updateFilters}
        groups={groups}
        availableCities={availableCities}
        availableAreas={availableAreas}
        activeLayer={activeLayer}
        onLayerChange={setActiveLayer}
        nonGeolocatedCount={nonGeolocatedCount}
        visualizationMode={visualizationMode}
        onVisualizationModeChange={setVisualizationMode}
      />

      {/* Map and KPIs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* KPI Panel - Side */}
        <div className="lg:col-span-1 order-2 lg:order-1 space-y-4">
          {/* Monthly Snapshot */}
          <MonthlySnapshotCard snapshot={monthlySnapshot} />
          
          {/* Viewport KPIs */}
          <ViewportKPIPanel 
            kpis={viewportKPIs || {
              totalRevenue: aggregatedStats.totalRevenue,
              occupancyRate: aggregatedStats.avgOccupancy,
              bookedNights: aggregatedStats.totalBookedNights,
              reservations: aggregatedStats.totalReservations,
              incidents: aggregatedStats.totalIncidents,
              repasseRate: aggregatedStats.avgRepasseRate,
              propertyCount: aggregatedStats.propertyCount,
            }}
            isViewportFiltered={isViewportFiltered}
          />
        </div>

        {/* Map - Main Area */}
        <div className="lg:col-span-3 order-1 lg:order-2 h-[500px] lg:h-[600px]">
          <StatsMap
            properties={properties}
            activeLayer={activeLayer}
            heatmapData={heatmapData}
            onViewportChange={handleViewportChange}
            groups={groups}
            visualizationMode={visualizationMode}
            mainCity={mainCity}
          />
        </div>
      </div>
    </div>
  );
}