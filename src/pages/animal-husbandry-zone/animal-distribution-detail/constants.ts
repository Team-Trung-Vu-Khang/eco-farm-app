// Seed/Variety Types
export interface Seed {
  id: string;
  code: string;
  name: string;
  variety: string; // Giống vật nuôi
  type: string; // Nhóm vật nuôi (Gia súc, Gia cầm)
  origin: string;
  quality: "A" | "B" | "C";
  imageUrl?: string; // Optional image URL
}

export const MOCK_SEEDS: Seed[] = [
  {
    id: "seed-1",
    code: "AN-BG-001",
    name: "Bò Angus giống",
    variety: "Bò",
    type: "Gia súc",
    origin: "Úc",
    quality: "A",
    imageUrl:
      "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "seed-2",
    code: "AN-PG-002",
    name: "Lợn Duroc giống",
    variety: "Lợn",
    type: "Gia súc",
    origin: "Mỹ",
    quality: "A",
    imageUrl:
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "seed-3",
    code: "AN-CH-001",
    name: "Gà giống Ai Cập",
    variety: "Gà",
    type: "Gia cầm",
    origin: "Ai Cập",
    quality: "A",
    imageUrl:
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "seed-4",
    code: "AN-DK-001",
    name: "Vịt giống Super Meat",
    variety: "Vịt",
    type: "Gia cầm",
    origin: "Pháp",
    quality: "A",
    imageUrl:
      "https://images.unsplash.com/photo-1484557985045-ebd25e08b53e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

// AnimalDistribution Types
export type AnimalDistributionScope = "region" | "area" | "plot";
export type AnimalDistributionMethod = "zone" | "row"; // Phân bổ theo vùng hoặc theo hàng

// Animal Entry for Zone AnimalDistribution
export interface AnimalEntry {
  id: string;
  variety: string; // Giống vật nuôi
  seedId: string; // Giống/Con giống
  quantity: number; // Số lượng con
}

// Row Configuration for Row AnimalDistribution
export interface RowConfig {
  id: string;
  rowNumber: number;
  variety: string;
  seedId: string;
  quantity: number;
  startPosition?: number;
  endPosition?: number;
}

// GPS Location for animals
export interface AnimalLocation {
  id: string;
  animalCode: string; // Mã con vật
  seedId: string;
  coordinate: {
    lat: number;
    lng: number;
  };
  animaledDate: string;
  rowNumber?: number; // If distributed by row
}
