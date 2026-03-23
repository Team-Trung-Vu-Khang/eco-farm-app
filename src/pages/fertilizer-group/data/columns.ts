import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { FertilizerGroup } from "./constants";

export const fertilizerGroupColumns: Column<FertilizerGroup>[] = [
  { key: "code", label: "Mã nhóm" },
  { key: "name", label: "Tên nhóm" },
  { key: "description", label: "Mô tả" },
];
