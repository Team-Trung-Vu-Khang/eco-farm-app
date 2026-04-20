import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export type NhomVaiTro =
  | "san-xuat"
  | "ky-thuat"
  | "quan-ly"
  | "chat-luong"
  | "kiem-dinh";

export type PhamViVaiTro = "lo-san-xuat" | "mua-vu" | "vung-trong" | "toan-trang-trai";

export type MucPheDuyet = string;

export type TrangThaiVaiTro = "hoat-dong" | "can-ra-soat" | "chua-phan-cong";

export type MaTrachNhiem =
  | "ghi-chep-nhat-ky"
  | "giam-sat-mua-vu"
  | "cap-nhat-tai-lieu"
  | "phe-duyet-quy-trinh"
  | "kiem-tra-du-luong"
  | "kiem-soat-chat-luong";

export type MaTieuChuan = string;

export interface NguoiDungVaiTro {
  id: string;
  hoTen: string;
  chucDanh: string;
  donVi: string;
  trangThai: "dang-lam-viec" | "tam-ngung";
  avatar?: string;
  email?: string;
}

export interface NhatKyVaiTro {
  id: string;
  hanhDong: "tao-moi" | "cap-nhat" | "gan-nguoi-dung";
  nguoiThucHien: string;
  thoiDiem: string;
  noiDung: string;
}

export interface VaiTroNghiepVu {
  id: string;
  maVaiTro: string;
  tenVaiTro: string;
  nhomVaiTro: NhomVaiTro;
  phamVi: PhamViVaiTro;
  mucPheDuyet: MucPheDuyet;
  maTrachNhiem: MaTrachNhiem[];
  maTieuChuan: MaTieuChuan[];
  nguoiDungIds: string[];
  moTa: string;
  nhatKy: NhatKyVaiTro[];
}

export interface FormVaiTroState {
  maVaiTro: string;
  tenVaiTro: string;
  nhomVaiTro: NhomVaiTro;
  phamVi: PhamViVaiTro;
  mucPheDuyet: MucPheDuyet;
  maTrachNhiem: MaTrachNhiem[];
  maTieuChuan: MaTieuChuan[];
  nguoiDungIds: string[];
  moTa: string;
}

export interface VaiTroTableRow {
  id: string;
  maVaiTro: string;
  tenVaiTro: string;
  nhomVaiTro: string;
  phamVi: string;
  soTrachNhiem: number;
  soNguoiDung: number;
  trangThai: TrangThaiVaiTro;
}

export type VaiTroTableColumn = Column<VaiTroTableRow>;
