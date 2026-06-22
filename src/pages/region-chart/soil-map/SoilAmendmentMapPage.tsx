import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Minimize2 } from "lucide-react";
import areaData from "../../../assets/map/area.json";
import plotData from "../../../assets/map/plot.json";
import zoneData from "../../../assets/map/zone.json";
import { SoilDetailsSidebar } from "./components/SoilDetailsSidebar";
import { SoilMapCanvas } from "./components/SoilMapCanvas";
import { SoilMapControls } from "./components/SoilMapControls";
import { SoilPlanDialog } from "./components/SoilPlanDialog";
import { useSoilAmendmentMapPage } from "./hooks/useSoilAmendmentMapPage";
import type { SoilGeoCollection } from "./types";

export default function SoilAmendmentMapPage() {
  const {
    activeMetric,
    handleCreatePlan,
    handleMetricChange,
    handlePlanModalOpenChange,
    handlePlanFormChange,
    handleSelectFeature,
    handleToggleFullScreen,
    handleZoomChange,
    isFullScreen,
    isPlanModalOpen,
    isSidebarCollapsed,
    mapViewState,
    planForm,
    selectedFeature,
    setIsSidebarCollapsed,
    soilDataMap,
    visibleLayers,
  } = useSoilAmendmentMapPage();

  const content = (
    <div
      className={`group relative flex bg-background ${
        isFullScreen ? "h-screen w-screen" : "h-[calc(100vh-140px)]"
      }`}
    >
      <SoilDetailsSidebar
        activeMetric={activeMetric}
        isCollapsed={isSidebarCollapsed}
        onCreatePlan={() => handlePlanModalOpenChange(true)}
        selectedFeature={selectedFeature}
      />

      <div className="group/map relative z-0 flex-1 bg-slate-100">
        {isFullScreen && (
          <div className="absolute right-22 top-3 z-[500]">
            <SoilMapControls
              activeMetric={activeMetric}
              isFullScreen={isFullScreen}
              onMetricChange={handleMetricChange}
              onToggleFullScreen={handleToggleFullScreen}
            />
          </div>
        )}

        {!isFullScreen && (
          <div className="pointer-events-none absolute right-16 top-4 z-[500]">
            {isSidebarCollapsed && (
              <Button
                variant="secondary"
                size="icon"
                className="pointer-events-auto bg-white/90 shadow-md backdrop-blur"
                onClick={() => setIsSidebarCollapsed(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {isFullScreen && isSidebarCollapsed && (
          <div className="absolute left-4 top-4 z-[500]">
            <Button
              variant="secondary"
              onClick={() => setIsSidebarCollapsed(false)}
            >
              Hiện bảng thông tin
            </Button>
          </div>
        )}

        <SoilMapCanvas
          activeMetric={activeMetric}
          areaCollection={areaData as SoilGeoCollection}
          mapViewState={mapViewState}
          onFeatureSelect={handleSelectFeature}
          onZoomChange={handleZoomChange}
          plotCollection={plotData as SoilGeoCollection}
          soilDataMap={soilDataMap}
          visibleLayers={visibleLayers}
          zoneCollection={zoneData as SoilGeoCollection}
        />
      </div>
    </div>
  );

  const dialog = (
    <SoilPlanDialog
      open={isPlanModalOpen}
      onOpenChange={handlePlanModalOpenChange}
      onSubmit={handleCreatePlan}
      onFormChange={handlePlanFormChange}
      planForm={planForm}
      selectedFeature={selectedFeature}
    />
  );

  if (isFullScreen) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-background">
        {content}
        {dialog}
      </div>
    );
  }

  return (
    <AdminLayout
      isRice
      title="Bản đồ cải tạo đất"
      description="Phân tích chất lượng đất và kế hoạch cải tạo"
      actions={
        <SoilMapControls
          activeMetric={activeMetric}
          isFullScreen={isFullScreen}
          onMetricChange={handleMetricChange}
          onToggleFullScreen={handleToggleFullScreen}
        />
      }
    >
      {content}
      {dialog}
    </AdminLayout>
  );
}
