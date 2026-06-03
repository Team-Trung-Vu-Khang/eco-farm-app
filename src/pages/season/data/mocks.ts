import type { Season } from "../types/types";

export const initialSeasons: Season[] = [
  {
    id: "S_COCO_001",
    code: "SV-COCO-DBSCL-CHINHVU",
    name: "Chính vụ dừa Đồng bằng sông Cửu Long (Đỉnh điểm năng suất)",
    description:
      "Dù dừa ra trái quanh năm, nhưng mùa vụ thu hoạch tập trung đạt đỉnh điểm vào giai đoạn từ tháng 5 đến tháng 8 hằng năm. Sự chuyển giao từ mùa khô sang mùa mưa với lượng mưa và độ ẩm cao kích thích phân hóa mầm hoa và thúc trái non lớn nhanh [2]. Tuy nhiên, vào mùa mưa nước dừa có thể nhạt hơn và giảm hương thơm [4].",
    duration: 365,
    status: "active",
    scope: "crop",
    cropId: "Dừa",
    growthCycleIds: ["GC_COCO_001"],
    documents: [
      {
        id: "D_COCO_001",
        name: "Quy-trinh-canh-tac-dua-DBSCL.pdf",
        url: "#",
        type: "technical",
        uploadedAt: "2026-01-15",
      },
    ],
    createdAt: 1777828295460,
    updatedAt: 1780420308039,
    selectedStages: {
      GC_COCO_001: {
        coco_s1_3: "6 - 40 năm",
      },
    },
  },
  {
    id: "S_COCO_002",
    code: "SV-COCO-NUOC-MUANANG",
    name: "Mùa dừa uống nước đạt chất lượng cao (Mùa nắng)",
    description:
      "Tập trung vào các tháng mùa khô. Cường độ bức xạ cao thúc đẩy quang hợp, làm tăng nồng độ chất khô hòa tan. Nước dừa thu hoạch mùa này có độ Brix (đường) cao hơn, vị ngọt đậm đà và hương thơm (như dừa dứa) nồng nàn nhất [4]. Yêu cầu chú ý giữ ẩm, bồi bùn và ngăn mặn để tránh rụng trái non [5, 6].",
    duration: 365,
    status: "active",
    scope: "variety",
    cropId: "Dừa",
    varietyId: "1",
    growthCycleIds: ["GC_VAR_001"],
    documents: [
      {
        id: "D_COCO_002",
        name: "Ky-thuat-giu-am-chong-man-mua-kho.pdf",
        url: "#",
        type: "technical",
        uploadedAt: "2026-02-10",
      },
    ],
    createdAt: 1775236295460,
    updatedAt: 1780420319869,
    selectedStages: {
      GC_VAR_001: {
        var1_s1: "30 tháng",
        var1_s2: "6 tháng",
        var1_s3: "nhiều năm",
      },
    },
  },
  {
    id: "S_COCO_003",
    code: "SV-COCO-TACA-BINHDINH",
    name: "Vụ dừa Ta đặc sản - Hoài Nhơn, Bình Định",
    description:
      "Mang đặc tính sinh thái của dải đất miền Trung. Chu kỳ ra hoa chính tập trung vào tháng 9 đến tháng 11 (mùa mưa lớn). Quá trình phát triển quả kéo dài qua mùa đông lạnh và bước vào thu hoạch rầm rộ từ tháng 4 đến tháng 8 năm sau, năng suất đạt 70 - 80 quả/cây/năm [7].",
    duration: 365,
    status: "planning",
    scope: "variety",
    cropId: "Dừa",
    varietyId: "3",
    growthCycleIds: ["GC_VAR_003"],
    documents: [],
    createdAt: 1772644295460,
    updatedAt: 1780420326743,
    selectedStages: {
      GC_VAR_003: {
        var3_s1: "6 tháng",
        var3_s2: "48 tháng",
        var3_s3: "12 tháng",
        var3_s4: "nhiều năm",
      },
    },
  },
  {
    id: "S_COCO_004",
    code: "SV-COCO-MUATREO",
    name: "Hiện tượng 'Mùa treo dừa' (Thời kỳ thất thu sinh lý)",
    description:
      "Tình trạng cây dừa không có buồng hoa, hoa thui chột hoặc rụng trái non hàng loạt. Thường xảy ra vào mùa mưa (tháng 7 đến tháng 10). Đây là cơ chế phản hồi chậm do cây từng chịu stress nghiêm trọng (hạn mặn, thiếu dinh dưỡng) từ 15-16 tháng trước đó [3, 8, 9]. Cần có biện pháp can thiệp sớm từ năm trước để tránh rớt năng suất [3, 6].",
    duration: 120,
    status: "active",
    scope: "crop",
    cropId: "Dừa",
    growthCycleIds: ["GC_COCO_002"],
    documents: [
      {
        id: "D_COCO_003",
        name: "Phac-do-khac-phuc-dua-treo.pdf",
        url: "#",
        type: "technical",
        uploadedAt: "2026-03-05",
      },
    ],
    createdAt: 1770052295460,
    updatedAt: 1780420334710,
    selectedStages: {
      GC_COCO_002: {
        coco_s2_2: "90 ngày",
      },
    },
  },
];
