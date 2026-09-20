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
  fullName: "Họ và tên",
  name: "Tên",
  code: "Mã",
  description: "Mô tả",
  displayOrder: "Thứ tự hiển thị",
  standardType: "Loại tiêu chuẩn",
  organization: "Tổ chức cấp",
  issuedDate: "Ngày cấp",
  expiryDate: "Ngày hết hạn",
  fileUrl: "Tệp đính kèm",
  attachments: "Tài liệu đính kèm",
  phone: "Số điện thoại",
  email: "Email",
  province: "Tỉnh / Thành phố",
  ward: "Phường / Xã",
  address: "Địa chỉ",
  personalTaxCode: "Mã số thuế cá nhân",
  taxAddress: "Địa chỉ thuế",
  taxCode: "Mã số thuế",
  avatarUrl: "Ảnh đại diện",
  status: "Trạng thái",
  departmentId: "Phòng ban",
  departmentType: "Phòng ban",
  positionId: "Chức vụ",
  positionType: "Chức vụ",
  teamIds: "Đội / Nhóm",
  "bankAccounts.bankId": "Ngân hàng",
  "bankAccounts.bankCode": "Ngân hàng",
  "bankAccounts.bankName": "Ngân hàng",
  "bankAccounts.accountNumber": "Số tài khoản",
  "bankAccounts.accountHolder": "Chủ tài khoản",
  "bankAccounts.branch": "Chi nhánh ngân hàng",
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
