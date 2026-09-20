import { type FC } from "react";
import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ShieldCheck,
  ShieldAlert,
  FlaskConical,
  Package,
  Building2,
  Leaf,
  FileCheck2,
  Clock,
  ExternalLink,
  Bug,
  Sprout,
  AlertOctagon,
  Info,
} from "lucide-react";
import type { Pesticide } from "../../types/types";

interface PesticideDetailViewProps {
  item: Pesticide;
}

export const PesticideDetailView: FC<PesticideDetailViewProps> = ({ item }) => {
  const raw = item as any;

  // Extract core properties from API JSON or legacy format
  const code = raw.code || item.code || "—";
  const sku = raw.sku || "";
  const name = raw.name || item.name || "Tên thuốc BVTV";
  const regNo = raw.registrationNumber || raw.registration_number || "";
  const legalStatus = raw.legalStatus || "";
  const legalDescription =
    raw.legalDescription || raw.metadataJson?.statusRaw || "";

  // Organization
  const manufacturer = raw.manufacturerOrganization?.name || item.origin || "";
  const importer = raw.importerOrganization?.name || "";

  // Classification & Group
  const classificationGroup =
    raw.classifications?.[0]?.group?.name ||
    raw.metadataJson?.targetGroupRaw ||
    item.group ||
    "";

  // Toxicity
  const toxicityWho = raw.metadataJson?.toxicityRaw?.who?.label || "";
  const toxicityGhs = raw.metadataJson?.toxicityRaw?.ghs?.label || "";
  const toxicityClass = item.toxicityLevel || "";

  // Registration Dates
  const regFrom = raw.metadataJson?.registeredFrom || "";
  const regTo = raw.metadataJson?.registeredTo || "";

  // Target Subjects
  const targetSubjects: Array<{ id?: number; code?: string; name: string }> =
    raw.targetSubjects || [];

  // Usage Scope
  const usageScope: Array<{
    crop?: string;
    target?: string;
    dosage?: string;
    isolationDaysText?: string;
    application?: string;
  }> = raw.metadataJson?.usageScope || [];

  // Packaging Variants / Specs
  const packagingVariants: Array<any> = raw.packagingVariants || [];

  // Extract full packaging specs (quantity + packagingType or packagingSpecs)
  const fullPackagingSpecs: string[] = [];

  packagingVariants.forEach((v: any) => {
    if (!v) return;
    const typeName = v.packagingType?.name || v.packagingType;
    const qty = v.quantity;
    const uName = v.unitBase?.name || v.unitBase;

    if (qty && uName && typeName) {
      fullPackagingSpecs.push(`${typeName} ${qty} ${uName}`);
    } else if (qty && uName) {
      fullPackagingSpecs.push(`${qty} ${uName}`);
    } else if (typeName && uName) {
      fullPackagingSpecs.push(`${typeName} (${uName})`);
    } else if (typeName) {
      fullPackagingSpecs.push(`${typeName}`);
    }
  });

  if (fullPackagingSpecs.length === 0) {
    if (Array.isArray(item.packagingSpecs) && item.packagingSpecs.length > 0) {
      item.packagingSpecs
        .filter(Boolean)
        .forEach((s) => fullPackagingSpecs.push(s));
    } else if (
      typeof item.packagingSpecs === "string" &&
      (item.packagingSpecs as string).trim()
    ) {
      fullPackagingSpecs.push((item.packagingSpecs as string).trim());
    } else if (
      typeof raw?.packagingSpecification === "string" &&
      raw.packagingSpecification.trim()
    ) {
      fullPackagingSpecs.push(raw.packagingSpecification.trim());
    } else if (typeof raw?.packaging === "string" && raw.packaging.trim()) {
      fullPackagingSpecs.push(raw.packaging.trim());
    }
  }

  // Extract basic unit name
  const baseUnitName: string =
    packagingVariants.map((v: any) => v?.unitBase?.name).find(Boolean) ||
    raw?.unitBase?.name ||
    raw?.unitName ||
    raw?.unit ||
    raw?.unitCode ||
    raw?.unitOfMeasure ||
    "";

  // Active Ingredient
  const activeIngredient = raw.activeIngredient || item.activeIngredient || "";

  // Source info
  const sourceName = raw.metadataJson?.source || raw.source || "MASTER";
  const sourceUrl = raw.metadataJson?.sourceUrl || "";
  const crawledAt = raw.metadataJson?.crawledAt
    ? new Date(raw.metadataJson.crawledAt).toLocaleDateString("vi-VN")
    : "";

  const isBanned =
    legalStatus === "banned" ||
    legalDescription.includes("Hết hiệu lực") ||
    legalDescription.includes("Cấm");

  const isAllowed =
    legalStatus === "allowed" || legalDescription.includes("Còn hiệu lực");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-6">
      {/* 1. HEADER SECTION */}
      <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-3 py-1 uppercase tracking-wider text-xs backdrop-blur-md">
                Thuốc BVTV
              </Badge>
              {sourceName && (
                <Badge
                  variant="outline"
                  className="text-slate-300 border-slate-700 text-xs font-mono"
                >
                  {sourceName}
                </Badge>
              )}
            </div>

            {isAllowed ? (
              <Badge className="bg-emerald-500 text-white font-bold px-3 py-1 flex items-center gap-1.5 shadow-md">
                <ShieldCheck size={14} />
                {legalDescription || "Còn hiệu lực"}
              </Badge>
            ) : isBanned ? (
              <Badge className="bg-rose-500 text-white font-bold px-3 py-1 flex items-center gap-1.5 shadow-md">
                <AlertOctagon size={14} />
                {legalDescription || "Hết hiệu lực"}
              </Badge>
            ) : legalDescription ? (
              <Badge className="bg-amber-500 text-white font-bold px-3 py-1 flex items-center gap-1.5 shadow-md">
                <Info size={14} />
                {legalDescription}
              </Badge>
            ) : null}
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              {name}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700/60">
            <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              Mã: <span className="text-white">{code}</span>
            </span>
            {sku && (
              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                SKU: <span className="text-white">{sku}</span>
              </span>
            )}
            {regNo && (
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                Số ĐK: <span className="text-white">{regNo}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Nhóm tác dụng */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Leaf size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Nhóm phân loại
            </p>
            <p className="font-bold text-slate-800 text-sm mt-0.5">
              {classificationGroup || "Chưa phân nhóm"}
            </p>
          </div>
        </div>

        {/* Độc tính WHO / GHS */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Độc tính (WHO / GHS)
            </p>
            <p className="font-bold text-slate-800 text-sm mt-0.5">
              {toxicityWho ||
                toxicityGhs ||
                toxicityClass ||
                "Rất ít độc / Không độc"}
            </p>
          </div>
        </div>

        {/* Nhà sản xuất */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3 sm:col-span-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Building2 size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Đơn vị sản xuất / Đăng ký
            </p>
            <p className="font-bold text-slate-800 text-sm mt-0.5 truncate">
              {manufacturer || "Đang cập nhật"}
            </p>
            {importer && (
              <p className="text-xs text-slate-500 mt-0.5">
                Nhập khẩu:{" "}
                <span className="font-semibold text-slate-700">{importer}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. THÀNH PHẦN HOẠT CHẤT */}
      {activeIngredient && (
        <div className="space-y-2">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <FlaskConical size={14} className="text-emerald-600" />
            Thành phần hoạt chất
          </h3>
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/80 text-sm font-semibold text-emerald-950 leading-relaxed">
            {activeIngredient}
          </div>
        </div>
      )}

      {/* 4. QUY CÁCH ĐÓNG GÓI HOẶC ĐƠN VỊ CƠ BẢN */}
      {fullPackagingSpecs.length > 0 ? (
        <Card className="border-slate-200/80 shadow-xs bg-white rounded-2xl">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Package size={20} />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Quy cách đóng gói
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {fullPackagingSpecs.map((spec, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-xs px-2.5 py-1 rounded-lg"
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : baseUnitName ? (
        <Card className="border-slate-200/80 shadow-xs bg-white rounded-2xl">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Package size={20} />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Đơn vị cơ bản
              </h4>
              <p className="text-sm font-bold text-slate-800 mt-1">
                <span className="text-indigo-600 font-black text-base">
                  {baseUnitName}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* 5. ĐỐI TƯỢNG CÂY TRỒNG ÁP DỤNG */}
      {targetSubjects.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Sprout size={14} className="text-emerald-600" />
            Cây trồng áp dụng ({targetSubjects.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {targetSubjects.map((sub, idx) => (
              <Badge
                key={sub.id || idx}
                variant="outline"
                className="bg-white border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl shadow-2xs hover:bg-slate-50 text-xs flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {sub.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 6. HƯỚNG DẪN & PHẠM VI SỬ DỤNG CHI TIẾT */}
      {usageScope.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Bug size={14} className="text-rose-500" />
            Phạm vi & Liều lượng sử dụng ({usageScope.length})
          </h3>

          <div className="space-y-3">
            {usageScope.map((scope, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm capitalize">
                      🌾 {scope.crop || "Cây trồng"}
                    </span>
                    {scope.target && (
                      <Badge className="bg-rose-50 text-rose-700 border border-rose-100 font-bold text-xs px-2.5 py-0.5">
                        {scope.target}
                      </Badge>
                    )}
                  </div>

                  {scope.isolationDaysText && (
                    <Badge
                      variant="outline"
                      className="text-amber-700 border-amber-200 bg-amber-50 text-xs font-bold flex items-center gap-1"
                    >
                      <Clock size={12} />
                      Cách ly: {scope.isolationDaysText}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  {scope.dosage && (
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px]">
                        Liều lượng:{" "}
                      </span>
                      <span className="font-bold text-slate-800">
                        {scope.dosage}
                      </span>
                    </div>
                  )}
                  {scope.application && (
                    <div className="sm:col-span-2 text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-500 uppercase text-[10px] block mb-0.5">
                        Cách dùng:
                      </span>
                      {scope.application}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. HẠN ĐĂNG KÝ & PHÁP LÝ */}
      {(regFrom || regTo) && (
        <div className="bg-slate-100/60 p-4 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <FileCheck2 size={16} className="text-slate-500" />
            <span>Thời hạn đăng ký:</span>
          </div>
          <span className="font-bold text-slate-800 font-mono">
            {regFrom} — {regTo}
          </span>
        </div>
      )}

      {/* 8. FOOTER / SOURCE */}
      {sourceUrl && (
        <div className="pt-2 text-right">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            Xem nguồn chi tiết
            <ExternalLink size={12} />
          </a>
          {crawledAt && (
            <p className="text-[10px] text-slate-400 mt-0.5">
              Thu thập ngày: {crawledAt}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
