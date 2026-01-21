// Seed/Variety Types
export interface Seed {
  id: string;
  code: string;
  name: string;
  variety: string; // Giống cây
  type: string; // Loại (fruit, vegetable, etc.)
  origin: string;
  quality: "A" | "B" | "C";
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
  },
  {
    id: "seed-2",
    code: "SD-DR-002",
    name: "Hạt giống Sầu riêng Ri6",
    variety: "Sầu riêng",
    type: "Trái cây",
    origin: "Việt Nam",
    quality: "A",
  },
  {
    id: "seed-3",
    code: "SD-AV-001",
    name: "Hạt giống Bơ 034",
    variety: "Bơ",
    type: "Trái cây",
    origin: "Việt Nam",
    quality: "A",
  },
  {
    id: "seed-4",
    code: "SD-MG-001",
    name: "Hạt giống Xoài Cát Hòa Lộc",
    variety: "Xoài",
    type: "Trái cây",
    origin: "Việt Nam",
    quality: "A",
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
