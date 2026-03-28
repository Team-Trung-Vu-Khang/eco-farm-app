import { useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import L from "leaflet";
import useCultivationPlotStore from "../../../stores/useCultivationPlotStore";
import useEnterpriseCertificateStore from "../../../stores/useEnterpriseCertificateStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import useFarmingMethodStore from "../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../stores/useIrrigationSystemStore";
import usePersonnelStore from "../../../stores/usePersonnelStore";
import useRegionStore from "../../../stores/useRegionStore";
import useVarietyStore from "../../../stores/useVarietyStore";

export const useCultivationPlotDetailPage = () => {
  const [, params] = useRoute("/cultivation-plot/:id");
  const [, setLocation] = useLocation();
  const { getCultivationPlotById } = useCultivationPlotStore();
  const { regions } = useRegionStore();
  const { enterprises } = useEnterpriseStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { varieties } = useVarietyStore();
  const { personnel } = usePersonnelStore();
  const { standards } = useEnterpriseCertificateStore();
  const plotId = params?.id;

  const data = useMemo(
    () => (plotId ? getCultivationPlotById(plotId) : undefined),
    [getCultivationPlotById, plotId],
  );

  const geometry = useMemo(() => {
    if (!data) return null;
    for (const region of regions) {
      for (const area of region.subAreas || []) {
        const matchedPlot = (area.plots || []).find(
          (plot) => plot.id === data.plotId || plot.id === data.id,
        );
        if (matchedPlot) return matchedPlot;
      }
    }
    return null;
  }, [data, regions]);

  return {
    data,
    geometry,
    enterprise: enterprises.find((item) => item.id.toString() === data?.enterpriseId),
    manager: personnel.find((item) => item.id.toString() === data?.managerId),
    farmingMethod: farmingMethods.find((item) => item.id === data?.farmingMethodId),
    irrigationSystem: irrigationSystems.find(
      (item) => item.id === data?.irrigationMethodId,
    ),
    varieties,
    standards,
    center: geometry?.coordinates?.[0]
      ? L.latLng(geometry.coordinates[0].lat, geometry.coordinates[0].lng)
      : L.latLng(11.54, 106.9),
    goBack: () => setLocation("/cultivation-plot"),
    goToEdit: () => data && setLocation(`/cultivation-plot/${data.id}/edit`),
  };
};
