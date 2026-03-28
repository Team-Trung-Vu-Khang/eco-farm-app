import { useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import L from "leaflet";
import useCultivationAreaStore from "../../../stores/useCultivationAreaStore";
import useEnterpriseCertificateStore from "../../../stores/useEnterpriseCertificateStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import useFarmingMethodStore from "../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../stores/useIrrigationSystemStore";
import usePersonnelStore from "../../../stores/usePersonnelStore";
import useRegionStore from "../../../stores/useRegionStore";
import useVarietyStore from "../../../stores/useVarietyStore";

export const useCultivationAreaDetailPage = () => {
  const [, params] = useRoute("/cultivation-area/:id");
  const [, setLocation] = useLocation();
  const { getCultivationAreaById } = useCultivationAreaStore();
  const { regions } = useRegionStore();
  const { enterprises } = useEnterpriseStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { varieties } = useVarietyStore();
  const { personnel } = usePersonnelStore();
  const { standards } = useEnterpriseCertificateStore();

  const areaId = params?.id;
  const data = useMemo(
    () => (areaId ? getCultivationAreaById(areaId) : undefined),
    [areaId, getCultivationAreaById],
  );

  const geometry = useMemo(() => {
    if (!data) return null;

    for (const region of regions) {
      if (region.id.toString() !== data.regionId) continue;

      const matchedArea = (region.subAreas || []).find(
        (area) =>
          area.id.toString() === (data.areaId || "").toString() ||
          area.id.toString() === data.id,
      );

      if (matchedArea) return matchedArea;
    }

    return null;
  }, [data, regions]);

  const enterprise = enterprises.find(
    (item) => item.id.toString() === data?.enterpriseId,
  );
  const manager = personnel.find(
    (item) => item.id.toString() === data?.managerId,
  );
  const farmingMethod = farmingMethods.find(
    (item) => item.id === data?.farmingMethodId,
  );
  const irrigationSystem = irrigationSystems.find(
    (item) => item.id === data?.irrigationMethodId,
  );

  const center = geometry?.coordinates?.[0]
    ? L.latLng(geometry.coordinates[0].lat, geometry.coordinates[0].lng)
    : L.latLng(11.54, 106.9);

  return {
    data,
    geometry,
    enterprise,
    manager,
    farmingMethod,
    irrigationSystem,
    varieties,
    standards,
    center,
    goBack: () => setLocation("/cultivation-area"),
    goToEdit: () => data && setLocation(`/cultivation-area/${data.id}/edit`),
  };
};
