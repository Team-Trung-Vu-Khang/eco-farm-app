import PageWrapper from "@/components/PageWrapper";
import {
  formatPackagingVariantText,
  isBaseUnitOnlyVariant,
} from "@/features/farm-supply";
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
  Building2,
  ChevronLeft,
  Edit,
  FileText,
  FlaskConical,
  HeartPulse,
  Info,
  Leaf,
  Package,
  Shield,
  ShieldAlert,
  Tag,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { SUPPLY_TYPE } from "./data/constants";

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
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

const ByProductDetailPage = () => {
  const [matchFarm, paramsFarm] = useRoute(
    "/cultivation-material/byproduct/:id",
  );
  const [matchAdmin, paramsAdmin] = useRoute("/admin/byproduct/:id");
  const params = paramsFarm || paramsAdmin;
  const matchAdminActive = !!matchAdmin;
  const [, setLocation] = useLocation();
  const id = params?.id ? Number(params.id) : 0;
  const { item, loading } = useFarmSupplyDetailHook(SUPPLY_TYPE, id);

  if (loading) {
    return (
      <PageWrapper title="Chi tiết phụ phẩm">
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
      <PageWrapper
        title="Chi tiết phụ phẩm"
        description="Đang tải thông tin..."
      >
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin phụ phẩm.
          </p>
          <Button
            onClick={() =>
              setLocation(
                matchAdminActive
                  ? "/admin/byproduct"
                  : "/cultivation-material/byproduct",
              )
            }
          >
            Quay lại danh sách
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const profile = item.profile || {};
  const originGroups =
    item.classifications
      ?.filter((c: any) => c.classification === "origin")
      ?.map((c: any) => c.group?.name)
      ?.filter(Boolean) || [];

  const physicoGroups =
    item.classifications
      ?.filter((c: any) => c.classification === "physico_chemical")
      ?.map((c: any) => c.group?.name)
      ?.filter(Boolean) || [];

  const toxicityGroups =
    item.classifications
      ?.filter((c: any) => c.classification === "toxicity_regulation")
      ?.map((c: any) => c.group?.name)
      ?.filter(Boolean) || [];

  const certsList =
    item.certificates
      ?.map((c: any) => c.certificate?.name || c.name)
      ?.filter(Boolean) ||
    item.standardsCompliance ||
    [];

  const documents = profile.documents || item.documents || [];

  return (
    <PageWrapper
      title={item.name}
      description={`Mã phụ phẩm: ${item.code || item.sku}`}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setLocation(
                matchAdminActive
                  ? "/admin/byproduct"
                  : "/cultivation-material/byproduct",
              )
            }
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại
          </Button>
          {(matchAdminActive || item.source === "OWNER") && (
            <Button
              size="sm"
              onClick={() =>
                setLocation(
                  matchAdminActive
                    ? `/admin/byproduct/${id}/edit`
                    : `/cultivation-material/byproduct/${id}/edit`,
                )
              }
            >
              <Edit className="w-4 h-4 mr-1" /> Chỉnh sửa
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6 pb-12">
        {/* Banner tổng quan */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {item.imageUrl ? (
                <img
                  alt={item.name}
                  src={item.imageUrl}
                  className="w-32 h-32 rounded-xl object-cover border shrink-0"
                />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-slate-100 border flex items-center justify-center text-slate-400 shrink-0">
                  <Package className="w-12 h-12" />
                </div>
              )}

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {item.code || item.sku}
                  </Badge>
                  {item.source && (
                    <Badge
                      variant={
                        item.source === "MASTER" ? "secondary" : "default"
                      }
                    >
                      {item.source === "MASTER" ? "Hệ thống" : "Nội bộ"}
                    </Badge>
                  )}
                  <Badge
                    variant={item.status === "active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {item.status === "active" ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                </div>

                <h2 className="text-2xl font-bold text-slate-900">
                  {item.name}
                </h2>

                {(profile.scientificName || item.scientificName) && (
                  <p className="text-sm text-muted-foreground italic">
                    Tên khoa học / kỹ thuật:{" "}
                    {profile.scientificName || item.scientificName}
                  </p>
                )}

                {item.description && (
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.hashtags && item.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.hashtags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center text-xs text-primary font-medium bg-primary/10 px-2.5 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin Phân loại & Kỹ thuật */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> Phân loại nhóm phụ phẩm
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                  Nguồn gốc
                </h4>
                <div className="flex flex-wrap gap-1">
                  {originGroups.length > 0 ? (
                    originGroups.map((g: string) => (
                      <Badge
                        key={g}
                        variant="outline"
                        className="text-xs bg-emerald-50 text-emerald-800 border-emerald-200"
                      >
                        {g}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                  Sinh học (Lý - Hóa)
                </h4>
                <div className="flex flex-wrap gap-1">
                  {physicoGroups.length > 0 ? (
                    physicoGroups.map((g: string) => (
                      <Badge
                        key={g}
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-800 border-blue-200"
                      >
                        {g}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                  Mức độ độc hại &amp; Quy chuẩn quản lý
                </h4>
                <div className="flex flex-wrap gap-1">
                  {toxicityGroups.length > 0 ? (
                    toxicityGroups.map((g: string) => (
                      <Badge
                        key={g}
                        variant="outline"
                        className="text-xs bg-amber-50 text-amber-800 border-amber-200"
                      >
                        {g}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-primary" /> Thành phần
                &amp; Thông số kỹ thuật
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <InfoRow
                label="Thành phần chi tiết"
                value={profile.detailedComposition || item.detailedComposition}
              />
              <InfoRow
                label="Số đăng ký / Lưu hành"
                value={item.registrationNumber}
              />
              <InfoRow
                label="Hạn sử dụng / Hạn bảo quản"
                value={profile.shelfLife}
              />
              <InfoRow
                label="Giá tham khảo"
                value={formatPrice(item.referencePrice)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Đóng gói & Đơn vị */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" /> Cấu hình Quy cách
              đóng gói &amp; Đơn vị
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {item.packagingVariants && item.packagingVariants.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {item.packagingVariants.map((pv: any, idx: number) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {formatPackagingVariantText(pv)}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Chưa có thông tin quy cách đóng gói.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Hướng dẫn & An toàn & Pháp lý */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary" /> Khuyên dùng &amp; Liều
                lượng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <InfoRow label="Công dụng chính" value={profile.mainUsage} />
              <InfoRow label="Giai đoạn tác động" value={profile.effectStage} />
              <InfoRow
                label="Liều lượng khuyến cáo"
                value={profile.recommendedDosage}
              />
              <InfoRow
                label="Phương pháp áp dụng"
                value={profile.usageMethod}
              />
              <InfoRow label="Lưu ý khi sử dụng" value={profile.usageNotes} />

              {documents.length > 0 && (
                <div className="pt-2 border-t">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Tài liệu đính kèm
                  </h4>
                  <div className="space-y-1.5">
                    {documents.map((doc: any, idx: number) => (
                      <a
                        key={idx}
                        href={doc.fileUrl || doc.content}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border hover:bg-slate-100 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-medium text-slate-700">
                          {doc.fileName || doc.name || "Tài liệu đính kèm"}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary" /> An toàn, Pháp
                lý &amp; Tiêu chuẩn
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <InfoRow
                label="Tình trạng pháp lý"
                value={
                  item.legalStatus === "allowed"
                    ? "Được phép lưu hành"
                    : item.legalStatus === "restricted"
                      ? "Hạn chế sử dụng"
                      : "Cấm sử dụng"
                }
              />
              <InfoRow label="Mô tả pháp lý" value={item.legalDescription} />
              <InfoRow
                label="Thông tin độc tính"
                value={profile.toxicityDescription}
              />
              <InfoRow
                label="Biện pháp bảo hộ"
                value={profile.protectiveMeasures}
              />

              {/* Chứng nhận / Tiêu chuẩn nông nghiệp */}
              {certsList.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" /> Tiêu
                    chuẩn &amp; Chứng nhận
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {certsList.map((certName: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1"
                      >
                        🏆 {certName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Sơ cứu khi ngộ độc / Xử lý sự cố */}
              {profile.poisoningTreatment && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <HeartPulse className="w-3.5 h-3.5 text-red-500" /> Sơ cứu
                    &amp; Xử lý sự cố
                  </h4>
                  <div
                    className="text-xs bg-red-50/50 border border-red-100 rounded-lg p-3 text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: profile.poisoningTreatment,
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Card: Xuất xứ & Nhà cung cấp */}
        {(item.manufacturerOrganization ||
          item.importerOrganization ||
          item.distributorOrganization) && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Xuất xứ &amp; Nhà
                cung ứng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoRow
                label="Nhà sản xuất / Nơi phát sinh"
                value={item.manufacturerOrganization?.name}
              />
              <InfoRow
                label="Nhà nhập khẩu / Chứng nhận"
                value={item.importerOrganization?.name}
              />
              <InfoRow
                label="Nhà phân phối"
                value={item.distributorOrganization?.name}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
};

export default ByProductDetailPage;
