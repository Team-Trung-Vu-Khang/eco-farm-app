import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { AmendmentCycle } from "../types/amendment-cycle";

export const amendmentCycleColumns: Column<AmendmentCycle>[] = [
  { key: "title", label: "Tên chu kỳ" },
  {
    key: "type",
    label: "Loại",
    render: (value) => (
      <Badge variant="secondary" className="uppercase">
        {value}
      </Badge>
    ),
  },
  { key: "duration", label: "Thời gian" },
  { key: "condition", label: "Điều kiện áp dụng" },
  { key: "outcome", label: "Kết quả dự kiến" },
];
