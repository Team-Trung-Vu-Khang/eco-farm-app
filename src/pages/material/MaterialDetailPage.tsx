import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Edit,
  Image as ImageIcon,
  Info,
  Package,
  Tags,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import useMaterialStore from "../../stores/useMaterialStore";
import { mockMaterialSuppliers } from "./data/constants";

const MaterialDetailPage = () => {
  const [, params] = useRoute("/material/:id");
  const [, setLocation] = useLocation();
  const id = params?.id ? Number(params.id) : 0;

  // Zustand store
  const getMaterialById = useMaterialStore((state) => state.getMaterialById);
  const item = getMaterialById(id);

  if (!item) {
    return (
      <AdminLayout title="Chi tiết vật tư">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin vật tư.
          </p>
          <Button onClick={() => setLocation("/material")}>
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Chi tiết vật tư"
      description={`Thông tin chi tiết cho ${item.name}`}
      actions={
        <Button onClick={() => setLocation(`/material/${id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </Button>
      }
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/material")}
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
            <div className="bg-linear-to-r from-orange-50 to-amber-50 p-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm border p-2 flex items-center justify-center shrink-0">
                <ImageIcon className="w-12 h-12 text-slate-300" />
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
                        Ngày tạo: {item.createdAt}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={item.status === "active" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {item.status === "active"
                      ? "Đang hoạt động"
                      : "Ngừng hoạt động"}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge
                    variant="outline"
                    className="bg-white/50 border-orange-200 text-orange-800"
                  >
                    {item.type}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Details Tabs/Sections */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Mô tả & Đặc điểm
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Mô tả chi tiết
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm leading-relaxed border border-slate-100 min-h-[100px]">
                    {item.description ||
                      "Chưa có mô tả chi tiết cho vật tư này."}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Nhà cung cấp ({mockMaterialSuppliers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid gap-4">
                {mockMaterialSuppliers.map((sup, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm text-slate-900">
                          {sup.name}
                        </h5>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded">
                            Đơn vị
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {sup.quantity} {sup.unit}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {sup.packaging}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="space-y-6">
          {/* Metadata/Keywords */}
          <Card>
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Tags className="w-4 h-4 text-slate-500" />
                Phân loại
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-normal">
                  #TietKiem
                </Badge>
                <Badge variant="secondary" className="font-normal">
                  #BenBi
                </Badge>
                <Badge variant="secondary" className="font-normal">
                  #ChatLuongCao
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Kiểm kho nhanh
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Package className="w-4 h-4 mr-2" />
              Lịch sử nhập xuất
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MaterialDetailPage;
