import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Edit,
  FileText,
  FlaskConical,
  Image as ImageIcon,
  Info,
  Package,
  ShieldCheck,
  Tags,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import usePesticideStore from "../../stores/usePesticideStore";

const PesticideDetailPage = () => {
  const [, params] = useRoute("/pesticide/:id");
  const [, setLocation] = useLocation();
  const id = params?.id ? Number(params.id) : 0;

  // Zustand store
  const getPesticideById = usePesticideStore((state) => state.getPesticideById);
  const item = getPesticideById(id);

  if (!item) {
    return (
      <AdminLayout isDev={true} title="Chi tiết thuốc BVTV">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin thuốc BVTV.
          </p>
          <Button onClick={() => setLocation("/pesticide")}>
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      isDev={true}
      title="Chi tiết thuốc BVTV"
      description={`Thông tin chi tiết cho sản phẩm ${item.name}`}
      actions={
        <Button onClick={() => setLocation(`/pesticide/${id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </Button>
      }
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/pesticide")}
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
            <div className="bg-linear-to-r from-green-50 to-emerald-50 p-6 flex flex-col md:flex-row gap-6 items-start">
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
                  <Badge variant="outline" className="bg-white/50">
                    {item.group}
                  </Badge>
                  <Badge variant="outline" className="bg-white/50">
                    {item.form}
                  </Badge>
                  <Badge variant="outline" className="bg-white/50">
                    {item.origin}
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
                  Thông tin chi tiết
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Cơ chế tác động
                    </h4>
                    <div className="flex items-center gap-2 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      {item.actionType}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Dạng thuốc
                    </h4>
                    <div className="flex items-center gap-2 font-medium">
                      <FlaskConical className="w-4 h-4 text-blue-600" />
                      {item.form}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Thành phần hoạt chất
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm leading-relaxed border border-slate-100">
                    {item.activeIngredient}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Công dụng & Hướng dẫn sử dụng
                  </h4>
                  <div className="prose prose-sm max-w-none text-slate-700">
                    <p>
                      Đặc trị các loại sâu bệnh hại trên lúa và rau màu. Hiệu
                      quả cao, kéo dài.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Pha 10-15ml cho bình 16 lít nước.</li>
                      <li>Phun ướt đều tán lá cây trồng.</li>
                      <li>Thời gian cách ly: 7 ngày.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                        Tai_lieu_ky_thuat_{item.code}.pdf
                      </div>
                      <div className="text-xs text-muted-foreground">
                        PDF • 2.4 MB • Cập nhật 2 ngày trước
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Tải xuống
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="space-y-6">
          {/* Supplier Info */}
          <Card>
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                Thông tin cung ứng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Nhà cung cấp chính
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {item.id % 2 === 0 ? "HP" : "VT"}
                  </div>
                  <div className="text-sm font-medium">
                    {item.id % 2 === 0
                      ? "Đại lý VTNN Hòa Phát"
                      : "Công ty CP BVTV 1"}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Quy cách đóng gói
                </h4>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-amber-600" />
                  <span>Thùng 24 chai (500ml/chai)</span>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  #HieuQuaCao
                </Badge>
                <Badge variant="secondary" className="font-normal">
                  #AnToan
                </Badge>
                <Badge variant="secondary" className="font-normal">
                  #PhoRong
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Đánh dấu ưu tiên
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Ngừng kinh doanh
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PesticideDetailPage;
