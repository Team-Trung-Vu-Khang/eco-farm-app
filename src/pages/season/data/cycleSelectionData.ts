import { CROP_OPTIONS } from "@/constants/crops";

export interface MockPrimaryOption {
  id: string;
  numericId: number;
  name: string;
  group: string;
  image: string;
  description?: string;
}

export interface MockChildOption {
  id: string;
  numericId: number;
  primaryId: string;
  name: string;
  code?: string;
  image: string;
  description?: string;
  group?: string;
}

export const plantCycleOptions: MockPrimaryOption[] = CROP_OPTIONS.map(
  (crop, index) => ({
    id: crop.id,
    numericId: index + 1,
    name: crop.name,
    group: crop.group,
    image: crop.image,
    description: `${crop.group} phổ biến trong hệ thống trồng trọt.`,
  }),
);

export const animalCycleOptions: MockPrimaryOption[] = [
  {
    id: "heo",
    numericId: 101,
    name: "Heo",
    group: "Gia súc",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/db/Pig_USDA01c0116.jpg",
    description: "Chu kỳ chăn nuôi heo thịt, heo nái hoặc heo hậu bị.",
  },
  {
    id: "ga",
    numericId: 102,
    name: "Gà",
    group: "Gia cầm",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0f/Broiler_house.jpg",
    description: "Chu kỳ nuôi gà thịt, gà đẻ trứng hoặc gà giống.",
  },
  {
    id: "bo",
    numericId: 103,
    name: "Bò sữa",
    group: "Gia súc",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/Cow_female_black_white.jpg",
    description: "Chu kỳ nuôi bò sữa hoặc bò thịt theo từng giai đoạn.",
  },
  {
    id: "ca-rolphi",
    numericId: 104,
    name: "Cá rô phi",
    group: "Thủy sản",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/5d/Tilapia_cabrae.jpg",
    description: "Chu kỳ ương nuôi cá rô phi, cá bố mẹ hoặc cá thương phẩm.",
  },
];

export const animalBreedOptions: MockChildOption[] = [
  {
    id: "heo-thit",
    numericId: 201,
    primaryId: "heo",
    name: "Heo thịt",
    code: "PIG-FEED",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/db/Pig_USDA01c0116.jpg",
    description: "Vỗ béo, tăng trọng và xuất chuồng.",
  },
  {
    id: "heo-nai",
    numericId: 202,
    primaryId: "heo",
    name: "Heo nái sinh sản",
    code: "PIG-BREED",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/db/Pig_USDA01c0116.jpg",
    description: "Hậu bị, phối giống, mang thai và nuôi con.",
  },
  {
    id: "ga-thit",
    numericId: 203,
    primaryId: "ga",
    name: "Gà thịt công nghiệp",
    code: "BROILER",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0f/Broiler_house.jpg",
    description: "Úm gà, tăng trọng nhanh và xuất bán.",
  },
  {
    id: "ga-trung",
    numericId: 204,
    primaryId: "ga",
    name: "Gà đẻ trứng",
    code: "LAYING-HEN",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0f/Broiler_house.jpg",
    description: "Hậu bị, vào đẻ, khai thác trứng và thay lông.",
  },
  {
    id: "bo-sua",
    numericId: 205,
    primaryId: "bo",
    name: "Bò sữa Holstein",
    code: "HOLSTEIN",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/Cow_female_black_white.jpg",
    description: "Hậu bị, phối giống, tiết sữa và cạn sữa.",
  },
  {
    id: "bo-thit",
    numericId: 206,
    primaryId: "bo",
    name: "Bò thịt",
    code: "BEEF",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/Cow_female_black_white.jpg",
    description: "Nuôi sinh trưởng, vỗ béo và xuất bán.",
  },
  {
    id: "ca-rolphi-thit",
    numericId: 207,
    primaryId: "ca-rolphi",
    name: "Cá rô phi đơn tính",
    code: "TILAPIA-SM",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/5d/Tilapia_cabrae.jpg",
    description: "Ương giống, nuôi thương phẩm và thu hoạch.",
  },
  {
    id: "ca-rolphi-bo-me",
    numericId: 208,
    primaryId: "ca-rolphi",
    name: "Cá rô phi bố mẹ",
    code: "TILAPIA-BR",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/5d/Tilapia_cabrae.jpg",
    description: "Nuôi hậu bị, sinh sản và ương cá giống.",
  },
];
