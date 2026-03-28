import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Branch } from "../../../stores/useBranchStore";

export const branchColumns: Column<Branch>[] = [
  { key: "code", label: "Mã" },
  { key: "name", label: "Tên chi nhánh" },
  { key: "enterpriseName", label: "Đơn vị chủ quản" },
  { key: "phone", label: "Điện thoại" },
  { key: "email", label: "Email" },
  { key: "address", label: "Địa chỉ" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "outline"}>
        {value === "active" ? "Hoạt động" : "Không hoạt động"}
      </Badge>
    ),
  },
];

export const branchFilters = [
  {
    key: "status",
    label: "Trạng thái",
    options: [
      { label: "Hoạt động", value: "active" },
      { label: "Không hoạt động", value: "inactive" },
    ],
  },
] as const;
