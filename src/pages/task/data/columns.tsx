import { Users } from "lucide-react";
import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Task } from "../../../stores/useTaskStore";

export const taskColumns: Column<Task>[] = [
  { key: "code", label: "Mã" },
  { key: "name", label: "Tên công việc" },
  { key: "plan", label: "Kế hoạch" },
  { key: "stage", label: "Giai đoạn" },
  {
    key: "assignedTo",
    label: "Phân công",
    render: (value, row) => (
      <div className="flex items-center gap-2">
        <Users
          className={
            row.assignedType === "team"
              ? "w-4 h-4 text-blue-500"
              : "w-4 h-4 text-green-500"
          }
        />
        <span>{Array.isArray(value) ? value.join(", ") : value}</span>
      </div>
    ),
  },
  {
    key: "priority",
    label: "Ưu tiên",
    render: (value) => (
      <Badge
        variant={
          value === "high"
            ? "destructive"
            : value === "medium"
              ? "default"
              : "outline"
        }
      >
        {value === "high" ? "Cao" : value === "medium" ? "Trung bình" : "Thấp"}
      </Badge>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge
        variant={
          value === "completed"
            ? "secondary"
            : value === "in-progress"
              ? "default"
              : value === "overdue"
                ? "destructive"
                : "outline"
        }
      >
        {value === "completed"
          ? "Hoàn thành"
          : value === "in-progress"
            ? "Đang thực hiện"
            : value === "overdue"
              ? "Quá hạn"
              : "Chờ thực hiện"}
      </Badge>
    ),
  },
  { key: "startDate", label: "Bắt đầu" },
  { key: "endDate", label: "Kết thúc" },
];
