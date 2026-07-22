import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Plant } from "../../../region-chart/constants";
import {
  usePlantIdentificationById,
  usePlantIdentificationMutations,
  useCultivationZoneById,
  regionApi,
  areaApi,
  plotApi,
} from "@/features/farm";
import { useQuery } from "@tanstack/react-query";
import { regionKeys } from "@/features/farm/hooks/useRegions";
import { areaKeys } from "@/features/farm/hooks/useAreas";
import { plotKeys } from "@/features/farm/hooks/usePlots";
import { mapApiPlantToFrontend } from "../utils/animalMapper";

const HISTORY_DATA = [
  {
    id: 1,
    date: "20/02/2026",
    action: "Bón phân",
    details: "NPK 20-20-15",
    executor: "Nguyễn Văn A",
  },
  {
    id: 2,
    date: "15/02/2026",
    action: "Tưới nước",
    details: "Hệ thống tự động 30 phút",
    executor: "Trần Thị B",
  },
  {
    id: 3,
    date: "10/02/2026",
    action: "Kiểm tra định kỳ",
    details: "Cây phát triển tốt, không sâu bệnh",
    executor: "Lê Văn C",
  },
];

export const plantHistoryColumns = [
  { key: "date", label: "Ngày" },
  { key: "action", label: "Hoạt động" },
  { key: "details", label: "Chi tiết" },
  { key: "executor", label: "Người thực hiện" },
];

export type PlantIdentificationDetailData = {
  plant: Plant;
  plot: any;
  area: any;
  region: any;
};

/** Convert API boundary (latitude/longitude) → map coords ({lat,lng}) */
function boundaryToCoords(boundary?: Array<{ latitude?: number; longitude?: number }>): { lat: number; lng: number }[] {
  if (!boundary) return [];
  return boundary
    .map((p) => ({ lat: p.latitude ?? 0, lng: p.longitude ?? 0 }))
    .filter((c) => c.lat !== 0 || c.lng !== 0);
}

const formatAge = (plant: Plant) => {
  if (plant.ageValue && plant.ageUnit) {
    const unitMap = {
      days: "ngày",
      months: "tháng",
      years: "năm",
    };

    return `${plant.ageValue} ${unitMap[plant.ageUnit as keyof typeof unitMap]}`;
  }

  return plant.age || "N/A";
};

export const useAnimalIdentificationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: apiData, isLoading } = usePlantIdentificationById(Number(id));
  const { deletePlant } = usePlantIdentificationMutations();
  const [deleteOpen, setDeleteOpen] = useState(false);

  // 1. Resolve location details directly from apiData payload
  const data = useMemo(() => {
    if (!apiData) return null;
    const plant = mapApiPlantToFrontend(apiData);

    let plot: any = null;
    let area: any = null;
    let region: any = null;

    const loc = apiData.location;
    if (loc) {
      if (loc.scopeType === "PLOT" && loc.plot) {
        plot = { id: loc.plot.id, code: loc.plot.code, name: loc.plot.name };
        if (loc.plot.area) {
          area = { id: loc.plot.area.id, code: loc.plot.area.code, name: loc.plot.area.name };
          if (loc.plot.area.region) {
            region = { id: loc.plot.area.region.id, code: loc.plot.area.region.code, name: loc.plot.area.region.name };
          }
        }
      } else if (loc.scopeType === "AREA" && loc.area) {
        area = { id: loc.area.id, code: loc.area.code, name: loc.area.name };
        if (loc.area.region) {
          region = { id: loc.area.region.id, code: loc.area.region.code, name: loc.area.region.name };
        }
      } else if (loc.scopeType === "REGION" && loc.region) {
        region = { id: loc.region.id, code: loc.region.code, name: loc.region.name };
      }
    }

    return {
      plant,
      plot,
      area,
      region,
    };
  }, [apiData]);

  // 2. Fetch detailed coordinates (boundaries) for the resolved geo entities
  const plotId = data?.plot?.id;
  const { data: plotDetail } = useQuery({
    queryKey: plotKeys.detail(Number(plotId)),
    queryFn: () => plotApi.getById(Number(plotId)),
    enabled: !!plotId,
  });

  const areaId = data?.area?.id;
  const { data: areaDetail } = useQuery({
    queryKey: areaKeys.detail(Number(areaId)),
    queryFn: () => areaApi.getById(Number(areaId)),
    enabled: !!areaId,
  });

  const regionId = data?.region?.id;
  const { data: regionDetail } = useQuery({
    queryKey: regionKeys.detail(Number(regionId)),
    queryFn: () => regionApi.getById(Number(regionId)),
    enabled: !!regionId,
  });

  const resolvedData = useMemo(() => {
    if (!data) return null;
    return {
      plant: data.plant,
      plot: data.plot ? { ...data.plot, coordinates: boundaryToCoords(plotDetail?.boundary) } : null,
      area: data.area ? { ...data.area, coordinates: boundaryToCoords(areaDetail?.boundary) } : null,
      region: data.region ? { ...data.region, coordinates: boundaryToCoords(regionDetail?.boundary) } : null,
    };
  }, [data, plotDetail, areaDetail, regionDetail]);

  // 3. Fetch full production zone details using API (no Zustand store)
  const productionZoneId = apiData?.productionZone?.id;
  const { data: cultivationRegionDetail } = useCultivationZoneById(
    Number(productionZoneId),
    { enabled: !!productionZoneId },
  );

  const cultivationRegion = cultivationRegionDetail || null;

  const manager = useMemo(() => {
    return cultivationRegionDetail?.personnel?.[0] || null;
  }, [cultivationRegionDetail]);

  const farmingMethod = useMemo(() => {
    return cultivationRegionDetail?.farmingMethod || null;
  }, [cultivationRegionDetail]);

  const irrigationMethod = useMemo(() => {
    return cultivationRegionDetail?.irrigationSystem || null;
  }, [cultivationRegionDetail]);

  const handleConfirmDelete = async () => {
    if (!id) return;
    try {
      await deletePlant.mutateAsync(Number(id));
      toast({
        title: "Thành công",
        description: `Đã xóa cá thể có mã ${data?.plant?.code || id}`,
      });
      setLocation("/animal-identification");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể xóa cá thể",
        variant: "destructive",
      });
    } finally {
      setDeleteOpen(false);
    }
  };

  return {
    id,
    data: resolvedData,
    isLoading,
    deleteOpen,
    setDeleteOpen,
    cultivationRegion,
    manager,
    farmingMethod,
    irrigationMethod,
    formattedAge: data?.plant ? formatAge(data.plant) : "N/A",
    historyData: HISTORY_DATA,
    historyColumns: plantHistoryColumns,
    goToList: () => setLocation("/animal-identification"),
    goToEdit: () => {
      if (!data?.plant?.id) return;
      setLocation(`/animal-identification/${data.plant.id}/edit`);
    },
    handleConfirmDelete,
  };
};
