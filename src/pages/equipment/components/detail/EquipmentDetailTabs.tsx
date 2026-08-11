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
  Cpu,
  Package,
  Wrench,
} from "lucide-react";
import type { Equipment } from "../../types";
import { maintenanceHistory, usageHistory } from "../../data/mocks";
import { suppliers as presetSuppliers } from "../../data/constants";

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div>
      <span className="text-muted-foreground block text-xs">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}

export const InfoTab = ({ item }: { item: Equipment }) => {
  return (
    <div className="space-y-6">
      {/* 1. Technical Specs Card */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            Thông số kỹ thuật chi tiết
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <DetailRow label="Model / Kiểu máy" value={item.model} />
            <DetailRow label="Hãng sản xuất" value={item.manufacturer} />
            <DetailRow label="Nước sản xuất" value={item.countryOfOrigin} />
            <DetailRow label="Năm sản xuất" value={item.manufactureYear} />
            <DetailRow label="Công suất" value={item.powerCapacity} />
            <DetailRow label="Dung tích / Khả năng làm việc" value={item.workingCapacity} />
            <DetailRow label="Nhiên liệu / Năng lượng" value={item.fuelEnergyType} />
            <DetailRow label="Trọng lượng" value={item.weight} />
            <DetailRow label="Kích thước" value={item.dimensions} />
          </div>

          {item.machineType && item.machineType.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <span className="text-muted-foreground block text-xs mb-2">Loại máy / Công dụng:</span>
              <div className="flex flex-wrap gap-1.5">
                {item.machineType.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-slate-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {item.otherSpecifications && (
            <div className="mt-6 border-t pt-4">
              <span className="text-muted-foreground block text-xs mb-2">Thông số kỹ thuật đặc thù khác:</span>
              <p className="text-sm bg-slate-50 p-3 rounded-lg border leading-relaxed text-slate-700 whitespace-pre-wrap">
                {item.otherSpecifications}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Operations & Maintenance Card */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Vận hành & Phụ tùng bảo dưỡng
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <DetailRow label="Định mức tiêu hao nhiên liệu" value={item.fuelConsumptionRate} />
            <DetailRow label="Chu kỳ bảo dưỡng định kỳ" value={item.maintenanceSchedule || item.maintainanceInterval} />
          </div>

          {item.mainAccessories && (
            <div className="border-t pt-4">
              <span className="text-muted-foreground block text-xs mb-2">Phụ tùng chính kèm theo máy:</span>
              <p className="text-sm bg-slate-50 p-3 rounded-lg border leading-relaxed text-slate-700 whitespace-pre-wrap">
                {item.mainAccessories}
              </p>
            </div>
          )}

          <div className="border-t pt-4">
            <span className="text-muted-foreground block text-xs mb-2">Mô tả tóm tắt:</span>
            <p className="text-sm bg-slate-50 p-3 rounded-lg border leading-relaxed text-slate-700">
              {item.description || "Chưa có mô tả tóm tắt cho thiết bị này."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Market Distribution Card */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Xuất xứ & Phân phối thị trường
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4 text-sm">
          {item.manufacturerOrigin && item.manufacturerOrigin.length > 0 && (
            <div>
              <span className="text-muted-foreground block text-xs mb-1.5">Nhà sản xuất / Xuất xứ:</span>
              <div className="flex flex-wrap gap-1.5">
                {item.manufacturerOrigin.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-slate-50">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {item.importerRegistrant && item.importerRegistrant.length > 0 && (
            <div className="border-t pt-4">
              <span className="text-muted-foreground block text-xs mb-1.5">Nhà nhập khẩu / Đăng ký:</span>
              <div className="flex flex-wrap gap-1.5">
                {item.importerRegistrant.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-slate-50">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {item.distributor && item.distributor.length > 0 && (
            <div className="border-t pt-4">
              <span className="text-muted-foreground block text-xs mb-1.5">Nhà phân phối chính:</span>
              <div className="flex flex-wrap gap-1.5">
                {item.distributor.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-slate-50">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <DetailRow label="Giá tham khảo trên thị trường" value={item.referencePrice} />
            {item.packagingSpecs && item.packagingSpecs.length > 0 && (
              <div>
                <span className="text-muted-foreground block text-xs mb-1.5">Quy cách bao bì máy:</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.packagingSpecs.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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
