import { useRoute, useLocation } from "wouter";
import {
  AdminLayout,
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@tankhang1/eco-shared-ui";
import {
  ChevronLeft,
  Edit,
  Wrench,
  Building2,
  FileText,
  CalendarDays,
  CheckCircle2,
  TimerReset,
  AlertTriangle,
  History,
  Info,
  Activity,
} from "lucide-react";
import { initialEquipments } from "./constants";

const EquipmentDetailPage = () => {
  const [, params] = useRoute("/equipment/:id");
  const [, setLocation] = useLocation();
  const id = params?.id ? Number(params.id) : 0;
  const item = initialEquipments.find((p) => p.id === id);

  if (!item) {
    return (
      <AdminLayout title="Chi tiết thiết bị">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin thiết bị.
          </p>
          <Button onClick={() => setLocation("/equipment")}>
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  // Mock Suppliers
  const itemSuppliers = [
    {
      name: "Công ty Kubota Việt Nam",
      quantity: "1",
      unit: "Chiếc",
      warranty: "24 tháng",
    },
  ];

  // Mock Usage History
  const usageHistory = [
    {
      id: 1,
      date: "2024-01-20",
      activity: "Cày đất ruộng lúa khu A",
      operator: "Nguyễn Văn A",
      duration: "4 giờ",
      status: "completed",
    },
    {
      id: 2,
      date: "2024-01-18",
      activity: "Vận chuyển vật tư",
      operator: "Trần Văn B",
      duration: "2 giờ",
      status: "completed",
    },
    {
      id: 3,
      date: "2024-01-15",
      activity: "Cày đất ruộng hoa màu",
      operator: "Nguyễn Văn A",
      duration: "5 giờ",
      status: "completed",
    },
  ];

  // Mock Maintenance History
  const maintenanceHistory = [
    {
      id: 1,
      date: "2023-12-25",
      type: "Bảo dưỡng định kỳ",
      description: "Thay nhớt, kiểm tra lọc gió",
      technician: "Kỹ thuật viên hãng",
      cost: "1.500.000 VNĐ",
      nextDate: "2024-03-25",
    },
    {
      id: 2,
      date: "2023-11-20",
      type: "Sửa chữa nhỏ",
      description: "Thay lưỡi cày bị mòn",
      technician: "Nguyễn Văn A",
      cost: "500.000 VNĐ",
      nextDate: null,
    },
  ];

  return (
    <AdminLayout
      title="Chi tiết thiết bị"
      description={`Thông tin và lịch sử bảo dưỡng của ${item.name}`}
      actions={
        <Button onClick={() => setLocation(`/equipment/${id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </Button>
      }
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/equipment")}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <Card className="overflow-hidden border-none shadow-md bg-white">
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm border p-2 flex items-center justify-center shrink-0">
                <Wrench className="w-12 h-12 text-slate-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {item.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
                      <span className="bg-white px-2 py-0.5 rounded border font-mono text-xs font-semibold">
                        {item.code}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        Ngày nhập: {item.createdAt}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      item.status === "active"
                        ? "default"
                        : item.status === "maintenance"
                          ? "destructive"
                          : "secondary"
                    }
                    className="capitalize"
                  >
                    {item.status === "active"
                      ? "Hoạt động tốt"
                      : item.status === "maintenance"
                        ? "Đang bảo trì"
                        : "Ngừng sử dụng"}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge
                    variant="outline"
                    className="bg-white/50 border-blue-200 text-blue-800"
                  >
                    {item.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-white/50 px-2 py-0.5 rounded border border-slate-200">
                    <TimerReset className="w-3 h-3" />
                    Bảo dưỡng: {item.maintainanceInterval}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Details & History Tabs */}
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="info">Thông tin</TabsTrigger>
              <TabsTrigger value="history">Lịch sử dùng</TabsTrigger>
              <TabsTrigger value="maintenance">Bảo trì</TabsTrigger>
              <TabsTrigger value="docs">Tài liệu</TabsTrigger>
            </TabsList>

            {/* Tab: Info */}
            <TabsContent value="info" className="mt-6 space-y-6">
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
            </TabsContent>

            {/* Tab: Usage History */}
            <TabsContent value="history" className="mt-6">
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
                              <Building2 className="w-3 h-3" />{" "}
                              {/* Using Building2 as placeholder for user icon if needed, or just text */}
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
            </TabsContent>

            {/* Tab: Maintenance History */}
            <TabsContent value="maintenance" className="mt-6">
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
                            <h4 className="font-bold text-slate-900">
                              {maint.type}
                            </h4>
                            <p className="text-sm text-slate-600 mt-1">
                              {maint.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <span>Thực hiện: {maint.technician}</span>
                              {maint.nextDate && (
                                <span>• Lần tới: {maint.nextDate}</span>
                              )}
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
            </TabsContent>

            {/* Tab: Documents */}
            <TabsContent value="docs" className="mt-6">
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
                          HUONG_DAN_SU_DUNG_{item.code}.pdf
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
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Sidebar Info */}
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
                    <span>
                      Số lượng: {sup.quantity} {sup.unit}
                    </span>
                    <span className="font-medium text-emerald-600">
                      BH: {sup.warranty}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
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
      </div>
    </AdminLayout>
  );
};

export default EquipmentDetailPage;
