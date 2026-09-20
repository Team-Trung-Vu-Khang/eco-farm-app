/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CropDetail } from "../../constants";

/**
 * Dựng `area` + `details` giả lập cho CropDetailDialog.
 *
 * Dialog vốn đọc dữ liệu từ API vùng canh tác (useCultivationRegionDetail).
 * Khi chưa có vùng canh tác nào khớp với cây (dữ liệu demo), toàn bộ 7 tab bị
 * chặn ở màn hình "Không tìm thấy dữ liệu vùng canh tác". Hàm này lấy chính
 * dữ liệu của cây trong MOCK_CROPS để dựng cấu trúc tương đương, nhờ đó demo
 * chạy được mà không cần backend.
 */
export const buildMockAreaFromCrop = (crop: CropDetail): any => {
  const hasPlot = Boolean(crop.plotId);
  const hasArea = Boolean(crop.areaId);

  const scope = hasPlot ? "plot" : hasArea ? "area" : "region";
  const targetId = String(crop.plotId || crop.areaId || crop.regionId);

  return {
    id: `mock-area-${crop.id}`,
    name: `Vùng canh tác ${crop.name}`,
    scope,
    targetIds: [targetId],
    targetName: crop.plotName || crop.areaName || crop.regionName,
    enterpriseId: "",
    certificateIds: crop.certifications.map((c) => c.id),
    managerIds: [],
    note: crop.notes,
    farmingMethodId: "",
    irrigationMethodId: "",
    selectedCrops: [crop.id],
    seedSelections: {},
    selections: [
      {
        id: `scope-${scope}-${targetId}`,
        type: scope,
        regionId: String(crop.regionId),
        areaId: hasArea ? String(crop.areaId) : undefined,
        plotId: hasPlot ? String(crop.plotId) : undefined,
        name: crop.plotName || crop.areaName || crop.regionName,
        regionName: crop.regionName,
        areaName: crop.areaName,
      },
    ],
  };
};

export const buildMockDetailsFromCrop = (crop: CropDetail): any => {
  // Thu hoạch: sắp xếp mới nhất trước để tính biến động giữa 2 vụ gần nhau
  const sortedHarvests = [...crop.harvestHistory].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const volumes = sortedHarvests.map((h) => h.quantity || 0);
  const totalVolume = volumes.reduce((sum, v) => sum + v, 0);
  const lastVolume = volumes[0] ?? 0;
  const prevVolume = volumes[1] ?? 0;
  const avgVolume = volumes.length
    ? Math.round(totalVolume / volumes.length)
    : 0;

  const percentChange = (current: number, previous: number) =>
    previous > 0 ? Number((((current - previous) / previous) * 100).toFixed(1)) : 0;

  const entity = {
    id: String(crop.plotId || crop.areaId || crop.regionId),
    targetId: String(crop.plotId || crop.areaId || crop.regionId),
    name: crop.plotName || crop.areaName || crop.regionName,
    type: crop.plotId ? "Lô đất" : crop.areaId ? "Khu vực" : "Vùng",
    typeCode: crop.plotId ? "plot" : crop.areaId ? "area" : "region",
    regionName: crop.regionName,
    areaName: crop.areaName,
  };

  return {
    managers: [],
    personnel: [],
    certificates: crop.certifications.map((c) => ({
      id: c.id,
      code: c.certificateNumber,
      name: c.name,
    })),
    selectedCerts: crop.certifications.map((c) => ({
      code: c.certificateNumber,
      name: c.name,
    })),
    regionStats: {
      totalRegions: 1,
      totalAreas: crop.areaId ? 1 : 0,
      totalPlots: crop.plotId ? 1 : 0,
    },
    region: {
      id: crop.regionId,
      name: crop.regionName,
      coordinates: [crop.coordinate],
    },
    selectedEntities: [entity],
    groupedSelections: {
      [String(crop.regionId)]: {
        region: { id: crop.regionId, name: crop.regionName },
        areas: {
          [crop.areaId ? String(crop.areaId) : "none"]: {
            area: crop.areaId ? { id: crop.areaId, name: crop.areaName } : null,
            entities: [entity],
          },
        },
      },
    },
    totalArea: 0,
    enterprise: undefined,
    entityConfigs: {},
    harvestStats: {
      totalVolume,
      lastVolume,
      lastChange: percentChange(lastVolume, prevVolume),
      avgVolume,
      avgChange: percentChange(lastVolume, avgVolume),
    },
    harvestBatches: sortedHarvests.map((h, index) => ({
      id: h.id,
      date: h.date,
      volume: h.quantity ?? 0,
      quality: `Loại ${h.quality}`,
      // CropDetail không lưu người thu hoạch — lấy từ nhật ký canh tác cùng kỳ,
      // nếu không có thì dùng tên mặc định để cột "Người phụ trách" không trống.
      staff:
        crop.cultivationHistory[index]?.performedBy ?? "Tổ thu hoạch số 1",
      notes: h.notes ?? (h.buyer ? `Thu mua bởi ${h.buyer}` : ""),
    })),
    technicalConfig: {
      farmingMethod: { id: 0, name: crop.seedType },
      irrigationMethod: undefined,
      crops: [
        {
          id: crop.id,
          varietyName: crop.variety,
          varietyCode: crop.code,
          crop: crop.groupCropName,
          illustration: crop.image,
          seedType: crop.seedType,
          selectedSeeds: [],
        },
      ],
    },
  };
};
