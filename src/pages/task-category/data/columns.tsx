import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { TaskCategoryRecord } from "@/features/task-category";
import dayjs from "dayjs";
import { Hash } from "lucide-react";

export const taskCategoryColumns: Column<TaskCategoryRecord>[] = [
  {
    key: "code",
    label: "Mã",
    render: (value) => {
      return (
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border w-fit">
          <Hash className="w-3 h-3 opacity-60" />
          {value ? (value as string) : "---"}
        </div>
      );
    },
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
