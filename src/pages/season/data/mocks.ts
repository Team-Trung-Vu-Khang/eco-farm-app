import type { Season } from "../types/types";

export const initialSeasons: Season[] = [
  {
    id: "S001",
    code: "SV-DBSCL-CHINHVU",
    name: "Chính vụ Đồng bằng sông Cửu Long",
    description:
      "Thu hoạch tập trung từ tháng 3 đến tháng 5 hàng năm với điều kiện nắng ấm đầu mùa khô, bức xạ cao giúp trái đạt độ béo tốt",
    duration: 365,
    status: "active",
    seasonType: "plant",
    scope: "crop",
    cropId: "Sầu riêng",
    growthCycleIds: ["GC001"],
    documents: [
      {
        id: "D001",
        name: "Quy trình canh tác thuận vụ ĐBSCL.pdf",
        url: "#",
        type: "technical",
        uploadedAt: "2024-01-15",
      },
    ],
    createdAt: 1767366133224,
    updatedAt: 1780326299036,
    selectedStages: {
      GC001: {
        s1_1: "90 ngày",
      },
    },
  },
  {
    id: "S002",
    code: "SV-DBSCL-NGHICHVU-RI6",
    name: "Vụ Nghịch ĐBSCL - Sầu riêng Ri6",
    description:
      "Xử lý ra hoa nghịch vụ bằng cách xiết nước, đậy bạt nilon để thu hoạch từ tháng 11 đến tháng 3 năm sau, mang lại giá trị thương mại cực cao.",
    duration: 250,
    status: "active",
    seasonType: "plant",
    scope: "variety",
    cropId: "Sầu riêng",
    varietyId: "1",
    growthCycleIds: ["GC003"],
    documents: [
      {
        id: "D002",
        name: "7-buoc-xu-ly-ra-hoa-nghich-vu.pdf",
        url: "#",
        type: "technical",
        uploadedAt: "2024-02-10",
      },
    ],
    createdAt: 1772550133224,
    updatedAt: 1780326309569,
    selectedStages: {
      GC003: {
        r1_2: "15 ngày",
        r1_3: "55 ngày",
      },
    },
  },
  {
    id: "S003",
    code: "SV-DNB-CHINHVU",
    name: "Chính vụ Đông Nam Bộ",
    description:
      "Thu hoạch từ tháng 4 đến tháng 7 tại các vùng đồi thấp như Đồng Nai, Tây Ninh, Bình Phước.",
    duration: 365,
    status: "planning",
    seasonType: "plant",
    scope: "variety",
    cropId: "Sầu riêng",
    varietyId: "2",
    growthCycleIds: ["GC004"],
    documents: [],
    createdAt: 1776006133224,
    updatedAt: 1780326320202,
    selectedStages: {
      GC004: {
        m1_4: "120 ngày",
        m1_1: "40 ngày",
        m1_2: "15 ngày",
        m1_3: "45 ngày",
      },
    },
  },
  {
    id: "S004",
    code: "SV-TAYNGUYEN-CHINHVU",
    name: "Chính vụ Tây Nguyên",
    description:
      "Mùa vụ thu hoạch muộn nhất cả nước nhờ khí hậu cao nguyên, bắt đầu từ tháng 7 (Đắk Nông) và kéo dài đến tháng 11 (Bảo Lộc, Lâm Đồng).",
    duration: 365,
    status: "planning",
    seasonType: "plant",
    scope: "crop",
    cropId: "Sầu riêng",
    growthCycleIds: ["GC001"],
    documents: [
      {
        id: "D003",
        name: "Ky-thuat-canh-tac-tay-nguyen.pdf",
        url: "#",
        type: "technical",
        uploadedAt: "2024-03-05",
      },
    ],
    createdAt: 1778598133224,
    updatedAt: 1780326328633,
    selectedStages: {
      GC001: {
        s1_2: "45 ngày",
        s1_3: "55 ngày",
        s1_4: "110 ngày",
      },
    },
  },
  {
    id: "S005",
    code: "VU-HEO-THIT-2025",
    name: "Vụ heo thịt tăng trọng 2025",
    description:
      "Tập trung giai đoạn úm, tăng trọng và xuất chuồng theo lịch nuôi heo thịt trong năm 2025.",
    duration: 180,
    status: "active",
    seasonType: "animal",
    scope: "variety",
    cropId: "heo",
    varietyId: "heo-thit",
    growthCycleIds: ["GC006"],
    documents: [
      {
        id: "D004",
        name: "Quy-trinh-nuoi-heo-thit-2025.pdf",
        url: "#",
        type: "technical",
        uploadedAt: "2025-01-08",
      },
    ],
    createdAt: 1789006133224,
    updatedAt: 1789326299036,
    selectedStages: {
      GC006: {
        p1_1: "28 ngày",
        p1_2: "52 ngày",
        p1_3: "60 ngày",
        p1_4: "40 ngày",
      },
    },
  },
  {
    id: "S006",
    code: "VU-GA-THIT-2025",
    name: "Vụ gà thịt công nghiệp 2025",
    description:
      "Lịch nuôi gà thịt theo lứa, tập trung úm - tăng trưởng - xuất bán cho hệ thống chuồng kín.",
    duration: 70,
    status: "planning",
    seasonType: "animal",
    scope: "variety",
    cropId: "ga",
    varietyId: "ga-thit",
    growthCycleIds: ["GC007"],
    documents: [],
    createdAt: 1789606133224,
    updatedAt: 1789726299036,
    selectedStages: {
      GC007: {
        g1_1: "14 ngày",
        g1_2: "21 ngày",
        g1_3: "20 ngày",
        g1_4: "15 ngày",
      },
    },
  },
];
