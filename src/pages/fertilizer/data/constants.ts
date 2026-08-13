import type { Fertilizer } from "../types/types";
export type { Fertilizer };

export const nutritionalContentOptions = [
  { id: "macronutrients", label: "Nhóm Đa lượng" },
  { id: "secondary_nutrients", label: "Nhóm Trung lượng" },
  { id: "micronutrients", label: "Nhóm Vi lượng" },
];

export const originOptions = [
  { id: "inorganic", label: "Phân Vô cơ" },
  { id: "organic", label: "Phân Hữu cơ" },
  { id: "biological", label: "Phân Sinh học / Vi sinh" },
];

export const applicationStageOptions = [
  { id: "basal_application", label: "Bón lót" },
  { id: "top_dressing", label: "Bón thúc" },
];

export const physicalFormOptions = [
  { id: "soil_application", label: "Phân bón gốc" },
  { id: "foliar_application", label: "Phân bón lá" },
];

export const targetCropsOptions = [
  "Cây lúa",
  "Cây ngô (bắp)",
  "Rau màu (rau cải, xà lách, muống...)",
  "Cây ăn quả (sầu riêng, xoài, nhãn, bưởi...)",
  "Cây công nghiệp (cà phê, hồ tiêu, cao su, chè...)",
  "Hoa & cây cảnh",
  "Cây lấy củ (khoai lang, sắn, khoai tây...)",
  "Cây lương thực khác",
];

export const standardsOptions = [
  "VietGAP",
  "GlobalG.A.P",
  "Organic (hữu cơ)",
  "EU MRL (Tiêu chuẩn dư lượng EU)",
  "FDA (Mỹ)",
  "HACCP",
  "ISO 22000",
];

export const packagingUnitOptions = [
  "Bao 50 kg",
  "Bao 25 kg",
  "Bao 10 kg",
  "Túi 5 kg",
  "Túi 1 kg",
  "Túi 500 g",
  "Chai 1 L",
  "Chai 500 ml",
  "Chai 100 ml",
  "Can 5 L",
  "Can 10 L",
];

export const initialFertilizers: Fertilizer[] = [
  {
    id: 1,
    code: "PB001",
    name: "NPK 20-20-15 Đầu Trâu",
    nutritionalContentId: "macronutrients",
    originId: "inorganic",
    applicationStageId: "top_dressing",
    physicalFormId: "soil_application",
    nutrientContent: "N: 20%, P: 20%, K: 15%",
    description: "Phân bón NPK cao cấp, kích thích ra rễ, đẻ nhánh mạnh mẽ.",
    status: "active",
    createdAt: "2024-01-20",

    // Spec fields
    registrationNumber: "LH-5821/GP-PB",
    scientificTechnicalName: "Nitrogen-Phosphorus-Potassium Complex",
    fertilizerOriginGroup: "Vô cơ (Hóa học)",
    nutritionalComponents: "Nhóm Đa lượng (NPK)",
    fertilizerType: "Hỗn hợp/Phức hợp (NPK)",
    physicalForm: "Dạng hạt (Granular)",
    mainIngredients: "Đạm tổng số (N): 20%\nLân hữu hiệu (P2O5): 20%\nKali hữu hiệu (K2O): 15%\nĐộ ẩm: 5%",
    moaGroup: "Cơ chế hấp thụ qua rễ và hòa tan nhanh",
    npkRatio: "20-20-15",

    indications: "Cung cấp đa lượng cân đối cho cây trồng giai đoạn kiến thiết cơ bản và bón thúc giai đoạn tăng trưởng nhanh. Kích thích đẻ nhánh, đâm chồi, lá xanh dày, tăng khả năng chống chịu.",
    applicationStage: "Bón thúc sinh trưởng",
    targetCrops: ["Cây lúa", "Cây ăn quả (sầu riêng, xoài, nhãn, bưởi...)", "Cây công nghiệp (cà phê, hồ tiêu, cao su, chè...)"],
    recommendedDosage: "Lúa: 150-250 kg/ha/lần bón\nCây ăn quả: 0.5-1.5 kg/cây/lần bón tùy độ tuổi",
    applicationMethod: "Bón gốc (rải quanh tán cây sau đó tưới nước) hoặc bón đón mưa",
    usageNotes: "Bón đúng liều lượng khuyến cáo. Tránh bón lúc trời nắng gắt hoặc đất khô hạn mà không tưới nước.",

    toxicityInfo: "Không độc hại trực tiếp nếu tiếp xúc da thông thường. Có thể gây kích ứng mắt nhẹ. Hạn chế rửa trôi lượng lớn xuống ao hồ nuôi thủy sản.",
    protectiveMeasures: "Đeo găng tay khi bón phân thủ công. Rửa sạch tay bằng xà phòng sau khi sử dụng.",
    firstAid: "<p>Nếu dính vào mắt: rửa sạch bằng nước ấm trong 15 phút. Nếu nuốt phải số lượng lớn: uống nhiều nước và gây nôn, sau đó đưa tới y tế.</p>",
    legalStatus: "Được phép lưu hành tại Việt Nam",
    standardsCompliance: ["VietGAP", "GlobalG.A.P"],

    manufacturerOrigin: "Công ty Cổ phần Phân bón Bình Điền - Việt Nam",
    importerRegistrant: "Bình Điền JSC",
    distributor: "Hệ thống Đại lý Vật tư Nông nghiệp Toàn quốc",
    referencePrice: "850.000 đ / bao 50kg",
    packagingSpecs: ["Bao 50kg", "Bao 25kg"],
  },
  {
    id: 2,
    code: "PB002",
    name: "Phân hữu cơ vi sinh Sông Gianh",
    nutritionalContentId: "macronutrients",
    originId: "organic",
    applicationStageId: "basal_application",
    physicalFormId: "soil_application",
    nutrientContent: "Hữu cơ: 15%, Axit Humic: 2.5%",
    description: "Cải tạo cấu trúc đất, cung cấp mùn hữu cơ tự nhiên và hoạt hóa hệ vi sinh vật.",
    status: "active",
    createdAt: "2024-01-21",

    registrationNumber: "LH-0934/GP-PB",
    scientificTechnicalName: "Microbial Organic Fertilizer",
    fertilizerOriginGroup: "Hữu cơ vi sinh",
    nutritionalComponents: "Nhóm Hữu cơ & Vi sinh",
    fertilizerType: "Phân hữu cơ bổ sung chủng men vi sinh vật ích",
    physicalForm: "Dạng bột hoặc viên nén",
    mainIngredients: "Chất hữu cơ: 15%\nAxit Humic: 2.5%\nNitơ (N): 1%\nLân (P2O5): 1%\nVi sinh vật phân giải xenlulo: 1x10^6 CFU/g",
    moaGroup: "Hoạt hóa mùn đất và tăng cường hệ vi sinh vùng rễ",

    indications: "Cải tạo đất chai cứng, bạc màu. Tăng độ tơi xốp, giữ ẩm, hoạt hóa các khoáng chất khó tan trong đất giúp rễ hấp thu dễ dàng hơn.",
    applicationStage: "Bón lót cải tạo đất và bón thúc phục hồi",
    targetCrops: ["Cây ăn quả (sầu riêng, xoài, nhãn, bưởi...)", "Rau màu (rau cải, xà lách, muống...)", "Cây công nghiệp (cà phê, hồ tiêu, cao su, chè...)"],
    recommendedDosage: "Rau màu: 1.000-1.500 kg/ha/vụ bón lót\nCây ăn quả: 3-5 kg/gốc/năm",
    applicationMethod: "Trộn đều với đất mặt khi làm đất (bón lót) hoặc rải xung quanh rãnh rễ rồi lấp đất giữ ẩm",
    usageNotes: "Ủ ẩm đất sau khi bón phân hữu cơ vi sinh để hệ vi sinh vật sinh trưởng nhanh.",

    toxicityInfo: "Hoàn toàn an toàn thân thiện môi trường, không độc hại với người và gia súc gia cầm.",
    protectiveMeasures: "Sử dụng khẩu trang khi rải phân dạng bột để tránh hít phải bụi mịn hữu cơ.",
    firstAid: "<p>Súc miệng bằng nước sạch nếu hít phải bụi phân. Rửa tay sau khi hoàn thành bón lót.</p>",
    legalStatus: "Được phép lưu hành tại Việt Nam",
    standardsCompliance: ["VietGAP", "Organic (hữu cơ)"],

    manufacturerOrigin: "Tổng Công ty Sông Gianh - Việt Nam",
    importerRegistrant: "Sông Gianh Corp",
    distributor: "Đại lý Vật tư Nông nghiệp Sông Gianh Miền Nam",
    referencePrice: "220.000 đ / bao 25kg",
    packagingSpecs: ["Bao 25kg", "Bao 10kg"],
  }
];

export const commonHashtags = [
  "TangTruongNhanh",
  "CaiTaoDat",
  "RaHoaDauQua",
  "AnToanSinhHoc",
  "ChuyenDungCayAnQua",
];

export const suppliers = [
  { id: "sup1", name: "Công ty Phân bón Bình Điền", type: "enterprise" },
  { id: "sup2", name: "Đại lý VTNN Hòa Phát", type: "enterprise" },
  { id: "sup3", name: "HTX Nông nghiệp Xanh", type: "enterprise" },
  { id: "sup4", name: "Nông hộ Nguyễn Văn A", type: "farmer" },
];

export const units = ["Bao", "Gói", "Thùng", "Chai", "Can", "Tấn", "Kg"];
