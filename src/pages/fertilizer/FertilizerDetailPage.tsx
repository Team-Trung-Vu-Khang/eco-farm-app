import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Droplets,
  Edit,
  FileText,
  FlaskConical,
  HeartPulse,
  Image as ImageIcon,
  Info,
  Leaf,
  Package,
  Shield,
  ShieldAlert,
  Tags,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import useFertilizerStore from "../../stores/useFertilizerStore";
import {
  originOptions,
  applicationStageOptions,
  physicalFormOptions,
  nutritionalContentOptions,
  suppliers,
} from "./data/constants";

const STANDARDS_META: Record<
  string,
  { emoji: string; color: string; desc: string }
> = {
  "VietGAP": {
    emoji: "🇻🇳",
    color: "bg-red-50 border-red-200 text-red-800",
    desc: "Thực hành nông nghiệp tốt Việt Nam",
  },
  "GlobalG.A.P": {
    emoji: "🌍",
    color: "bg-green-50 border-green-200 text-green-800",
    desc: "Tiêu chuẩn toàn cầu về an toàn thực phẩm",
  },
  "Organic (hữu cơ)": {
    emoji: "🌿",
    color: "bg-emerald-50 border-emerald-200 text-emerald-800",
    desc: "Không dùng hóa chất tổng hợp",
  },
  "EU MRL (Tiêu chuẩn dư lượng EU)": {
    emoji: "🇪🇺",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    desc: "Giới hạn dư lượng thuốc/phân thị trường EU",
  },
  "FDA (Mỹ)": {
    emoji: "🇺🇸",
    color: "bg-indigo-50 border-indigo-200 text-indigo-800",
    desc: "Tiêu chuẩn an toàn thực phẩm Hoa Kỳ",
  },
  "HACCP": {
    emoji: "🔬",
    color: "bg-purple-50 border-purple-200 text-purple-800",
    desc: "Phân tích mối nguy & kiểm soát điểm tới hạn",
  },
  "ISO 22000": {
    emoji: "📋",
    color: "bg-slate-50 border-slate-200 text-slate-800",
    desc: "Hệ thống quản lý an toàn thực phẩm ISO",
  },
};

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </h4>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

const FertilizerDetailPage = () => {
  const [, params] = useRoute("/cultivation-material/fertilizer/:id");
  const [, setLocation] = useLocation();
  const id = params?.id ? Number(params.id) : 0;

  const getFertilizerById = useFertilizerStore(
    (state) => state.getFertilizerById,
  );
  const item = getFertilizerById(id);

  if (!item) {
    return (
      <PageWrapper title="Chi tiết phân bón" description="Đang tải thông tin...">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin phân bón.
          </p>
          <Button onClick={() => setLocation("/cultivation-material/fertilizer")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Chi tiết phân bón"
      description={`Thông tin chi tiết sản phẩm ${item.name}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/cultivation-material/fertilizer")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Button onClick={() => setLocation(`/cultivation-material/fertilizer/${id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Left Column: Main cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card className="overflow-hidden border-none shadow-md bg-white">
            <div className="bg-linear-to-r from-green-50/50 to-emerald-50/50 p-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm border p-2 flex items-center justify-center shrink-0">
                {item.originId === "organic" ? (
                  <Leaf className="w-12 h-12 text-green-500" />
                ) : item.originId === "biological" ? (
                  <FlaskConical className="w-12 h-12 text-purple-500" />
                ) : (
                  <Droplets className="w-12 h-12 text-blue-500" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{item.name}</h2>
                    <div className="flex items-center gap-3 mt-1.5 text-sm text-slate-600">
                      <span className="bg-white px-2 py-0.5 rounded border font-mono text-xs font-semibold">
                        {item.code}
                      </span>
                      <span className="flex items-center gap-1 text-xs">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                        Ngày tạo: {item.createdAt}
                      </span>
                    </div>
                  </div>
                  <Badge variant={item.status === "active" ? "default" : "secondary"}>
                    {item.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </Badge>
                </div>

                {item.description && (
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.hashtags && item.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.hashtags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-slate-100 hover:bg-slate-200">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Section 1: Định danh & Phân loại */}
          <Card className="shadow-sm border-slate-100 bg-white">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <Info className="w-5 h-5 text-primary" />
                Thông tin định danh & Phân loại
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoRow label="Số đăng ký quyết định lưu hành" value={item.registrationNumber} />
                <InfoRow label="Tên khoa học / Tên kỹ thuật" value={item.scientificTechnicalName} />
                <InfoRow label="Nhóm phân bón (nguồn gốc)" value={item.fertilizerOriginGroup} />
                <InfoRow label="Thành phần dinh dưỡng chính" value={item.nutritionalComponents} />
                <InfoRow label="Dạng phân bón" value={item.fertilizerType} />
                <InfoRow label="Hình thái vật lý" value={item.physicalForm} />
                <InfoRow label="Cơ chế tác động (MoA)" value={item.moaGroup} />
                <InfoRow label="Tỷ lệ N-P-K" value={item.npkRatio} />
              </div>

              {item.mainIngredients && (
                <div className="border-t pt-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Thành phần chính chi tiết
                  </h4>
                  <div className="text-sm bg-slate-50 border rounded-lg p-3 whitespace-pre-line text-slate-700">
                    {item.mainIngredients}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Hướng dẫn sử dụng */}
          <Card className="shadow-sm border-slate-100 bg-white">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <Leaf className="w-5 h-5 text-primary" />
                Hướng dẫn & Đối tượng sử dụng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-5">
              {item.indications && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Công dụng / Chỉ định
                  </h4>
                  <p className="text-sm bg-slate-50 border rounded-lg p-3 text-slate-700">
                    {item.indications}
                  </p>
                </div>
              )}

              {item.targetCrops && item.targetCrops.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Cây trồng áp dụng
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.targetCrops.map((crop) => (
                      <Badge key={crop} variant="outline" className="text-xs border-green-200 bg-green-50/30 text-green-800">
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <InfoRow label="Giai đoạn tác động" value={item.applicationStage} />
              </div>

              {item.recommendedDosage && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Liều lượng khuyến cáo
                  </h4>
                  <p className="text-sm bg-slate-50 border rounded-lg p-3 whitespace-pre-line text-slate-700">
                    {item.recommendedDosage}
                  </p>
                </div>
              )}

              {item.applicationMethod && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Cách bón / Cách dùng
                  </h4>
                  <p className="text-sm bg-slate-50 border rounded-lg p-3 whitespace-pre-line text-slate-700">
                    {item.applicationMethod}
                  </p>
                </div>
              )}

              {item.usageNotes && (
                <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                    Lưu ý khi sử dụng
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed whitespace-pre-line">
                    {item.usageNotes}
                  </p>
                </div>
              )}

              {/* Technical Documents (PDF/Word) */}
              {item.documents && item.documents.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Tài liệu kỹ thuật đính kèm
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <FileText className="w-8 h-8 text-red-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{(doc.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Safety & Supply info */}
        <div className="space-y-6">
          {/* Card: Safety & Legal */}
          <Card className="shadow-sm border-slate-100 bg-white">
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                An toàn & Pháp lý
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-5">
              {item.toxicityInfo && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Độc tính
                  </h4>
                  <p className="text-sm bg-red-50/50 border border-red-100 rounded-lg p-3 text-red-900 text-xs">
                    {item.toxicityInfo}
                  </p>
                </div>
              )}

              {item.protectiveMeasures && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                    Biện pháp phòng hộ
                  </h4>
                  <p className="text-xs bg-blue-50/30 border border-blue-100 rounded-lg p-3 text-blue-900 whitespace-pre-line leading-relaxed">
                    {item.protectiveMeasures}
                  </p>
                </div>
              )}

              {item.firstAid && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <HeartPulse className="w-3.5 h-3.5 text-red-500" />
                    Sơ cứu khi ngộ độc
                  </h4>
                  <div
                    className="text-xs bg-slate-50 rounded-lg p-3 border leading-relaxed text-slate-700 editor-content-preview"
                    dangerouslySetInnerHTML={{ __html: item.firstAid }}
                  />
                </div>
              )}

              <Separator />

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  Tình trạng pháp lý
                </h4>
                <Badge variant="outline" className="bg-slate-50 border-slate-200">
                  {item.legalStatus || "Được phép lưu hành"}
                </Badge>
              </div>

              {item.standardsCompliance && item.standardsCompliance.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Tiêu chuẩn nông nghiệp đạt được
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.standardsCompliance.map((std) => {
                      const meta = STANDARDS_META[std];
                      return (
                        <div
                          key={std}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                            meta?.color ?? "bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <span>{meta?.emoji ?? "📄"}</span>
                          <span>{std}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card: Origin & Supply */}
          <Card className="shadow-sm border-slate-100 bg-white">
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                <Building2 className="w-4 h-4 text-primary" />
                Xuất xứ & Cung ứng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-5 text-sm">
              <InfoRow label="Nhà sản xuất / Xuất xứ" value={item.manufacturerOrigin} />
              <InfoRow label="Nhà nhập khẩu / Đăng ký" value={item.importerRegistrant} />
              <InfoRow label="Nhà phân phối" value={item.distributor} />
              <InfoRow label="Giá bán tham khảo" value={item.referencePrice} />

              {item.packagingSpecs && item.packagingSpecs.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Quy cách đóng gói
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.packagingSpecs.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs bg-slate-50">
                        <Package className="w-3 h-3 mr-1" />
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Lô kho */}
              {item.supplierDetails && item.supplierDetails.length > 0 && (
                <div className="border-t pt-4 space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    Lô hàng tồn kho ban đầu
                  </h4>
                  <div className="space-y-1.5">
                    {item.supplierDetails.map((supDetail, idx) => {
                      const sup = suppliers.find((s) => s.id === supDetail.supplierId);
                      return (
                        <div key={idx} className="flex justify-between p-2 rounded-lg bg-slate-50 text-xs border">
                          <span className="font-semibold text-slate-700 truncate mr-2">{sup?.name || supDetail.supplierId}</span>
                          <span className="text-muted-foreground shrink-0">{supDetail.quantity} {supDetail.unit} ({supDetail.packaging})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default FertilizerDetailPage;
