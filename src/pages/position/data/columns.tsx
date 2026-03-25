import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Position } from "../../../stores/usePositionStore";

export const positionColumns: Column<Position>[] = [
  { key: "code", label: "Mã chức vụ" },
  { key: "name", label: "Tên chức vụ" },
  { key: "group", label: "Nhóm chức vụ" },
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
