import type { Variety } from "./types";

export const initialData: Variety[] = [
  {
    id: "1",
    illustration:
      "https://images.unsplash.com/photo-1599598424967-df791849f12d?auto=format&fit=crop&q=80&w=200",
    crop: "Đậu nành",
    varietyCode: "DN-DT84",
    varietyName: "Đậu nành DT84",
    supplier: "Trung tâm Giống cây trồng Việt Nam",
    origin: "Việt Nam",
    germinationRate: 90,
    uniformity: 70,
    yield: "2.5-3.0 tấn/ha",
    description: "Giống đậu nành có năng suất cao, chịu hạn tốt.",
    documents: [{ name: "huong-dan-nuoi-trong.pdf", url: "#" }],
    status: "active",
    updatedAt: "2024-01-20",
    editorContent: "Giống đậu nành có năng suất cao, chịu hạn tốt.",
  },
  {
    id: "2",
    illustration:
      "https://images.unsplash.com/photo-1531026383433-6edec320857a?auto=format&fit=crop&q=80&w=200",
    crop: "Đậu nành",
    varietyCode: "DN-DX11",
    varietyName: "Đậu nành ĐX11",
    supplier: "Công ty Mekong Seed",
    origin: "Việt Nam",
    germinationRate: 88,
    uniformity: 72,
    yield: "2.3-2.8 tấn/ha",
    description: "Kháng sâu bệnh tốt, hạt mẩy, chất lượng cao.",
    documents: [{ name: "ky-thuat-cham-soc-xoai.pdf", url: "#" }],
    status: "active",
    updatedAt: "2024-01-21",
  },
  {
    id: "3",
    illustration:
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=200",
    crop: "Bắp",
    varietyCode: "BP-LVN10",
    varietyName: "Bắp LVN10",
    supplier: "Viện Nghiên cứu Ngô Trung ương",
    origin: "Việt Nam",
    germinationRate: 93,
    uniformity: 80,
    yield: "8-10 tấn/ha",
    description: "Sinh trưởng mạnh, trái to, hạt đều.",
    documents: [],
    status: "active",
    updatedAt: "2024-01-22",
  },
  {
    id: "4",
    illustration:
      "https://images.unsplash.com/photo-1536675005814-1425178659d4?auto=format&fit=crop&q=80&w=200",
    crop: "Bắp",
    varietyCode: "BP-NK66",
    varietyName: "Bắp NK66",
    supplier: "Syngenta Việt Nam",
    origin: "Thái Lan",
    germinationRate: 91,
    uniformity: 78,
    yield: "7.5-9.5 tấn/ha",
    description: "Năng suất ổn định, thích nghi rộng.",
    documents: [{ name: "quy-trinh-canh-tac-caphe.pdf", url: "#" }],
    status: "active",
    updatedAt: "2024-01-23",
  },
  {
    id: "5",
    illustration:
      "https://images.unsplash.com/photo-1530510515152-4098935c754d?auto=format&fit=crop&q=80&w=200",
    crop: "Bắp",
    varietyCode: "BP-HN88",
    varietyName: "Bắp nếp HN88",
    supplier: "Công ty Giống Cây trồng Trung ương",
    origin: "Việt Nam",
    germinationRate: 89,
    uniformity: 75,
    yield: "6.5-8.0 tấn/ha",
    description: "Bắp nếp ăn tươi, dẻo, ngọt.",
    documents: [],
    status: "active",
    updatedAt: "2024-01-24",
  },
];

export const cropOptions = [
  { label: "Đậu nành", value: "Đậu nành" },
  { label: "Bắp", value: "Bắp" },
  { label: "Lúa", value: "Lúa" },
];

export const supplierOptions = [
  {
    label: "Trung tâm Giống cây trồng Việt Nam",
    value: "Trung tâm Giống cây trồng Việt Nam",
  },
  { label: "Công ty Mekong Seed", value: "Công ty Mekong Seed" },
  {
    label: "Viện Nghiên cứu Ngô Trung ương",
    value: "Viện Nghiên cứu Ngô Trung ương",
  },
  { label: "Syngenta Việt Nam", value: "Syngenta Việt Nam" },
  {
    label: "Công ty Giống Cây trồng Trung ương",
    value: "Công ty Giống Cây trồng Trung ương",
  },
];

export const originOptions = [
  { label: "Việt Nam", value: "Việt Nam" },
  { label: "Thái Lan", value: "Thái Lan" },
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

export const mockSuppliers: Supplier[] = [
  {
    id: "s1",
    name: "Trung tâm Giống cây trồng Việt Nam",
    type: "DOANH NGHIỆP",
    code: "SUP-TCGCTVN",
    representative: "Nguyễn Văn An",
    phone: "02438255055",
    email: "contact@vcsc.gov.vn",
    address: "Đại học Nông nghiệp Hà Nội, Trâu Quỳ, Gia Lâm, Hà Nội",
  },
  {
    id: "s2",
    name: "Công ty Mekong Seed",
    type: "DOANH NGHIỆP",
    code: "SUP-MKSEED",
    representative: "Trần Văn Bình",
    phone: "02923896234",
    email: "info@mekongseed.com",
    address: "Khu công nghiệp Long Hậu, Cần Giuộc, Long An",
  },
  {
    id: "s3",
    name: "Viện Nghiên cứu Ngô Trung ương",
    type: "DOANH NGHIỆP",
    code: "SUP-VNNNTW",
    representative: "Phạm Xuân Hùng",
    phone: "02053856789",
    email: "maize@nnc.vn",
    address: "Thị trấn Yên Mỹ, Thanh Trì, Hà Nội",
  },
  {
    id: "s4",
    name: "Syngenta Việt Nam",
    type: "DOANH NGHIỆP",
    code: "SUP-SYNGVN",
    representative: "John Smith",
    phone: "02838247247",
    email: "vietnam@syngenta.com",
    address: "Tòa nhà Flemington, 182 Lê Đại Hành, Quận 11, TP.HCM",
  },
  {
    id: "s5",
    name: "Công ty Giống Cây trồng Trung ương",
    type: "DOANH NGHIỆP",
    code: "SUP-GCTTW",
    representative: "Lê Minh Tuấn",
    phone: "02438612345",
    email: "info@gcctw.vn",
    address: "Đại Mỗ, Nam Từ Liêm, Hà Nội",
  },
  {
    id: "s6",
    name: "Vườn Lan Ba Hùng",
    type: "NÔNG HỘ",
    code: "FARM-BAHUNG",
    representative: "Phạm Hùng",
    phone: "0988777666",
    email: "bahung.lan@yahoo.com",
    address: "Xã Đam B'ri, TP. Bảo Lộc, Lâm Đồng",
  },
  {
    id: "s7",
    name: "Hợp tác xã Nông nghiệp Xanh",
    type: "NÔNG HỘ",
    code: "COOP-XANH",
    representative: "Lê Văn Tám",
    phone: "0345678901",
    email: "htxxanh@gmail.com",
    address: "Đức Trọng, Lâm Đồng",
  },
  {
    id: "s8",
    name: "Vườn giống Tư Sang",
    type: "NÔNG HỘ",
    code: "FARM-TUSANG",
    representative: "Nguyễn Tư Sang",
    phone: "0912345678",
    email: "tusang@gmail.com",
    address: "Chợ Lách, Bến Tre",
  },
];
