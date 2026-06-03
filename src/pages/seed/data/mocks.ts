import type { Variety } from "../types/types";

export const initialData: Variety[] = [
  {
    id: "1",
    crop: "Dừa",
    illustration:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS22anr0ZeVFmt6I4XAodCYKhF2pwHMLkrHJQ&s",
    varietyCode: "SEED-COCO-01",
    varietyName: "Cây giống Dừa sáp cấy mô",
    supplier: "Công ty TNHH Công nghệ sinh học ViGen",
    origin: "Cầu Kè, Trà Vinh, Việt Nam",
    germinationRate: 100, // Cây cấy mô sống sót tốt
    uniformity: 98,
    yield: "40 - 80 trái/cây/năm",
    description:
      "Cây giống được sản xuất bằng công nghệ nuôi cấy phôi/mô, giúp nâng tỷ lệ trái sáp đạt từ 85% đến 100% so với phương pháp ươm bằng trái truyền thống.",
    documents: [{ name: "quy-trinh-cay-mo-dua-sap.pdf", url: "#" }],
    status: "active",
    updatedAt: "2026-06-03",
    editorContent:
      "Dừa sáp cấy mô có khả năng cho trái nhanh, cơm dày xốp. Yêu cầu đất canh tác thoát nước tốt và phải áp dụng kỹ thuật bón phân hữu cơ cân đối.",
  },
  {
    id: "2",
    crop: "Dừa",
    illustration:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRySCSquLBI-_mlCXKaUE1c1pJHteILKg3K9w&s",
    varietyCode: "SEED-COCO-02",
    varietyName: "Trái giống Dừa xiêm lùn (Xiêm xanh)",
    supplier: "Công ty TNHH MTV Thế giới cây giống",
    origin: "Bến Tre, Việt Nam",
    germinationRate: 90,
    uniformity: 85,
    yield: "120 - 150 trái/cây/năm",
    description:
      "Trái giống được tuyển chọn từ các vườn dừa mẹ khỏe mạnh, ít sâu bệnh. Giống dừa xiêm lùn cho trái sớm, ra trái quanh năm và thu hoạch với chu kỳ 25 ngày/lần.",
    documents: [{ name: "ky-thuat-trong-dua-xiem-lun.pdf", url: "#" }],
    status: "active",
    updatedAt: "2026-06-03",
    editorContent:
      "Khuyến cáo khi ươm trái cần vạt nhẹ một phần vỏ phía núm để mầm dễ bung, tránh để nơi úng nước gây thối mầm.",
  },
  {
    id: "3",
    crop: "Dừa",
    illustration: "https://dailyduabentre.com/upload/ckfinder/images/14.jpg",
    varietyCode: "SEED-COCO-03",
    varietyName: "Trái giống Dừa lai PB 121",
    supplier: "Trung tâm Thực nghiệm Dừa Đồng Gò",
    origin: "Lai nhân tạo (Mã Lai x Tây Phi)",
    germinationRate: 88,
    uniformity: 92,
    yield: "150 - 200 trái/cây/năm",
    description:
      "Dừa lai PB 121 (Lùn vàng Mã Lai x Cao Tây Phi) mang ưu thế lai, năng suất cực cao, cơm dày 13-14mm, chịu hạn mặn rất tốt.",
    documents: [{ name: "ky-thuat-dua-lai-pb121.pdf", url: "#" }],
    status: "active",
    updatedAt: "2026-06-03",
    editorContent:
      "Khuyến cáo tuyệt đối không được để trái lai làm giống cho đời F2 vì sẽ xảy ra hiện tượng phân ly, làm mất các đặc tính ưu việt của dòng lai F1.",
  },
  {
    id: "4",
    crop: "Dừa",
    illustration:
      "https://caygiongphucan.com/wp-content/uploads/2025/06/z5912053468843_2fe7c35eb4c134aa12276231ebd2dba3.jpg",
    varietyCode: "SEED-COCO-04",
    varietyName: "Cây giống Dừa ta (cây đầu dòng)",
    supplier: "Viện KHKT Nông nghiệp Duyên hải Nam Trung Bộ",
    origin: "Hoài Nhơn, Bình Định, Việt Nam",
    germinationRate: 92,
    uniformity: 88,
    yield: "60 - 80 trái/cây/năm",
    description:
      "Cây giống sản xuất từ vườn dừa ta đầu dòng tại Hoài Nhơn, Bình Định. Khối lượng cơm dừa lớn (400-500g/quả), hàm lượng dầu cực cao từ 62% - 67%.",
    documents: [{ name: "giong-dua-ta-binh-dinh.pdf", url: "#" }],
    status: "active",
    updatedAt: "2026-06-03",
    editorContent:
      "Giống dừa lấy dầu chịu được môi trường đất cát ven biển và khí hậu khô hạn tại Nam Trung Bộ. Có thể trồng xen cỏ voi, sắn để tăng thu nhập.",
  },
  {
    id: "5",
    crop: "Dừa",
    illustration:
      "https://cayantrai.vn/wp-content/uploads/2025/03/dua-dua-2.jpg",
    varietyCode: "SEED-COCO-05",
    varietyName: "Trái giống Dừa dứa Thái Lan",
    supplier: "Vựa cây giống Minh Hậu",
    origin: "Thái Lan",
    germinationRate: 85,
    uniformity: 80,
    yield: "80 - 140 trái/cây/năm",
    description:
      "Tuyển chọn từ nhóm dừa dứa trái to, có khả năng nảy mầm cao (80-90%). Nước dừa, rễ, lá và cơm đều mang mùi thơm lá dứa đặc trưng.",
    documents: [],
    status: "active",
    updatedAt: "2026-06-03",
    editorContent:
      "Cần trồng dừa dứa tách biệt khỏi các giống dừa khác nhằm tránh thụ phấn chéo gây hiện tượng lai tạp làm mất đi hương thơm đặc trưng của trái.",
  },
];

export const cropOptions = [
  { label: "Đậu nành", value: "Đậu nành" },
  { label: "Đậu xanh", value: "Đậu xanh" },
  { label: "Bắp", value: "Bắp" },
  { label: "Lúa", value: "Lúa" },
  { label: "Sầu riêng", value: "Sầu riêng" },
];

// 2. DỮ LIỆU MOCK NHÀ CUNG CẤP (mockSuppliers)
export const mockSuppliers: Supplier[] = [
  {
    id: "SUP-COCO-01",
    name: "Trường Đại học Trà Vinh",
    type: "DOANH NGHIỆP",
    code: "SUP-TVU",
    representative: "PGS.TS Phạm Tiết Khánh",
    phone: "02943855246",
    email: "banbientap@tvu.edu.vn",
    address:
      "126 Nguyễn Thiện Thành, Khóm 4, Phường 5, TP Trà Vinh, Tỉnh Trà Vinh", // [1, 2]
  },
  {
    id: "SUP-COCO-02",
    name: "Trung tâm Thực nghiệm Dừa Đồng Gò",
    type: "DOANH NGHIỆP",
    code: "SUP-DONGGO",
    representative: "Ngô Thị Kiều Dương",
    phone: "02753822000",
    email: "donggo@ioop.org.vn",
    address: "Huyện Giồng Trôm, Tỉnh Bến Tre", // [3]
  },
  {
    id: "SUP-COCO-03",
    name: "Công ty TNHH MTV Thế giới cây giống",
    type: "DOANH NGHIỆP",
    code: "SUP-TGCG",
    representative: "Nguyễn Quang Trình",
    phone: "0784664499",
    email: "thegioicaygiong.com@gmail.com",
    address: "Số 64 Tổ 3, Ấp 14, Xã Long Trung, Huyện Cai Lậy, Tỉnh Tiền Giang", // [4]
  },
  {
    id: "SUP-COCO-04",
    name: "Viện KHKT Nông nghiệp Duyên hải Nam Trung Bộ",
    type: "DOANH NGHIỆP",
    code: "SUP-ASISOV",
    representative: "TS. Phan Thanh Hải",
    phone: "02563846626",
    email: "asisov.vaas@mard.gov.vn",
    address: "Đường Tây Sơn, Phường Quy Nhơn Bắc, Tỉnh Bình Định", // [5, 6]
  },
  {
    id: "SUP-COCO-05",
    name: "Công ty TNHH Công nghệ sinh học ViGen",
    type: "DOANH NGHIỆP",
    code: "SUP-VIGEN",
    representative: "Nguyễn Văn Tuấn",
    phone: "0909789789",
    email: "Contact@vigen.vn",
    address: "Ấp Long Huê, Xã Chợ Lách, Tỉnh Vĩnh Long", // [7]
  },
  {
    id: "SUP-COCO-06",
    name: "Vựa cây giống Minh Hậu",
    type: "NÔNG HỘ",
    code: "FARM-MINHHAU",
    representative: "Phạm Minh Hậu",
    phone: "0987639100",
    email: "minhhau@gmail.com",
    address: "QL60, TT Châu Thành, Bến Tre", // [8]
  },
];

export const supplierOptions = mockSuppliers.map((s) => ({
  label: s.name,
  value: s.name,
}));

export const originOptions = [
  { label: "Bến Tre, Việt Nam", value: "Bến Tre, Việt Nam" },
  { label: "Cầu Kè, Trà Vinh, Việt Nam", value: "Cầu Kè, Trà Vinh, Việt Nam" },
  {
    label: "Hoài Nhơn, Bình Định, Việt Nam",
    value: "Hoài Nhơn, Bình Định, Việt Nam",
  },
  { label: "Thái Lan", value: "Thái Lan" },
  {
    label: "Lai nhân tạo (Mã Lai x Tây Phi)",
    value: "Lai nhân tạo (Mã Lai x Tây Phi)",
  },
];

export interface Supplier {
  id: string;
  name: string;
  type: "NÔNG HỘ" | "DOANH NGHIỆP";
  code: string;
  representative: string;
  phone: string;
  email: string;
  address: string;
}
