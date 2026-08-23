import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { FertilizerGroupRecord } from "@/features/master-data/types/master-data.type";
import { CodeBadge } from "@/components/CodeBadge";

export const fertilizerGroupColumns: Column<FertilizerGroupRecord>[] = [
  {
    key: "code",
    label: "Mã nhóm",
    render: (value) => <CodeBadge value={value} />,
  },
  { key: "name", label: "Tên nhóm" },
  { key: "description", label: "Mô tả" },
];
