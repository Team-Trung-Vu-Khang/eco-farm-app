import type { Variety } from "../types/types";

export const initialData: Variety[] = [
  {
    id: "1",
    illustration:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh3WrdDlyDlvU4zUrcW5l7GXeoJutE8IoHww&s",
    crop: "Đậu nành",
    varietyCode: "DN-DT84",
    varietyName: "Đậu nành DT84",
    supplier: "Trung tâm Giống cây trồng Việt Nam",
    origin: "Việt Nam",
    germinationRate: 90,
    uniformity: 70,
    yield: "2.0-2.5 tấn/ha",
    description:
      "Giống đậu nành chín sớm, thời gian sinh trưởng 75-85 ngày. Chống chịu tốt bệnh gỉ sắt và sương mai. Hạt vàng sáng, rốn hạt nâu nhạt.",
    documents: [{ name: "huong-dan-nuoi-trong.pdf", url: "#" }],
    status: "active",
    updatedAt: "2024-01-20",
    editorContent:
      "Giống đậu nành DT84 có khả năng thích ứng rộng, trồng được nhiều vụ trong năm. Khối lượng 1000 hạt đạt 180-200g.",
  },
  {
    id: "2",
    illustration:
      "https://vusta.vnmediacdn.com/thumb_x600x/Portals/0/Thumbnails/Ky-thuat-canh-tac-dau-xanh-giong-DX11-tren-dat-doc-tinh-Cao-Bang-1011.jpg",
    crop: "Đậu xanh",
    varietyCode: "DX-DX11",
    varietyName: "Đậu xanh ĐX11",
    supplier: "Công ty Mekong Seed",
    origin: "Việt Nam",
    germinationRate: 88,
    uniformity: 72,
    yield: "1.6-2.0 tấn/ha",
    description:
      "Thời gian sinh trưởng ngắn (70-75 ngày). Cây đứng, không đổ ngã, chín tập trung. Hạt màu xanh mốc, chất lượng thương phẩm cao.",
    documents: [{ name: "ky-thuat-trong-dau-xanh.pdf", url: "#" }],
    status: "active",
    updatedAt: "2024-01-21",
  },
  {
    id: "3",
    illustration:
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=200",
    crop: "Bắp",
    varietyCode: "BP-LVN10",
    varietyName: "Ngô lai LVN10",
    supplier: "Viện Nghiên cứu Ngô Trung ương",
    origin: "Việt Nam",
    germinationRate: 93,
    uniformity: 80,
    yield: "8-12 tấn/ha",
    description:
      "Ngô lai đơn F1, chín trung bình muộn. Cây sinh trưởng mạnh, bộ lá xanh bền, chống chịu sâu bệnh và hạn tốt. Tỷ lệ 2 bắp cao.",
    documents: [],
    status: "active",
    updatedAt: "2024-01-22",
  },
  {
    id: "4",
    illustration:
      "https://static.tuoitre.vn/tto/i/s626/2015/03/24/AgwPWLuq.jpg",
    crop: "Bắp",
    varietyCode: "BP-NK66",
    varietyName: "Ngô NK66",
    supplier: "Syngenta Việt Nam",
    origin: "Thái Lan",
    germinationRate: 91,
    uniformity: 78,
    yield: "7.5-9.5 tấn/ha",
    description:
      "Giống ngô lai đơn, chịu hạn và rét tốt. Bắp to, lá bi bao kín, màu sắc hạt đẹp. Thích hợp trồng trên đất dốc, vùng khó khăn.",
    documents: [{ name: "quy-trinh-canh-tac-nk66.pdf", url: "#" }],
    status: "active",
    updatedAt: "2024-01-23",
  },
  {
    id: "5",
    illustration:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdJVGm-sJJtIaAWAKr9iSf1cR2w7C-iJZqUw&s",
    crop: "Bắp",
    varietyCode: "BP-HN88",
    varietyName: "Ngô nếp HN88",
    supplier: "Công ty Giống Cây trồng Trung ương",
    origin: "Việt Nam",
    germinationRate: 89,
    uniformity: 75,
    yield: "18-20 tấn bắp tươi/ha",
    description:
      "Ngô nếp lai F1, chất lượng ăn tươi ngon, dẻo, ngọt, thơm đậm. Thời gian thu hoạch ngắn (65-70 ngày). Vỏ bi kín, bắp to.",
    documents: [],
    status: "active",
    updatedAt: "2024-01-24",
  },
  {
    id: "6",
    illustration:
      "https://traicayvuongtron.vn/resources/cache/original_xxxxx/WEBSITE%202023/tim%20hieu%20them/blog/kinh%20nghiem%2Cmeo%20vat/trai%20cay/trai%20cay%20dac%20san/sauriengri6/sauriengri62.jpg.webp",
    crop: "Sầu riêng",
    varietyCode: "VARI01",
    varietyName: "Hạt giống Sầu riêng Ri6",
    supplier: "Công ty Mekong Seed",
    origin: "Việt Nam",
    germinationRate: 95,
    uniformity: 85,
    yield: "15-20 tấn/ha",
    description: "Hạt giống sầu riêng Ri6 chất lượng cao, kháng bệnh tốt.",
    documents: [],
    status: "active",
    updatedAt: "2024-02-24",
  },
  {
    id: "7",
    illustration:
      "https://nongsantaynguyen.net/wp-content/uploads/2017/04/sau-rieng-dona-sau-rieng-thai-lan.jpg",
    crop: "Sầu riêng",
    varietyCode: "VARI02",
    varietyName: "Hạt giống Sầu riêng Dona",
    supplier: "Syngenta Việt Nam",
    origin: "Thái Lan",
    germinationRate: 92,
    uniformity: 88,
    yield: "20-25 tấn/ha",
    description: "Hạt giống sầu riêng Dona F1, năng suất ổn định.",
    documents: [],
    status: "active",
    updatedAt: "2024-02-24",
  },
  {
    id: "8",
    illustration:
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/sau_Musa_King_01_0ea1377077.jpg",
    crop: "Sầu riêng",
    varietyCode: "VARI03",
    varietyName: "Hạt giống Sầu riêng Musang King",
    supplier: "Công ty Giống Cây trồng Trung ương",
    origin: "Malaysia",
    germinationRate: 90,
    uniformity: 80,
    yield: "10-14 tấn/ha",
    description: "Hạt giống Musang King nhập khẩu, chuẩn giống.",
    documents: [],
    status: "active",
    updatedAt: "2024-02-24",
  },
  {
    id: "9",
    illustration:
      "https://vinadurian.com/wp-content/uploads/2023/11/sau-rieng-black-thorn-05-i.jpg",
    crop: "Sầu riêng",
    varietyCode: "VARI04",
    varietyName: "Hạt giống Sầu riêng Black Thorn",
    supplier: "Viện Nghiên cứu Ngô Trung ương",
    origin: "Malaysia",
    germinationRate: 88,
    uniformity: 75,
    yield: "12-16 tấn/ha",
    description: "Gia tăng giá trị kinh tế với sầu riêng Black Thorn.",
    documents: [],
    status: "active",
    updatedAt: "2024-02-24",
  },
  {
    id: "10",
    illustration:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcROeFYHrBvhkXLU78CIneldJwI3mgAWoFDZsxJ5f2sXfPdgwkF9xweTGSi2oLpcSSt1n4CoRTq2huxq1toGW128i1mZCKxrYcXbSwPQ-tesGnTqXiN-gKtN0VidPtK1b188MUGgnw&usqp=CAc",
    crop: "Lúa",
    varietyCode: "VARI05",
    varietyName: "Hạt giống Lúa OM5451",
    supplier: "Trung tâm Giống cây trồng Việt Nam",
    origin: "Việt Nam",
    germinationRate: 98,
    uniformity: 95,
    yield: "6-8 tấn/ha",
    description: "Giống lúa xác nhận OM5451, sạch bệnh, tỷ lệ nảy mầm cao.",
    documents: [],
    status: "active",
    updatedAt: "2024-02-24",
  },
];

export const cropOptions = [
  { label: "Đậu nành", value: "Đậu nành" },
  { label: "Đậu xanh", value: "Đậu xanh" },
  { label: "Bắp", value: "Bắp" },
  { label: "Lúa", value: "Lúa" },
  { label: "Sầu riêng", value: "Sầu riêng" },
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
