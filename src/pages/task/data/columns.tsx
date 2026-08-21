import { Users } from "lucide-react";
import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Task } from "../../../stores/useTaskStore";

const ROLE_LABELS: Record<string, string> = {
  MANAGER: "Quản lý",
  QUALITY_INSPECTOR: "Kiểm định",
  EXECUTOR: "Thực hiện",
};

export const taskColumns: Column<Task>[] = [
  { key: "code", label: "Mã" },
  { key: "name", label: "Tên công việc" },
  { key: "plan", label: "Kế hoạch" },
  { key: "stage", label: "Giai đoạn" },
  {
    key: "assignedTo",
    label: "Phân công",
    render: (value, row) => (
      <div className="flex items-start gap-2">
        <Users
          className={
            row.assignedType === "team"
              ? "mt-0.5 w-4 h-4 text-blue-500 shrink-0"
              : "mt-0.5 w-4 h-4 text-green-500 shrink-0"
          }
        />
        <div className="flex flex-wrap gap-1.5">
          {row.personnel && row.personnel.length > 0 ? (
            row.personnel.map((person, index) => (
              <Badge key={`${person.id}-${index}`} variant="outline" className="text-xs">
                {ROLE_LABELS[person.role] || person.role}
                {person.fullName ? `: ${person.fullName}` : ""}
              </Badge>
            ))
          ) : Array.isArray(value) && value.length > 0 ? (
            value.map((person, index) => (
              <Badge key={`${person}-${index}`} variant="outline" className="text-xs">
                {person}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">Chưa phân công</span>
          )}
        </div>
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
