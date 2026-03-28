import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Terrain } from "../../../stores/useTerrainStore";

export const terrainColumns: Column<Terrain>[] = [
  { key: "code", label: "Mã" },
  { key: "name", label: "Tên địa hình" },
  { key: "description", label: "Mô tả" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value === "active" ? "Hoạt động" : "Không hoạt động"}
      </Badge>
    ),
  },
  { key: "createdAt", label: "Ngày tạo" },
];
