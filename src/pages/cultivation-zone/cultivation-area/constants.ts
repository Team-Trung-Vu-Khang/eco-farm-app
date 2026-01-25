export interface Certificate {
  id: string;
  name: string;
  code: string;
  organization: string;
  imageUrl: string;
}

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    name: "VietGAP",
    code: "VG-2024-001",
    organization: "Trung tâm Khuyến nông Quốc gia",
    imageUrl:
      "https://cdn.vietnambiz.vn/2020/3/2/vg-15831176957661073999454.jpg", // Placeholder
  },
  {
    id: "cert-2",
    name: "GlobalGAP",
    code: "GG-2023-999",
    organization: "GlobalGAP Secretariat",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0VCMHRpDAs8PTI0U7WmPd-Bnifg92-ai4_Q&s",
  },
  {
    id: "cert-3",
    name: "Organic USDA",
    code: "US-ORG-123",
    organization: "USDA",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0789/8483/files/Untitled-4.png?875230042906236671",
  },
];

export interface Manager {
  id: string;
  name: string;
  role: string;
  department: string;
  avatarUrl: string;
}

export const MOCK_MANAGERS: Manager[] = [
  {
    id: "man-1",
    name: "Nguyễn Văn An",
    role: "Kỹ sư trưởng",
    department: "Phòng Kỹ thuật",
    avatarUrl: "https://i.pravatar.cc/150?u=man-1",
  },
  {
    id: "man-2",
    name: "Trần Thị Bé",
    role: "Quản lý vùng",
    department: "Ban Quản lý",
    avatarUrl: "https://i.pravatar.cc/150?u=man-2",
  },
  {
    id: "man-3",
    name: "Lê Hoàng Nam",
    role: "Giám sát viên",
    department: "Phòng Giám sát",
    avatarUrl: "https://i.pravatar.cc/150?u=man-3",
  },
];

export interface FarmingMethod {
  id: string;
  name: string;
  allowedCrops: string[]; // IDs of allowed crops
}

export const FARMING_METHODS: FarmingMethod[] = [
  {
    id: "organic",
    name: "Hữu cơ (Organic)",
    allowedCrops: ["crop-1", "crop-2", "crop-3"],
  },
  {
    id: "vietgap",
    name: "VietGAP",
    allowedCrops: ["crop-1", "crop-2", "crop-4"],
  },
  {
    id: "traditional",
    name: "Truyền thống",
    allowedCrops: ["crop-1", "crop-4"],
  },
  {
    id: "greenhouse",
    name: "Nhà kính (High-tech)",
    allowedCrops: ["crop-2", "crop-3"],
  },
];

export const IRRIGATION_METHODS = [
  { id: "drip", name: "Tưới nhỏ giọt" },
  { id: "rain", name: "Tưới phun (Mưa nhân tạo)" },
  { id: "flood", name: "Tưới tràn" },
  { id: "manual", name: "Tưới thủ công" },
];

export interface CropVariety {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
}

export const CROP_VARIETIES: CropVariety[] = [
  {
    id: "crop-1",
    name: "Sầu riêng Monthong",
    type: "Fruit",
    imageUrl:
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop",
  },
  {
    id: "crop-2",
    name: "Dâu tây Hana",
    type: "Fruit",
    imageUrl:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop",
  },
  {
    id: "crop-3",
    name: "Cà chua Cherry",
    type: "Vegetable",
    imageUrl:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop",
  },
  {
    id: "crop-4",
    name: "Lúa ST25",
    type: "Grain",
    imageUrl:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
  },
  {
    id: "crop-5",
    name: "Bơ 034",
    type: "Fruit",
    imageUrl:
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop",
  },
];
