import { useFarmDashboardAlerts } from "@/features/farm/hooks/useFarmDashboard";
import type { SupplyTypeKey } from "@/features/farm/types/farm-dashboard.type";

const SHORTAGE_TYPE_LABELS: Record<SupplyTypeKey, string> = {
  medicine: "thuốc BVTV",
  fertilizer: "phân bón",
  material: "vật tư",
  equipment: "thiết bị",
};

export type DashboardAlertTone = "red" | "amber" | "blue";

export interface DashboardAlertItem {
  key: string;
  title: string;
  description: string;
  href: string;
  tone: DashboardAlertTone;
  /** true khi cần người dùng xử lý (dùng để đếm badge thông báo) */
  needsAttention: boolean;
}

/** Cảnh báo dashboard (chứng chỉ, vật tư, hợp đồng) — dùng chung cho card và thông báo */
export function useDashboardAlertItems() {
  const { certCount, lowStockData, contractData, isLoading } =
    useFarmDashboardAlerts();

  const shortageType = lowStockData?.topShortageType;
  const shortageCount = lowStockData?.topShortageCount ?? 0;
  const totalLowStock = lowStockData?.totalLowStock ?? 0;
  const shortageTypeName = shortageType
    ? SHORTAGE_TYPE_LABELS[shortageType] || shortageType
    : "";

  const supplyText =
    shortageType && shortageCount > 0
      ? `${shortageCount} loại ${shortageTypeName} cần bổ sung`
      : totalLowStock > 0
        ? `${totalLowStock} loại vật tư cần bổ sung`
        : "Tồn kho vật tư đạt ngưỡng an toàn";

  const expiringContractsCount = contractData?.expiringCount ?? 0;
  const windowDays = contractData?.windowDays ?? 7;
  const contractText =
    expiringContractsCount > 0
      ? `${expiringContractsCount} hợp đồng hết hạn trong ${windowDays} ngày tới`
      : "Không có hợp đồng nào cần gia hạn";

  const items: DashboardAlertItem[] = [
    {
      key: "certificate",
      title: "Chứng chỉ sắp hết hạn",
      description:
        certCount > 0
          ? `${certCount} chứng chỉ VietGAP hết hạn trong 30 ngày`
          : "Không có chứng chỉ nào sắp hết hạn",
      href: "/certificate",
      tone: "red",
      needsAttention: certCount > 0,
    },
    {
      key: "supply",
      title: "Vật tư sắp hết",
      description: supplyText,
      href: "/cultivation-material/material",
      tone: "amber",
      needsAttention: shortageCount > 0 || totalLowStock > 0,
    },
    {
      key: "contract",
      title: "Hợp đồng cần gia hạn",
      description: contractText,
      href: "/contract",
      tone: "blue",
      needsAttention: expiringContractsCount > 0,
    },
  ];

  return {
    items,
    attentionCount: items.filter((item) => item.needsAttention).length,
    isLoading,
  };
}
