import { PROVINCES } from "@/constants/province";
import {
  Building2,
  Target,
  Map as MapIcon,
  Activity,
} from "lucide-react";

export interface AdvancedFilters {
  types?: string[];
  classifications?: string[];
  status?: string[];
  provinces?: string[];
}

export const ORGANIZATION_TYPES = [
  { id: "enterprise", name: "Doanh nghiệp" },
  { id: "farm", name: "Nông hộ" },
  { id: "cooperative", name: "Hợp tác xã" },
];

export const BUSINESS_FIELDS = [
  { id: "production", name: "Sản xuất" },
  { id: "processing", name: "Chế biến" },
  { id: "trading", name: "Thương mại" },
  { id: "service", name: "Dịch vụ" },
];

export const STATUS_OPTIONS = [
  { id: "active", name: "Đang hoạt động" },
  { id: "inactive", name: "Ngưng hoạt động" },
];

export const PROVINCE_OPTIONS = PROVINCES.map(p => ({ id: p.name, name: p.name }));

export const POLYGON_COLORS = {
  region: "#3b82f6", // blue
  area: "#10b981",   // emerald
  plot: "#f59e0b",   // orange
};

export const FILTER_GROUP_CONFIG = [
  {
    title: "1. Quy mô & Lĩnh vực",
    icon: Building2,
    fields: [
      {
        key: "types" as keyof AdvancedFilters,
        label: "Loại hình tổ chức",
        icon: Building2,
        options: ORGANIZATION_TYPES,
      },
      {
        key: "classifications" as keyof AdvancedFilters,
        label: "Lĩnh vực kinh doanh",
        icon: Target,
        options: BUSINESS_FIELDS,
      },
    ],
  },
  {
    title: "2. Vị trí & Trạng thái",
    icon: MapIcon,
    fields: [
      {
        key: "provinces" as keyof AdvancedFilters,
        label: "Tỉnh thành hoạt động",
        icon: MapIcon,
        options: PROVINCE_OPTIONS,
      },
      {
        key: "status" as keyof AdvancedFilters,
        label: "Trạng thái vận hành",
        icon: Activity,
        options: STATUS_OPTIONS,
      },
    ],
  },
];
