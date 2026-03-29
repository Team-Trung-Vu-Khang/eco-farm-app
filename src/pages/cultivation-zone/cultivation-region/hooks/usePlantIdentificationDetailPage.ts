import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Plant } from "../../../region-chart/constants";
import useCultivationRegionStore from "../../../../stores/useCultivationRegionStore";
import useFarmingMethodStore from "../../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../../stores/useIrrigationSystemStore";
import usePersonnelStore from "../../../../stores/usePersonnelStore";
import usePlantStore from "../../../../stores/usePlantStore";

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

export type PlantIdentificationDetailData = NonNullable<
  ReturnType<ReturnType<typeof usePlantStore>["getPlantById"]>
>;

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

export const usePlantIdentificationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { getPlantById, deletePlant } = usePlantStore();
  const { areas: cultivationRegions } = useCultivationRegionStore();
  const { personnel } = usePersonnelStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const data = useMemo(() => {
    if (!id) return null;
    return getPlantById(id) ?? null;
  }, [getPlantById, id]);

  const cultivationRegion = useMemo(() => {
    if (!data?.plant?.cultivationRegionId) return null;
    return (
      cultivationRegions.find(
        (region) => region.id === data.plant.cultivationRegionId,
      ) ?? null
    );
  }, [cultivationRegions, data]);

  const primaryManagerId = cultivationRegion?.managerIds?.[0];

  const manager = useMemo(() => {
    if (!primaryManagerId) return null;
    return (
      personnel.find((item) => String(item.id) === String(primaryManagerId)) ??
      null
    );
  }, [personnel, primaryManagerId]);

  const farmingMethod = useMemo(() => {
    if (!cultivationRegion?.farmingMethodId) return null;
    return (
      farmingMethods.find(
        (method) => method.id === cultivationRegion.farmingMethodId,
      ) ?? null
    );
  }, [cultivationRegion, farmingMethods]);

  const irrigationMethod = useMemo(() => {
    if (!cultivationRegion?.irrigationMethodId) return null;
    return (
      irrigationSystems.find(
        (system) => system.id === cultivationRegion.irrigationMethodId,
      ) ?? null
    );
  }, [cultivationRegion, irrigationSystems]);

  const handleConfirmDelete = () => {
    if (!id) return;

    deletePlant(id);
    toast({
      title: "Thành công",
      description: `Đã xóa cây có mã ${data?.plant?.code || id}`,
    });
    setLocation("/plant-identification");
    setDeleteOpen(false);
  };

  return {
    id,
    data,
    deleteOpen,
    setDeleteOpen,
    cultivationRegion,
    manager,
    farmingMethod,
    irrigationMethod,
    formattedAge: data?.plant ? formatAge(data.plant) : "N/A",
    historyData: HISTORY_DATA,
    historyColumns: plantHistoryColumns,
    goToList: () => setLocation("/plant-identification"),
    goToEdit: () => {
      if (!data?.plant?.id) return;
      setLocation(`/plant-identification/${data.plant.id}/edit`);
    },
    handleConfirmDelete,
  };
};
