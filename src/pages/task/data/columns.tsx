import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Users } from "lucide-react";
import type { Task } from "../../../stores/useTaskStore";

const ROLE_LABELS: Record<string, string> = {
  MANAGER: "Quản lý",
  QUALITY_INSPECTOR: "Kiểm định",
  EXECUTOR: "Thực hiện",
};

const ROLE_ORDER = ["EXECUTOR", "MANAGER", "QUALITY_INSPECTOR"] as const;

function getAssignmentCounts(
  value: unknown,
  row: Task,
): Array<{ role: (typeof ROLE_ORDER)[number]; count: number }> {
  if (Array.isArray(row.personnel) && row.personnel.length > 0) {
    return ROLE_ORDER.map((role) => {
      const people = new Set(
        (row.personnel || [])
          .filter((person) => String(person.role).toUpperCase() === role)
          .map((person) => person.id ?? person.fullName)
          .filter(Boolean),
      );
      return { role, count: people.size };
    }).filter(({ count }) => count > 0);
  }

  // Legacy task rows only expose executors through `assignedTo`.
  const executorCount = Array.isArray(value) ? new Set(value).size : 0;
  return executorCount > 0 ? [{ role: "EXECUTOR", count: executorCount }] : [];
}

export const taskColumns: Column<Task>[] = [
  { key: "code", label: "Mã" },
  { key: "name", label: "Tên công việc" },
  { key: "plan", label: "Kế hoạch" },
  { key: "stage", label: "Giai đoạn" },
  {
    key: "assignedTo",
    label: "Phân công",
    render: (value, row) => {
      const assignmentCounts = getAssignmentCounts(value, row);

      return (
        <div className="flex items-start gap-2">
          <Users
            className={
              row.assignedType === "team"
                ? "mt-0.5 w-4 h-4 text-blue-500 shrink-0"
                : "mt-0.5 w-4 h-4 text-green-500 shrink-0"
            }
          />
          <div className="flex flex-col gap-1">
            {assignmentCounts.length > 0 ? (
              assignmentCounts.map(({ role, count }) => (
                <span
                  key={role}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {ROLE_LABELS[role]}: {count} người
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                Chưa phân công
              </span>
            )}
          </div>
        </div>
      );
    },
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
