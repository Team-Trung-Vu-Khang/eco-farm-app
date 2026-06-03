import type { Treatment, Material } from "../types/treatment.types";

export const cropTypes = [
  { id: 1, name: "Cây ăn quả" },
  { id: 2, name: "Cây lương thực" },
  { id: 3, name: "Cây rau" },
  { id: 4, name: "Cây công nghiệp" },
];

export const crops = {
  "Cây ăn quả": ["Sầu riêng", "Xoài", "Bưởi", "Thanh long"],
  "Cây lương thực": ["Lúa", "Ngô", "Khoai"],
  "Cây rau": ["Cà chua", "Dưa chuột", "Rau muống"],
  "Cây công nghiệp": ["Cà phê", "Cao su", "Hồ tiêu"],
};

export const varieties = {
  "Sầu riêng": ["Monthon", "Ri6", "Musang King"],
  Xoài: ["Cát Hòa Lộc", "Cát Chu", "Úc"],
  Bưởi: ["Da xanh", "Năm roi", "Diễn"],
  "Thanh long": ["Ruột đỏ", "Ruột trắng"],
};

export const seeds = {
  Monthon: ["Giống F1", "Giống lai"],
  Ri6: ["Giống thuần", "Giống ghép"],
  "Cát Hòa Lộc": ["Giống F1", "Giống cải tiến"],
};

export const diseases = [
  "Bệnh thán thư",
  "Bệnh đốm lá",
  "Bệnh héo xanh",
  "Sâu đục thân",
  "Rệp sáp",
  "Bọ trĩ",
  "Bệnh phấn trắng",
  "Bệnh thối rễ",
];

export const applicationMethods = [
  "Phun toàn bộ tán lá",
  "Phun trực tiếp vào vùng bệnh",
  "Tưới gốc",
  "Bón vào đất",
  "Phun sương",
];

export const ppeOptions = [
  "Khẩu trang",
  "Găng tay",
  "Kính bảo hộ",
  "Quần áo dài tay",
  "Ủng cao su",
  "Mũ bảo hộ",
];

export const severityConfig = {
  M0: {
    label: "M0 - Phòng",
    strategy: "Ngăn xuất hiện",
    description: "Chưa có bệnh / rất ít",
    color: "text-green-700 bg-green-50 border-green-200 ring-green-500/20",
    iconColor: "text-green-600 bg-green-100/50 ring-green-200",
    gradient: "from-green-50 to-white border-green-100",
  },
  M1: {
    label: "M1 - Chớm",
    strategy: "Khoanh vùng nhanh",
    description: "1-2 cây/điểm",
    color:
      "text-emerald-700 bg-emerald-50 border-emerald-200 ring-emerald-500/20",
    iconColor: "text-emerald-600 bg-emerald-100/50 ring-emerald-200",
    gradient: "from-emerald-50 to-white border-emerald-100",
  },
  M2: {
    label: "M2 - Vừa",
    strategy: "Dập triệu chứng",
    description: "Nhiều điểm rải rác",
    color: "text-amber-700 bg-amber-50 border-amber-200 ring-amber-500/20",
    iconColor: "text-amber-600 bg-amber-100/50 ring-amber-200",
    gradient: "from-amber-50 to-white border-amber-100",
  },
  M3: {
    label: "M3 - Nặng",
    strategy: "Chặn lan + giảm thiệt hại",
    description: "Lan nhanh, ảnh hưởng đọt/hoa/trái",
    color: "text-orange-700 bg-orange-50 border-orange-200 ring-orange-500/20",
    iconColor: "text-orange-600 bg-orange-100/50 ring-orange-200",
    gradient: "from-orange-50 to-white border-orange-100",
  },
  M4: {
    label: "M4 - Khủng hoảng",
    strategy: "Cứu vườn",
    description: "Nguy cơ chết cây/thiệt hại lớn",
    color: "text-red-700 bg-red-50 border-red-200 ring-red-500/20",
    iconColor: "text-red-600 bg-red-100/50 ring-red-200",
    gradient: "from-red-50 to-white border-red-100",
  },
} as const;

export const treatmentIntensityOptions = [
  { label: "Thấp - Theo dõi", value: "low" },
  { label: "Trung bình - Can thiệp vừa", value: "medium" },
  { label: "Cao - Cấp cứu thần tốc", value: "high" },
] as const;

export const treatmentPriorityOptions = [
  { label: "🔴 Ưu tiên cao", value: "high" },
  { label: "🟡 Trung bình", value: "medium" },
  { label: "🔵 Linh hoạt", value: "low" },
] as const;

export const responsibleUnitOptions = [
  { label: "Phòng Kỹ thuật NN", value: "tech_dept" },
  { label: "Đội Bảo vệ thực vật", value: "pesticide_team" },
  { label: "Ban Quản lý vùng trồng", value: "zone_mgmt" },
  { label: "Đơn vị tư vấn ngoài", value: "external_consult" },
] as const;

export const treatmentMethodOptions = [
  { label: "Phun xịt hóa học", value: "chemical_spray" },
  { label: "Kích kháng sinh học (SAR)", value: "biological_sar" },
  { label: "Tưới gốc đặc trị", value: "root_drench" },
  { label: "Xử lý ngoại khoa (Cạo vôi/quét thuốc)", value: "surgery" },
  { label: "Bón phân hồi phục rễ", value: "root_recovery_fert" },
] as const;

export const budgetRangeOptions = [
  { label: "< 5 triệu VNĐ/ha", value: "tier_1" },
  { label: "5 - 15 triệu VNĐ/ha", value: "tier_2" },
  { label: "15 - 30 triệu VNĐ/ha", value: "tier_3" },
  { label: "> 30 triệu VNĐ/ha", value: "tier_4" },
] as const;

export const treatmentMaterialCategoryOptions = [
  { label: "Thuốc BVTV (Hóa học)", value: "pesticide" },
  { label: "Thuốc trừ bệnh sinh học", value: "bio_fungicide" },
  { label: "Chế phẩm vi sinh", value: "microbial" },
  { label: "Phân bón lá", value: "foliar_fertilizer" },
  { label: "Phân bón gốc", value: "root_fertilizer" },
  { label: "Kích thích sinh trưởng", value: "growth_stimulant" },
  { label: "Chất bám dính/phụ trợ", value: "adjuvant" },
] as const;

export const inspectionParameterOptions = [
  { label: "Độ ẩm đất (%)", value: "soil_moisture" },
  { label: "Độ pH đất", value: "soil_ph" },
  { label: "Mật độ sâu hại (con/m2)", value: "pest_density" },
  { label: "Tỷ lệ vết bệnh (%)", value: "disease_rate" },
  { label: "Độ phủ tán lá", value: "canopy_cover" },
  { label: "Sức sống cây trồng", value: "plant_vigor" },
  { label: "Dư lượng nitrate", value: "nitrate_residue" },
];

// Mock materials database

export const materialsDatabase: Record<string, Material> = {
  PEST001: {
    id: "PEST001",
    code: "MZ-80",
    name: "Mancozeb 80% WP",
    type: "pesticide",
    manufacturer: "Bayer CropScience",
    activeIngredient: "Mancozeb",
    concentration: "80%",
    formulation: "Wettable Powder (WP)",
    toxicityLevel: "medium",
    safetyPeriod: "7 ngày",
    instructions:
      "Pha 2g thuốc với 1 lít nước. Phun đều lên lá cây vào buổi sáng sớm hoặc chiều mát.",
    dosageGuide: "1.5-2kg/ha, pha với 400-600 lít nước",
    storage:
      "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Nhiệt độ < 30°C",
    warnings: [
      "Không ăn uống khi đang sử dụng",
      "Tránh hít phải bụi thuốc",
      "Rửa tay sạch sau khi sử dụng",
      "Không thải bỏ bao bì ra môi trường",
    ],
    registrationNumber: "VN-2023-0145",
    expiryMonths: 24,
  },
  PEST002: {
    id: "PEST002",
    code: "CB-50",
    name: "Carbendazim 50% WP",
    type: "pesticide",
    manufacturer: "Syngenta",
    activeIngredient: "Carbendazim",
    concentration: "50%",
    formulation: "Wettable Powder (WP)",
    toxicityLevel: "medium",
    safetyPeriod: "14 ngày",
    instructions:
      "Pha 1.5g thuốc với 1 lít nước. Phun trực tiếp vào vùng bị bệnh, lặp lại sau 7-10 ngày nếu cần.",
    dosageGuide: "1-1.5kg/ha, pha với 400-500 lít nước",
    storage: "Bảo quản nơi khô ráo, nhiệt độ 15-25°C, tránh ẩm ướt",
    warnings: [
      "Độc tính trung bình - cần thận trọng",
      "Đeo găng tay và khẩu trang khi sử dụng",
      "Không phun khi có gió mạnh",
      "Tránh tiếp xúc với da và mắt",
    ],
    registrationNumber: "VN-2022-0892",
    expiryMonths: 36,
  },
  PEST003: {
    id: "PEST003",
    code: "CY-25",
    name: "Cypermethrin 25% EC",
    type: "pesticide",
    manufacturer: "FMC Corporation",
    activeIngredient: "Cypermethrin",
    concentration: "25%",
    formulation: "Emulsifiable Concentrate (EC)",
    toxicityLevel: "high",
    safetyPeriod: "21 ngày",
    instructions:
      "Pha 2ml thuốc với 1 lít nước. Phun vào thân cây và vùng bị sâu hại. Chỉ sử dụng khi thực sự cần thiết.",
    dosageGuide: "1-1.5 lít/ha, pha với 500-600 lít nước",
    storage:
      "Bảo quản nơi khô ráo, thoáng mát, khóa kín. Tránh xa thực phẩm và nước uống.",
    warnings: [
      "⚠️ ĐỘC TÍNH CAO - Cần bảo hộ đầy đủ",
      "Đeo quần áo dài tay, găng tay, kính bảo hộ, khẩu trang",
      "Không sử dụng gần nguồn nước",
      "Gây hại cho ong và sinh vật có ích",
      "Tắm rửa ngay sau khi sử dụng",
    ],
    registrationNumber: "VN-2023-0567",
    expiryMonths: 24,
  },
  FERT001: {
    id: "FERT001",
    code: "NPK-20-20-15",
    name: "NPK 20-20-15 + TE",
    type: "fertilizer",
    manufacturer: "Bình Điền",
    activeIngredient: "N: 20%, P: 20%, K: 15%",
    concentration: "Granular",
    formulation: "Granules",
    toxicityLevel: "low",
    safetyPeriod: "Không yêu cầu",
    instructions:
      "Rải đều quanh gốc, cách gốc 20-50cm tùy tán cây, tưới nước sau khi bón.",
    dosageGuide: "300-500g/gốc tùy tuổi cây",
    storage: "Nơi khô ráo, thoáng mát",
    warnings: ["Tránh xa tầm tay trẻ em"],
    registrationNumber: "PB-2023-099",
    expiryMonths: 24,
  },
  FERT002: {
    id: "FERT002",
    code: "HC-ROOT",
    name: "Siêu Ra Rễ Hữu Cơ",
    type: "fertilizer",
    manufacturer: "Organic Farm Labs",
    activeIngredient: "Humic Acid, Fulvic Acid, Amino Acid",
    concentration: "Liquid",
    formulation: "Solution",
    toxicityLevel: "low",
    safetyPeriod: "Không yêu cầu",
    instructions: "Pha 20ml/16 lít nước, tưới gốc hoặc phun lá.",
    dosageGuide: "1 lít/ha",
    storage: "Nơi thoáng mát, tránh ánh nắng",
    warnings: ["Lắc đều trước khi sử dụng"],
    registrationNumber: "PB-2023-112",
    expiryMonths: 18,
  },
  BIO001: {
    id: "BIO001",
    code: "BZYM-HCDF",
    name: "Bzym+ ($10^{15}$ CFU/mL)",
    type: "fertilizer", // Chức năng hồi phục rễ và đối kháng vi sinh [1][2]
    manufacturer: "TANBAOARGRI_PROBIOTICSVN",
    activeIngredient: "Bacillus subtilis & Lipopeptide (Surfactin, Iturin)",
    concentration: "10^15 CFU/mL",
    formulation: "Dịch thể (Liquid)",
    toxicityLevel: "low", // An toàn sinh học [5]
    safetyPeriod: "0 ngày",
    instructions:
      "Pha tỷ lệ 1 lít chế phẩm với 100 lít nước. Tưới đẫm vào vùng gốc trong bán kính 2m để tiêu diệt nấm Phytophthora.",
    dosageGuide:
      "500 ml/cây/lần. Tần suất 3 lần/tháng trong giai đoạn tấn công.",
    storage:
      "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp để bảo vệ hoạt lực vi sinh.",
    warnings: [
      "TUYỆT ĐỐI KHÔNG pha chung với thuốc bảo vệ thực vật gốc Đồng.",
      "Cách ly thuốc gốc Đồng ít nhất 5-7 ngày trước và sau khi sử dụng.",
      "Sử dụng ngay sau khi pha loãng với nước.",
    ],
    registrationNumber: "HCDF-2026-BZYM",
    expiryMonths: 12,
  },
  BIO002: {
    id: "BIO002",
    code: "EZYM-PRO",
    name: "Ezym (Dịch thể Đặc trị)",
    type: "pesticide", // Kháng sinh sinh học kích kháng SAR [1][9]
    manufacturer: "TANBAOARGRI_PROBIOTICSVN",
    activeIngredient:
      "Hợp chất kích kháng SAR & Enzyme phân giải vách tế bào nấm",
    concentration: "Đậm đặc",
    formulation: "Dịch thể (Liquid)",
    toxicityLevel: "low",
    safetyPeriod: "0 ngày",
    instructions:
      "Quét trực tiếp nồng độ nguyên chất lên vết xì mủ đã cạo sạch hoặc phun lên tán lá để kích hoạt hệ miễn dịch tự thân.",
    dosageGuide: "200 ml/cây/lần. Tần suất 4 lần/tháng trong giai đoạn ICU.",
    storage: "Nơi mát, tránh nhiệt độ cao làm biến tính Enzyme.",
    warnings: [
      "Không trộn chung với phân bón lá hóa học trong tuần đầu điều trị.",
      "Cần kết hợp với chất bám dính sinh học khi quét vết loét thân.",
    ],
    registrationNumber: "HCDF-2026-EZYM",
    expiryMonths: 12,
  },
  BIO003: {
    id: "BIO003",
    code: "OZYM-SOIL",
    name: "Ozym (Bào tử vi sinh)",
    type: "fertilizer", // Phân hủy hữu cơ và cải tạo nền đất [1][2]
    manufacturer: "TANBAOARGRI_PROBIOTICSVN",
    activeIngredient: "Bào tử Bacillus hiếu khí",
    concentration: "Mật độ bào tử cao",
    formulation: "Dạng bột/Bào tử (Spore Powder)",
    toxicityLevel: "low",
    safetyPeriod: "0 ngày",
    instructions:
      "Rải xung quanh vùng tán cây để phân hủy các rễ đã bị thối, triệt tiêu môi trường trú ngụ của nấm nấm.",
    dosageGuide: "100 g/cây/lần. Tần suất 1 lần/tháng.",
    storage: "Nơi khô ráo, tránh ẩm ướt để bào tử không nảy mầm sớm.",
    warnings: [
      "Nên xới nhẹ đất mặt trước khi rải để tăng độ thoáng khí cho vi sinh hiếu khí.",
      "Sử dụng kết hợp với phân hữu cơ hoai mục để tăng hiệu quả thiết lập quần thể.",
    ],
    registrationNumber: "HCDF-2026-OZYM",
    expiryMonths: 24,
  },
};

export const initialTreatments: Treatment[] = [
  {
    id: 101,
    code: "PT-COCO-SDD-001",
    name: "Phác đồ quản lý tổng hợp Sâu đầu đen hại dừa (Mức độ nặng)",
    cropType: "Cây công nghiệp",
    crop: "Dừa",
    variety: "Tất cả các giống",
    seed: "Cây giống thực sinh / Cấy mô",
    disease: "Sâu đầu đen (Opisina arenosella Walker)",
    severity: "M4",
    author: "Chi cục Trồng trọt và BVTV",
    authorTitle: "Chuyên gia bảo vệ thực vật",
    totalCost: "2,500,000 VNĐ/ha",
    totalDuration: "30 ngày",
    safetyRating: "medium",
    efficacyRate: "85%",
    stage: "Cây kinh doanh / Nuôi trái",
    responsibleUnit: "tech_dept",
    targetSeverity: "M4",
    priority: "high",
    budgetRange: "tier_2",
    cropGroupTags: ["Cây công nghiệp", "Cây ăn quả"],
    applicableCrops: ["Dừa", "Cau", "Chà là"],
    primaryMethodId: "chemical_spray",
    supportingMethodIds: ["biological_control", "mechanical_pruning"],
    goalTags: ["Diệt sâu đầu đen", "Bảo vệ lá", "Phục hồi sinh trưởng"],
    expectedOutcomeSummary:
      "Dập tắt dịch sâu đầu đen lây lan, bảo vệ các tàu lá non mới ra, thiết lập lại hệ sinh thái thiên địch trong vườn dừa sau 30 ngày.",
    procedures: [
      {
        id: 1011,
        stepNumber: 1,
        name: "Cắt tỉa và tiêu hủy mầm bệnh cơ học",
        description: "Loại bỏ nơi trú ẩn và nguồn lây lan của sâu đầu đen.",
        detailedInstructions:
          "Tiến hành cắt tỉa các tàu lá già, lá chét bị sâu đầu đen ăn cháy xơ xác phía dưới. Thu gom toàn bộ tàn dư này đem đốt hoặc ngâm ngập trong nước mương để tiêu diệt triệt để trứng, ấu trùng và nhộng ẩn nấp trong các đường hầm tơ.",
        dosage: "Không áp dụng",
        timing: "Ngày 1",
        technique: "Xử lý cơ học",
        materials: [],
        equipment: ["Kéo cắt cành lớn", "Câu liêm", "Bảo hộ lao động"],
        estimatedDays: 2,
        warnings: [
          "Tuyệt đối không vận chuyển tàu lá hoặc trái nhiễm bệnh sang vườn khác để tránh lây lan.",
        ],
        tips: [
          "Thực hiện đồng loạt trên diện rộng để tránh tái nhiễm từ vườn lân cận.",
        ],
        startDay: 1,
        endDay: 2,
        stageMaterials: [],
      },
      {
        id: 1012,
        stepNumber: 2,
        name: "Phun thuốc hóa học dập dịch cục bộ",
        description:
          "Sử dụng thuốc trừ sâu đặc trị pha kèm dầu khoáng để thấm qua lớp tơ bảo vệ của sâu.",
        detailedInstructions:
          "Phun các loại thuốc có hoạt chất Flubendiamide (Takumi 20WG) hoặc Emamectin benzoate (Comda Gold 5WG). Pha chung với dầu khoáng SK Enspray 99EC hoặc chất bám dính. Phun ướt đẫm đều hai mặt lá, xịt mạnh vào các tàu lá bị hại. Phun 2 lần cách nhau 7-10 ngày.",
        dosage: "8gr Takumi 20WG / 16 lít nước (cho 3-4 cây)",
        timing: "Ngày 3, Ngày 10",
        technique: "Phun xịt hóa học",
        materials: ["PEST-TAKUMI", "OIL-SK99EC"],
        equipment: ["Máy phun áp lực cao", "Cần phun dài"],
        estimatedDays: 8,
        warnings: [
          "Nên phun sáng sớm hoặc chiều mát. Tuân thủ đồ bảo hộ khi phun ngửa vòi lên tán dừa cao.",
        ],
        tips: [
          "Phun nhiều nước để thuốc thấm sâu vào lớp phân và tơ do sâu nhả ra.",
        ],
        startDay: 3,
        endDay: 10,
        stageMaterials: [
          {
            id: 10121,
            category: "pesticide",
            name: "Takumi 20WG (Flubendiamide)",
            dosageMin: "8",
            dosageMax: "10",
            unit: "g/16L",
          },
        ],
      },
      {
        id: 1013,
        stepNumber: 3,
        name: "Phóng thích thiên địch (Ong ký sinh)",
        description:
          "Thiết lập hàng rào sinh học bảo vệ vườn dừa lâu dài, thay thế thuốc hóa học.",
        detailedInstructions:
          "Sau khi phun thuốc hóa học từ 10-14 ngày (khi thuốc đã hết thời gian cách ly và hết độc tính), tiến hành thả ong ký sinh nhộng và ấu trùng (Goniozus nephantidis hoặc Bracon brevicornis) với mật độ 4.000 con/ha.",
        dosage: "20 con ong/cây",
        timing: "Ngày 24 - Ngày 30",
        technique: "Kiểm soát sinh học",
        materials: ["BIO-ONGKYSINH"],
        equipment: ["Hộp xốp chứa ong"],
        estimatedDays: 6,
        warnings: [
          "Tuyệt đối ngừng sử dụng thuốc trừ sâu hóa học phổ rộng khi đã thả ong ký sinh để tránh tiêu diệt thiên địch.",
        ],
        tips: [
          "Nên thả ong vào lúc 8-10h sáng hoặc 3-5h chiều lúc trời mát mẻ.",
        ],
        startDay: 24,
        endDay: 30,
        stageMaterials: [],
      },
    ],
    status: "active",
    createdAt: "2026-06-03T00:00:00.000Z",
  },
  {
    id: 102,
    code: "PT-COCO-PHYTO-002",
    name: "Phác đồ cấp cứu bệnh Thối đọt dừa do nấm Phytophthora",
    cropType: "Cây công nghiệp",
    crop: "Dừa",
    variety: "Dừa lùn / Dừa cao",
    seed: "Tất cả",
    disease: "Bệnh thối đọt (Phytophthora palmivora)",
    severity: "M3",
    author: "Viện Nghiên cứu Dầu và Cây có dầu",
    authorTitle: "Kỹ sư Nông nghiệp",
    totalCost: "1,200,000 VNĐ/ha",
    totalDuration: "21 ngày",
    safetyRating: "high",
    efficacyRate: "90%",
    stage: "Mùa mưa / Ẩm độ cao",
    responsibleUnit: "tech_dept",
    targetSeverity: "M3",
    priority: "high",
    budgetRange: "tier_1",
    cropGroupTags: ["Cây công nghiệp"],
    applicableCrops: ["Dừa"],
    primaryMethodId: "chemical_treatment",
    supportingMethodIds: ["mechanical_surgery", "soil_microbiome"],
    goalTags: ["Trị thối đọt", "Diệt nấm Phytophthora", "Cứu đỉnh sinh trưởng"],
    expectedOutcomeSummary:
      "Cây dừa ngừng hiện tượng thối nhũn ở đọt, lá non mới đâm lên không bị cong queo, nấm bệnh bị tiêu diệt hoàn toàn.",
    procedures: [
      {
        id: 1021,
        stepNumber: 1,
        name: "Vệ sinh và xử lý ngoại khoa phần đọt",
        description: "Loại bỏ mô hoại tử để ngăn nấm lây lan sâu vào củ hủ.",
        detailedInstructions:
          "Khi phát hiện lá đọt non bị vàng úa, rút nhẹ bị đứt gốc và ngửi thấy mùi hôi thối. Tiến hành dùng dao bén cắt bỏ hoàn toàn phần bẹ lá và mô bị thối nhũn. Thu gom phần thối đem ra khỏi vườn để tiêu hủy.",
        dosage: "Không áp dụng",
        timing: "Ngày 1",
        technique: "Xử lý ngoại khoa",
        materials: [],
        equipment: ["Dao bén", "Thang leo"],
        estimatedDays: 1,
        warnings: [
          "Sát trùng dao sau khi cắt cây bệnh để không lây nhiễm chéo sang cây khỏe.",
        ],
        tips: [
          "Chú ý kiểm tra và tiêu diệt kiến vương hoặc chuột, vì vết cắn của chúng là ngõ xâm nhập của nấm Phytophthora.",
        ],
        startDay: 1,
        endDay: 1,
        stageMaterials: [],
      },
      {
        id: 1022,
        stepNumber: 2,
        name: "Phun/tưới thuốc trừ nấm đặc trị",
        description:
          "Tiêu diệt sợi nấm Phytophthora ẩn sâu trong đỉnh sinh trưởng.",
        detailedInstructions:
          "Sử dụng các loại thuốc có tính lưu dẫn hai chiều mạnh như Ridomil-MZ 72 WP, Aliette 80WP hoặc Mataxyl 500WP pha đậm đặc. Phun kỹ hoặc tưới trực tiếp dung dịch thuốc vào giữa đọt lá, nách bẹ lá và phần đỉnh sinh trưởng vừa cắt. Xử lý 2-3 lần cách nhau 7 ngày.",
        dosage: "30g Ridomil / bình 8 lít",
        timing: "Ngày 1, Ngày 8, Ngày 15",
        technique: "Phun/tưới ngọn",
        materials: ["PEST-RIDOMIL", "PEST-ALIETTE"],
        equipment: ["Bình xịt", "Gáo tưới"],
        estimatedDays: 15,
        warnings: [
          "Nếu cây đã bị thối củ hủ hoàn toàn và chết đọt, bắt buộc phải đốn bỏ và tiêu hủy toàn bộ cây.",
        ],
        tips: [
          "Nên xử lý vào lúc trời khô ráo để thuốc ngấm sâu vào trong lõi bẹ dừa.",
        ],
        startDay: 1,
        endDay: 15,
        stageMaterials: [
          {
            id: 10221,
            category: "pesticide",
            name: "Ridomil-MZ 72 WP / Aliette 80WP",
            dosageMin: "30",
            dosageMax: "40",
            unit: "g/8L",
          },
        ],
      },
      {
        id: 1023,
        stepNumber: 3,
        name: "Tái tạo rễ và đối kháng nấm từ đất",
        description:
          "Nâng cao sức đề kháng hệ rễ, triệt tiêu mầm bệnh Phytophthora trong đất.",
        detailedInstructions:
          "Bón phân hữu cơ hoai mục kết hợp nấm đối kháng Trichoderma xung quanh vùng rễ (cách gốc 1.5 - 2m). Đảm bảo mương vườn thoát nước tốt, không bị ngập úng ẩm thấp.",
        dosage: "50g Trichoderma + 15kg Hữu cơ / gốc",
        timing: "Ngày 18 - Ngày 21",
        technique: "Bón gốc sinh học",
        materials: ["BIO-TRICHODERMA", "FERT-ORGANIC"],
        equipment: ["Cuốc xới"],
        estimatedDays: 4,
        warnings: [
          "Không bón Trichoderma cùng lúc với thời điểm tưới các loại thuốc trừ nấm hóa học gốc đồng dưới rễ.",
        ],
        tips: [
          "Kết hợp bón thêm Kali để tăng độ cứng cáp cho màng tế bào, giúp cây chống chịu nấm tốt hơn.",
        ],
        startDay: 18,
        endDay: 21,
        stageMaterials: [],
      },
    ],
    status: "active",
    createdAt: "2026-06-03T00:00:00.000Z",
  },
];
