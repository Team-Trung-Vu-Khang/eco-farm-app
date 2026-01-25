// Seed/Variety Types
export interface Seed {
  id: string;
  code: string;
  name: string;
  variety: string; // Giống cây
  type: string; // Loại (fruit, vegetable, etc.)
  origin: string;
  quality: "A" | "B" | "C";
  imageUrl?: string; // Optional image URL
}

export const MOCK_SEEDS: Seed[] = [
  {
    id: "seed-1",
    code: "SD-DR-001",
    name: "Hạt giống Sầu riêng Monthong",
    variety: "Sầu riêng",
    type: "Trái cây",
    origin: "Thái Lan",
    quality: "A",
    imageUrl:
      "https://vuacaygiong.com/wp-content/uploads/2022/03/dia_chi_cung_cap_giong_sau_rieng_ri6_monthon_musang_king_black_thorn.jpg",
  },
  {
    id: "seed-2",
    code: "SD-DR-002",
    name: "Hạt giống Sầu riêng Ri6",
    variety: "Sầu riêng",
    type: "Trái cây",
    origin: "Việt Nam",
    quality: "A",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/grande/100/407/635/products/cay-giong-sau-rieng-ri6.jpg?v=1637295175713",
  },
  {
    id: "seed-3",
    code: "SD-AV-001",
    name: "Hạt giống Bơ 034",
    variety: "Bơ",
    type: "Trái cây",
    origin: "Việt Nam",
    quality: "A",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT19UCTo9SJEvSVoM-A4b6h3MHpNmf1-rYVlQ&s",
  },
  {
    id: "seed-4",
    code: "SD-MG-001",
    name: "Hạt giống Xoài Cát Hòa Lộc",
    variety: "Xoài",
    type: "Trái cây",
    origin: "Việt Nam",
    quality: "A",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/grande/100/422/567/files/cay-giong-xoai-cat-hoa-loc-8ac19b60-86e6-4915-ac84-f34faf708e6d.jpg?v=1635758427166",
  },
];

// Distribution Types
export type DistributionScope = "region" | "area" | "plot";
export type DistributionMethod = "zone" | "row"; // Phân bổ theo vùng hoặc theo hàng

// Plant Entry for Zone Distribution
export interface PlantEntry {
  id: string;
  variety: string; // Giống cây
  seedId: string; // Hạt giống
  quantity: number; // Số lượng cây
}

// Row Configuration for Row Distribution
export interface RowConfig {
  id: string;
  rowNumber: number;
  variety: string;
  seedId: string;
  quantity: number;
  startPosition?: number;
  endPosition?: number;
}

// GPS Location for plants
export interface PlantLocation {
  id: string;
  plantCode: string; // Mã cây
  seedId: string;
  coordinate: {
    lat: number;
    lng: number;
  };
  plantedDate: string;
  rowNumber?: number; // If distributed by row
}
