import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { MaterialGroupRecord } from "@/features/master-data/types/master-data.type";
import { CodeBadge } from "@/components/CodeBadge";

export const materialGroupColumns: Column<MaterialGroupRecord>[] = [
  {
    key: "code",
    label: "Mã nhóm",
    render: (value) => <CodeBadge value={value} />,
  },
  { key: "name", label: "Tên nhóm" },
  { key: "description", label: "Mô tả" },
];
