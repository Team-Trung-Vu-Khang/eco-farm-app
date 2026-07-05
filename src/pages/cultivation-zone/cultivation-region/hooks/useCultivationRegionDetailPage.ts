import { useParams } from "wouter";
import { useCultivationZoneById } from "@/features/farm/hooks/useCultivationZones";

export const useCultivationRegionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? parseInt(id, 10) : 0;

  const { data: area } = useCultivationZoneById(numericId, {
    enabled: !!numericId,
  });

  return {
    area,
    title: area?.name || "Đang tải...",
    description: area
      ? `Mã: ${area.id} • Tạo: ${area.createdAt ? new Date(area.createdAt).toLocaleDateString("vi-VN") : "---"}`
      : "Vùng canh tác",
  };
};
