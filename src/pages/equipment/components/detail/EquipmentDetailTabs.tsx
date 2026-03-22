import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Activity,
  Building2,
  FileText,
  History,
  Info,
  TimerReset,
} from "lucide-react";
import type { Equipment } from "../../data/constants";
import { maintenanceHistory, usageHistory } from "../../data/mocks";

export const InfoTab = ({ item }: { item: Equipment }) => (
  <Card>
    <CardHeader className="pb-3 border-b">
      <CardTitle className="text-lg flex items-center gap-2">
        <Info className="w-5 h-5 text-primary" />
        Thông số kỹ thuật & Mô tả
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="bg-slate-50 p-4 rounded-lg text-sm leading-relaxed border border-slate-100 min-h-[100px]">
        {item.description || "Chưa có mô tả chi tiết."}
      </div>
    </CardContent>
  </Card>
);

export const UsageTab = () => (
  <Card>
    <CardHeader className="pb-3 border-b">
      <CardTitle className="text-lg flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        Nhật trình hoạt động
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="space-y-4">
        {usageHistory.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-4 p-4 border rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
          >
            <div className="w-12 text-center shrink-0">
              <div className="text-sm font-bold text-slate-900 leading-none">
                {log.date.split("-")[2]}
              </div>
              <div className="text-xs text-muted-foreground uppercase mt-1">
                Thg {log.date.split("-")[1]}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-800 truncate">
                {log.activity}
              </h4>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {log.operator}
                </div>
                <div className="flex items-center gap-1">
                  <TimerReset className="w-3 h-3" />
                  {log.duration}
                </div>
              </div>
            </div>
            <Badge
              variant="outline"
              className="text-green-600 bg-green-50 border-green-200"
            >
              Hoàn thành
            </Badge>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const MaintenanceTab = () => (
  <Card>
    <CardHeader className="pb-3 border-b">
      <CardTitle className="text-lg flex items-center gap-2">
        <History className="w-5 h-5 text-primary" />
        Lịch sử bảo trì, sửa chữa
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pl-8 py-2">
        {maintenanceHistory.map((maint) => (
          <div key={maint.id} className="relative">
            <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-blue-500 shadow-sm" />
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-xl border bg-white shadow-xs">
              <div>
                <div className="text-xs font-semibold text-blue-600 mb-1">
                  {maint.date}
                </div>
                <h4 className="font-bold text-slate-900">{maint.type}</h4>
                <p className="text-sm text-slate-600 mt-1">
                  {maint.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>Thực hiện: {maint.technician}</span>
                  {maint.nextDate && <span>• Lần tới: {maint.nextDate}</span>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-slate-900">
                  {maint.cost}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const DocsTab = ({ equipmentCode }: { equipmentCode: string }) => (
  <Card>
    <CardHeader className="pb-3 border-b">
      <CardTitle className="text-lg flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Tài liệu kỹ thuật
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium group-hover:text-primary transition-colors">
              HUONG_DAN_SU_DUNG_{equipmentCode}.pdf
            </div>
            <div className="text-xs text-muted-foreground">
              PDF • 5.2 MB • Tải lên 1 tháng trước
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          Tải xuống
        </Button>
      </div>
    </CardContent>
  </Card>
);
