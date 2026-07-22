import type { GeographicalSelection } from "../components/types";

export type AquacultureGeoOption = {
  id: string;
  type: "region" | "area" | "plot";
  name: string;
  regionId: string;
  areaId?: string;
  plotId?: string;
  parentName?: string;
};

export const AQUACULTURE_GEO_OPTIONS: AquacultureGeoOption[] = [
  {
    id: "region-1",
    type: "region",
    name: "Vùng nuôi tôm Cần Giờ",
    regionId: "1",
  },
  {
    id: "area-1",
    type: "area",
    name: "Khu nuôi thủy sản Long Sơn",
    regionId: "1",
    areaId: "11",
    parentName: "Vùng nuôi tôm Cần Giờ",
  },
  {
    id: "plot-1",
    type: "plot",
    name: "Lô nuôi cá tra Bến Tre",
    regionId: "2",
    areaId: "21",
    plotId: "211",
    parentName: "Vùng nuôi cá tra Trà Vinh",
  },
  {
    id: "region-2",
    type: "region",
    name: "Vùng nuôi nghêu Bến Tre",
    regionId: "2",
  },
  {
    id: "area-2",
    type: "area",
    name: "Khu nuôi tôm sú Trà Vinh",
    regionId: "2",
    areaId: "22",
    parentName: "Vùng nuôi nghêu Bến Tre",
  },
  {
    id: "plot-2",
    type: "plot",
    name: "Lô ươm giống Phú Yên",
    regionId: "3",
    areaId: "31",
    plotId: "311",
    parentName: "Khu nuôi biển Phú Yên",
  },
];

export const AQUACULTURE_ENTERPRISES = [
  { id: "ent-1", name: "Công ty Nuôi biển Xanh" },
  { id: "ent-2", name: "Hợp tác xã Thủy sản Phát Lộc" },
  { id: "ent-3", name: "Trang trại Đông Hải" },
];

export const AQUACULTURE_MANAGERS = [
  {
    id: 11,
    fullName: "Nguyễn Minh Hải",
    avatarUrl: "",
    position: "Trưởng vùng",
    department: "Kỹ thuật nuôi",
  },
  {
    id: 12,
    fullName: "Trần Thị Thu Hà",
    avatarUrl: "",
    position: "Kỹ sư thủy sản",
    department: "Vận hành",
  },
  {
    id: 13,
    fullName: "Lê Hoàng Nam",
    avatarUrl: "",
    position: "Giám sát lô",
    department: "Giám sát",
  },
  {
    id: 14,
    fullName: "Phạm Ngọc Anh",
    avatarUrl: "",
    position: "Quản lý kỹ thuật",
    department: "Nuôi trồng",
  },
];

export const AQUACULTURE_CERTIFICATES = [
  { id: 101, code: "ASC", name: "ASC" },
  { id: 102, code: "VietGAP", name: "VietGAP" },
  { id: 103, code: "BAP", name: "BAP" },
  { id: 104, code: "GlobalGAP", name: "GlobalGAP" },
];

export const AQUACULTURE_FARMING_METHODS = [
  { id: "1", name: "Nuôi ao đất" },
  { id: "2", name: "Nuôi lồng bè" },
  { id: "3", name: "Nuôi tuần hoàn RAS" },
  { id: "4", name: "Nuôi bể xi măng" },
];

export const AQUACULTURE_IRRIGATION_SYSTEMS = [
  { id: "1", name: "Cấp thoát nước riêng" },
  { id: "2", name: "Tuần hoàn lọc sinh học" },
  { id: "3", name: "Bơm tự động" },
  { id: "4", name: "Kênh dẫn ven biển" },
];

export const AQUACULTURE_SPECIES = [
  { id: 201, varietyName: "Tôm thẻ chân trắng" },
  { id: 202, varietyName: "Tôm sú" },
  { id: 203, varietyName: "Cá tra" },
  { id: 204, varietyName: "Nghêu" },
  { id: 205, varietyName: "Cá mú" },
  { id: 206, varietyName: "Cá rô phi đơn tính" },
];

export const AQUACULTURE_REGION_TREE = [
  {
    id: "1",
    name: "Vùng nuôi tôm Cần Giờ",
    enterpriseId: "ent-1",
    subAreas: [
      {
        id: "11",
        name: "Khu nuôi thủy sản Long Sơn",
        plots: [
          { id: "111", name: "Lô nuôi số 1" },
          { id: "112", name: "Lô nuôi số 2" },
          { id: "113", name: "Lô nuôi số 3" },
        ],
      },
      {
        id: "12",
        name: "Khu ươm giống ven biển",
        plots: [
          { id: "121", name: "Lô ươm giống 1" },
          { id: "122", name: "Lô ươm giống 2" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Vùng nuôi nghêu Bến Tre",
    enterpriseId: "ent-2",
    subAreas: [
      {
        id: "21",
        name: "Khu nuôi nghêu cửa sông",
        plots: [
          { id: "211", name: "Lô nghêu A" },
          { id: "212", name: "Lô nghêu B" },
          { id: "213", name: "Lô nghêu C" },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Vùng nuôi cá tra Trà Vinh",
    enterpriseId: "ent-3",
    subAreas: [
      {
        id: "31",
        name: "Khu ao nuôi tập trung",
        plots: [
          { id: "311", name: "Lô cá tra 1" },
          { id: "312", name: "Lô cá tra 2" },
        ],
      },
    ],
  },
] as const;

export const AQUACULTURE_DRAFT_BY_ID = {
  1: {
    id: 1,
    code: "AQ-001",
    name: "Vùng nuôi tôm mẫu Cần Giờ",
    selections: [
      {
        id: "region-1",
        type: "region",
        regionId: "1",
        name: "Vùng nuôi tôm Cần Giờ",
      } satisfies GeographicalSelection,
      {
        id: "area-1",
        type: "area",
        regionId: "1",
        areaId: "11",
        name: "Khu nuôi thủy sản Long Sơn",
        regionName: "Vùng nuôi tôm Cần Giờ",
      } satisfies GeographicalSelection,
    ],
    enterpriseId: "ent-2",
    farmingMethodId: 2,
    irrigationSystemId: 2,
    seedIds: [201, 202, 206],
    certificateIds: [101, 102, 104],
    personnelIds: [11, 12, 14],
    notes: "Bản nháp thủy sản dùng dữ liệu giả, đã có đủ thông tin mẫu.",
    status: "active" as const,
  },
} as const;
