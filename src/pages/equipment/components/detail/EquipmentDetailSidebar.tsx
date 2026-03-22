import { Card, CardContent, CardHeader, CardTitle, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, AlertTriangle, History, CheckCircle2 } from "lucide-react";
import { itemSuppliers } from "../../data/mocks";

export const EquipmentDetailSidebar = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3 border-b bg-slate-50/50">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-500" />
            Nhà cung cấp
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid gap-4">
          {itemSuppliers.map((sup, idx) => (
            <div key={idx} className="space-y-2">
              <div className="font-semibold text-sm">{sup.name}</div>
              <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                <span>Số lượng: {sup.quantity} {sup.unit}</span>
                <span className="font-medium text-emerald-600">BH: {sup.warranty}</span>
              </div>
            </div>
          ))}
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
