import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Plant } from "@/pages/region-chart/constants";
import {
  useCultivationZoneById,
  usePlantIdentificationById,
  usePlantIdentificationMutations,
} from "@/features/farm";
import { mapApiPlantToFrontend } from "../utils/aquacultureMapper";

const HISTORY_DATA = [
  { id: 1, date: "20/02/2026", action: "Kiểm tra nước", details: "Độ mặn và pH ổn định", executor: "Nguyễn Văn Hải" },
  { id: 2, date: "15/02/2026", action: "Bổ sung thức ăn", details: "Theo định mức mẫu", executor: "Trần Thị Mai" },
  { id: 3, date: "10/02/2026", action: "Vệ sinh ao", details: "Loại bỏ cặn và kiểm tra bờ bao", executor: "Lê Minh Khoa" },
];

export const aquacultureHistoryColumns = [
  { key: "date", label: "Ngày" },
  { key: "action", label: "Hoạt động" },
  { key: "details", label: "Chi tiết" },
  { key: "executor", label: "Người thực hiện" },
];

type AquacultureIdentificationDetailData = { plant: Plant; plot: any; area: any; region: any };

const formatAge = (plant: Plant) => {
  if (plant.ageValue && plant.ageUnit) {
    const unitMap = { days: "ngày", months: "tháng", years: "năm" };
    return `${plant.ageValue} ${unitMap[plant.ageUnit as keyof typeof unitMap]}`;
  }
  return plant.age || "N/A";
};

export const useAquacultureIdentificationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: apiData, isLoading } = usePlantIdentificationById(Number(id));
  const { deletePlant } = usePlantIdentificationMutations();

  const data = useMemo<AquacultureIdentificationDetailData | null>(() => {
    if (!apiData || apiData.domainCode !== "AQUACULTURE") return null;

    const location = apiData.location;
    let plot: any = null;
    let area: any = null;
    let region: any = null;
    if (location?.scopeType === "PLOT" && location.plot) {
      plot = location.plot;
      area = location.plot.area ?? null;
      region = location.plot.area?.region ?? null;
    } else if (location?.scopeType === "AREA" && location.area) {
      area = location.area;
      region = location.area.region ?? null;
    } else if (location?.scopeType === "REGION" && location.region) {
      region = location.region;
    }

    return {
      plant: mapApiPlantToFrontend(apiData),
      plot: plot && { id: plot.id, code: plot.code, name: plot.name },
      area: area && { id: area.id, code: area.code, name: area.name },
      region: region && { id: region.id, code: region.code, name: region.name },
    };
  }, [apiData]);

  const productionZoneId = apiData?.productionZone?.id ?? apiData?.cultivationZone?.id;
  const { data: cultivationRegion } = useCultivationZoneById(Number(productionZoneId), {
    enabled: Boolean(productionZoneId),
  });

  const handleConfirmDelete = async () => {
    if (!id) return;
    try {
      await deletePlant.mutateAsync(Number(id));
      toast({ title: "Thành công", description: `Đã xóa định danh ${data?.plant.code || id}` });
      setLocation("/aquaculture-identification");
    } catch (error: any) {
      toast({ title: "Lỗi", description: error?.message || "Không thể xóa định danh", variant: "destructive" });
    } finally {
      setDeleteOpen(false);
    }
  };

  return {
    id, data, isLoading, deleteOpen, setDeleteOpen,
    cultivationRegion: cultivationRegion ?? null,
    manager: cultivationRegion?.personnel?.[0] ?? null,
    farmingMethod: cultivationRegion?.productionMethod ?? cultivationRegion?.farmingMethod ?? null,
    irrigationMethod: cultivationRegion?.rearingMethod ?? cultivationRegion?.irrigationSystem ?? null,
    formattedAge: data?.plant ? formatAge(data.plant) : "N/A",
    historyData: HISTORY_DATA, historyColumns: aquacultureHistoryColumns,
    goToList: () => setLocation("/aquaculture-identification"),
    goToEdit: () => data?.plant.id && setLocation(`/aquaculture-identification/${data.plant.id}/edit`),
    handleConfirmDelete,
  };
};
