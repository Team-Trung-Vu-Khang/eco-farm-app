import type { SupplyType } from "@/features/farm-supply/types";
import type { BiologicalProduct } from "../types/types";
export type { BiologicalProduct };

/**
 * TODO(API): Backend chưa có endpoint riêng cho chế phẩm sinh học — hiện chỉ có
 * medicines / fertilizers / materials / equipment. Tạm dùng chung "fertilizer"
 * để UI chạy được; khi có endpoint mới thì thêm giá trị vào `SupplyType`
 * (features/farm-supply/types) + `SUPPLY_PATHS` (farm-supply.api.ts) rồi đổi
 * hằng số này. Toàn bộ module chỉ tham chiếu qua đây nên sửa một chỗ là đủ.
 */
export const SUPPLY_TYPE: SupplyType = "fertilizer";

/**
 * TODO(API): Danh mục nhóm — cùng lý do trên, chưa có catalog riêng cho chế phẩm
 * sinh học nên tạm dùng "fertilizer-groups".
 */
export const SUPPLY_GROUP_CATALOG = "fertilizer-groups" as const;

/** Nhóm hoạt chất sinh học chính của chế phẩm */
export const nutritionalContentOptions = [
  { id: "microorganism", label: "Vi sinh vật có ích" },
  { id: "enzyme", label: "Enzyme" },
  { id: "plant_extract", label: "Chiết xuất thực vật" },
];

/** Nguồn gốc chế phẩm */
export const originOptions = [
  { id: "microbial", label: "Vi sinh" },
  { id: "botanical", label: "Thảo mộc" },
  { id: "mineral", label: "Khoáng sinh học" },
];

/** Giai đoạn sử dụng trong chu kỳ canh tác */
export const applicationStageOptions = [
  { id: "soil_preparation", label: "Xử lý đất trước gieo trồng" },
  { id: "growth_stage", label: "Giai đoạn sinh trưởng" },
  { id: "post_harvest", label: "Sau thu hoạch" },
];

export const physicalFormOptions = [
  { id: "soil_application", label: "Xử lý qua đất" },
  { id: "foliar_application", label: "Phun qua lá" },
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

export const initialBiologicalProducts: BiologicalProduct[] = [
  {
    id: 1,
    code: "CPSH001",
    name: "Chế phẩm Trichoderma đối kháng",
    nutritionalContentId: "microorganism",
    originId: "microbial",
    applicationStageId: "soil_preparation",
    physicalFormId: "soil_application",
    nutrientContent: "Trichoderma harzianum: 1x10^9 CFU/g",
    description:
      "Chế phẩm vi sinh Trichoderma, đối kháng nấm bệnh vùng rễ và phân giải hữu cơ.",
    status: "active",
    createdAt: "2024-01-20",

    // Spec fields
    registrationNumber: "LH-5821/GP-CPSH",
    scientificTechnicalName: "Trichoderma harzianum Rifai",
    biologicalProductOriginGroup: "Vi sinh",
    nutritionalComponents: "Vi sinh vật có ích",
    biologicalProductType: "Chế phẩm vi sinh đối kháng",
    physicalForm: "Dạng hạt (Granular)",
    mainIngredients:
      "Trichoderma harzianum: 1x10^9 CFU/g\nBacillus subtilis: 1x10^8 CFU/g\nĐộ ẩm: 5%",
    moaGroup: "Ký sinh và cạnh tranh dinh dưỡng với nấm bệnh vùng rễ",
    npkRatio: "",

    indications:
      "Phòng trừ nấm bệnh vùng rễ (Phytophthora, Fusarium, Rhizoctonia). Phân giải chất hữu cơ, cải tạo đất và kích thích bộ rễ phát triển.",
    applicationStage: "Xử lý đất trước gieo trồng",
    targetCrops: ["Cây lúa", "Cây ăn quả (sầu riêng, xoài, nhãn, bưởi...)", "Cây công nghiệp (cà phê, hồ tiêu, cao su, chè...)"],
    recommendedDosage:
      "Xử lý đất: 3-5 kg/ha\nTưới gốc: 20-30 g/10 lít nước, định kỳ 15-20 ngày/lần",
    applicationMethod:
      "Trộn đều với phân hữu cơ hoai mục rải quanh tán, hoặc hòa nước tưới vùng rễ",
    usageNotes:
      "Không dùng chung với thuốc trừ nấm hóa học; cách ly tối thiểu 7 ngày. Tưới giữ ẩm sau khi xử lý để vi sinh phát triển.",

    toxicityInfo: "Không độc hại trực tiếp nếu tiếp xúc da thông thường. Có thể gây kích ứng mắt nhẹ. Hạn chế rửa trôi lượng lớn xuống ao hồ nuôi thủy sản.",
    protectiveMeasures:
      "Đeo găng tay và khẩu trang khi thao tác. Rửa sạch tay bằng xà phòng sau khi sử dụng.",
    firstAid: "<p>Nếu dính vào mắt: rửa sạch bằng nước ấm trong 15 phút. Nếu nuốt phải số lượng lớn: uống nhiều nước và gây nôn, sau đó đưa tới y tế.</p>",
    legalStatus: "Được phép lưu hành tại Việt Nam",
    standardsCompliance: ["VietGAP", "GlobalG.A.P"],

    manufacturerOrigin: "Công ty Cổ phần Công nghệ Sinh học Nông nghiệp - Việt Nam",
    importerRegistrant: "Bình Điền JSC",
    distributor: "Hệ thống Đại lý Vật tư Nông nghiệp Toàn quốc",
    referencePrice: "850.000 đ / bao 50kg",
    packagingSpecs: ["Bao 50kg", "Bao 25kg"],
  },
  {
    id: 2,
    code: "CPSH002",
    name: "Chế phẩm EM gốc",
    nutritionalContentId: "microorganism",
    originId: "botanical",
    applicationStageId: "growth_stage",
    physicalFormId: "soil_application",
    nutrientContent: "Vi sinh vật hữu hiệu tổng số: 1x10^8 CFU/ml",
    description:
      "Tổ hợp vi sinh vật hữu hiệu, dùng ủ phân hữu cơ, xử lý mùi và cải tạo hệ vi sinh vùng rễ.",
    status: "active",
    createdAt: "2024-01-21",

    registrationNumber: "LH-0934/GP-CPSH",
    scientificTechnicalName: "Effective Microorganisms (EM)",
    biologicalProductOriginGroup: "Vi sinh",
    nutritionalComponents: "Vi sinh vật có ích",
    biologicalProductType: "Chế phẩm vi sinh tổng hợp (EM)",
    physicalForm: "Dạng dung dịch",
    mainIngredients:
      "Lactobacillus sp.: 1x10^8 CFU/ml\nSaccharomyces sp.: 1x10^7 CFU/ml\nRhodopseudomonas sp.: 1x10^6 CFU/ml",
    moaGroup: "Lên men phân giải hữu cơ, ức chế vi sinh vật gây hại",

    indications:
      "Ủ nhanh phân hữu cơ và phụ phẩm nông nghiệp, khử mùi hôi chuồng trại, cân bằng hệ vi sinh vùng rễ.",
    applicationStage: "Xử lý đất và giai đoạn sinh trưởng",
    targetCrops: ["Cây ăn quả (sầu riêng, xoài, nhãn, bưởi...)", "Rau màu (rau cải, xà lách, muống...)", "Cây công nghiệp (cà phê, hồ tiêu, cao su, chè...)"],
    recommendedDosage:
      "Ủ phân: 1 lít EM gốc cho 1 tấn nguyên liệu\nTưới gốc: pha loãng 1/500, định kỳ 10-15 ngày/lần",
    applicationMethod:
      "Pha loãng với nước sạch (không chứa clo) rồi tưới gốc hoặc phun đều lên nguyên liệu ủ",
    usageNotes:
      "Bảo quản nơi mát, tránh ánh nắng trực tiếp. Không pha với nước máy còn clo hoặc dùng chung thuốc sát khuẩn.",

    toxicityInfo: "Hoàn toàn an toàn thân thiện môi trường, không độc hại với người và gia súc gia cầm.",
    protectiveMeasures:
      "Đeo găng tay khi pha chế. Tránh để dung dịch bắn vào mắt.",
    firstAid:
      "<p>Nếu dính vào mắt: rửa sạch bằng nước trong 15 phút. Rửa tay bằng xà phòng sau khi sử dụng.</p>",
    legalStatus: "Được phép lưu hành tại Việt Nam",
    standardsCompliance: ["VietGAP", "Organic (hữu cơ)"],

    manufacturerOrigin: "Viện Công nghệ Sinh học Nông nghiệp - Việt Nam",
    importerRegistrant: "AgriBio Vietnam",
    distributor: "Hệ thống Đại lý Vật tư Nông nghiệp Miền Nam",
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
  {
    id: "sup1",
    name: "Công ty Công nghệ Sinh học Nông nghiệp",
    type: "enterprise",
  },
  { id: "sup2", name: "Đại lý VTNN Hòa Phát", type: "enterprise" },
  { id: "sup3", name: "HTX Nông nghiệp Xanh", type: "enterprise" },
  { id: "sup4", name: "Nông hộ Nguyễn Văn A", type: "farmer" },
];

export const units = ["Bao", "Gói", "Thùng", "Chai", "Can", "Tấn", "Kg"];
