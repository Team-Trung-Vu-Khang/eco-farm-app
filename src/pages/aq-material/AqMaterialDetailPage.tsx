import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Edit,
  Image as ImageIcon,
  Info,
  Package,
  Tags,
  Building2,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import useMaterialStore from "../../stores/useMaterialStore";
import { getMaterialGroupLabel } from "../material/data/constants";

const AqMaterialDetailPage = () => {
  const [, params] = useRoute("/aquaculture-material/material/:id");
  const [, setLocation] = useLocation();
  const id = params?.id ? Number(params.id) : 0;

  const getMaterialById = useMaterialStore((state) => state.getMaterialById);
  const item = getMaterialById(id);

  if (!item) {
    return (
      <PageWrapper title="Chi tiết vật tư thủy sản">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin vật tư.
          </p>
          <Button onClick={() => setLocation("/aquaculture-material/material")}>
            Quay lại danh sách
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Chi tiết vật tư thủy sản"
      description={`Thông tin chi tiết cho ${item.name}`}
      actions={
        <Button
          onClick={() =>
            setLocation(`/aquaculture-material/material/${id}/edit`)
          }
        >
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </Button>
      }
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/aquaculture-material/material")}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden border-none shadow-md bg-white">
            <div className="bg-linear-to-r from-teal-50 to-cyan-50 p-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm border p-2 flex items-center justify-center shrink-0">
                <ImageIcon className="w-12 h-12 text-slate-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{item.name}</h2>
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
                    {item.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Mô tả & Phân loại thuộc tính
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">Mức độ công nghệ:</span>
                    <span className="font-semibold text-slate-850 bg-slate-50 border px-2 py-1 rounded inline-block text-xs mt-1">
                      {getMaterialGroupLabel(item.technologyLevelId)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">Giai đoạn áp dụng:</span>
                    <span className="font-semibold text-slate-850 bg-slate-50 border px-2 py-1 rounded inline-block text-xs mt-1">
                      {getMaterialGroupLabel(item.valueChainId)}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Mô tả</h4>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm leading-relaxed border border-slate-100 min-h-[100px]">
                    {item.description || "Chưa có mô tả cho vật tư này."}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Xuất xứ & Đơn vị phân phối
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

                {item.packagingSpecs && item.packagingSpecs.length > 0 && (
                  <div className="border-t pt-4">
                    <span className="text-muted-foreground block text-xs mb-1.5">Quy cách đóng gói vật tư:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.packagingSpecs.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {(!item.manufacturerOrigin?.length &&
                  !item.importerRegistrant?.length &&
                  !item.distributor?.length &&
                  !item.packagingSpecs?.length) && (
                  <div className="text-center py-6 text-xs text-muted-foreground border border-dashed rounded-lg bg-slate-50">
                    Không cấu hình thông tin xuất xứ & phân phối
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="space-y-6">
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
    </PageWrapper>
  );
};

export default AqMaterialDetailPage;
