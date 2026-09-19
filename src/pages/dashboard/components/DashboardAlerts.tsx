import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useFarmDashboardAlerts } from "@/features/farm/hooks/useFarmDashboard";
import type { SupplyTypeKey } from "@/features/farm/types/farm-dashboard.type";

const SHORTAGE_TYPE_LABELS: Record<SupplyTypeKey, string> = {
  medicine: "thuốc BVTV",
  fertilizer: "phân bón",
  material: "vật tư",
  equipment: "thiết bị",
};

export function DashboardAlerts() {
  const { certCount, lowStockData, contractData, isLoading } =
    useFarmDashboardAlerts();

  // Supply shortage text calculation
  const shortageType = lowStockData?.topShortageType;
  const shortageCount = lowStockData?.topShortageCount ?? 0;
  const shortageTypeName = shortageType ? SHORTAGE_TYPE_LABELS[shortageType] || shortageType : "";

  const supplyText =
    shortageType && shortageCount > 0
      ? `${shortageCount} loại ${shortageTypeName} cần bổ sung`
      : lowStockData?.totalLowStock && lowStockData.totalLowStock > 0
        ? `${lowStockData.totalLowStock} loại vật tư cần bổ sung`
        : "Tồn kho vật tư đạt ngưỡng an toàn";

  // Expiring contracts text calculation
  const expiringContractsCount = contractData?.expiringCount ?? 0;
  const windowDays = contractData?.windowDays ?? 7;
  const contractText =
    expiringContractsCount > 0
      ? `${expiringContractsCount} hợp đồng hết hạn trong ${windowDays} ngày tới`
      : "Không có hợp đồng nào cần gia hạn";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Cảnh báo</span>
          </div>
          {isLoading && (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/certificate"
            className="p-4 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 transition-colors group"
          >
            <p className="font-medium text-red-800 flex items-center gap-1">
              Chứng chỉ sắp hết hạn
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
            <p className="text-sm text-red-600 mt-1">
              {isLoading
                ? "Đang kiểm tra..."
                : certCount > 0
                  ? `${certCount} chứng chỉ VietGAP hết hạn trong 30 ngày`
                  : "Không có chứng chỉ nào sắp hết hạn"}
            </p>
          </Link>

          <Link
            to="/cultivation-material/material"
            className="p-4 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors group"
          >
            <p className="font-medium text-amber-800 flex items-center gap-1">
              Vật tư sắp hết
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
            <p className="text-sm text-amber-600 mt-1">
              {isLoading ? "Đang kiểm tra..." : supplyText}
            </p>
          </Link>

          <Link
            to="/contract"
            className="p-4 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors group"
          >
            <p className="font-medium text-blue-800 flex items-center gap-1">
              Hợp đồng cần gia hạn
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {isLoading ? "Đang kiểm tra..." : contractText}
            </p>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
