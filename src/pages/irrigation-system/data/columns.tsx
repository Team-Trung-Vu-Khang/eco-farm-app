import type { IrrigationSystemRecord } from "@/features/master-data/types/master-data.type";
import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CodeBadge } from "@/components/CodeBadge";

const statusLabelMap: Record<IrrigationSystemRecord["status"], string> = {
  active: "Hoạt động",
  inactive: "Ngừng hoạt động",
  archived: "Đã lưu trữ",
};

export const irrigationSystemColumns: Column<IrrigationSystemRecord>[] = [
  {
    key: "code",
    label: "Mã hệ thống",
    render: (value) => <CodeBadge value={value} />,
  },
  { key: "name", label: "Tên hệ thống" },
  { key: "description", label: "Mô tả" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant="secondary" className="capitalize">
        {statusLabelMap[value as IrrigationSystemRecord["status"]] ??
          String(value ?? "")}
      </Badge>
    ),
  },
];
