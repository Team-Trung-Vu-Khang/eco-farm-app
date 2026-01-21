export const PROVINCES = [
  { id: "binh-phuoc", name: "Bình Phước" },
  { id: "dong-nai", name: "Đồng Nai" },
  { id: "dak-lak", name: "Đắk Lắk" },
];

export const DISTRICTS = [
  { id: "dong-xoai", name: "Đồng Xoài" },
  { id: "bu-dang", name: "Bù Đăng" },
];

export const ENTERPRISES = [
  { id: "ent-1", name: "Công ty Nông nghiệp Xanh" },
  { id: "ent-2", name: "Hợp tác xã Hữu cơ" },
  { id: "farmer-1", name: "Nông hộ Nguyễn Văn A" },
];

export const LAND_TYPES = [
  { id: "red-soil", name: "Đất đỏ Bazan" },
  { id: "alluvial", name: "Đất phù sa" },
  { id: "grey-soil", name: "Đất xám" },
];

export const TERRAIN_TYPES = [
  { id: "flat", name: "Bằng phẳng" },
  { id: "hill", name: "Đồi núi" },
  { id: "slope", name: "Dốc" },
];

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface SubArea {
  id: string;
  name: string;
  area: number;
  landType: string;
  coordinates: Coordinate[]; // Rectangle corners
}

export interface Region {
  id: number;
  code: string;
  name: string;
  provinceId: string;
  districtId: string;
  address: string;
  enterpriseId: string;
  area: number;
  landType: string;
  terrain: string;
  note: string;
  status: "active" | "inactive";
  coordinates: Coordinate[]; // Rectangle corners for the region
  subAreas: SubArea[];
  createdAt: string;
}
