import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { FertilizerGroupRecord } from "@/features/master-data/types/master-data.type";

export const fertilizerGroupColumns: Column<FertilizerGroupRecord>[] = [
  {
    key: "code",
    label: "Mã nhóm",
    render: (value) => (
      <Badge variant="outline" className="bg-background font-mono">
        {String(value ?? "")}
      </Badge>
    ),
  },
  { key: "name", label: "Tên nhóm" },
  { key: "description", label: "Mô tả" },
];
