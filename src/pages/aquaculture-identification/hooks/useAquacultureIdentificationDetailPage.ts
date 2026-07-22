import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Plant } from "@/pages/region-chart/constants";
import {
  AQUACULTURE_IDENTIFICATION_GEO_UNITS,
  AQUACULTURE_IDENTIFICATION_PLANTS,
  AQUACULTURE_IDENTIFICATION_REGIONS,
} from "../data/dummy";

const HISTORY_DATA = [
  {
    id: 1,
    date: "20/02/2026",
    action: "Kiểm tra nước",
    details: "Độ mặn và pH ổn định",
    executor: "Nguyễn Văn Hải",
  },
  {
    id: 2,
    date: "15/02/2026",
    action: "Bổ sung thức ăn",
    details: "Theo định mức mẫu",
    executor: "Trần Thị Mai",
  },
  {
    id: 3,
    date: "10/02/2026",
    action: "Vệ sinh ao",
    details: "Loại bỏ cặn và kiểm tra bờ bao",
    executor: "Lê Minh Khoa",
  },
];

export const aquacultureHistoryColumns = [
  { key: "date", label: "Ngày" },
  { key: "action", label: "Hoạt động" },
  { key: "details", label: "Chi tiết" },
  { key: "executor", label: "Người thực hiện" },
];

type AquacultureIdentificationDetailData = {
  plant: Plant;
  plot: any;
  area: any;
  region: any;
};

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

export const useAquacultureIdentificationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const data = useMemo<AquacultureIdentificationDetailData | null>(() => {
    const plant = AQUACULTURE_IDENTIFICATION_PLANTS.find(
      (item) => item.id === id,
    );
    if (!plant) return null;

    const region = AQUACULTURE_IDENTIFICATION_REGIONS.find(
      (item) => item.id === plant.cultivationRegionId,
    );

    const plotUnit = AQUACULTURE_IDENTIFICATION_GEO_UNITS.find(
      (unit) => unit.id === plant.plotId,
    );
    let resolvedArea =
      AQUACULTURE_IDENTIFICATION_GEO_UNITS.find(
        (unit) => unit.id === "aq-a-1",
      ) || null;
    if (plant.plotId === "aq-a-2") {
      resolvedArea =
        AQUACULTURE_IDENTIFICATION_GEO_UNITS.find(
          (unit) => unit.id === "aq-a-2",
        ) || null;
    }

    return {
      plant,
      plot: plotUnit ? { ...plotUnit } : null,
      area: resolvedArea ? { ...resolvedArea } : null,
      region: region
        ? {
            id: region.id,
            code: region.code,
            name: region.name,
            coordinates: (
              region.id === "aq-region-2"
                ? AQUACULTURE_IDENTIFICATION_GEO_UNITS.find(
                    (unit) => unit.id === "aq-r-2",
                  )
                : AQUACULTURE_IDENTIFICATION_GEO_UNITS.find(
                    (unit) => unit.id === "aq-r-1",
                  )
            )?.coordinates,
          }
        : null,
    };
  }, [id]);

  const selectedRegion = useMemo(
    () =>
      data
        ? AQUACULTURE_IDENTIFICATION_REGIONS.find(
            (item) => item.id === data.plant.cultivationRegionId,
          ) || null
        : null,
    [data],
  );

  const manager = selectedRegion?.personnel || [];
  const farmingMethod = selectedRegion?.farmingMethod || null;
  const irrigationMethod = selectedRegion?.irrigationSystem || null;

  const handleConfirmDelete = () => {
    toast({
      title: "Thành công",
      description: "Đã xóa dữ liệu định danh mẫu",
    });
    setDeleteOpen(false);
    setLocation("/aquaculture-identification");
  };

  return {
    id,
    data,
    isLoading: false,
    deleteOpen,
    setDeleteOpen,
    cultivationRegion: selectedRegion,
    manager,
    farmingMethod,
    irrigationMethod,
    formattedAge: data?.plant ? formatAge(data.plant) : "N/A",
    historyData: HISTORY_DATA,
    historyColumns: aquacultureHistoryColumns,
    goToList: () => setLocation("/aquaculture-identification"),
    goToEdit: () => {
      if (!data?.plant?.id) return;
      setLocation(`/aquaculture-identification/${data.plant.id}/edit`);
    },
    handleConfirmDelete,
  };
};
