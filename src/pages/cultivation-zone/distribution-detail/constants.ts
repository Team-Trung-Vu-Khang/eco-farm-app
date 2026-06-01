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
    code: "SD-RC-001",
    name: "Hạt giống Lúa ST25",
    variety: "Lúa ST25",
    type: "Cây lương thực",
    origin: "Việt Nam",
    quality: "A",
    imageUrl:
      "https://rice-spices.com/wp-content/uploads/2023/06/ST25-RICE-1.jpg",
  },
  {
    id: "seed-2",
    code: "SD-RC-002",
    name: "Hạt giống Lúa OM5451",
    variety: "Lúa OM5451",
    type: "Cây lương thực",
    origin: "Việt Nam",
    quality: "A",
    imageUrl: "https://ssc.com.vn/storage/app/media/product/OM5451-1.jpg",
  },
  {
    id: "seed-3",
    code: "SD-RC-003",
    name: "Hạt giống Lúa Japonica",
    variety: "Lúa Japonica",
    type: "Cây lương thực",
    origin: "Nhật Bản",
    quality: "A",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Koshihikari_rice.jpg/640px-Koshihikari_rice.jpg",
  },
  {
    id: "seed-4",
    code: "SD-RC-004",
    name: "Hạt giống Lúa Nàng Hoa 9",
    variety: "Lúa Nàng Hoa 9",
    type: "Cây lương thực",
    origin: "Việt Nam",
    quality: "A",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Rice_grains_%28IRRI%29.jpg/640px-Rice_grains_%28IRRI%29.jpg",
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
