import type { Plant } from "@/pages/region-chart/constants";

export type DummyScope = {
  id: string;
  scopeType: "REGION" | "AREA" | "PLOT";
  region?: { id: string; code?: string; name: string };
  area?: {
    id: string;
    code?: string;
    name: string;
    region?: { id: string; code?: string; name: string };
  };
  plot?: {
    id: string;
    code?: string;
    name: string;
    area?: {
      id: string;
      code?: string;
      name: string;
      region?: { id: string; code?: string; name: string };
    };
  };
};

export type DummyIdentificationRegion = {
  id: string;
  code: string;
  name: string;
  scopes: DummyScope[];
  personnel: Array<{ id: string; fullName: string }>;
  farmingMethod: { id: string; name: string };
  irrigationSystem: { id: string; name: string };
  cropVarieties: Array<{
    id: string;
    cropVarietyCode: string;
    cropVarietyName: string;
    cropName: string;
    germinationRate: number;
    uniformity: number;
  }>;
};

export type DummyGeoUnit = {
  id: string;
  name: string;
  type: string;
  level: number;
  coordinates: Array<{ lat: number; lng: number }>;
};

export type DummyIdentificationRecord = Plant & {
  description?: string;
};

const makeRectangle = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => [
  { lat: lat1, lng: lng1 },
  { lat: lat1, lng: lng2 },
  { lat: lat2, lng: lng2 },
  { lat: lat2, lng: lng1 },
];

export const AQUACULTURE_IDENTIFICATION_REGIONS: DummyIdentificationRegion[] = [
  {
    id: "aq-region-1",
    code: "AQ-001",
    name: "Vùng nuôi tôm Cần Giờ",
    personnel: [
      { id: "staff-1", fullName: "Nguyễn Văn Hải" },
      { id: "staff-2", fullName: "Trần Thị Mai" },
    ],
    farmingMethod: { id: "method-1", name: "Nuôi thâm canh tuần hoàn" },
    irrigationSystem: { id: "irrigation-1", name: "Hệ thống cấp thoát nước tự động" },
    cropVarieties: [
      {
        id: "var-1",
        cropVarietyCode: "TT-001",
        cropVarietyName: "Tôm thẻ chân trắng",
        cropName: "Tôm",
        germinationRate: 98,
        uniformity: 96,
      },
      {
        id: "var-2",
        cropVarietyCode: "CA-003",
        cropVarietyName: "Cá rô phi đơn tính",
        cropName: "Cá",
        germinationRate: 95,
        uniformity: 92,
      },
    ],
    scopes: [
      {
        id: "aq-region-1-scope-region",
        scopeType: "REGION",
        region: {
          id: "aq-r-1",
          code: "VR-01",
          name: "Khu nuôi tôm Cần Giờ",
        },
      },
      {
        id: "aq-region-1-scope-area",
        scopeType: "AREA",
        area: {
          id: "aq-a-1",
          code: "AR-01",
          name: "Ao ươm số 1",
          region: {
            id: "aq-r-1",
            code: "VR-01",
            name: "Khu nuôi tôm Cần Giờ",
          },
        },
      },
      {
        id: "aq-region-1-scope-plot",
        scopeType: "PLOT",
        plot: {
          id: "aq-p-1",
          code: "PL-01",
          name: "Bể nuôi chính 01",
          area: {
            id: "aq-a-1",
            code: "AR-01",
            name: "Ao ươm số 1",
            region: {
              id: "aq-r-1",
              code: "VR-01",
              name: "Khu nuôi tôm Cần Giờ",
            },
          },
        },
      },
    ],
  },
  {
    id: "aq-region-2",
    code: "AQ-002",
    name: "Khu nuôi thủy sản Long Sơn",
    personnel: [{ id: "staff-3", fullName: "Lê Minh Khoa" }],
    farmingMethod: { id: "method-2", name: "Nuôi bán thâm canh" },
    irrigationSystem: { id: "irrigation-2", name: "Kênh dẫn tuần hoàn" },
    cropVarieties: [
      {
        id: "var-3",
        cropVarietyCode: "CA-010",
        cropVarietyName: "Cá mú chấm nâu",
        cropName: "Cá mú",
        germinationRate: 91,
        uniformity: 89,
      },
    ],
    scopes: [
      {
        id: "aq-region-2-scope-region",
        scopeType: "REGION",
        region: {
          id: "aq-r-2",
          code: "VR-02",
          name: "Khu nuôi thủy sản Long Sơn",
        },
      },
      {
        id: "aq-region-2-scope-area",
        scopeType: "AREA",
        area: {
          id: "aq-a-2",
          code: "AR-02",
          name: "Ao nuôi số 2",
          region: {
            id: "aq-r-2",
            code: "VR-02",
            name: "Khu nuôi thủy sản Long Sơn",
          },
        },
      },
    ],
  },
];

export const AQUACULTURE_IDENTIFICATION_GEO_UNITS: DummyGeoUnit[] = [
  {
    id: "aq-p-1",
    name: "Bể nuôi chính 01",
    type: "Lô trồng",
    level: 1,
    coordinates: makeRectangle(10.4, 106.8, 10.406, 106.808),
  },
  {
    id: "aq-a-1",
    name: "Ao ươm số 1",
    type: "Khu vực",
    level: 2,
    coordinates: makeRectangle(10.398, 106.798, 10.41, 106.81),
  },
  {
    id: "aq-r-1",
    name: "Khu nuôi tôm Cần Giờ",
    type: "Vùng trồng",
    level: 3,
    coordinates: makeRectangle(10.392, 106.792, 10.415, 106.814),
  },
  {
    id: "aq-a-2",
    name: "Ao nuôi số 2",
    type: "Khu vực",
    level: 2,
    coordinates: makeRectangle(10.455, 106.845, 10.462, 106.855),
  },
  {
    id: "aq-r-2",
    name: "Khu nuôi thủy sản Long Sơn",
    type: "Vùng trồng",
    level: 3,
    coordinates: makeRectangle(10.448, 106.838, 10.468, 106.862),
  },
];

export const AQUACULTURE_IDENTIFICATION_PLANTS: DummyIdentificationRecord[] = [
  {
    id: "aq-plant-1",
    code: "AQP-001",
    name: "Vùng nuôi tôm Cần Giờ 01",
    type: "Aquaculture",
    status: "healthy",
    height: "2.5",
    ageValue: "3",
    ageUnit: "years",
    age: "3 năm",
    plantedDate: "2024-03-12",
    coordinate: { lat: 10.403, lng: 106.804 },
    plotId: "aq-p-1",
    cultivationRegionId: "aq-region-1",
    regionName: "Khu nuôi tôm Cần Giờ",
    areaName: "Ao ươm số 1",
    note: "Dữ liệu mẫu cho trang định danh vùng nuôi trồng thủy sản.",
    description: "Mẫu định danh đầu tiên cho vùng nuôi trồng.",
  },
  {
    id: "aq-plant-2",
    code: "AQP-002",
    name: "Long Sơn Batch 02",
    type: "Aquaculture",
    status: "healthy",
    height: "1.9",
    ageValue: "18",
    ageUnit: "months",
    age: "18 tháng",
    plantedDate: "2024-11-01",
    coordinate: { lat: 10.457, lng: 106.85 },
    plotId: "aq-a-2",
    cultivationRegionId: "aq-region-2",
    regionName: "Khu nuôi thủy sản Long Sơn",
    areaName: "Ao nuôi số 2",
    note: "Dummy data cho danh sách định danh thủy sản.",
  },
];

