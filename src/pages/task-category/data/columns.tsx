import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { TaskCategoryRecord } from "@/features/task-category";
import { CodeBadge } from "@/components/CodeBadge";
import dayjs from "dayjs";

export const taskCategoryColumns: Column<TaskCategoryRecord>[] = [
  {
    key: "code",
    label: "Mã",
    render: (value) => <CodeBadge value={value} />,
  },
  { key: "name", label: "Tên công việc" },
  { key: "example", label: "Ví dụ" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value === "active"
          ? "Hoạt động"
          : value === "archived"
            ? "Đã lưu trữ"
            : "Không hoạt động"}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    render: (value) =>
      value && dayjs(String(value)).isValid()
        ? dayjs(String(value)).format("DD/MM/YYYY HH:mm")
        : "---",
  },
];
