import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { MaterialGroup } from "../types/types";

export const materialGroupColumns: Column<MaterialGroup>[] = [
  { key: "code", label: "Mã nhóm" },
  { key: "name", label: "Tên nhóm" },
  { key: "description", label: "Mô tả" },
];
