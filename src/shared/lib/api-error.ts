import axios from "axios";

export type ApiFieldErrors = Record<string, string>;

export interface ApiErrorDetails {
  status?: number;
  messageKey?: string;
  message: string;
  fieldErrors: ApiFieldErrors;
}

type ApiErrorResponse = {
  status?: number;
  messageKey?: string;
  fieldErrors?: unknown;
};

const messageByKey: Record<string, string> = {
  "api.message.common.badRequest": "Yêu cầu không hợp lệ.",
  "api.message.common.validationFailed":
    "Dữ liệu nhập chưa hợp lệ. Vui lòng kiểm tra lại.",
  "api.message.common.unauthorized": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  "api.message.common.forbidden": "Bạn không có quyền thực hiện thao tác này.",
  "api.message.common.notFound": "Không tìm thấy dữ liệu yêu cầu.",
  "api.message.common.conflict": "Dữ liệu bị trùng hoặc đang xung đột.",
  "api.message.common.conflict.blockedByReference":
    "Không thể thực hiện vì dữ liệu đang được sử dụng.",
  "api.message.common.conflict.protected":
    "Dữ liệu hệ thống được bảo vệ và không thể thay đổi.",
  "api.message.common.conflict.busy":
    "Thao tác đang được xử lý. Vui lòng thử lại sau.",
  "api.message.common.tooManyRequests":
    "Bạn thao tác quá nhanh. Vui lòng thử lại sau.",
  "api.message.system.error.internal":
    "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.",
};

const fieldMessageByKey: Record<string, string> = {
  "api.message.validation.required": "Trường này là bắt buộc.",
  "api.message.validation.invalidFormat": "Định dạng dữ liệu không hợp lệ.",
  "api.message.validation.outOfRange": "Giá trị nằm ngoài phạm vi cho phép.",
  "api.message.validation.notFound": "Dữ liệu tham chiếu không tồn tại.",
  "api.message.validation.inactive": "Dữ liệu tham chiếu đã ngừng hoạt động.",
  "api.message.validation.duplicate": "Giá trị này đã tồn tại.",
  "api.message.validation.invalid": "Giá trị không hợp lệ.",
};

const fallbackMessageByStatus: Record<number, string> = {
  400: "Yêu cầu không hợp lệ.",
  401: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  403: "Bạn không có quyền thực hiện thao tác này.",
  404: "Không tìm thấy dữ liệu yêu cầu.",
  409: "Dữ liệu bị trùng hoặc đang xung đột.",
  429: "Bạn thao tác quá nhanh. Vui lòng thử lại sau.",
};

function normalizeFieldErrors(value: unknown): ApiFieldErrors {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter(
      ([field, reason]) => field.trim().length > 0 && typeof reason === "string",
    ),
  ) as ApiFieldErrors;
}

/**
 * Nhãn tiếng Việt của các trường hay bị backend trả về trong `fieldErrors`.
 * Khoá viết ở dạng không chỉ số, vd. `bankAccounts[0].accountNumber` tra bằng
 * `bankAccounts.accountNumber`.
 */
const fieldLabelByPath: Record<string, string> = {
  // ─── Chung ───────────────────────────────────────────────────────────────
  id: "Mã định danh",
  name: "Tên",
  code: "Mã",
  sku: "Mã SKU",
  shortName: "Tên viết tắt",
  aliasName: "Tên gọi khác",
  description: "Mô tả",
  note: "Ghi chú",
  notes: "Ghi chú",
  status: "Trạng thái",
  type: "Loại",
  displayOrder: "Thứ tự hiển thị",
  color: "Màu sắc",
  level: "Cấp",
  parentCode: "Mã cấp cha",
  domainCode: "Lĩnh vực",
  classification: "Phân loại",
  hashtags: "Từ khoá",
  attributes: "Thuộc tính",
  metadataJson: "Thông tin bổ sung",

  // ─── Liên hệ & địa chỉ ───────────────────────────────────────────────────
  fullName: "Họ và tên",
  phone: "Số điện thoại",
  email: "Email",
  website: "Website",
  province: "Tỉnh / Thành phố",
  district: "Quận / Huyện",
  ward: "Phường / Xã",
  city: "Thành phố",
  address: "Địa chỉ",
  countryOfOrigin: "Quốc gia xuất xứ",
  origin: "Nguồn gốc",
  latitude: "Vĩ độ",
  longitude: "Kinh độ",
  centerPoint: "Toạ độ trung tâm",
  boundary: "Ranh giới",
  contactId: "Người liên hệ",
  contacts: "Danh sách liên hệ",
  representative: "Người đại diện",

  // ─── Thuế & pháp lý ──────────────────────────────────────────────────────
  taxCode: "Mã số thuế",
  personalTaxCode: "Mã số thuế cá nhân",
  taxAddress: "Địa chỉ thuế",
  taxAuthority: "Cơ quan thuế",
  businessLines: "Ngành nghề kinh doanh",
  foundedDate: "Ngày thành lập",
  brandName: "Tên thương hiệu",
  legalStatus: "Tình trạng pháp lý",
  legalDescription: "Mô tả pháp lý",
  legalDocuments: "Hồ sơ pháp lý",
  registrationNumber: "Số đăng ký",

  // ─── Nhân sự & tổ chức ───────────────────────────────────────────────────
  avatarUrl: "Ảnh đại diện",
  departmentId: "Phòng ban",
  departmentType: "Phòng ban",
  masterDataDepartmentId: "Phòng ban",
  positionId: "Chức vụ",
  positionType: "Chức vụ",
  positionGroupId: "Nhóm chức vụ",
  masterDataPositionId: "Chức vụ",
  responsibilityDescription: "Mô tả trách nhiệm",
  teamIds: "Đội / Nhóm",
  leaderId: "Trưởng nhóm",
  personnel: "Nhân sự",
  personnelId: "Nhân sự",
  personnelIds: "Nhân sự",
  headcount: "Số lượng nhân sự",
  role: "Vai trò",
  organizationId: "Tổ chức",
  organizationTypeId: "Loại hình tổ chức",
  workspaceId: "Không gian làm việc",
  groupId: "Nhóm",
  groupIds: "Nhóm",

  // ─── Ngân hàng ───────────────────────────────────────────────────────────
  bankAccounts: "Tài khoản ngân hàng",
  "bankAccounts.bankId": "Ngân hàng",
  "bankAccounts.bankCode": "Ngân hàng",
  "bankAccounts.bankName": "Ngân hàng",
  "bankAccounts.bin": "Mã BIN ngân hàng",
  "bankAccounts.accountNumber": "Số tài khoản",
  "bankAccounts.accountHolder": "Chủ tài khoản",
  "bankAccounts.branch": "Chi nhánh ngân hàng",
  bankId: "Ngân hàng",
  bankCode: "Ngân hàng",
  bankName: "Ngân hàng",
  bin: "Mã BIN ngân hàng",
  swiftCode: "Mã SWIFT",
  accountNumber: "Số tài khoản",
  accountHolder: "Chủ tài khoản",
  branch: "Chi nhánh",
  branches: "Chi nhánh",
  isPrimary: "Đặt làm mặc định",

  // ─── Tài liệu & tệp ──────────────────────────────────────────────────────
  documents: "Tài liệu",
  document: "Tài liệu",
  documentType: "Loại tài liệu",
  surveyDocuments: "Hồ sơ khảo sát",
  purposeDocuments: "Hồ sơ mục đích sử dụng",
  attachments: "Tài liệu đính kèm",
  fileUrl: "Tệp đính kèm",
  fileName: "Tên tệp",
  mimeType: "Định dạng tệp",
  sizeBytes: "Dung lượng tệp",
  objectKey: "Tệp",
  imageUrl: "Hình ảnh",
  illustrationUrl: "Ảnh minh hoạ",
  thumbnail: "Ảnh thu nhỏ",
  photos: "Hình ảnh",
  stampUrl: "Ảnh con dấu",
  logoUrl: "Logo",
  content: "Nội dung",

  // ─── Chứng nhận ──────────────────────────────────────────────────────────
  certificateId: "Chứng nhận",
  certificateIds: "Chứng nhận",
  certificates: "Chứng nhận",
  agricultureCertificateId: "Chứng nhận nông nghiệp",
  standardType: "Loại tiêu chuẩn",
  organization: "Tổ chức cấp",
  issuerId: "Đơn vị cấp",
  issuerIds: "Đơn vị cấp",
  issueDate: "Ngày cấp",
  issuedDate: "Ngày cấp",
  expiryDate: "Ngày hết hạn",
  validityMonths: "Thời hạn hiệu lực (tháng)",

  // ─── Vùng canh tác & lô ──────────────────────────────────────────────────
  regionId: "Vùng trồng",
  areas: "Khu vực",
  plots: "Lô đất",
  plotAddress: "Địa chỉ lô",
  acreage: "Diện tích",
  totalAcreage: "Tổng diện tích",
  elevation: "Độ cao",
  contourInterval: "Đường bình độ",
  soilTypeId: "Loại đất",
  terrainFeatureId: "Địa hình",
  scopes: "Phạm vi",
  scopeType: "Loại phạm vi",
  scopeId: "Phạm vi",
  scopeNote: "Ghi chú phạm vi",
  targetId: "Đối tượng áp dụng",
  targetIds: "Đối tượng áp dụng",
  targetType: "Loại đối tượng",
  cultivationZoneId: "Vùng canh tác",
  productionZoneId: "Vùng sản xuất",

  // ─── Cây trồng, giống & mùa vụ ───────────────────────────────────────────
  cropId: "Cây trồng",
  crops: "Cây trồng",
  cropGroupId: "Nhóm cây trồng",
  cropVarietyId: "Giống cây trồng",
  mainCropId: "Cây trồng chính",
  scientificName: "Tên khoa học",
  family: "Họ thực vật",
  biological: "Đặc điểm sinh học",
  subjectId: "Đối tượng sản xuất",
  subjects: "Đối tượng sản xuất",
  subjectGroupId: "Nhóm đối tượng",
  subjectVariantIds: "Giống",
  productionSubjectIds: "Đối tượng sản xuất",
  productionSubjectGroupIds: "Nhóm đối tượng sản xuất",
  productionSubjectVariantIds: "Giống Foundation",
  productionMethodId: "Phương pháp sản xuất",
  farmingMethodId: "Phương pháp canh tác",
  rearingMethodId: "Phương pháp nuôi",
  irrigationSystemId: "Hệ thống tưới tiêu",
  harvestMethod: "Phương pháp thu hoạch",
  germinationRate: "Tỷ lệ nảy mầm",
  purityRate: "Độ sạch",
  avgYieldFrom: "Năng suất tối thiểu",
  avgYieldTo: "Năng suất tối đa",
  growthDurationDays: "Thời gian sinh trưởng (ngày)",
  seasonId: "Mùa vụ",
  seasonIds: "Mùa vụ",
  seasonStageId: "Giai đoạn mùa vụ",
  stage: "Giai đoạn",
  stages: "Giai đoạn",
  stageId: "Giai đoạn",
  expectedDays: "Số ngày dự kiến",
  densityDescription: "Mật độ trồng",

  // ─── Cây trồng định danh & chỉ số ────────────────────────────────────────
  height: "Chiều cao",
  plantedAt: "Ngày trồng",
  startedAt: "Ngày bắt đầu",
  durationDays: "Số ngày",
  durationValue: "Thời lượng",
  durationUnit: "Đơn vị thời lượng",
  totalCount: "Tổng số lượng",
  healthyCount: "Số cây khoẻ",
  pestCount: "Số cây nhiễm bệnh",
  harvestedCount: "Số cây đã thu hoạch",
  soilPh: "Độ pH đất",
  soilTemperature: "Nhiệt độ đất",
  soilMoisturePct: "Độ ẩm đất",
  soilCompaction: "Độ nén đất",
  nitrogen: "Đạm (N)",
  phosphorus: "Lân (P)",
  potassium: "Kali (K)",
  organicMatterPct: "Hàm lượng hữu cơ",
  temperatureFrom: "Nhiệt độ tối thiểu",
  temperatureTo: "Nhiệt độ tối đa",
  humidityFrom: "Độ ẩm tối thiểu",
  humidityTo: "Độ ẩm tối đa",
  phFrom: "Độ pH tối thiểu",
  phTo: "Độ pH tối đa",

  // ─── Kế hoạch & công việc ────────────────────────────────────────────────
  planId: "Kế hoạch",
  planGroupId: "Nhóm kế hoạch",
  workflowId: "Quy trình",
  tasks: "Công việc",
  taskId: "Công việc",
  taskCategoryId: "Nhóm công việc",
  dailyTaskId: "Công việc trong ngày",
  workItems: "Hạng mục công việc",
  sourceWorkItemId: "Hạng mục nguồn",
  startDate: "Ngày bắt đầu",
  endDate: "Ngày kết thúc",
  priority: "Độ ưu tiên",
  purpose: "Mục đích",
  progressPercent: "Tiến độ",
  executorProgress: "Tiến độ thực hiện",
  submittedByPersonnelId: "Người gửi",
  repeatMode: "Chế độ lặp",
  repeatDates: "Ngày lặp",
  recurrence: "Lặp lại",
  location: "Vị trí",

  // ─── Vật tư, thiết bị & thu hoạch ────────────────────────────────────────
  supplies: "Vật tư",
  supplyLines: "Danh sách vật tư",
  supplyItemId: "Vật tư",
  fromSupplyItemId: "Vật tư nguồn",
  toSupplyItemId: "Vật tư đích",
  lines: "Danh sách dòng",
  quantity: "Số lượng",
  quantityActual: "Số lượng thực tế",
  unitBaseId: "Đơn vị tính",
  packagingTypeId: "Loại bao bì",
  packagingVariants: "Quy cách đóng gói",
  packagingNotes: "Ghi chú đóng gói",
  referencePrice: "Giá tham khảo",
  harvestItems: "Sản phẩm thu hoạch",
  ownerId: "Chủ sở hữu",
  ownerType: "Loại chủ sở hữu",
  manufacturer: "Nhà sản xuất",
  manufacturerOrganizationId: "Nhà sản xuất",
  importer: "Nhà nhập khẩu",
  importerOrganizationId: "Nhà nhập khẩu",
  distributor: "Nhà phân phối",
  distributorOrganizationId: "Nhà phân phối",
  supplierOrganizationId: "Nhà cung cấp",
  model: "Model",
  brand: "Thương hiệu",
  manufactureYear: "Năm sản xuất",
  powerRating: "Công suất",
  capacity: "Sức chứa",
  fuelType: "Loại nhiên liệu",
  fuelConsumptionRate: "Mức tiêu hao nhiên liệu",
  dimensions: "Kích thước",
  weight: "Khối lượng",
  otherSpecs: "Thông số khác",
  maintenanceSchedule: "Lịch bảo trì",
  includedParts: "Phụ kiện kèm theo",
  typeTags: "Nhãn phân loại",
  shelfLife: "Hạn sử dụng",

  // ─── Thuốc & dinh dưỡng ──────────────────────────────────────────────────
  targetSubjectIds: "Đối tượng phòng trừ",
  concentration: "Nồng độ",
  activeIngredient: "Hoạt chất",
  moaGroupCode: "Nhóm cơ chế tác động",
  moaOrNutrientNote: "Ghi chú cơ chế / dinh dưỡng",
  npkRatio: "Tỷ lệ NPK",
  detailedComposition: "Thành phần chi tiết",
  mainUsage: "Công dụng chính",
  recommendedDosage: "Liều lượng khuyến cáo",
  usageMethod: "Cách sử dụng",
  usageNotes: "Lưu ý khi sử dụng",
  withdrawalPeriodDays: "Thời gian cách ly (ngày)",
  maxUsageCount: "Số lần sử dụng tối đa",
  toxicityDescription: "Mô tả độc tính",
  protectiveMeasures: "Biện pháp bảo hộ",
  poisoningTreatment: "Xử lý khi ngộ độc",
  transferSupported: "Hỗ trợ chuyển khoản",
  lookupSupported: "Hỗ trợ tra cứu",
  example: "Ví dụ",
  classifications: "Phân loại",
};

/** `bankAccounts[0].accountNumber` -> `bankAccounts.accountNumber` */
const stripIndexes = (path: string) => path.replace(/\[\d+\]/g, "");

export function getFieldLabel(path: string): string {
  const normalized = stripIndexes(path);

  return (
    fieldLabelByPath[normalized] ??
    // Chưa khai báo: lấy đoạn cuối cho ngắn thay vì in cả đường dẫn
    fieldLabelByPath[normalized.split(".").pop() ?? ""] ??
    normalized
  );
}

export function getFieldErrorMessage(reason: string): string {
  return fieldMessageByKey[reason] ?? "Giá trị không hợp lệ.";
}

/**
 * Gộp toàn bộ `fieldErrors` thành các dòng đọc được, vd.
 * "Số tài khoản: Trường này là bắt buộc."
 */
export function getApiFieldErrorLines(error: unknown): string[] {
  const { fieldErrors } = getApiErrorDetails(error);

  return Object.entries(fieldErrors).map(
    ([field, reason]) =>
      `${getFieldLabel(field)}: ${getFieldErrorMessage(reason)}`,
  );
}

/**
 * Thông báo hoàn chỉnh để đưa thẳng vào toast: ưu tiên liệt kê lỗi từng trường,
 * nếu không có thì dùng message chung. Nhiều lỗi ngăn bằng " • " vì toast
 * render plain text, ký tự xuống dòng sẽ bị gộp lại.
 */
export function getApiErrorMessage(error: unknown): string {
  const lines = getApiFieldErrorLines(error);

  return lines.length > 0 ? lines.join(" • ") : getApiErrorDetails(error).message;
}

export function getApiErrorDetails(error: unknown): ApiErrorDetails {
  const responseData = axios.isAxiosError<ApiErrorResponse>(error)
    ? error.response?.data
    : undefined;
  const status = responseData?.status ??
    (axios.isAxiosError(error) ? error.response?.status : undefined);
  const messageKey = responseData?.messageKey;
  const fieldErrors = normalizeFieldErrors(responseData?.fieldErrors);

  return {
    status,
    messageKey,
    message:
      (messageKey ? messageByKey[messageKey] : undefined) ??
      (status !== undefined ? fallbackMessageByStatus[status] : undefined) ??
      (status !== undefined && status >= 500
        ? "Hệ thống đang gặp sự cố. Vui lòng thử lại sau."
        : "Đã có lỗi xảy ra. Vui lòng thử lại."),
    fieldErrors,
  };
}

export function getFirstApiFieldError(error: unknown) {
  const details = getApiErrorDetails(error);
  const [field, reason] = Object.entries(details.fieldErrors)[0] ?? [];

  return field && reason
    ? { field, reason, message: getFieldErrorMessage(reason) }
    : null;
}
