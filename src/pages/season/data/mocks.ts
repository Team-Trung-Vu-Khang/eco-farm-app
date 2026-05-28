import type { Season } from "../types/types";

const now = Date.now();

export const initialSeasons: Season[] = [
  {
    id: "S001",
    code: "SV-DBSCL-CHINHVU",
    name: "Chính vụ Đồng bằng sông Cửu Long",
    description:
      "Thu hoạch tập trung từ tháng 3 đến tháng 5 hàng năm với điều kiện nắng ấm đầu mùa khô, bức xạ cao giúp trái đạt độ béo tốt",
    duration: 365,
    status: "active",
    scope: "crop",
    cropId: "Sầu riêng",
    growthCycleIds: ["GC001"], // Quy trình Sầu riêng kinh doanh (Thuận vụ)
    documents: [
      {
        id: "D001",
        name: "Quy trình canh tác thuận vụ ĐBSCL.pdf",
        url: "#",
        type: "technical",
        uploadedAt: "2024-01-15",
      },
    ],
    createdAt: now - 150 * 86400000,
    updatedAt: now - 10 * 86400000,
  },
  {
    id: "S002",
    code: "SV-DBSCL-NGHICHVU-RI6",
    name: "Vụ Nghịch ĐBSCL - Sầu riêng Ri6",
    description:
      "Xử lý ra hoa nghịch vụ bằng cách xiết nước, đậy bạt nilon để thu hoạch từ tháng 11 đến tháng 3 năm sau, mang lại giá trị thương mại cực cao.",
    duration: 250, // Chu kỳ làm bông đến thu hoạch ngắn hơn (đặc thù nghịch vụ)
    status: "active",
    scope: "variety",
    cropId: "Sầu riêng",
    varietyId: "1", // Sầu riêng Ri6
    growthCycleIds: ["GC003"], // Quy trình Sầu riêng Ri6 (Nghịch vụ ĐBSCL)
    documents: [
      {
        id: "D002",
        name: "7-buoc-xu-ly-ra-hoa-nghich-vu.pdf",
        url: "#",
        type: "technical",
        uploadedAt: "2024-02-10",
      },
    ],
    createdAt: now - 90 * 86400000,
    updatedAt: now - 2 * 86400000,
  },
  {
    id: "S003",
    code: "SV-DNB-CHINHVU",
    name: "Chính vụ Đông Nam Bộ",
    description:
      "Thu hoạch từ tháng 4 đến tháng 7 tại các vùng đồi thấp như Đồng Nai, Tây Ninh, Bình Phước.",
    duration: 365,
    status: "planning",
    scope: "variety",
    cropId: "Sầu riêng",
    varietyId: "2", // Sầu riêng Monthong (Dona) phổ biến tại Đông Nam Bộ
    growthCycleIds: ["GC004"], // Quy trình Sầu riêng Monthong
    documents: [],
    createdAt: now - 50 * 86400000,
    updatedAt: now,
  },
  {
    id: "S004",
    code: "SV-TAYNGUYEN-CHINHVU",
    name: "Chính vụ Tây Nguyên",
    description:
      "Mùa vụ thu hoạch muộn nhất cả nước nhờ khí hậu cao nguyên, bắt đầu từ tháng 7 (Đắk Nông) và kéo dài đến tháng 11 (Bảo Lộc, Lâm Đồng).",
    duration: 365,
    status: "planning",
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
    createdAt: now - 20 * 86400000,
    updatedAt: now,
  },
];
