import type {
  FormVaiTroState,
  NguoiDungVaiTro,
  VaiTroNghiepVu,
} from "./types";

export const DANH_SACH_NGUOI_DUNG: NguoiDungVaiTro[] = [
  {
    id: "user-1",
    hoTen: "Nguyễn Văn Hòa",
    chucDanh: "Nông dân phụ trách lô",
    donVi: "Vùng xoài xuất khẩu",
  trangThai: "dang-lam-viec",
  avatar: "",
  email: "",
  },
  {
    id: "user-2",
    hoTen: "Trần Thị Mai",
    chucDanh: "Kỹ thuật viên nông nghiệp",
    donVi: "Tổ kỹ thuật mùa vụ",
  trangThai: "dang-lam-viec",
  avatar: "",
  email: "",
  },
  {
    id: "user-3",
    hoTen: "Phạm Quốc Huy",
    chucDanh: "Quản lý trang trại",
    donVi: "Ban điều hành nông trại",
  trangThai: "dang-lam-viec",
  avatar: "",
  email: "",
  },
  {
    id: "user-4",
    hoTen: "Lê Minh Châu",
    chucDanh: "QA/QC",
    donVi: "Bộ phận kiểm soát chất lượng",
  trangThai: "dang-lam-viec",
  avatar: "",
  email: "",
  },
  {
    id: "user-5",
    hoTen: "Ngô Khánh Linh",
    chucDanh: "Nhân viên ghi nhật ký",
    donVi: "Tổ vận hành nhật ký",
  trangThai: "tam-ngung",
  avatar: "",
  email: "",
  },
];

export const DANH_SACH_VAI_TRO: VaiTroNghiepVu[] = [
  {
    id: "role-1",
    maVaiTro: "VT-NN-001",
    tenVaiTro: "Kỹ thuật viên giám sát mùa vụ",
    nhomVaiTro: "ky-thuat",
    phamVi: "mua-vu",
    mucPheDuyet: "quan-ly-trang-trai",
    maTrachNhiem: [
      "giam-sat-mua-vu",
      "cap-nhat-tai-lieu",
      "ghi-chep-nhat-ky",
    ],
    maTieuChuan: ["vietgap", "globalgap"],
    nguoiDungIds: ["user-2"],
    moTa:
      "Theo dõi diễn biến mùa vụ, cập nhật quy trình kỹ thuật và xác nhận nhật ký canh tác theo từng giai đoạn.",
    nhatKy: [
      {
        id: "role-1-log-1",
        hanhDong: "cap-nhat",
        nguoiThucHien: "Trần Thanh Bình",
        thoiDiem: "2026-04-18T09:20:00.000Z",
        noiDung:
          "Cập nhật phạm vi từ vùng trồng sang mùa vụ để phù hợp quy trình giám sát mới.",
      },
    ],
  },
  {
    id: "role-2",
    maVaiTro: "VT-NN-002",
    tenVaiTro: "QA/QC kiểm soát dư lượng",
    nhomVaiTro: "chat-luong",
    phamVi: "toan-trang-trai",
    mucPheDuyet: "qa-qc",
    maTrachNhiem: [
      "kiem-tra-du-luong",
      "kiem-soat-chat-luong",
      "phe-duyet-quy-trinh",
    ],
    maTieuChuan: ["globalgap", "organic"],
    nguoiDungIds: ["user-4", "user-3"],
    moTa:
      "Kiểm soát chất lượng hồ sơ, kiểm tra dư lượng đầu vào và tham gia phê duyệt quy trình trọng yếu.",
    nhatKy: [
      {
        id: "role-2-log-1",
        hanhDong: "gan-nguoi-dung",
        nguoiThucHien: "Trần Thanh Bình",
        thoiDiem: "2026-04-17T14:40:00.000Z",
        noiDung: "Bổ sung Quản lý trang trại tham gia đồng phê duyệt.",
      },
    ],
  },
  {
    id: "role-3",
    maVaiTro: "VT-NN-003",
    tenVaiTro: "Nhân viên ghi nhật ký sản xuất",
    nhomVaiTro: "san-xuat",
    phamVi: "lo-san-xuat",
    mucPheDuyet: "khong-yeu-cau",
    maTrachNhiem: ["ghi-chep-nhat-ky"],
    maTieuChuan: [],
    nguoiDungIds: [],
    moTa:
      "Thu thập dữ liệu đầu vào hằng ngày, hoàn thiện nhật ký sản xuất theo lô và gửi kỹ thuật viên xác nhận.",
    nhatKy: [
      {
        id: "role-3-log-1",
        hanhDong: "tao-moi",
        nguoiThucHien: "Phạm Quốc Huy",
        thoiDiem: "2026-04-12T07:30:00.000Z",
        noiDung: "Khởi tạo vai trò cho nhóm vận hành nhật ký tại hiện trường.",
      },
    ],
  },
];

export const FORM_VAI_TRO_RONG: FormVaiTroState = {
  maVaiTro: "",
  tenVaiTro: "",
  nhomVaiTro: "ky-thuat",
  phamVi: "mua-vu",
  mucPheDuyet: "",
  maTrachNhiem: [],
  maTieuChuan: [],
  nguoiDungIds: [],
  moTa: "",
};
