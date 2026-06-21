import type { PositionGroup, PositionGroupFormData } from "../types";

export const INITIAL_POSITION_GROUPS: PositionGroup[] = [
  {
    id: 1,
    code: "GRP-MNG",
    name: "Nhóm quản lý – điều hành",
    description:
      "Các chức vụ điều hành và quản lý trực tiếp hoạt động trang trại, từ chủ trang trại đến tổ trưởng sản xuất.",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    code: "GRP-TECH",
    name: "Nhóm kỹ thuật trồng trọt",
    description:
      "Các chức danh kỹ thuật chuyên trách về trồng trọt, canh tác và tối ưu hóa năng suất cây trồng.",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 3,
    code: "GRP-PPRO",
    name: "Nhóm bảo vệ thực vật",
    description:
      "Các chức danh chuyên trách phòng trừ sâu bệnh hại, quản lý dịch hại tổng hợp (IPM) và giám sát phun thuốc.",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 4,
    code: "GRP-SOIL",
    name: "Nhóm đất – phân bón – dinh dưỡng",
    description:
      "Các chức danh phân tích, quản lý đất đai và xây dựng chế độ dinh dưỡng, phân bón phù hợp cho cây trồng.",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 5,
    code: "GRP-SYS",
    name: "Nhóm tưới – hệ thống – nhà màng",
    description:
      "Các chức danh thiết kế, vận hành hệ thống tưới tiêu, nhà kính, nhà màng và canh tác thủy canh.",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 6,
    code: "GRP-SEED",
    name: "Nhóm giống – vườn ươm",
    description:
      "Các chức danh quản lý và kỹ thuật sản xuất, chọn lọc và nhân giống cây trồng.",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 7,
    code: "GRP-HARV",
    name: "Nhóm thu hoạch – sơ chế – chất lượng",
    description:
      "Các chức danh điều phối thu hoạch, quản lý quy trình sơ chế, đóng gói và kiểm soát chất lượng nông sản.",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 8,
    code: "GRP-STD",
    name: "Nhóm tiêu chuẩn – chứng nhận – truy xuất",
    description:
      "Các chức danh đảm bảo tuân thủ VietGAP, GlobalGAP và quản lý hồ sơ nhật ký truy xuất nguồn gốc.",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 9,
    code: "GRP-LOG",
    name: "Nhóm kho – vật tư – logistics",
    description:
      "Các chức danh quản lý kho vật tư nông nghiệp, nông sản và điều phối vận chuyển.",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 10,
    code: "GRP-MECH",
    name: "Nhóm cơ giới – bảo trì",
    description:
      "Các chức danh vận hành và bảo trì máy móc, thiết bị cơ giới nông nghiệp.",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 11,
    code: "GRP-LAB",
    name: "Nhóm lao động trực tiếp",
    description:
      "Các chức danh công nhân lao động trực tiếp tại trang trại, bao gồm lao động thường xuyên và lao động thời vụ.",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 12,
    code: "GRP-DIR",
    name: "Nhóm lãnh đạo – ban giám đốc",
    description:
      "Các chức danh lãnh đạo cấp cao: Hội đồng quản trị, Tổng Giám đốc, Giám đốc các khối và Phó Giám đốc.",
    status: "active",
    createdAt: "2024-01-01",
  },
];

export const emptyPositionGroupFormData: PositionGroupFormData = {
  code: "",
  name: "",
  description: "",
  status: "active",
};
