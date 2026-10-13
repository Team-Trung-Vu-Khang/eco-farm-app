import type { FarmWorkflowProductionZoneRef } from "@/features/farm-workflow/types/farm-workflow.type";

/**
 * Tính tổng diện tích (ha) từ danh sách productionZones của Workflow theo 3 quy tắc của Backend:
 * 1. Chỉ cộng `acreage` của node đúng `scopeType` (vd scope `PLOT` thì cộng `plot.acreage`).
 * 2. Chống cộng trùng: Nếu có cả node cha lẫn node con (vd Vùng trồng và Lô thuộc Vùng trồng đó),
 *    chỉ tính node cha.
 * 3. Bỏ qua node có trạng thái `inactive` / `archived` hoặc `acreage == null` (hoặc <= 0).
 */
export function calculateProductionZonesAcreage(
  zones?: FarmWorkflowProductionZoneRef[],
): number | null {
  if (!zones || zones.length === 0) return null;

  let totalAcreage = 0;
  let hasValidAcreage = false;

  zones.forEach((zone) => {
    const scopes = zone.scopes || [];
    if (scopes.length === 0) return;

    // Tập hợp các ID node cha để chống cộng trùng
    const wholeRegionIds = new Set<number>();
    const wholeAreaIds = new Set<number>();
    const countedNodeKeys = new Set<string>();

    // Bước 1: Quét các node cha có mặt ở cấp cao
    scopes.forEach((scope) => {
      if (scope.scopeType === "REGION" && scope.region?.id) {
        wholeRegionIds.add(scope.region.id);
      } else if (scope.scopeType === "AREA" && scope.area?.id) {
        wholeAreaIds.add(scope.area.id);
      }
    });

    // Bước 2: Duyệt từng scope để cộng diện tích hợp lệ
    scopes.forEach((scope) => {
      if (scope.scopeType === "REGION" && scope.region) {
        const { id, acreage, status } = scope.region;
        const key = `region-${id}`;
        if (countedNodeKeys.has(key)) return;

        if (status !== "inactive" && status !== "archived") {
          const val = Number(acreage);
          if (!Number.isNaN(val) && val > 0) {
            totalAcreage += val;
            hasValidAcreage = true;
            countedNodeKeys.add(key);
          }
        }
      } else if (scope.scopeType === "AREA" && scope.area) {
        const { id, acreage, status, region } = scope.area;
        const parentRegionId = region?.id;

        // Bỏ qua nếu đã cộng Vùng trồng (Region) cha
        if (parentRegionId && wholeRegionIds.has(parentRegionId)) return;

        const key = `area-${id}`;
        if (countedNodeKeys.has(key)) return;

        if (status !== "inactive" && status !== "archived") {
          const val = Number(acreage);
          if (!Number.isNaN(val) && val > 0) {
            totalAcreage += val;
            hasValidAcreage = true;
            countedNodeKeys.add(key);
          }
        }
      } else if (scope.scopeType === "PLOT" && scope.plot) {
        const { id, acreage, status, area } = scope.plot;
        const parentAreaId = area?.id;
        const parentRegionId = area?.region?.id;

        // Bỏ qua nếu đã cộng Vùng trồng cha hoặc Khu vực cha
        if (parentRegionId && wholeRegionIds.has(parentRegionId)) return;
        if (parentAreaId && wholeAreaIds.has(parentAreaId)) return;

        const key = `plot-${id}`;
        if (countedNodeKeys.has(key)) return;

        if (status !== "inactive" && status !== "archived") {
          const val = Number(acreage);
          if (!Number.isNaN(val) && val > 0) {
            totalAcreage += val;
            hasValidAcreage = true;
            countedNodeKeys.add(key);
          }
        }
      }
    });
  });

  return hasValidAcreage ? Number(totalAcreage.toFixed(2)) : null;
}

/**
 * Trích xuất danh sách tên Vùng canh tác áp dụng quy trình từ productionZones:
 * - Ưu tiên tên Vùng canh tác (`zone.name`).
 * - Nếu không có tên vùng hoặc tên chỉ là mã code, lấy tên Vùng địa lý / Vùng trồng (Region) từ `scopes`.
 */
export function extractZoneDisplayNames(
  zones?: FarmWorkflowProductionZoneRef[],
): string[] {
  if (!zones || zones.length === 0) return [];

  const namesSet = new Set<string>();

  zones.forEach((zone) => {
    const rawZoneName = zone.name?.trim();
    if (rawZoneName) {
      namesSet.add(rawZoneName);
      return;
    }

    // Fallback sang tên các Region từ scopes nếu zone chưa có name
    (zone.scopes || []).forEach((scope) => {
      const regionName =
        scope.region?.name ||
        scope.area?.region?.name ||
        scope.plot?.area?.region?.name;
      if (regionName?.trim()) {
        namesSet.add(regionName.trim());
      }
    });

    if (namesSet.size === 0 && zone.code?.trim()) {
      namesSet.add(zone.code.trim());
    }
  });

  return Array.from(namesSet);
}

/**
 * Trích xuất danh sách Cây trồng & Giống từ `subjects` của productionZones:
 * Ví dụ: ["Sầu riêng (Ri6)", "Cà phê (Robusta)"]
 */
export function extractCropSubjectLabels(
  zones?: FarmWorkflowProductionZoneRef[],
): string[] {
  if (!zones || zones.length === 0) return [];

  const labelsSet = new Set<string>();

  zones.forEach((zone) => {
    (zone.subjects || []).forEach((subject) => {
      const cropName = subject.name?.trim();
      if (!cropName) return;

      const variants = subject.variants || [];
      if (variants.length > 0) {
        variants.forEach((v) => {
          const variantName = v.name?.trim();
          if (
            variantName &&
            variantName.toLowerCase() !== cropName.toLowerCase()
          ) {
            labelsSet.add(`${cropName} (${variantName})`);
          } else {
            labelsSet.add(cropName);
          }
        });
      } else {
        labelsSet.add(cropName);
      }
    });
  });

  return Array.from(labelsSet);
}

/**
 * Định dạng diện tích (ha) hiển thị thân thiện với người dùng
 */
export function formatAcreageLabel(acreage: number | null | undefined): string {
  if (
    acreage === null ||
    acreage === undefined ||
    Number.isNaN(acreage) ||
    acreage <= 0
  ) {
    return "—";
  }
  return `${acreage} ha`;
}
