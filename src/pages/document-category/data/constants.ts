export type EntityType = "enterprise" | "farm" | "cooperative" | "product" | "region";

export interface DocumentCategory {
  id: number;
  code: string;
  name: string;
  description?: string;
  entityTypes: EntityType[];
  required: boolean;
  allowMultiple: boolean;
  hasExpiry: boolean;
  status: "active" | "inactive";
  createdAt: string;
}

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  enterprise: "Doanh nghiệp",
  farm: "Nông hộ",
  cooperative: "Hợp tác xã",
  product: "Sản phẩm",
  region: "Vùng trồng",
};

export const ENTITY_TYPE_COLORS: Record<EntityType, string> = {
  enterprise: "blue",
  farm: "green",
  cooperative: "orange",
  product: "purple",
  region: "emerald",
};

export const initialDocumentCategories: DocumentCategory[] = [
  {
    id: 1,
    code: "GDKD",
    name: "Giấy đăng ký kinh doanh",
    description: "Giấy phép đăng ký kinh doanh chính thức của đơn vị",
    entityTypes: ["enterprise", "cooperative"],
    required: true,
    allowMultiple: false,
    hasExpiry: true,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    code: "SO_DO",
    name: "Sổ đỏ / Giấy chứng nhận quyền sử dụng đất",
    description: "Tài liệu chứng minh quyền sử dụng đất canh tác",
    entityTypes: ["farm", "region"],
    required: true,
    allowMultiple: true,
    hasExpiry: false,
    status: "active",
    createdAt: "2024-02-20",
  },
  {
    id: 3,
    code: "VIETGAP",
    name: "Chứng nhận VietGAP",
    description: "Chứng nhận thực hành nông nghiệp tốt tại Việt Nam",
    entityTypes: ["farm", "cooperative", "product"],
    required: false,
    allowMultiple: true,
    hasExpiry: true,
    status: "active",
    createdAt: "2024-03-10",
  },
  {
    id: 4,
    code: "ISO_22000",
    name: "Chứng nhận ISO 22000",
    description: "Hệ thống quản lý an toàn thực phẩm",
    entityTypes: ["enterprise", "cooperative"],
    required: false,
    allowMultiple: false,
    hasExpiry: true,
    status: "inactive",
    createdAt: "2024-04-05",
  },
];
