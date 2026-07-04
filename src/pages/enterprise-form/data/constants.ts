import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { EnterpriseType } from "../types";
import type { MasterDataRecord } from "@/features/master-data/types/master-data.type";

export const INITIAL_ORGANIZATION_DATA: EnterpriseType[] = [
  {
    id: 1,
    code: "HTX",
    name: "Hợp tác xã",
    description:
      "Tổ chức kinh tế tập thể do các thành viên tự nguyện thành lập",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "DNTN",
    name: "Doanh nghiệp tư nhân",
    description:
      "Doanh nghiệp do một cá nhân làm chủ và chịu trách nhiệm bằng toàn bộ tài sản",
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    code: "TNHH",
    name: "Công ty TNHH",
    description:
      "Công ty trách nhiệm hữu hạn, thành viên chịu trách nhiệm trong phạm vi vốn góp",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    code: "CP",
    name: "Công ty cổ phần",
    description:
      "Công ty có vốn điều lệ chia thành nhiều phần bằng nhau gọi là cổ phần",
    status: "active",
    createdAt: "2024-01-13",
  },
  {
    id: 5,
    code: "DNNN",
    name: "Doanh nghiệp nhà nước",
    description: "Doanh nghiệp do Nhà nước nắm giữ 100% vốn điều lệ",
    status: "active",
    createdAt: "2024-01-14",
  },
  {
    id: 6,
    code: "NH",
    name: "Nông hộ",
    description: "Hộ gia đình sản xuất nông nghiệp, lâm nghiệp, ngư nghiệp",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 7,
    code: "HTXLN",
    name: "Hợp tác xã liên hiệp",
    description: "Liên hiệp của các hợp tác xã cùng ngành nghề hoặc lãnh thổ",
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: 8,
    code: "TCKT",
    name: "Tổ hợp tác",
    description: "Tổ chức kinh tế hợp tác nhỏ hơn hợp tác xã",
    status: "active",
    createdAt: "2024-01-17",
  },
];

export const INITIAL_BUSINESS_DATA: EnterpriseType[] = [
  {
    id: 1,
    code: "SX",
    name: "Sản xuất",
    description:
      "Hoạt động sản xuất nông nghiệp, trồng trọt, chăn nuôi, nuôi trồng thủy sản",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "CB",
    name: "Chế biến",
    description: "Chế biến nông sản, thực phẩm, đóng gói và bảo quản",
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    code: "TM",
    name: "Thương mại",
    description: "Mua bán, phân phối nông sản, vật tư nông nghiệp",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    code: "DV",
    name: "Dịch vụ",
    description:
      "Dịch vụ hỗ trợ sản xuất: tưới tiêu, cơ giới hóa, tư vấn kỹ thuật",
    status: "active",
    createdAt: "2024-01-13",
  },
  {
    id: 5,
    code: "XK",
    name: "Xuất khẩu",
    description: "Xuất khẩu nông sản, thủy sản ra thị trường quốc tế",
    status: "active",
    createdAt: "2024-01-14",
  },
  {
    id: 6,
    code: "DVTC",
    name: "Dịch vụ tài chính",
    description: "Tín dụng, bảo hiểm, cho vay vốn sản xuất nông nghiệp",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 7,
    code: "CNSH",
    name: "Công nghệ sau thu hoạch",
    description: "Bảo quản, sơ chế, đóng gói, vận chuyển nông sản",
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: 8,
    code: "DVKT",
    name: "Dịch vụ khoa học kỹ thuật",
    description: "Nghiên cứu, chuyển giao công nghệ, tư vấn kỹ thuật canh tác",
    status: "active",
    createdAt: "2024-01-17",
  },
  {
    id: 9,
    code: "DVVT",
    name: "Dịch vụ vật tư",
    description:
      "Cung cấp giống, phân bón, thuốc bảo vệ thực vật, thức ăn chăn nuôi",
    status: "active",
    createdAt: "2024-01-18",
  },
  {
    id: 10,
    code: "DVLH",
    name: "Dịch vụ logistics",
    description: "Vận chuyển, kho bãi, phân phối nông sản",
    status: "active",
    createdAt: "2024-01-19",
  },
  {
    id: 11,
    code: "DVTV",
    name: "Dịch vụ tư vấn",
    description: "Tư vấn quản lý, marketing, chứng nhận tiêu chuẩn",
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: 12,
    code: "NNCS",
    name: "Nông nghiệp công nghệ cao",
    description: "Ứng dụng công nghệ cao trong sản xuất nông nghiệp",
    status: "active",
    createdAt: "2024-01-21",
  },
];

export const ENTERPRISE_COLUMNS: Column<EnterpriseType>[] = [
  { key: "code", label: "Mã" },
  { key: "name", label: "Tên" },
  { key: "description", label: "Mô tả" },
];

type BusinessLineRow = MasterDataRecord<"business-lines">;

const ORGANIZATION_TYPE_LABELS: Record<string, string> = {
  enterprise: "Doanh nghiệp",
  farm_household: "Nông hộ",
  cooperative: "Hợp tác xã",
};

type OrganizationTypeRow = MasterDataRecord<"organization-types">;

export const ORGANIZATION_COLUMNS: Column<OrganizationTypeRow>[] = [
  { key: "code", label: "Mã" },
  { key: "name", label: "Tên" },
  {
    key: "type",
    label: "Nhóm đơn vị",
    render: (_value: unknown, row: OrganizationTypeRow) =>
      ORGANIZATION_TYPE_LABELS[row.type ?? "enterprise"],
  },
  { key: "description", label: "Mô tả" },
];

export const BUSINESS_COLUMNS: Column<BusinessLineRow>[] = [
  { key: "code", label: "Mã" },
  { key: "name", label: "Tên" },
  { key: "description", label: "Mô tả" },
];
