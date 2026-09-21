// Endpoint thực tế của trang này là master-data "rearing-methods"
import type { RearingMethodRecord } from "@/features/master-data/types/master-data.type";
import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CodeBadge } from "@/components/CodeBadge";

const statusLabelMap: Record<RearingMethodRecord["status"], string> = {
  active: "Hoạt động",
  inactive: "Ngừng hoạt động",
  archived: "Đã lưu trữ",
};

export const irrigationSystemColumns: Column<RearingMethodRecord>[] = [
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
        {statusLabelMap[value as RearingMethodRecord["status"]] ??
          String(value ?? "")}
      </Badge>
    ),
  },
];
