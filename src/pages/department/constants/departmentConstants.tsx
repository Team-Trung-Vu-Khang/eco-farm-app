import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { type Department } from "../../../stores/useDepartmentStore";

export const DEPARTMENT_COLUMNS: Column<Department>[] = [
  { key: "code", label: "Mã phòng ban" },
  { key: "name", label: "Tên phòng ban" },
  { key: "description", label: "Mô tả" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "outline"}>
        {value === "active" ? "Hoạt động" : "Ngừng hoạt động"}
      </Badge>
    ),
  },
  { key: "createdAt", label: "Ngày tạo" },
];
