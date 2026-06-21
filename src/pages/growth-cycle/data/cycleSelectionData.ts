import { CROP_OPTIONS } from "@/constants/crops";

export type CyclePrimaryOptionType = "plant" | "animal";

export interface CyclePrimaryOption {
  id: string;
  name: string;
  group: string;
  image: string;
  description: string;
}

export interface CycleBreedOption {
  id: string;
  primaryId: string;
  name: string;
  code: string;
  image: string;
  description: string;
}

export const plantCycleOptions: CyclePrimaryOption[] = CROP_OPTIONS.map((crop) => ({
  id: crop.id,
  name: crop.name,
  group: crop.group,
  image: crop.image,
  description: `${crop.group} phổ biến trong hệ thống trồng trọt.`,
}));

export const animalCycleOptions: CyclePrimaryOption[] = [
  {
    id: "heo",
    name: "Heo",
    group: "Gia súc",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/db/Pig_USDA01c0116.jpg",
    description: "Chu kỳ chăn nuôi heo thịt, heo nái hoặc heo hậu bị.",
  },
  {
    id: "ga",
    name: "Gà",
    group: "Gia cầm",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Broiler_house.jpg",
    description: "Chu kỳ nuôi gà thịt, gà đẻ trứng hoặc gà giống.",
  },
  {
    id: "bo",
    name: "Bò sữa",
    group: "Gia súc",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Cow_female_black_white.jpg",
    description: "Chu kỳ nuôi bò sữa hoặc bò thịt theo từng giai đoạn.",
  },
  {
    id: "ca-rolphi",
    name: "Cá rô phi",
    group: "Thủy sản",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Tilapia_cabrae.jpg",
    description: "Chu kỳ ương nuôi cá rô phi, cá bố mẹ hoặc cá thương phẩm.",
  },
];

export const animalBreedOptions: CycleBreedOption[] = [
  {
    id: "heo-thit",
    primaryId: "heo",
    name: "Heo thịt",
    code: "PIG-FEED",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/db/Pig_USDA01c0116.jpg",
    description: "Vỗ béo, tăng trọng và xuất chuồng.",
  },
  {
    id: "heo-nai",
    primaryId: "heo",
    name: "Heo nái sinh sản",
    code: "PIG-BREED",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/db/Pig_USDA01c0116.jpg",
    description: "Hậu bị, phối giống, mang thai và nuôi con.",
  },
  {
    id: "ga-thit",
    primaryId: "ga",
    name: "Gà thịt công nghiệp",
    code: "BROILER",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Broiler_house.jpg",
    description: "Úm gà, tăng trọng nhanh và xuất bán.",
  },
  {
    id: "ga-trung",
    primaryId: "ga",
    name: "Gà đẻ trứng",
    code: "LAYING-HEN",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Broiler_house.jpg",
    description: "Hậu bị, vào đẻ, khai thác trứng và thay lông.",
  },
  {
    id: "bo-sua",
    primaryId: "bo",
    name: "Bò sữa Holstein",
    code: "HOLSTEIN",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Cow_female_black_white.jpg",
    description: "Hậu bị, phối giống, tiết sữa và cạn sữa.",
  },
  {
    id: "bo-thit",
    primaryId: "bo",
    name: "Bò thịt",
    code: "BEEF",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Cow_female_black_white.jpg",
    description: "Nuôi sinh trưởng, vỗ béo và xuất bán.",
  },
  {
    id: "ca-rolphi-thit",
    primaryId: "ca-rolphi",
    name: "Cá rô phi đơn tính",
    code: "TILAPIA-SM",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Tilapia_cabrae.jpg",
    description: "Ương giống, nuôi thương phẩm và thu hoạch.",
  },
  {
    id: "ca-rolphi-bo-me",
    primaryId: "ca-rolphi",
    name: "Cá rô phi bố mẹ",
    code: "TILAPIA-BR",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Tilapia_cabrae.jpg",
    description: "Nuôi hậu bị, sinh sản và ương cá giống.",
  },
];
