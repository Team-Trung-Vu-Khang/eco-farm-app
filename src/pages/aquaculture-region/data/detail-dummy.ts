export type AquacultureDetailNode = {
  id: string;
  name: string;
  area?: number;
  landType?: string;
  terrain?: string;
  createdAt?: string;
  coordinates?: { lat: number; lng: number }[];
  plots?: AquacultureDetailNode[];
};

export type AquacultureDetailSeed = {
  id: number;
  cropVariety?: { id: number; name?: string; code?: string };
  crop?: { name?: string };
  origin?: string;
  imageUrl?: string;
  supplier?: { name?: string };
};

export type AquacultureDetailCertificate = {
  id: number;
  code: string;
  name: string;
};

export type AquacultureDetailPersonnel = {
  id: number;
  fullName: string;
  avatarUrl: string | null;
  position?: { name?: string; code?: string };
  department?: { name?: string };
  team?: { name?: string };
  phone?: string;
  email?: string;
  address?: string;
  ward?: string;
  district?: string;
  province?: string;
};

export type AquacultureDetailData = {
  area: {
    id: string;
    name: string;
    scope: "region" | "area" | "plot";
    targetIds: string[];
    targetName: string;
    enterpriseId: string;
    certificateIds: string[];
    managerIds: string[];
    note: string;
    farmingMethodId: string;
    irrigationMethodId: string;
    selectedCrops: string[];
    seedSelections: Record<string, string[]>;
    status: "active" | "inactive" | "archived";
    createdAt: string;
    selections: Array<{
      id: string;
      type: "region" | "area" | "plot";
      regionId: string;
      areaId?: string;
      plotId?: string;
      name?: string;
      regionName?: string;
      areaName?: string;
    }>;
  };
  details: {
    managers: any[];
    personnel: AquacultureDetailPersonnel[];
    certificates: AquacultureDetailCertificate[];
    selectedCerts: any[];
    regionStats: {
      total: number;
      healthy: number;
      treating: number;
      diseased: number;
    };
    region: {
      id: number;
      code: string;
      name: string;
      provinceId: string;
      districtId: string;
      address: string;
      enterpriseId: string;
      area: number;
      landType: string;
      terrain: string;
      note: string;
      status: string;
      coordinates: { lat: number; lng: number }[];
      createdAt: string;
      subAreas: Array<{
        id: string;
        name: string;
        area: number;
        landType: string;
        terrain: string;
        createdAt: string;
        coordinates: { lat: number; lng: number }[];
        plots: Array<{
          id: string;
          name: string;
          area: number;
          altitude: number;
          contour: string;
          coordinates: { lat: number; lng: number }[];
        }>;
      }>;
    } | null;
    selectedEntities: any[];
    groupedSelections: Record<string, any>;
    totalArea: number;
    enterprise: any;
    entityConfigs: Array<{
      entity: any;
      farmingMethod: any;
      irrigationMethod: any;
      crops: any[];
    }>;
    technicalConfig: {
      farmingMethod: any;
      irrigationMethod: any;
      crops: Array<{
        id: string;
        crop: string;
        varietyName: string;
        illustration: string;
        seedType?: string;
        selectedSeeds: Array<{ id: string; varietyName: string; origin: string }>;
      }>;
    };
    harvestStats: {
      totalVolume: number;
      lastVolume: number;
      lastChange: number;
      avgVolume: number;
      avgChange: number;
    };
    harvestBatches: Array<{
      id: string;
      date: string;
      volume: number;
      quality: string;
      staff: string;
      notes?: string;
    }>;
  };
}

const DUMMY_REGION = {
  id: 101,
  code: "AQ-REG-101",
  name: "Vùng nuôi tôm Cần Giờ",
  provinceId: "binh-phuoc",
  districtId: "dong-xoai",
  address: "Khu ấp biển số 1",
  enterpriseId: "ent-2",
  area: 128.4,
  landType: "marine-silt",
  terrain: "coastal-flat",
  note: "Vùng nuôi trồng thủy sản mẫu cho demo.",
  status: "active",
  coordinates: [
    { lat: 10.4101, lng: 106.9532 },
    { lat: 10.4121, lng: 106.9589 },
    { lat: 10.4084, lng: 106.9631 },
    { lat: 10.4059, lng: 106.9573 },
  ],
  createdAt: "2026-07-10",
  subAreas: [
    {
      id: "AQ-A1",
      name: "Khu nuôi tôm sú",
      area: 42.6,
      landType: "marine-silt",
      terrain: "coastal-flat",
      createdAt: "2026-07-10",
      coordinates: [
        { lat: 10.4097, lng: 106.9538 },
        { lat: 10.411, lng: 106.9569 },
        { lat: 10.4083, lng: 106.9587 },
        { lat: 10.4068, lng: 106.9552 },
      ],
      plots: [
        {
          id: "AQ-P1",
          name: "Lô ương giống A1",
          area: 14.2,
          altitude: 0.7,
          contour: "Mực nước 0.7m",
          coordinates: [
            { lat: 10.4099, lng: 106.9541 },
            { lat: 10.4108, lng: 106.9558 },
            { lat: 10.4091, lng: 106.9564 },
            { lat: 10.4085, lng: 106.9548 },
          ],
        },
      ],
    },
    {
      id: "AQ-A2",
      name: "Khu nuôi cá tra",
      area: 39.8,
      landType: "freshwater-pond",
      terrain: "flat",
      createdAt: "2026-07-10",
      coordinates: [
        { lat: 10.4065, lng: 106.9592 },
        { lat: 10.4082, lng: 106.9627 },
        { lat: 10.406, lng: 106.9641 },
        { lat: 10.4044, lng: 106.9608 },
      ],
      plots: [
        {
          id: "AQ-P2",
          name: "Lô cá tra B1",
          area: 19.5,
          altitude: 0.9,
          contour: "Mực nước 0.9m",
          coordinates: [
            { lat: 10.4068, lng: 106.9601 },
            { lat: 10.4075, lng: 106.9618 },
            { lat: 10.4059, lng: 106.9625 },
            { lat: 10.4051, lng: 106.9608 },
          ],
        },
      ],
    },
  ],
} as const;

const DUMMY_SPECIES = [
  {
    id: 201,
    cropVariety: { id: 9001, name: "Tôm thẻ chân trắng", code: "TTC" },
    crop: { name: "Tôm" },
    origin: "Ninh Thuận",
    imageUrl: "",
    supplier: { name: "Trại giống Biển Xanh" },
  },
  {
    id: 202,
    cropVariety: { id: 9002, name: "Cá tra", code: "CTA" },
    crop: { name: "Cá" },
    origin: "An Giang",
    imageUrl: "",
    supplier: { name: "Trại giống Mekong" },
  },
  {
    id: 203,
    cropVariety: { id: 9003, name: "Nghêu", code: "NGH" },
    crop: { name: "Nhuyễn thể" },
    origin: "Bến Tre",
    imageUrl: "",
    supplier: { name: "Trại giống Cửa Đại" },
  },
] as const;

const DUMMY_CERTS: AquacultureDetailCertificate[] = [
  { id: 101, code: "VietGAP", name: "VietGAP" },
  { id: 102, code: "ASC", name: "ASC" },
  { id: 103, code: "BAP", name: "BAP" },
];

const DUMMY_PERSONNEL: AquacultureDetailPersonnel[] = [
  {
    id: 11,
    fullName: "Nguyễn Minh Hải",
    avatarUrl: null,
    position: { name: "Quản lý vùng", code: "QLV" },
    department: { name: "Phòng kỹ thuật" },
    team: { name: "Tổ nuôi tôm" },
    phone: "0901 234 567",
    email: "hai.nguyen@example.com",
    address: "TP. Hồ Chí Minh",
    ward: "Phường 1",
    district: "Quận 7",
    province: "TP. Hồ Chí Minh",
  },
  {
    id: 12,
    fullName: "Trần Thị Thu Hà",
    avatarUrl: null,
    position: { name: "Kỹ thuật viên", code: "KTV" },
    department: { name: "Phòng vận hành" },
    team: { name: "Tổ nước" },
    phone: "0902 345 678",
    email: "ha.tran@example.com",
    address: "Bà Rịa - Vũng Tàu",
    ward: "Phường 2",
    district: "TP. Vũng Tàu",
    province: "Bà Rịa - Vũng Tàu",
  },
];

const DUMMY_SELECTED_ENTITIES = [
  {
    id: 101,
    name: "Vùng nuôi tôm Cần Giờ",
    code: "AQ-REG-101",
    type: "Vùng nuôi trồng",
    typeCode: "region",
    regionId: 101,
    _regionData: DUMMY_REGION,
  },
  {
    id: "AQ-A1",
    name: "Khu nuôi tôm sú",
    code: "",
    type: "Khu vực",
    typeCode: "area",
    regionId: 101,
    areaId: "AQ-A1",
    _regionData: DUMMY_REGION,
    _areaData: DUMMY_REGION.subAreas[0],
  },
  {
    id: "AQ-P2",
    name: "Lô cá tra B1",
    code: "",
    type: "Lô",
    typeCode: "plot",
    regionId: 101,
    areaId: "AQ-A2",
    plotId: "AQ-P2",
    _regionData: DUMMY_REGION,
    _areaData: DUMMY_REGION.subAreas[1],
    _plotData: DUMMY_REGION.subAreas[1].plots[0],
  },
];

const DUMMY_GROUPED_SELECTIONS = {
  101: {
    region: {
      id: 101,
      name: "Vùng nuôi tôm Cần Giờ",
      coordinates: DUMMY_REGION.coordinates,
    },
    areas: {
      "AQ-A1": {
        area: DUMMY_REGION.subAreas[0],
        entities: [DUMMY_SELECTED_ENTITIES[1]],
      },
      "AQ-A2": {
        area: DUMMY_REGION.subAreas[1],
        entities: [DUMMY_SELECTED_ENTITIES[2]],
      },
    },
  },
};

export const AQUACULTURE_DETAIL_DRAFTS: Record<number, AquacultureDetailData> =
  {
    101: {
      area: {
        id: "101",
        name: "Vùng nuôi tôm Cần Giờ",
        scope: "region",
        targetIds: ["101", "AQ-A1", "AQ-A2", "AQ-P1", "AQ-P2"],
        targetName: "Vùng nuôi tôm Cần Giờ",
        enterpriseId: "ent-2",
        certificateIds: ["101", "102"],
        managerIds: ["11", "12"],
        note: "Dữ liệu mẫu cho vùng nuôi trồng thủy sản.",
        farmingMethodId: "2",
        irrigationMethodId: "2",
        selectedCrops: ["9001", "9002", "9003"],
        seedSelections: {
          9001: ["201"],
          9002: ["202"],
          9003: ["203"],
        },
        status: "active",
        createdAt: "2026-07-10",
        selections: [
          {
            id: "101",
            type: "region",
            regionId: "101",
            name: "Vùng nuôi tôm Cần Giờ",
          },
          {
            id: "AQ-A1",
            type: "area",
            regionId: "101",
            areaId: "AQ-A1",
            name: "Khu nuôi tôm sú",
            regionName: "Vùng nuôi tôm Cần Giờ",
          },
          {
            id: "AQ-P2",
            type: "plot",
            regionId: "101",
            areaId: "AQ-A2",
            plotId: "AQ-P2",
            name: "Lô cá tra B1",
            regionName: "Vùng nuôi tôm Cần Giờ",
            areaName: "Khu nuôi cá tra",
          },
        ],
      },
      details: {
        managers: [],
        personnel: DUMMY_PERSONNEL,
        certificates: DUMMY_CERTS,
        selectedCerts: [],
        regionStats: { total: 12800, healthy: 12040, treating: 460, diseased: 300 },
        region: DUMMY_REGION as any,
        selectedEntities: DUMMY_SELECTED_ENTITIES,
        groupedSelections: DUMMY_GROUPED_SELECTIONS,
        totalArea: 128.4,
        enterprise: { id: "ent-2", name: "Hợp tác xã Thủy sản Phát Lộc" },
        entityConfigs: [
          {
            entity: { id: 101, name: "Vùng nuôi tôm Cần Giờ", typeCode: "region" },
            farmingMethod: { id: "2", name: "Nuôi lồng bè" },
            irrigationMethod: { id: "2", name: "Tuần hoàn lọc sinh học" },
            crops: [
              {
                id: "9001",
                crop: "Tôm",
                varietyName: "Tôm thẻ chân trắng",
                illustration: "",
                selectedSeeds: [{ id: "201", varietyName: "Tôm thẻ chân trắng", origin: "Ninh Thuận" }],
              },
            ],
          },
        ],
        technicalConfig: {
          farmingMethod: { id: "2", name: "Nuôi lồng bè" },
          irrigationMethod: { id: "2", name: "Tuần hoàn lọc sinh học" },
          crops: [
            {
              id: "9001",
              crop: "Tôm",
              varietyName: "Tôm thẻ chân trắng",
              illustration: "",
              seedType: "Con giống",
              selectedSeeds: [
                { id: "201", varietyName: "Tôm thẻ chân trắng", origin: "Ninh Thuận" },
              ],
            },
            {
              id: "9002",
              crop: "Cá",
              varietyName: "Cá tra",
              illustration: "",
              seedType: "Con giống",
              selectedSeeds: [
                { id: "202", varietyName: "Cá tra", origin: "An Giang" },
              ],
            },
            {
              id: "9003",
              crop: "Nhuyễn thể",
              varietyName: "Nghêu",
              illustration: "",
              seedType: "Con giống",
              selectedSeeds: [
                { id: "203", varietyName: "Nghêu", origin: "Bến Tre" },
              ],
            },
          ],
        },
        harvestStats: {
          totalVolume: 8540,
          lastVolume: 1250,
          lastChange: 12.5,
          avgVolume: 1067,
          avgChange: 5.2,
        },
        harvestBatches: [
          {
            id: "HB001",
            date: "2026-07-10",
            volume: 1250,
            quality: "Loại A",
            staff: "Nguyễn Minh Hải",
            notes: "Thu hoạch đúng tiến độ.",
          },
          {
            id: "HB002",
            date: "2026-06-15",
            volume: 1100,
            quality: "Loại A",
            staff: "Trần Thị Thu Hà",
            notes: "Môi trường nước ổn định.",
          },
        ],
      },
    },
  };

export function getAquacultureDetailDraft(id?: number | null) {
  return AQUACULTURE_DETAIL_DRAFTS[id ?? 0] ?? AQUACULTURE_DETAIL_DRAFTS[101];
}
