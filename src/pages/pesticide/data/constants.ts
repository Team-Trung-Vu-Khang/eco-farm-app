import type { Pesticide } from "../types";

export const initialPesticides: Pesticide[] = [
  {
    id: 1,
    code: "BVTV001",
    name: "Actara 25WG",
    group: "Thuốc trừ sâu",
    form: "WG (hạt phân tán trong nước)",
    actionType: "Nội hấp, tiếp xúc",
    origin: "Syngenta (Thụy Sĩ)",
    activeIngredient: "Thiamethoxam 25%",
    registrationNumber: "BVTV-SY-2024-001",
    concentration: "25%",
    toxicityLevel: "II",
    moaGroup: "IRAC Nhóm 4A – Agonist receptor nicotinic acetylcholine",
    indications: "Phòng trừ rầy nâu, sâu cuốn lá, bọ trĩ trên lúa và rau màu",
    targetEntities: ["Lúa", "Rau màu", "Cây ăn quả"],
    recommendedDosage: "10-15g/bình 16L nước",
    applicationMethod: "Phun ướt đều tán lá cây trồng",
    phi: 7,
    maxUsage: 3,
    shelfLife: "2 năm",
    usageNotes: "Không phun khi trời gió lớn hoặc sắp mưa. Không pha lẫn với thuốc kiềm.",
    toxicityInfo: "Độc với ong mật. Ít độc với cá và động vật thủy sinh.",
    protectiveMeasures: "Đeo khẩu trang, kính bảo hộ, găng tay và quần áo bảo hộ khi phun.",
    firstAid: "Nếu nuốt phải: súc miệng, uống nước và đến cơ sở y tế ngay.",
    legalStatus: "Được phép lưu hành tại Việt Nam (Danh mục Bộ NN&PTNT)",
    standardsCompliance: ["VietGAP", "GlobalG.A.P"],
    manufacturerOrigin: "Syngenta AG – Thụy Sĩ",
    importerRegistrant: "Syngenta Việt Nam",
    distributor: "Công ty CP Bảo vệ Thực vật 1",
    referencePrice: "85.000 đ / gói 50g",
    packagingSpecs: ["Gói 50g", "Chai 250g"],
    status: "active",
    createdAt: "2024-01-10",
    domain: "cultivation",
  },
  {
    id: 2,
    code: "BVTV002",
    name: "Score 250EC",
    group: "Thuốc trừ bệnh",
    form: "EC (nhũ dầu)",
    actionType: "Nội hấp",
    origin: "Syngenta (Thụy Sĩ)",
    activeIngredient: "Difenoconazole 25%",
    registrationNumber: "BVTV-SY-2024-002",
    concentration: "25%",
    toxicityLevel: "II",
    indications: "Phòng trị bệnh đạo ôn, khô vằn, lem lép hạt trên lúa",
    targetEntities: ["Lúa", "Rau màu"],
    recommendedDosage: "10-15ml/bình 16L nước",
    applicationMethod: "Phun ướt đều",
    phi: 14,
    maxUsage: 2,
    shelfLife: "2 năm",
    legalStatus: "Được phép lưu hành tại Việt Nam",
    status: "active",
    createdAt: "2024-01-11",
    domain: "cultivation",
  },
  {
    id: 3,
    code: "BVTV003",
    name: "Gramoxone 20SL",
    group: "Thuốc trừ cỏ",
    form: "SL (dạng lỏng)",
    actionType: "Tiếp xúc",
    origin: "Syngenta (Thụy Sĩ)",
    activeIngredient: "Paraquat 20%",
    toxicityLevel: "Ib",
    indications: "Diệt cỏ dại trước khi gieo sạ hoặc trồng cây",
    targetEntities: ["Lúa", "Cây công nghiệp"],
    applicationMethod: "Phun thẳng lên cỏ",
    phi: 30,
    legalStatus: "Hạn chế sử dụng – Chỉ được phép trong trường hợp đặc biệt",
    status: "active",
    createdAt: "2024-01-12",
    domain: "cultivation",
  },
  {
    id: 4,
    code: "BVTV004",
    name: "Reasgant 3.6EC",
    group: "Thuốc trừ sâu",
    form: "EC (nhũ dầu)",
    actionType: "Tiếp xúc, vị độc",
    origin: "Thuốc sinh học",
    activeIngredient: "Abamectin 3.6%",
    toxicityLevel: "III",
    indications: "Đặc trị nhện đỏ, bọ trĩ, sâu vẽ bùa",
    targetEntities: ["Rau màu", "Cây ăn quả", "Chè"],
    phi: 5,
    status: "active",
    createdAt: "2024-01-13",
    domain: "cultivation",
  },
  {
    id: 5,
    code: "BVTV005",
    name: "Tilt Super 300EC",
    group: "Thuốc trừ bệnh",
    form: "EC (nhũ dầu)",
    actionType: "Nội hấp",
    origin: "Syngenta (Thụy Sĩ)",
    activeIngredient: "Propiconazole 15% + Difenoconazole 15%",
    toxicityLevel: "II",
    phi: 21,
    status: "inactive",
    createdAt: "2024-01-14",
    domain: "cultivation",
  },
];

// ── Bước 1: Định danh & Phân loại ────────────────────────────────────────────

export const pesticideGroups = [
  "Thuốc trừ sâu",
  "Thuốc trừ bệnh",
  "Thuốc trừ cỏ",
  "Thuốc trừ chuột",
  "Thuốc trừ tuyến trùng",
  "Thuốc trừ ốc, nhện, rệp",
  // Chăn nuôi
  "Kháng sinh",
  "Vaccine",
  "Thuốc kháng ký sinh trùng",
  "Chế phẩm sinh học thú y",
  // Thủy sản
  "Thuốc xử lý nước",
  "Thuốc kháng nấm thủy sản",
  "Hóa chất khử trùng ao",
  "Chất cải thiện môi trường",
];

export const pesticideForms = [
  "EC (nhũ dầu)",
  "SC (huyền phù đậm đặc)",
  "WP (bột thấm nước)",
  "WG (hạt phân tán trong nước)",
  "SL (dạng lỏng)",
  "GR (dạng hạt)",
  "DP (bột rắc)",
  "Dung dịch tiêm",
  "Viên nén",
  "Bột hòa tan",
];

/** Nhóm độc WHO */
export const toxicityLevels = [
  { value: "Ia", label: "Ia – Cực kỳ độc hại", color: "red" },
  { value: "Ib", label: "Ib – Rất độc hại", color: "orange" },
  { value: "II", label: "II – Độc hại vừa phải", color: "yellow" },
  { value: "III", label: "III – Ít độc hại", color: "blue" },
  { value: "U", label: "U – Không độc hại rõ ràng", color: "green" },
];

export const actionTypes = [
  "Tiếp xúc",
  "Vị độc",
  "Xông hơi",
  "Nội hấp (lưu dẫn)",
  "Tiếp xúc, vị độc",
  "Tiếp xúc, nội hấp",
  "Nội hấp, tiếp xúc",
];

export const origins = [
  "Thuốc hóa học",
  "Thuốc sinh học",
  "Thuốc thảo mộc",
  "Thuốc khoáng",
];

// ── Bước 2: Thông tin sử dụng ────────────────────────────────────────────────

export const applicationMethods = [
  "Phun ướt đều tán lá",
  "Tưới gốc",
  "Trộn thức ăn",
  "Tiêm trực tiếp",
  "Ngâm",
  "Rắc xuống ao",
  "Xử lý nước",
  "Nhỏ mắt / nhỏ tai",
  "Bôi ngoài da",
];

export const targetEntitiesCultivation = [
  "Lúa",
  "Ngô (bắp)",
  "Rau màu",
  "Cây ăn quả",
  "Cây công nghiệp",
  "Chè",
  "Mía",
  "Khoai",
  "Đậu tương",
  "Hoa màu",
];

export const targetEntitiesAnimal = [
  "Lợn (heo)",
  "Gà",
  "Vịt",
  "Bò",
  "Trâu",
  "Dê",
  "Thỏ",
  "Chó",
  "Mèo",
  "Gia cầm nói chung",
];

export const targetEntitiesAquaculture = [
  "Tôm sú",
  "Tôm thẻ chân trắng",
  "Cá tra",
  "Cá ba sa",
  "Cá rô phi",
  "Cá chép",
  "Cá trê",
  "Cá lóc",
  "Ếch",
  "Cua biển",
];

// ── Bước 3: An toàn & Pháp lý ────────────────────────────────────────────────

export const standardsOptions = [
  "VietGAP",
  "GlobalG.A.P",
  "Organic (hữu cơ)",
  "EU MRL (Tiêu chuẩn dư lượng EU)",
  "FDA (Mỹ)",
  "HACCP",
  "ISO 22000",
  "ASC (Thủy sản)",
  "MSC (Thủy sản tự nhiên)",
  "4C (Cà phê)",
];

// ── Bước 4: Cung ứng & Bao bì ────────────────────────────────────────────────

export const packagingUnitOptions = [
  "50 ml / Chai",
  "100 ml / Chai",
  "250 ml / Chai",
  "500 ml / Chai",
  "1 L / Chai",
  "50 g / Lọ",
  "100 g / Lọ",
  "250 g / Lọ",
  "50 g / Gói",
  "100 g / Gói",
  "200 g / Gói",
  "500 g / Bọc",
  "1 kg / Bọc",
  "25 kg / Bao",
  "5 L / Can",
  "10 L / Can",
  "20 L / Can",
  "20 L / Thùng",
  "100 viên / Hộp",
  "10 ml / Ống",
];

export const commonHashtags = [
  "HieuQuaCao",
  "AnToan",
  "SinhHoc",
  "PhoRong",
  "DacTriSauCuonLa",
  "DacTriRayNau",
];

export const suppliers = [
  { id: "sup1", name: "Công ty CP Bảo vệ Thực vật 1", type: "enterprise" },
  { id: "sup2", name: "Đại lý VTNN Hòa Phát", type: "enterprise" },
  { id: "sup3", name: "HTX Nông nghiệp Xanh", type: "enterprise" },
  { id: "sup4", name: "Nông hộ Nguyễn Văn A", type: "farmer" },
];

export const units = ["Chai", "Lọ", "Gói", "Bọc", "Can", "Bao", "Thùng", "Hộp", "Ống"];
