import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Droplets,
  Edit,
  FileText,
  FlaskConical,
  Image as ImageIcon,
  Info,
  Leaf,
  Package,
  Tags,
  Truck,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import useFertilizerStore from "../../stores/useFertilizerStore";
import {
  originOptions,
  applicationStageOptions,
  physicalFormOptions,
  nutritionalContentOptions,
  suppliers
} from "./data/constants";

// Auto-generated mock data for detail page (data that doesn't exist in the store)
const fertilizerDetailExtras: Record<
  number,
  {
    manufacturer: string;
    origin: string;
    registrationNo: string;
    packaging: string;
    shelfLife: string;
    storageCondition: string;
    usage: string;
    targetCrops: string[];
    hashtags: string[];
    supplierDetails: {
      supplierId: string;
      quantity: string;
      unit: string;
      packaging: string;
    }[];
    documents: { name: string; size: string; updatedAt: string }[];
    safetyWarnings: string[];
  }
> = {
  1: {
    manufacturer: "Công ty CP Phân Bón Bình Điền",
    origin: "Việt Nam",
    registrationNo: "BVTV-PB-001-2024",
    packaging: "Bao 50kg",
    shelfLife: "24 tháng",
    storageCondition:
      "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp",
    usage:
      "Bón lót hoặc bón thúc. Liều lượng: 200-300kg/ha tùy loại cây trồng. Rải đều quanh gốc cây, cách gốc 15-20cm.",
    targetCrops: ["Lúa", "Ngô", "Rau màu", "Cây ăn quả"],
    hashtags: ["HieuQuaCao", "TangTruongNhanh", "CayCongNghiep"],
    supplierDetails: [
      {
        supplierId: "sup1",
        quantity: "500",
        unit: "Bao",
        packaging: "Bao 50kg",
      },
      {
        supplierId: "sup2",
        quantity: "200",
        unit: "Bao",
        packaging: "Bao 25kg",
      },
    ],
    documents: [
      {
        name: "Tai_lieu_ky_thuat_PB001.pdf",
        size: "2.4 MB",
        updatedAt: "2 ngày trước",
      },
      {
        name: "Phieu_kiem_dinh_chat_luong.pdf",
        size: "1.1 MB",
        updatedAt: "1 tuần trước",
      },
    ],
    safetyWarnings: [
      "Đeo khẩu trang và găng tay khi sử dụng",
      "Rửa tay sạch sau khi tiếp xúc",
      "Không để trẻ em tiếp xúc",
    ],
  },
  2: {
    manufacturer: "Công ty CP Sông Gianh",
    origin: "Việt Nam",
    registrationNo: "BVTV-PB-002-2024",
    packaging: "Bao 25kg",
    shelfLife: "18 tháng",
    storageCondition: "Bảo quản nơi khô ráo, tránh ẩm ướt",
    usage:
      "Bón lót trước khi gieo trồng. Liều lượng: 1-2 tấn/ha. Trộn đều vào đất canh tác.",
    targetCrops: ["Rau hữu cơ", "Cây ăn quả", "Cây công nghiệp"],
    hashtags: ["HuuCo", "CaiTaoDat", "AnToanSinhHoc"],
    supplierDetails: [
      {
        supplierId: "sup3",
        quantity: "300",
        unit: "Bao",
        packaging: "Bao 25kg",
      },
    ],
    documents: [
      {
        name: "Tai_lieu_ky_thuat_PB002.pdf",
        size: "1.8 MB",
        updatedAt: "5 ngày trước",
      },
    ],
    safetyWarnings: ["Sản phẩm an toàn, không gây hại cho người và môi trường"],
  },
};

// Generate default extras for items not in the map
function getExtras(id: number) {
  if (fertilizerDetailExtras[id]) return fertilizerDetailExtras[id];
  return {
    manufacturer: "Nhà sản xuất chung",
    origin: "Việt Nam",
    registrationNo: `BVTV-PB-${String(id).padStart(3, "0")}-2024`,
    packaging: "Bao 50kg",
    shelfLife: "24 tháng",
    storageCondition:
      "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp",
    usage:
      "Bón lót hoặc bón thúc theo hướng dẫn kỹ thuật. Liều lượng tùy thuộc loại cây trồng.",
    targetCrops: ["Lúa", "Rau màu", "Cây ăn quả"],
    hashtags: ["HieuQuaCao", "TangTruongNhanh"],
    supplierDetails: [
      {
        supplierId: "sup1",
        quantity: "100",
        unit: "Bao",
        packaging: "Bao 50kg",
      },
    ],
    documents: [
      {
        name: `Tai_lieu_ky_thuat_PB${String(id).padStart(3, "0")}.pdf`,
        size: "2.0 MB",
        updatedAt: "3 ngày trước",
      },
    ],
    safetyWarnings: [
      "Đeo khẩu trang khi sử dụng",
      "Rửa tay sạch sau khi tiếp xúc",
    ],
  };
}

const FertilizerDetailPage = () => {
  const [, params] = useRoute("/fertilizer/:id");
  const [, setLocation] = useLocation();
  const id = params?.id ? Number(params.id) : 0;

  const getFertilizerById = useFertilizerStore(
    (state) => state.getFertilizerById,
  );
  const item = getFertilizerById(id);

  if (!item) {
    return (
      <PageWrapper
        title="Chi tiết phân bón"
        description="Đang tải thông tin..."
      >
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin phân bón.
          </p>
          <Button onClick={() => setLocation("/fertilizer")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const extras = getExtras(id);

  return (
    <PageWrapper
      title="Chi tiết phân bón"
      description={`Thông tin chi tiết sản phẩm ${item.name}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/fertilizer")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Button onClick={() => setLocation(`/fertilizer/${id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card className="overflow-hidden border-none shadow-md bg-white">
            <div className="bg-linear-to-r from-green-50 to-emerald-50 p-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm border p-2 flex items-center justify-center shrink-0">
                {item.originId === "organic" ? (
                  <Leaf className="w-12 h-12 text-green-400" />
                ) : item.originId === "biological" ? (
                  <FlaskConical className="w-12 h-12 text-purple-400" />
                ) : item.physicalFormId === "foliar_application" ? (
                  <Droplets className="w-12 h-12 text-blue-400" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-slate-300" />
                )}
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
                    {originOptions.find(o => o.id === item.originId)?.label || "N/A"}
                  </Badge>
                  <Badge variant="outline" className="bg-white/50">
                    {applicationStageOptions.find(o => o.id === item.applicationStageId)?.label || "N/A"}
                  </Badge>
                  <Badge variant="outline" className="bg-white/50">
                    {physicalFormOptions.find(o => o.id === item.physicalFormId)?.label || "N/A"}
                  </Badge>
                  <Badge variant="outline" className="bg-white/50">
                    {extras.origin}
                  </Badge>
                  <Badge variant="outline" className="bg-white/50">
                    {extras.packaging}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
              <TabsTrigger
                value="info"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Thông tin chi tiết
              </TabsTrigger>
              <TabsTrigger
                value="usage"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Hướng dẫn sử dụng
              </TabsTrigger>
              <TabsTrigger
                value="suppliers"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Nhà cung cấp ({extras.supplierDetails.length})
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Tài liệu ({extras.documents.length})
              </TabsTrigger>
            </TabsList>

            <div className="pt-6">
              {/* Tab: Info */}
              <TabsContent value="info" className="m-0">
                <Card>
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      Thông tin sản phẩm
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Nguồn gốc
                        </h4>
                        <div className="flex items-center gap-2 font-medium">
                          <Leaf className="w-4 h-4 text-emerald-600" />
                          {originOptions.find(o => o.id === item.originId)?.label || "N/A"}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Giai đoạn & Hình thái
                        </h4>
                        <div className="flex items-center gap-2 font-medium">
                          <Droplets className="w-4 h-4 text-blue-600" />
                          {applicationStageOptions.find(o => o.id === item.applicationStageId)?.label} - {physicalFormOptions.find(o => o.id === item.physicalFormId)?.label}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Thành phần dinh dưỡng
                        </h4>
                        <div className="flex items-center gap-2 font-medium">
                          <Info className="w-4 h-4 text-indigo-600" />
                          {nutritionalContentOptions.find(o => o.id === item.nutritionalContentId)?.label || "N/A"}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Nhà sản xuất
                        </h4>
                        <div className="flex items-center gap-2 font-medium">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          {extras.manufacturer}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Số đăng ký
                        </h4>
                        <div className="font-medium font-mono text-sm">
                          {extras.registrationNo}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Hạn sử dụng
                        </h4>
                        <div className="font-medium">{extras.shelfLife}</div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Hàm lượng dinh dưỡng
                      </h4>
                      <div className="bg-slate-50 p-4 rounded-lg text-sm leading-relaxed border border-slate-100">
                        {item.nutrientContent}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Mô tả
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Điều kiện bảo quản
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {extras.storageCondition}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Cây trồng phù hợp
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {extras.targetCrops.map((crop) => (
                          <Badge
                            key={crop}
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {crop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Usage */}
              <TabsContent value="usage" className="m-0 space-y-6">
                <Card>
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-primary" />
                      Hướng dẫn sử dụng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose prose-sm max-w-none text-slate-700">
                      <p>{extras.usage}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      Cảnh báo an toàn
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      {extras.safetyWarnings.map((warning, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-slate-700"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Suppliers */}
              <TabsContent value="suppliers" className="m-0">
                <Card>
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      Thông tin cung ứng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                    {extras.supplierDetails.map((detail, idx) => {
                      const sup = suppliers.find(
                        (s) => s.id === detail.supplierId,
                      );
                      return (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                              {sup?.name
                                .split(" ")
                                .map((w) => w[0])
                                .slice(0, 2)
                                .join("") || "NCC"}
                            </div>
                            <div>
                              <div className="font-medium text-sm text-slate-900">
                                {sup?.name || "Nhà cung cấp"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {sup?.type === "enterprise"
                                  ? "Doanh nghiệp"
                                  : "Nông hộ"}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0 flex items-center gap-2">
                            <Badge variant="outline">
                              {detail.quantity} {detail.unit}
                            </Badge>
                            <Badge variant="secondary">
                              {detail.packaging}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Documents */}
              <TabsContent value="documents" className="m-0">
                <Card>
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Tài liệu kỹ thuật
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                    {extras.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium group-hover:text-primary transition-colors text-sm">
                              {doc.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              PDF • {doc.size} • Cập nhật {doc.updatedAt}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Tải xuống
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          {/* Quick Summary */}
          <Card>
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-500" />
                Tóm tắt sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã sản phẩm</span>
                <span className="font-mono font-semibold">{item.code}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phân loại</span>
                <span className="font-medium text-right">
                  {originOptions.find(o => o.id === item.originId)?.label || "N/A"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Xuất xứ</span>
                <span className="font-medium">{extras.origin}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quy cách</span>
                <span className="font-medium">{extras.packaging}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hạn dùng</span>
                <span className="font-medium">{extras.shelfLife}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái</span>
                <Badge
                  variant={item.status === "active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {item.status === "active" ? "Hoạt động" : "Không hoạt động"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Tags className="w-4 h-4 text-slate-500" />
                Phân loại & Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-2">
                {extras.hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-normal">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setLocation(`/fertilizer/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa thông tin
            </Button>
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
    </PageWrapper>
  );
};

export default FertilizerDetailPage;
