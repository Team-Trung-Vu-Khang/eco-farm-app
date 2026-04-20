import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  FormVaiTroState,
  MaTieuChuan,
  MaTrachNhiem,
  NguoiDungVaiTro,
  TrangThaiVaiTro,
  VaiTroNghiepVu,
  VaiTroTableRow,
} from "../types";

export const TU_DIEN_NHOM_VAI_TRO = {
  "san-xuat": "Sản xuất",
  "ky-thuat": "Kỹ thuật nông nghiệp",
  "quan-ly": "Quản lý trang trại",
  "chat-luong": "QA/QC",
  "kiem-dinh": "Đơn vị kiểm định",
} as const;

export const TU_DIEN_PHAM_VI = {
  "lo-san-xuat": "Lô sản xuất",
  "mua-vu": "Mùa vụ",
  "vung-trong": "Vùng trồng",
  "toan-trang-trai": "Toàn trang trại",
} as const;

export const TU_DIEN_MUC_PHE_DUYET = {
  "khong-yeu-cau": "Không yêu cầu",
  "to-truong": "Tổ trưởng",
  "quan-ly-trang-trai": "Quản lý trang trại",
  "qa-qc": "QA/QC",
} as const;

export const DANH_MUC_TRACH_NHIEM: { id: MaTrachNhiem; label: string; moTa: string }[] = [
  {
    id: "ghi-chep-nhat-ky",
    label: "Ghi chép nhật ký sản xuất",
    moTa: "Ghi nhận hoạt động canh tác, vật tư đầu vào và phát sinh hiện trường.",
  },
  {
    id: "giam-sat-mua-vu",
    label: "Giám sát mùa vụ",
    moTa: "Theo dõi tiến độ mùa vụ, cảnh báo rủi ro và điều phối kỹ thuật.",
  },
  {
    id: "cap-nhat-tai-lieu",
    label: "Cập nhật tài liệu",
    moTa: "Quản lý biểu mẫu, SOP và tài liệu kiểm soát phát hành.",
  },
  {
    id: "phe-duyet-quy-trinh",
    label: "Phê duyệt quy trình",
    moTa: "Phê duyệt quy trình canh tác hoặc thay đổi nghiệp vụ trọng yếu.",
  },
  {
    id: "kiem-tra-du-luong",
    label: "Kiểm tra dư lượng",
    moTa: "Rà soát kết quả kiểm nghiệm và đối chiếu ngưỡng an toàn.",
  },
  {
    id: "kiem-soat-chat-luong",
    label: "Kiểm soát chất lượng",
    moTa: "Đảm bảo hồ sơ, quy trình và minh chứng đáp ứng chuẩn chất lượng.",
  },
];

export const DANH_MUC_TIEU_CHUAN: { id: MaTieuChuan; label: string }[] = [
  { id: "vietgap", label: "VietGAP" },
  { id: "globalgap", label: "GlobalGAP" },
  { id: "organic", label: "Organic" },
];

export function dinhDangNgayGio(value: string) {
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function layNhanTrachNhiem(maTrachNhiem: MaTrachNhiem) {
  return (
    DANH_MUC_TRACH_NHIEM.find((item) => item.id === maTrachNhiem)?.label || maTrachNhiem
  );
}

export function layNhanTieuChuan(maTieuChuan: MaTieuChuan) {
  return DANH_MUC_TIEU_CHUAN.find((item) => item.id === maTieuChuan)?.label || maTieuChuan;
}

export function layNhanMucPheDuyet(mucPheDuyet: string) {
  return TU_DIEN_MUC_PHE_DUYET[mucPheDuyet as keyof typeof TU_DIEN_MUC_PHE_DUYET] || mucPheDuyet || "Chưa thiết lập";
}

export function layTrangThaiVaiTro(vaiTro: VaiTroNghiepVu, nguoiDungList: NguoiDungVaiTro[]): TrangThaiVaiTro {
  const ketQua = kiemTraDieuKienNghiepVu(vaiTro, [], nguoiDungList);
  if (vaiTro.nguoiDungIds.length === 0) return "chua-phan-cong";
  if (ketQua.loi.length > 0 || ketQua.canhBao.length > 0) return "can-ra-soat";
  return "hoat-dong";
}

export function taoRowsVaiTro(
  vaiTroList: VaiTroNghiepVu[],
  nguoiDungList: NguoiDungVaiTro[],
): VaiTroTableRow[] {
  return vaiTroList.map((vaiTro) => ({
    id: vaiTro.id,
    maVaiTro: vaiTro.maVaiTro,
    tenVaiTro: vaiTro.tenVaiTro,
    nhomVaiTro: TU_DIEN_NHOM_VAI_TRO[vaiTro.nhomVaiTro],
    phamVi: TU_DIEN_PHAM_VI[vaiTro.phamVi],
    soTrachNhiem: vaiTro.maTrachNhiem.length,
    soNguoiDung: vaiTro.nguoiDungIds.length,
    trangThai: layTrangThaiVaiTro(vaiTro, nguoiDungList),
  }));
}

export function badgeTrangThaiVaiTro(trangThai: TrangThaiVaiTro) {
  const config = {
    "hoat-dong": {
      label: "Đang vận hành",
      className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
    },
    "can-ra-soat": {
      label: "Cần rà soát",
      className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    },
    "chua-phan-cong": {
      label: "Chưa phân công",
      className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    },
  } as const;

  return <Badge className={config[trangThai].className}>{config[trangThai].label}</Badge>;
}

export function kiemTraDieuKienNghiepVu(
  formData: Pick<
    FormVaiTroState,
    | "maVaiTro"
    | "tenVaiTro"
    | "phamVi"
    | "mucPheDuyet"
    | "maTrachNhiem"
    | "maTieuChuan"
    | "nguoiDungIds"
  >,
  vaiTroList: VaiTroNghiepVu[],
  nguoiDungList: NguoiDungVaiTro[],
  idDangSua?: string | null,
) {
  const loi: string[] = [];
  const canhBao: string[] = [];

  if (!formData.maVaiTro.trim()) {
    loi.push("Mã vai trò là thông tin bắt buộc.");
  }

  if (!formData.tenVaiTro.trim()) {
    loi.push("Tên vai trò là thông tin bắt buộc.");
  }

  const maTrung = vaiTroList.find(
    (item) =>
      item.id !== idDangSua &&
      item.maVaiTro.trim().toLowerCase() === formData.maVaiTro.trim().toLowerCase(),
  );

  if (maTrung) {
    loi.push(`Mã vai trò ${formData.maVaiTro} đã tồn tại trong hệ thống.`);
  }

  if (formData.maTrachNhiem.length === 0) {
    loi.push("Vai trò phải có ít nhất một trách nhiệm nghiệp vụ.");
  }

  if (
    formData.maTrachNhiem.includes("phe-duyet-quy-trinh") &&
    !formData.mucPheDuyet.trim()
  ) {
    loi.push("Vai trò có trách nhiệm phê duyệt phải chọn cấp phê duyệt phù hợp.");
  }

  if (
    (formData.maTrachNhiem.includes("kiem-tra-du-luong") ||
      formData.maTrachNhiem.includes("kiem-soat-chat-luong")) &&
    formData.maTieuChuan.length === 0
  ) {
    loi.push("Vai trò QA/QC hoặc kiểm tra dư lượng phải gắn ít nhất một bộ tiêu chuẩn áp dụng.");
  }

  if (formData.phamVi === "toan-trang-trai" && formData.nguoiDungIds.length === 0) {
    loi.push("Vai trò phạm vi toàn trang trại phải có ít nhất một người dùng được gán.");
  }

  const nguoiDungTamNgung = formData.nguoiDungIds
    .map((id) => nguoiDungList.find((nguoiDung) => nguoiDung.id === id))
    .filter((item) => item?.trangThai === "tam-ngung");

  if (nguoiDungTamNgung.length > 0) {
    canhBao.push(
      `Có ${nguoiDungTamNgung.length} người dùng đang tạm ngưng nhưng vẫn được gán vào vai trò này.`,
    );
  }

  if (
    formData.maTrachNhiem.includes("ghi-chep-nhat-ky") &&
    !formData.maTrachNhiem.includes("giam-sat-mua-vu")
  ) {
    canhBao.push(
      "Nên kết hợp giám sát mùa vụ với ghi chép nhật ký để tăng khả năng kiểm soát hiện trường.",
    );
  }

  return { loi, canhBao };
}

export const COT_VAI_TRO: Column<VaiTroTableRow>[] = [
  { key: "maVaiTro", label: "Mã vai trò" },
  { key: "tenVaiTro", label: "Tên vai trò" },
  { key: "nhomVaiTro", label: "Nhóm" },
  { key: "phamVi", label: "Phạm vi" },
  { key: "soTrachNhiem", label: "Số trách nhiệm" },
  { key: "soNguoiDung", label: "Số người dùng" },
  {
    key: "trangThai",
    label: "Trạng thái",
    render: (value) => badgeTrangThaiVaiTro(value as TrangThaiVaiTro),
  },
];
