import { useEffect, useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import zoneData from "../../../../assets/map/zone.json";
import areaData from "../../../../assets/map/area.json";
import plotData from "../../../../assets/map/plot.json";
import {
  buildSoilDataMap,
  createPlanIssuesSummary,
  DEFAULT_MAP_VIEW,
  getGeneratedPlanActions,
  getVisibleLayersByZoom,
} from "../utils";
import type {
  SelectedSoilFeature,
  SoilGeoCollection,
  SoilLayerVisibility,
  SoilMetric,
  SoilPlan,
  SoilPlanForm,
} from "../types";

const soilCollections = [
  zoneData as SoilGeoCollection,
  areaData as SoilGeoCollection,
  plotData as SoilGeoCollection,
];

const initialPlanForm: SoilPlanForm = {
  startDate: new Date().toISOString().split("T")[0],
  assignedTo: "",
  customAction: "",
};

export function useSoilAmendmentMapPage() {
  const { toast } = useToast();
  const isFullScreen =
    new URLSearchParams(window.location.search).get("fullscreen") === "true";

  const [activeMetric, setActiveMetric] = useState<SoilMetric>("ph");
  const [visibleLayers, setVisibleLayers] = useState<SoilLayerVisibility>({
    zone: true,
    area: true,
    plot: true,
  });
  const [selectedFeature, setSelectedFeature] =
    useState<SelectedSoilFeature | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [, setCreatedPlans] = useState<SoilPlan[]>([]);
  const [planForm, setPlanForm] = useState<SoilPlanForm>(initialPlanForm);

  const soilDataMap = useMemo(() => buildSoilDataMap(soilCollections), []);

  useEffect(() => {
    const timers = [100, 300, 500].map((delay) =>
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, delay),
    );

    return () => timers.forEach(clearTimeout);
  }, [isSidebarCollapsed]);

  const handleMetricChange = (metric: SoilMetric) => setActiveMetric(metric);

  const handleZoomChange = (zoom: number) => {
    setVisibleLayers(getVisibleLayersByZoom(zoom));
  };

  const handleSelectFeature = (nextFeature: SelectedSoilFeature) => {
    setSelectedFeature(nextFeature);
  };

  const handleToggleFullScreen = () => {
    if (isFullScreen) {
      window.close();
      return;
    }

    window.open(
      `${window.location.pathname}?fullscreen=true`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handlePlanFormChange = (field: keyof SoilPlanForm, value: string) => {
    setPlanForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handlePlanModalOpenChange = (open: boolean) => {
    if (open && selectedFeature) {
      setPlanForm((currentForm) => ({
        ...currentForm,
        customAction: getGeneratedPlanActions(selectedFeature),
      }));
    }

    setIsPlanModalOpen(open);
  };

  const handleCreatePlan = () => {
    if (!selectedFeature) {
      return;
    }

    const nextPlan: SoilPlan = {
      id: `plan-${Date.now()}`,
      regionId: selectedFeature.id,
      regionName: selectedFeature.name,
      issues: createPlanIssuesSummary(selectedFeature),
      actions: planForm.customAction,
      startDate: planForm.startDate,
      assignedTo: planForm.assignedTo,
      status: "planned",
      createdAt: new Date().toISOString(),
    };

    setCreatedPlans((currentPlans) => [...currentPlans, nextPlan]);
    setIsPlanModalOpen(false);
    setPlanForm((currentForm) => ({
      ...currentForm,
      assignedTo: "",
      customAction: "",
    }));
    toast({
      title: "Thành công",
      description: `Đã tạo kế hoạch cải tạo cho ${selectedFeature.name}`,
    });
  };

  return {
    activeMetric,
    handleMetricChange,
    handleZoomChange,
    handleSelectFeature,
    handleToggleFullScreen,
    handlePlanModalOpenChange,
    handlePlanFormChange,
    handleCreatePlan,
    isFullScreen,
    isPlanModalOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    mapViewState: DEFAULT_MAP_VIEW,
    planForm,
    selectedFeature,
    soilDataMap,
    visibleLayers,
  };
}
