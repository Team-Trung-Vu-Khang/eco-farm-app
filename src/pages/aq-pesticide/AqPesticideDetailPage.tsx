import PageWrapper from "@/components/PageWrapper";
import { formatPackagingVariantText } from "@/features/farm-supply";
import { useFarmSupplyDetailHook } from "@/features/farm-supply/hooks/useFarmSupplyDetailHook";
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
  ChevronLeft,
  DollarSign,
  Edit,
  HeartPulse,
  Image as ImageIcon,
  Info,
  Leaf,
  Package,
  Shield,
  ShieldAlert,
  Tags,
  Waves,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { toxicityLevels } from "../pesticide/data/constants";

const toxicityColorMap: Record<string, string> = {
  Ia: "bg-red-100 text-red-700 border-red-300",
  Ib: "bg-orange-100 text-orange-700 border-orange-300",
  II: "bg-yellow-100 text-yellow-700 border-yellow-300",
  III: "bg-blue-100 text-blue-700 border-blue-300",
  U: "bg-green-100 text-green-700 border-green-300",
};

const formatPrice = (price?: string | number | null) => {
  if (!price) return "";
  const str = price.toString().trim();
  if (str.toLowerCase().includes("đ") || str.toLowerCase().includes("vnd"))
    return str;
  let s = str.replace(/\s+/g, "").replace(/\./g, "").replace(/,/g, ".");
  const matched = s.match(/[-+]?[0-9]*\.?[0-9]+/);
  if (!matched) return str;
  const num = parseFloat(matched[0]);
  if (isNaN(num)) return str;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </h4>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

const AqPesticideDetailPage = () => {
  const [matchFarm, paramsFarm] = useRoute(
    "/aquaculture-material/pesticide/:id",
  );
  const [matchAdmin, paramsAdmin] = useRoute("/admin/aq-pesticide/:id");
  const params = paramsFarm || paramsAdmin;
  const matchAdminActive = !!matchAdmin;
  const [, setLocation] = useLocation();
  const id = params?.id ? Number(params.id) : 0;
  const { item, loading } = useFarmSupplyDetailHook("medicine", id);

  if (loading) {
    return (
      <PageWrapper title="Chi tiết thuốc thủy sản">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground animate-pulse">
            Đang tải dữ liệu...
          </p>
        </div>
      </PageWrapper>
    );
  }

  if (!item) {
    return (
      <PageWrapper title="Chi tiết thuốc thủy sản">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin thuốc.
          </p>
          <Button
            onClick={() =>
              setLocation(
                matchAdminActive
                  ? "/admin/aq-pesticide"
                  : "/aquaculture-material/pesticide",
              )
            }
          >
            Quay lại danh sách
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const toxLabel = toxicityLevels.find((t) => t.value === item.toxicityLevel);

  const getControlLevelColor = (val: string) => {
    if (val.includes("OTC") || val.includes("An toàn")) {
      return "bg-green-100 text-green-700 border-green-300";
    }
    if (
      val.includes("kê đơn") ||
      val.includes("cách ly") ||
      val.includes("WITHDRAWAL")
    ) {
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
    if (
      val.includes("cấm") ||
      val.includes("hạn chế") ||
      val.includes("RESTRICTED") ||
      val.includes("BANNED")
    ) {
      return "bg-red-100 text-red-700 border-red-300";
    }
    return "bg-slate-50 border-slate-200 text-slate-600";
  };

  return (
    <PageWrapper
      title="Chi tiết thuốc thủy sản"
      description={`Thông tin chi tiết cho sản phẩm ${item.name}`}
      actions={
        (item.source === "OWNER" || matchAdminActive) && (
          <Button
            onClick={() =>
              setLocation(
                matchAdminActive
                  ? `/admin/aq-pesticide/${id}/edit`
                  : `/aquaculture-material/pesticide/${id}/edit`,
              )
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        )
      }
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setLocation(
              matchAdminActive
                ? "/admin/aq-pesticide"
                : "/aquaculture-material/pesticide",
            )
          }
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card className="overflow-hidden border-none shadow-md bg-white">
            <div className="bg-linear-to-r from-cyan-50 to-teal-50 p-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm border p-2 flex items-center justify-center shrink-0">
                {item?.metadataJson?.imageUrl ? (
                  <img
                    className="w-full h-full"
                    src={item.metadataJson.imageUrl}
                  />
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
                      {item.registrationNumber && (
                        <span className="text-xs text-muted-foreground">
                          SĐK: {item.registrationNumber}
                        </span>
                      )}
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
                  {item.form && (
                    <Badge variant="outline" className="bg-white/50">
                      {item.form}
                    </Badge>
                  )}
                  {item.toxicityLevel && (
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold border ${getControlLevelColor(item.toxicityLevel)}`}
                    >
                      {item.toxicityLevel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Định danh */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Thông tin định danh & phân loại
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Tên hoạt chất" value={item.activeIngredient} />
                <InfoRow
                  label="Hàm lượng / Nồng độ"
                  value={item.concentration}
                />
                <InfoRow label="Dạng bào chế" value={item.form} />
                <InfoRow label="Cách dùng / Xâm nhập" value={item.actionType} />
                {item.toxicityLevel && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Mức
                      độ kiểm soát & dư lượng
                    </h4>
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold border ${getControlLevelColor(item.toxicityLevel)}`}
                    >
                      {item.toxicityLevel}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sử dụng */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Waves className="w-5 h-5 text-teal-500" />
                Thông tin sử dụng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              {item.indications && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Công dụng / Chỉ định
                  </h4>
                  <p className="text-sm bg-slate-50 rounded-lg p-3 border">
                    {item.indications}
                  </p>
                </div>
              )}
              {item.targetEntities && item.targetEntities.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    <Leaf className="w-3.5 h-3.5 inline mr-1" />
                    Loài thủy sản áp dụng
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.targetEntities.map((e) => (
                      <Badge
                        key={e}
                        variant="outline"
                        className="text-xs border-teal-300 text-teal-700"
                      >
                        {e}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoRow label="Liều lượng" value={item.recommendedDosage} />
                <InfoRow label="Cách dùng" value={item.applicationMethod} />
                {item.phi != null && (
                  <InfoRow
                    label="Ngưng thuốc trước thu hoạch"
                    value={`${item.phi} ngày`}
                  />
                )}
                {item.maxUsage != null && (
                  <InfoRow
                    label="Số lần tối đa"
                    value={`${item.maxUsage} lần/chu kỳ nuôi`}
                  />
                )}
                <InfoRow label="Hạn sử dụng" value={item.shelfLife} />
              </div>
              {item.usageNotes && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Lưu ý
                  </h4>
                  <p className="text-sm bg-amber-50 border border-amber-100 rounded-lg p-3 text-amber-800">
                    {item.usageNotes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* An toàn */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                An toàn & Pháp lý
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              {item.toxicityInfo && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Độc
                    tính
                  </h4>
                  <p className="text-sm bg-red-50 border border-red-100 rounded-lg p-3 text-red-800">
                    {item.toxicityInfo}
                  </p>
                </div>
              )}
              {item.protectiveMeasures && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-blue-500" /> Biện pháp
                    phòng hộ
                  </h4>
                  <p className="text-sm bg-blue-50 border border-blue-100 rounded-lg p-3 text-blue-800 whitespace-pre-line">
                    {item.protectiveMeasures}
                  </p>
                </div>
              )}
              {item.firstAid && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <HeartPulse className="w-3.5 h-3.5 text-red-500" /> Sơ cứu
                    khi ngộ độc
                  </h4>
                  <div
                    className="text-sm bg-slate-50 rounded-lg p-3 border leading-relaxed text-slate-700"
                    dangerouslySetInnerHTML={{ __html: item.firstAid }}
                  />
                </div>
              )}
              <Separator />
              {item.legalStatus && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-primary" /> Tình trạng
                    pháp lý
                  </h4>
                  <p className="text-sm font-medium">{item.legalStatus}</p>
                </div>
              )}
              {item.standardsCompliance &&
                item.standardsCompliance.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Tiêu chuẩn đáp ứng
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {item.standardsCompliance.map((std) => (
                        <Badge
                          key={std}
                          variant="secondary"
                          className="text-xs"
                        >
                          {std}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b bg-teal-50/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                Xuất xứ & Cung ứng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <InfoRow
                label="Nhà sản xuất / Xuất xứ"
                value={item.manufacturerOrganization?.name ?? item.origin}
              />
              <InfoRow
                label="Nhà nhập khẩu / Đăng ký"
                value={item.importerOrganization?.name}
              />
              <InfoRow
                label="Nhà phân phối"
                value={item.distributorOrganization?.name}
              />
              {item.referencePrice && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Giá
                    tham khảo
                  </h4>
                  <p className="text-sm font-semibold text-emerald-700">
                    {formatPrice(item.referencePrice)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {((item.packagingVariants && item.packagingVariants.length > 0) ||
            (item.packagingSpecs && item.packagingSpecs.length > 0)) && (
            <Card>
              <CardHeader className="pb-3 border-b bg-teal-50/50">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-500" />
                  Cấu hình Đơn vị / Quy cách đóng gói
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-1.5">
                  {item.packagingVariants && item.packagingVariants.length > 0
                    ? item.packagingVariants.map((v, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Package className="w-3 h-3 mr-1" />
                          {formatPackagingVariantText(v)}
                        </Badge>
                      ))
                    : item.packagingSpecs?.map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          <Package className="w-3 h-3 mr-1" />
                          {spec}
                        </Badge>
                      ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3 border-b bg-teal-50/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Tags className="w-4 h-4 text-slate-500" />
                Phân loại
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-2">
                {item.hashtags && item.hashtags.length > 0 ? (
                  item.hashtags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="font-normal"
                    >
                      #{tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Chưa có nhãn phân loại
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* <div className="grid grid-cols-1 gap-2">
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
          </div> */}
        </div>
      </div>
    </PageWrapper>
  );
};

export default AqPesticideDetailPage;
