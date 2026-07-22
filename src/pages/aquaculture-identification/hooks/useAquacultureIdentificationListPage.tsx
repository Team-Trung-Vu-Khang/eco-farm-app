import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AQUACULTURE_IDENTIFICATION_PLANTS } from "../data/dummy";

export const useAquacultureIdentificationListPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [plants, setPlants] = useState(AQUACULTURE_IDENTIFICATION_PLANTS);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const columns = useMemo(
    () => [
      {
        key: "code",
        label: "Mã định danh",
        render: (value: string, row: { id: string }) => (
          <button
            type="button"
            onClick={() => setLocation(`/aquaculture-identification/${row.id}`)}
            className="font-mono font-bold text-primary hover:underline cursor-pointer"
          >
            {value || `AQI-${row.id}`}
          </button>
        ),
      },
      {
        key: "regionName",
        label: "Vùng nuôi trồng",
        render: (_: unknown, row: any) => (
          <span className="font-semibold text-slate-800">
            {row.regionName || "—"}
          </span>
        ),
      },
      {
        key: "areaName",
        label: "Khu vực",
        render: (_: unknown, row: any) => (
          <span className="text-slate-600 text-sm font-medium">
            {row.areaName || "Chưa xác định"}
          </span>
        ),
      },
      {
        key: "height",
        label: "C.Cao (m)",
        render: (value: string) => value || "—",
      },
      {
        key: "ageValue",
        label: "Độ tuổi",
        render: (_: unknown, row: any) => {
          if (!row.ageValue) return row.age || "—";
          const unitLabel = {
            days: "ngày",
            months: "tháng",
            years: "năm",
          }[row.ageUnit || "years"];
          return `${row.ageValue} ${unitLabel}`;
        },
      },
      {
        key: "coordinate",
        label: "Tọa độ",
        render: (_: unknown, row: any) =>
          row.coordinate?.lat ? (
            <span className="text-muted-foreground italic text-xs font-mono">
              {row.coordinate.lat.toFixed(5)} / {row.coordinate.lng.toFixed(5)}
            </span>
          ) : (
            "—"
          ),
      },
      {
        key: "note",
        label: "Ghi chú",
        render: (value: string) => (
          <span
            className="text-muted-foreground italic text-xs block max-w-50 truncate"
            title={value}
          >
            {value || "—"}
          </span>
        ),
      },
    ],
    [setLocation],
  );

  const handleDelete = (row: { id: string }) => {
    setSelectedId(row.id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedId) return;
    setPlants((prev) => prev.filter((item) => item.id !== selectedId));
    toast({
      title: "Thành công",
      description: "Đã xóa dữ liệu định danh mẫu",
    });
    setDeleteOpen(false);
    setSelectedId(null);
  };

  return {
    plants,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
  };
};

