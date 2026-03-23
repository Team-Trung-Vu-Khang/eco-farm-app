// Defines constants, interfaces for Fertilizer Domain

export interface Fertilizer {
  id: number;
  code: string;
  name: string;
  type: string;
  nutrientContent: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export const initialFertilizers: Fertilizer[] = [
  {
    id: 1,
    code: "PB001",
    name: "NPK 20-20-15 Đầu Trâu",
    type: "Phân vô cơ",
    nutrientContent: "N: 20%, P: 20%, K: 15%",
    description: "Phân bón NPK cao cấp, kích thích ra rễ, đẻ nhánh",
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: 2,
    code: "PB002",
    name: "Phân hữu cơ vi sinh Sông Gianh",
    type: "Phân hữu cơ",
    nutrientContent: "Hữu cơ: 15%, Axit Humic: 2.5%",
    description: "Cải tạo đất, cung cấp mùn hữu cơ",
    status: "active",
    createdAt: "2024-01-21",
  },
  {
    id: 3,
    code: "PB003",
    name: "Đạm Phú Mỹ",
    type: "Phân đơn",
    nutrientContent: "N: 46%",
    description: "Giúp cây sinh trưởng nhanh, lá xanh tốt",
    status: "active",
    createdAt: "2024-01-22",
  },
  {
    id: 4,
    code: "PB004",
    name: "NPK 16-16-8 Lâm Thao",
    type: "Phân phức hợp",
    nutrientContent: "N: 16%, P: 16%, K: 8%",
    description: "Phân bón tổng hợp cho giai đoạn sinh trưởng",
    status: "active",
    createdAt: "2024-01-23",
  },
  {
    id: 5,
    code: "PB005",
    name: "Lân Siêu Lân Cà Mau",
    type: "Phân đơn",
    nutrientContent: "P2O5: 16%",
    description: "Bổ sung lân cho đất, kích thích ra hoa đậu quả",
    status: "active",
    createdAt: "2024-01-24",
  },
  {
    id: 6,
    code: "PB006",
    name: "Kali Clorua KCl",
    type: "Phân đơn",
    nutrientContent: "K2O: 60%",
    description: "Tăng cường sức đề kháng, chất lượng quả",
    status: "active",
    createdAt: "2024-01-25",
  },
  {
    id: 7,
    code: "PB007",
    name: "Phân vi sinh Trichoderma",
    type: "Phân vi sinh",
    nutrientContent: "Vi sinh vật: 10^8 CFU/g",
    description: "Phòng trừ bệnh đất, kích thích sinh trưởng rễ",
    status: "active",
    createdAt: "2024-01-26",
  },
  {
    id: 8,
    code: "PB008",
    name: "Phân bón lá NPK 30-10-10",
    type: "Phân bón lá",
    nutrientContent: "N: 30%, P: 10%, K: 10% + Vi lượng",
    description: "Phun lá bổ sung dinh dưỡng nhanh chóng",
    status: "active",
    createdAt: "2024-01-27",
  },
  {
    id: 9,
    code: "PB009",
    name: "Phân hữu cơ Dơi Guano",
    type: "Phân hữu cơ",
    nutrientContent: "N: 10%, P: 12%, K: 2%, Hữu cơ: 45%",
    description: "Phân hữu cơ cao cấp từ phân dơi, giàu dinh dưỡng",
    status: "active",
    createdAt: "2024-01-28",
  },
  {
    id: 10,
    code: "PB010",
    name: "DAP (Đạm Lân)",
    type: "Phân phức hợp",
    nutrientContent: "N: 18%, P2O5: 46%",
    description: "Phân bón lót, cung cấp đạm và lân cho cây trồng",
    status: "active",
    createdAt: "2024-01-29",
  },
  {
    id: 11,
    code: "PB011",
    name: "Phân bón lá Canxi Boron",
    type: "Phân bón lá",
    nutrientContent: "Ca: 15%, B: 0.5%",
    description: "Phòng nứt quả, tăng độ cứng vỏ, chống rụng hoa",
    status: "active",
    createdAt: "2024-01-30",
  },
  {
    id: 12,
    code: "PB012",
    name: "Phân hữu cơ vi sinh Orgatop",
    type: "Phân hữu cơ",
    nutrientContent: "Hữu cơ: 20%, NPK: 3-2-1, Vi sinh: 10^7 CFU/g",
    description: "Kết hợp hữu cơ và vi sinh, cải tạo đất hiệu quả",
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: 13,
    code: "PB013",
    name: "NPK 15-5-20 Chuyên Dụng Cây Ăn Quả",
    type: "Phân phức hợp",
    nutrientContent: "N: 15%, P: 5%, K: 20% + TE",
    description: "Công thức chuyên biệt cho cây ăn quả, tăng năng suất",
    status: "active",
    createdAt: "2024-02-02",
  },
  {
    id: 14,
    code: "PB014",
    name: "Phân vi sinh Azospirillum",
    type: "Phân vi sinh",
    nutrientContent: "Vi khuẩn cố định đạm: 10^9 CFU/g",
    description: "Cố định đạm sinh học, giảm lượng phân đạm hóa học",
    status: "active",
    createdAt: "2024-02-03",
  },
  {
    id: 15,
    code: "PB015",
    name: "Phân bón lá Kelp (Tảo Biển)",
    type: "Phân bón lá",
    nutrientContent: "Chiết xuất tảo biển 30%, Axit amin 5%",
    description: "Tăng cường sức đề kháng, kích thích sinh trưởng tự nhiên",
    status: "active",
    createdAt: "2024-02-04",
  },
];

export const fertilizerTypes = [
  "Phân vô cơ",
  "Phân hữu cơ",
  "Phân vi sinh",
  "Phân bón lá",
  "Phân đơn",
  "Phân phức hợp",
];

export const commonHashtags = [
  "TangTruongNhanh",
  "CaiTaoDat",
  "RaHoaDauQua",
  "AnToanSinhHoc",
  "ChuyenDungCayAnQua",
];

export const suppliers = [
  { id: "sup1", name: "Công ty Phân bón Bình Điền", type: "enterprise" },
  { id: "sup2", name: "Đại lý VTNN Hòa Phát", type: "enterprise" },
  { id: "sup3", name: "HTX Nông nghiệp Xanh", type: "enterprise" },
  { id: "sup4", name: "Nông hộ Nguyễn Văn A", type: "farmer" },
];

export const units = ["Bao", "Gói", "Thùng", "Chai", "Can", "Tấn", "Kg"];
