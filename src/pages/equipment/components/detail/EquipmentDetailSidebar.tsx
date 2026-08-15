import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertTriangle, Building2, CheckCircle2, History } from "lucide-react";
import { suppliers as presetSuppliers } from "../../data/constants";
import type { Equipment } from "../../types";

interface EquipmentDetailSidebarProps {
  item?: Equipment;
}

export const EquipmentDetailSidebar = ({
  item,
}: EquipmentDetailSidebarProps) => {
  // Convert item's supplierDetails if available
  const activeSuppliers: Record<string, string>[] =
    item?.supplierDetails &&
    Array.isArray(item.supplierDetails) &&
    item.supplierDetails.length > 0
      ? item.supplierDetails.map((detail) => {
          const found = presetSuppliers.find((s) => s.id === detail.supplierId);
          return {
            name: found?.name || detail.supplierId,
            quantity: detail.quantity,
            unit: detail.unit,
            warranty: detail.warranty,
          };
        })
      : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3 border-b bg-slate-50/50">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-500" />
            Nhà cung cấp lưu kho
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid gap-4">
          {activeSuppliers.map((sup, idx) => (
            <div
              key={idx}
              className="space-y-2 border-b pb-3 last:border-b-0 last:pb-0"
            >
              <div className="font-semibold text-sm">{sup.name}</div>
              <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                <span>
                  Số lượng: {sup.quantity} {sup.unit}
                </span>
                <span className="font-medium text-emerald-600">
                  BH: {sup.warranty}
                </span>
              </div>
            </div>
          ))}
          {activeSuppliers.length === 0 && (
            <div className="text-center py-4 text-xs text-muted-foreground">
              Chưa gán nhà cung cấp lưu kho
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-2">
        <Button
          variant="outline"
          className="w-full justify-start text-amber-600 border-amber-200 hover:bg-amber-50"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Báo hỏng / Cần bảo trì
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <History className="w-4 h-4 mr-2" />
          Lịch sử bảo dưỡng
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Nhật trình hoạt động
        </Button>
      </div>
    </div>
  );
};
