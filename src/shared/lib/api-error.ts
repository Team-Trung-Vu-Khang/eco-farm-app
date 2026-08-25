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

export function getFieldErrorMessage(reason: string): string {
  return fieldMessageByKey[reason] ?? "Giá trị không hợp lệ.";
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
