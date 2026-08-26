import { useFormContext } from "react-hook-form";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useProductionMethods } from "@/features/foundation/hooks/useProductionSubjects";
import { useAddressOptions } from "@/features/master-data/hooks/useAddressOptions";
import { useRearingMethods } from "@/features/master-data/hooks/useRearingMethods";
import { useIrrigationSystems } from "@/features/master-data/hooks/useIrrigationSystems";
import { useMemo } from "react";
import { CheckCircle2, Droplets, Leaf, ScrollText, Sprout } from "lucide-react";
import { Badge, Card } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { RegionBasicFormValues } from "../data/region-basic-form.schema";
import { useMethodApplications } from "@/features/foundation";
import { useSeeds } from "@/features/farm/hooks/useSeeds";
import type { FarmSeedResponse } from "@/features/farm/types/farm.type";

interface RegionConfirmationStepProps {
  domainCode: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  title?: string;
  description?: string;
  allSeeds?: FarmSeedResponse[];
}

export const RegionConfirmationStep = ({
  domainCode,
  title = "Xác nhận thông tin",
  description,
  allSeeds = [],
}: RegionConfirmationStepProps) => {
  const { watch } = useFormContext<RegionBasicFormValues>();
  const formValues = watch();

  const isEdit = !!formValues.id;
  const defaultDescription = isEdit
    ? "Vui lòng kiểm tra kỹ các thông tin dưới đây trước khi lưu cập nhật."
    : "Vui lòng kiểm tra kỹ các thông tin dưới đây. Sau khi xác nhận, hệ thống sẽ tiến hành khởi tạo.";

  const displayDesc = description || defaultDescription;

  // ─── Reference Data ────────────────────────────────────────────────────
  const { items: lands } = useCatalog("soil-types");
  const { items: terrains } = useCatalog("terrain-features");
  const { provinces, wards } = useAddressOptions(formValues.provinceId);

  // Farming methods
  const { items: farmingMethods } = useProductionMethods({
    params: { domainCode, size: 100 },
  });

  // Rearing methods (irrigation) / Irrigation systems
  const { items: rearingMethods } = useRearingMethods({
    params: { domainCode, size: 100 },
  });
  const { items: irrigationSystems } = useIrrigationSystems({
    params: { size: 100 },
  });

  // Subjects (Crops / Livestock / Aquaculture)
  // const { items: subjects } = useProductionSubjects({
  //   params: { domainCode, size: 100 },
  // });

  const selectedFarmingMethodId = Number(formValues.farmingMethodId);
  const isCropDomain = domainCode === "CROP";

  // CROP zones resolve seedIds against the farm seed catalog.
  // API: GET /api/farm/subject-variants?productionMethodId=&domainCode=CROP&status=active
  const { items: seedItems } = useSeeds({
    params: {
      productionMethodId: selectedFarmingMethodId,
      domainCode,
      status: "active",
      size: 100,
    },
    enabled: isCropDomain && !!selectedFarmingMethodId && selectedFarmingMethodId > 0,
  });

  // LIVESTOCK / AQUACULTURE zones still resolve seedIds against method-application variants.
  const { items: methodApplications } = useMethodApplications({
    params: { domainCode, size: 100, status: "active" },
    enabled:
      !isCropDomain && !!selectedFarmingMethodId && selectedFarmingMethodId > 0,
  });

  const activeMethodApp = useMemo(() => {
    return methodApplications.find(
      (item) => item.productionMethod?.id === selectedFarmingMethodId,
    );
  }, [methodApplications, selectedFarmingMethodId]);

  // Selected details
  const landTypeName =
    lands.find((l) => String(l.id || l.code) === formValues.landType)?.name ||
    formValues.landType;
  const terrainName =
    terrains.find((t) => String(t.id || t.code) === formValues.terrain)?.name ||
    formValues.terrain;
  const provinceName =
    provinces.find((p) => p.id === formValues.provinceId)?.name || "";
  const wardName = wards.find((w) => w.id === formValues.wardId)?.name || "";

  // const selectedSubjects = useMemo(() => {
  //   const ids = formValues.cropIds ?? [];
  //   return subjects.filter((s) => ids.includes(String(s.id)));
  // }, [subjects, formValues.cropIds]);

  const selectedVariants = useMemo(() => {
    const selectedIds = (formValues.seedIds ?? []).map(Number);
    const list: Array<{ id: number; name: string; subjectName: string }> = [];

    if (isCropDomain) {
      // Prefer the freshly-fetched seed catalog; fall back to a caller-supplied
      // list for consumers that still pass `allSeeds` directly.
      const source = seedItems.length > 0 ? seedItems : allSeeds;
      source.forEach((seed) => {
        if (selectedIds.includes(Number(seed.id))) {
          list.push({
            id: seed.id,
            name: seed.name || "",
            subjectName: (seed.productionSubject ?? seed.crop)?.name || "",
          });
        }
      });
      return list;
    }

    if (activeMethodApp) {
      activeMethodApp.subjects?.forEach((subject) => {
        subject.variants?.forEach((variant) => {
          if (selectedIds.includes(Number(variant.id))) {
            list.push({
              id: variant.id,
              name: variant.name || "",
              subjectName: subject.subjectName || "",
            });
          }
        });
      });
    }
    return list;
  }, [isCropDomain, seedItems, allSeeds, activeMethodApp, formValues.seedIds]);

  // Labels customized based on domainCode
  const domainLabels = useMemo(() => {
    switch (domainCode) {
      case "LIVESTOCK":
        return {
          // subjectTitle: "Vật nuôi chính",
          farmingMethod: "Phương pháp chăn nuôi",
          irrigation: "Hệ thống chuồng trại/cấp nước",
          irrigationName:
            irrigationSystems.find(
              (i) => i.id === Number(formValues.irrigationSystemId),
            )?.name || "",
          seedTitle: "Danh sách con giống áp dụng",
          seedLabel: "Con giống:",
        };
      case "AQUACULTURE":
        return {
          // subjectTitle: "Đối tượng nuôi trồng",
          farmingMethod: "Phương pháp nuôi trồng",
          irrigation: "Phương pháp nuôi trồng chi tiết",
          irrigationName:
            rearingMethods.find(
              (r) => r.id === Number(formValues.rearingMethodId),
            )?.name || "",
          seedTitle: "Danh sách giống thủy sản áp dụng",
          seedLabel: "Giống thủy sản:",
        };
      case "CROP":
      default:
        return {
          // subjectTitle: "Cây trồng chính",
          farmingMethod: "Phương pháp canh tác",
          irrigation: "Phương pháp tưới tiêu",
          irrigationName:
            rearingMethods.find(
              (r) => r.id === Number(formValues.rearingMethodId),
            )?.name || "",
          seedTitle: "Danh sách giống cây trồng áp dụng",
          seedLabel: "Hạt giống:",
        };
    }
  }, [
    domainCode,
    formValues.rearingMethodId,
    formValues.irrigationSystemId,
    rearingMethods,
    irrigationSystems,
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-white shadow-xs relative z-10">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-900 z-10 relative">
          {title}
        </h3>
        <p className="text-green-700/80 mt-1.5 z-10 relative max-w-lg mx-auto text-xs">
          {displayDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Step 1 Information */}
        <Card className="border-slate-200 shadow-xs overflow-hidden bg-white">
          <div className="bg-slate-50 border-b px-4 py-3 flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-slate-500" />
            <h4 className="font-semibold text-slate-800 text-sm">
              Thông tin vùng địa lý
            </h4>
          </div>
          <div className="p-0">
            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 px-4 text-muted-foreground w-1/3">
                    Tên vùng
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900">
                    {formValues.name}
                  </td>
                </tr>
                {formValues.code && (
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 px-4 text-muted-foreground">
                      Mã vùng
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {formValues.code}
                    </td>
                  </tr>
                )}
                {formValues.area !== undefined && (
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 px-4 text-muted-foreground">
                      Diện tích (ha)
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {formValues.area}
                    </td>
                  </tr>
                )}
                {/* <tr className="border-b border-slate-100">
                  <td className="py-2.5 px-4 text-muted-foreground">
                    {domainLabels.subjectTitle}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSubjects.map((s) => (
                        <Badge
                          key={s.id}
                          variant="secondary"
                          className="bg-green-50 text-green-700 border-green-100 text-[11px]"
                        >
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr> */}
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 px-4 text-muted-foreground">
                    Địa chỉ / Vị trí
                  </td>
                  <td className="py-2.5 px-4 text-slate-700 font-medium">
                    {[formValues.address, wardName, provinceName]
                      .filter(Boolean)
                      .join(", ") ||
                      formValues.metadataJson?.address ||
                      "---"}
                  </td>
                </tr>
                {(landTypeName || terrainName) && (
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 px-4 text-muted-foreground">
                      Đặc tính tự nhiên
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 font-medium">
                      {[
                        landTypeName && `Loại đất: ${landTypeName}`,
                        terrainName && `Địa hình: ${terrainName}`,
                      ]
                        .filter(Boolean)
                        .join(" • ") || "---"}
                    </td>
                  </tr>
                )}
                {formValues.centerPoint?.lat && formValues.centerPoint?.lng && (
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 px-4 text-muted-foreground">
                      Tọa độ tâm (GPS)
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600">
                      {formValues.centerPoint.lat.toFixed(6)},{" "}
                      {formValues.centerPoint.lng.toFixed(6)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Step 2 Information */}
        <Card className="border-slate-200 shadow-xs overflow-hidden bg-white">
          <div className="bg-slate-50 border-b px-4 py-3 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-slate-500" />
            <h4 className="font-semibold text-slate-800 text-sm">
              Cấu hình canh tác vùng
            </h4>
          </div>
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <ScrollText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">
                    {domainLabels.farmingMethod}
                  </div>
                  <div className="font-bold text-xs text-slate-900">
                    {farmingMethods.find(
                      (m) => m.id === selectedFarmingMethodId,
                    )?.name || (
                      <span className="text-red-500 italic font-medium">
                        Chưa chọn
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">
                    {domainLabels.irrigation}
                  </div>
                  <div className="font-bold text-xs text-slate-900">
                    {domainLabels.irrigationName || (
                      <span className="text-muted-foreground italic font-medium">
                        Chưa cấu hình
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-green-600" />
                {domainLabels.seedTitle} ({selectedVariants.length})
              </div>
              <div className="grid grid-cols-1 gap-2">
                {selectedVariants.length > 0 ? (
                  selectedVariants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="font-semibold text-xs text-slate-800">
                          {variant.name}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] text-slate-500 bg-slate-50 border-slate-200"
                      >
                        {variant.subjectName}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <span className="text-muted-foreground italic text-xs">
                    Chưa chọn con giống/hạt giống nào.
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {formValues.note && (
        <div className="bg-yellow-50/50 border border-yellow-200/60 p-3.5 rounded-lg text-xs text-slate-700">
          <span className="font-bold text-yellow-800 mr-1.5">Ghi chú:</span>{" "}
          {formValues.note}
        </div>
      )}
    </div>
  );
};
