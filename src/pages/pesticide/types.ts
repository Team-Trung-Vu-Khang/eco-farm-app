// Domain phân biệt ngữ cảnh của thuốc
export type PesticideDomain = "cultivation" | "animal" | "aquaculture";

export interface Pesticide {
  id: number;
  // Bước 1 – Định danh & phân loại
  code: string;           // SKU / Mã sản phẩm
  name: string;           // Tên thương mại
  registrationNumber?: string; // Số đăng ký lưu hành
  activeIngredient: string;    // Tên hoạt chất
  concentration?: string;      // Hàm lượng / Nồng độ
  form: string;                // Dạng bào chế (EC, SC, WP...)
  group: string;               // Nhóm phân loại chính (Đối tượng phòng trừ)
  toxicityLevel?: string;      // Nhóm độc WHO: Ia, Ib, II, III, U
  moaGroup?: string;           // Nhóm cơ chế tác động MoA (IRAC/FRAC)
  actionType: string;          // Cách xâm nhập / Mode of entry
  origin: string;              // Xuất xứ / Nhà sản xuất
  imageUrl?: string;

  // Bước 2 – Thông tin sử dụng
  indications?: string;        // Công dụng chính / Chỉ định
  targetEntities?: string[];   // Đối tượng sử dụng (cây trồng/vật nuôi/thủy sản)
  recommendedDosage?: string;  // Liều lượng khuyến cáo
  applicationMethod?: string;  // Cách dùng (phun, tưới, tiêm...)
  phi?: number;                // Thời gian cách ly (ngày)
  maxUsage?: number;           // Số lần sử dụng tối đa / vụ
  shelfLife?: string;          // Hạn sử dụng
  usageNotes?: string;         // Lưu ý khi sử dụng

  // Bước 3 – An toàn & Pháp lý
  toxicityInfo?: string;       // Độc tính với người, ĐV, môi trường
  protectiveMeasures?: string; // Biện pháp phòng hộ
  firstAid?: string;           // Sơ cứu khi ngộ độc
  legalStatus?: string;        // Tình trạng pháp lý
  standardsCompliance?: string[]; // Tiêu chuẩn đáp ứng (VietGAP, GlobalGAP...)

  // Bước 4 – Xuất xứ & Cung ứng
  manufacturerOrigin?: string; // Nhà sản xuất / Xuất xứ chi tiết
  importerRegistrant?: string; // Nhà nhập khẩu / Đăng ký
  distributor?: string;        // Nhà phân phối
  referencePrice?: string;     // Giá tham khảo
  packagingSpecs?: string[];   // Bao bì quy cách (chai 100ml, gói 50g...)

  status: "active" | "inactive";
  createdAt: string;
  domain?: PesticideDomain;    // Phân biệt domain (trồng trọt / chăn nuôi / thủy sản)
}

export interface PesticideFormData {
  // Bước 1 – Định danh & Phân loại
  code: string;
  name: string;
  registrationNumber: string;
  activeIngredient: string;
  concentration: string;
  form: string;
  group: string;
  toxicityLevel: string;
  moaGroup: string;
  actionType: string;
  imageUrl?: string;

  // Bước 2 – Thông tin sử dụng
  indications: string;
  targetEntities: string[];
  recommendedDosage: string;
  applicationMethod: string;
  phi: string;
  maxUsage: string;
  shelfLife: string;
  usageNotes: string;

  // Bước 3 – An toàn & Pháp lý
  toxicityInfo: string;
  protectiveMeasures: string;
  firstAid: string;
  legalStatus: string;
  standardsCompliance: string[];

  // Bước 4 – Xuất xứ & Cung ứng
  manufacturerOrigin: string;
  importerRegistrant: string;
  distributor: string;
  referencePrice: string;
  packagingSpecs: string[];

  // Legacy / misc
  origin: string;
  usage: string;
  note: string;
  hashtags: string[];
  technicalDocType: "file" | "editor";
  technicalDocFile?: File | null;
  technicalDocContent: string;
  selectedSupplierId: string;
  quantity: string;
  unit: string;
  packaging: string;
}
