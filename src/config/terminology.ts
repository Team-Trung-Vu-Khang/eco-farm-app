/**
 * Cấu hình tập trung quản lý thuật ngữ nghiệp vụ (Terminology Management).
 * File này được thiết kế theo dạng Contract & Factory độc lập để sau này có thể
 * di chuyển sang @Team-Trung-Vu-Khang/eco-shared-ui mà không làm thay đổi các call sites.
 */

export type TermKey =
  | "zone" // Vùng canh tác (Eco base) vs Vườn (Mevi)
  | "region" // Vùng địa lý (Eco base) vs Vùng trồng (Mevi)
  | "area" // Khu vực (Eco base) vs Lô (Mevi)
  | "plot" // Lô (Eco base) vs Lô (Mevi)
  | "crop" // Cây canh tác (Eco base) vs Cây trồng (Mevi)
  | "workflow"; // Vụ mùa (Eco base) vs Vụ mùa

export interface TermItem {
  /** Dạng viết hoa đầu từ (dùng cho Title, Label, Thẻ): "Vùng canh tác", "Vùng địa lý", "Khu vực" */
  singular: string;
  /** Dạng viết thường (dùng ghép câu, placeholder, validate): "vùng canh tác", "vùng địa lý", "khu vực" */
  lower: string;
  /** Dạng số nhiều (tuỳ chọn): "các vùng canh tác", "các khu vực" */
  plural?: string;
}

export type TerminologyDictionary = Record<TermKey, TermItem>;

/**
 * Trích xuất an toàn dạng viết thường của thuật ngữ để ghép vào câu tiếng Việt
 */
export const getTermLower = (term: TermItem | string): string => {
  if (typeof term === "object" && term !== null && "lower" in term) {
    return term.lower;
  }
  if (typeof term === "string") {
    return term.charAt(0).toLowerCase() + term.slice(1);
  }
  return String(term);
};

/**
 * Trích xuất an toàn dạng viết hoa của thuật ngữ để làm tiêu đề/nhãn
 */
export const getTermTitle = (term: TermItem | string): string => {
  if (typeof term === "object" && term !== null && "singular" in term) {
    return term.singular;
  }
  if (typeof term === "string") {
    return term.charAt(0).toUpperCase() + term.slice(1);
  }
  return String(term);
};

/**
 * Tiện ích format chuẩn hoá câu tiếng Việt, tránh lặp lại template string và sai chính tả
 */
export const formatTerm = {
  // ── 1. Chọn & Tìm kiếm (Selection & Search) ──
  select: (term: TermItem | string) => `Chọn ${getTermLower(term)}...`,
  search: (term: TermItem | string) => `Tìm kiếm ${getTermLower(term)}...`,
  searchPlaceholder: (term: TermItem | string) =>
    `Tìm kiếm theo tên, mã ${getTermLower(term)}...`,
  all: (term: TermItem | string) => `Tất cả ${getTermLower(term)}`,

  // ── 2. Thao tác CRUD (Actions) ──
  create: (term: TermItem | string) => `Thêm ${getTermLower(term)}`,
  createTitle: (term: TermItem | string) => `Thêm mới ${getTermLower(term)}`,
  edit: (term: TermItem | string) => `Chỉnh sửa ${getTermLower(term)}`,
  update: (term: TermItem | string) => `Cập nhật ${getTermLower(term)}`,
  delete: (term: TermItem | string) => `Xóa ${getTermLower(term)}`,
  deleteConfirm: (term: TermItem | string) =>
    `Bạn có chắc chắn muốn xóa ${getTermLower(term)} này? Hành động này không thể hoàn tác.`,
  detail: (term: TermItem | string) => `Chi tiết ${getTermLower(term)}`,
  manage: (term: TermItem | string) => `Quản lý ${getTermLower(term)}`,

  // ── 3. Thông báo Toast / Feedback (Success & Error) ──
  createSuccess: (term: TermItem | string) =>
    `Đã tạo ${getTermLower(term)} thành công.`,
  updateSuccess: (term: TermItem | string) =>
    `Đã cập nhật ${getTermLower(term)} thành công.`,
  deleteSuccess: (term: TermItem | string) =>
    `Đã xóa ${getTermLower(term)} thành công.`,
  deleteError: (term: TermItem | string) =>
    `Không thể xóa ${getTermLower(term)}. Vui lòng thử lại.`,

  // ── 4. Nhãn Form & Tiêu đề dữ liệu (Labels & Headings) ──
  name: (term: TermItem | string) => `Tên ${getTermLower(term)}`,
  code: (term: TermItem | string) => `Mã ${getTermLower(term)}`,
  info: (term: TermItem | string) => `Thông tin ${getTermLower(term)}`,
  scope: (term: TermItem | string) => `Phạm vi ${getTermLower(term)}`,
  list: (term: TermItem | string) => `Danh sách ${getTermLower(term)}`,
  map: (term: TermItem | string) => `Bản đồ ${getTermLower(term)}`,
  diagram: (term: TermItem | string) => `Sơ đồ ${getTermLower(term)}`,

  // ── 5. Thông báo Validate (Validation Rules) ──
  required: (term: TermItem | string) => `Vui lòng chọn ${getTermLower(term)}`,
  requiredInput: (term: TermItem | string) =>
    `Vui lòng nhập tên ${getTermLower(term)}`,
  requiredCode: (term: TermItem | string) =>
    `Vui lòng nhập mã ${getTermLower(term)}`,

  // ── 6. Trạng thái rỗng & Đang tải (States) ──
  notFound: (term: TermItem | string) =>
    `Không tìm thấy ${getTermLower(term)} phù hợp.`,
  notSelected: (term: TermItem | string) =>
    `Chưa chọn ${getTermLower(term)} cụ thể.`,
  empty: (term: TermItem | string) => `Chưa có ${getTermLower(term)} nào.`,
  loading: (term: TermItem | string) => `Đang tải ${getTermLower(term)}...`,
  loadingList: (term: TermItem | string) =>
    `Đang tải danh sách ${getTermLower(term)}...`,
};

/**
 * Factory tạo terminology bundle: cho phép truy cập cả flat access lẫn dictionary
 */
export function createTerminology(dict: TerminologyDictionary) {
  return {
    // 1. Flat shortcuts truy cập nhanh:
    zone: dict.zone.singular, // "Vùng canh tác"
    zoneLower: dict.zone.lower, // "vùng canh tác"
    region: dict.region.singular, // "Vùng địa lý"
    regionLower: dict.region.lower, // "vùng địa lý"
    area: dict.area.singular, // "Khu vực"
    areaLower: dict.area.lower, // "khu vực"
    plot: dict.plot.singular, // "Lô"
    plotLower: dict.plot.lower, // "lô"
    crop: dict.crop.singular, // "Cây canh tác"
    cropLower: dict.crop.lower, // "cây canh tác"
    workflow: dict.workflow.singular, // "Vụ mùa"
    workflowLower: dict.workflow.lower, // "vụ mùa"

    // 2. Dictionary gốc:
    dict,

    // 3. Helper lấy từ ngữ an toàn:
    get: (key: TermKey) => dict[key],

    // 4. Các helper định dạng câu văn:
    format: formatTerm,
  };
}

/**
 * Cấu hình thuật ngữ nghiệp vụ cho ECO-FARM-APP (Base)
 */
export const ECO_TERMINOLOGY_DICT: TerminologyDictionary = {
  zone: {
    singular: "Vùng canh tác",
    lower: "vùng canh tác",
    plural: "các vùng canh tác",
  },
  region: {
    singular: "Vùng địa lý",
    lower: "vùng địa lý",
    plural: "các vùng địa lý",
  },
  area: {
    singular: "Khu vực",
    lower: "khu vực",
    plural: "các khu vực",
  },
  plot: {
    singular: "Lô",
    lower: "lô",
    plural: "các lô",
  },
  crop: {
    singular: "Cây canh tác",
    lower: "cây canh tác",
    plural: "các cây canh tác",
  },
  workflow: {
    singular: "Vụ mùa",
    lower: "vụ mùa",
  },
};

export const TERMS = createTerminology(ECO_TERMINOLOGY_DICT);
