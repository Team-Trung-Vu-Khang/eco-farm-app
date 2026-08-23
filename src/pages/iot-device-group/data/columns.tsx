import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { IoTDeviceGroupRecord } from "@/features/master-data/types/master-data.type";
import { CodeBadge } from "@/components/CodeBadge";

const statusLabelMap: Record<IoTDeviceGroupRecord["status"], string> = {
  active: "Hoạt động",
  inactive: "Ngừng hoạt động",
  archived: "Đã lưu trữ",
};

export const iotDeviceGroupColumns: Column<IoTDeviceGroupRecord>[] = [
  {
    key: "code",
    label: "Mã nhóm",
    render: (value) => <CodeBadge value={value} />,
  },
  { key: "name", label: "Tên nhóm" },
  { key: "description", label: "Mô tả" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant="secondary" className="capitalize">
        {statusLabelMap[value as IoTDeviceGroupRecord["status"]] ??
          String(value ?? "")}
      </Badge>
    ),
  },
];
