import { useMemo } from "react";
import { useParams } from "wouter";
import useCultivationRegionStore from "../../../../stores/useCultivationRegionStore";

export const useCultivationRegionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getAreaById } = useCultivationRegionStore();

  const area = useMemo(() => {
    if (!id) return null;
    return getAreaById(id) ?? null;
  }, [getAreaById, id]);

  return {
    area,
    title: area?.name || "Không tìm thấy",
    description: area
      ? `Mã: ${area.id} • Tạo: ${new Date(area.createdAt).toLocaleDateString("vi-VN")}`
      : "Vùng canh tác không tồn tại",
  };
};
