import { Badge, Button, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Beaker, Eye, MapPin, Users } from "lucide-react";
import type { AmendmentTask } from "../../stores/useAmendmentTaskStore";
import { getPriorityConfig, getStatusConfig } from "./amendmentTaskData";

export const createAmendmentTaskColumns = (
  onViewDetail: (task: AmendmentTask) => void,
): Column<AmendmentTask>[] => [
  {
    key: "code",
    label: "Mã",
    render: (value) => (
      <span className="font-mono text-xs font-medium text-slate-500">
        {value}
      </span>
    ),
  },
  {
    key: "name",
    label: "Tên công việc",
    render: (value, item) => (
      <div className="flex flex-col">
        <span className="font-medium text-slate-900">{value}</span>
        <span className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
          <Beaker className="h-3 w-3" />
          {item.method}
        </span>
      </div>
    ),
  },
  {
    key: "zone",
    label: "Khu vực",
    render: (value) => (
      <div className="flex items-center gap-1.5 text-slate-600">
        <MapPin className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-sm">{value}</span>
      </div>
    ),
  },
  {
    key: "assignedTo",
    label: "Phân công",
    render: (value, item) => (
      <div className="flex items-center gap-1.5">
        <Users
          className={`h-3.5 w-3.5 ${item.assignedType === "team" ? "text-blue-500" : "text-green-500"}`}
        />
        <span className="text-sm">{value}</span>
      </div>
    ),
  },
  {
    key: "priority",
    label: "Ưu tiên",
    render: (value) => {
      const config = getPriorityConfig(value as string);

      return (
        <Badge variant={config.variant} className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => {
      const config = getStatusConfig(value as string);

      return (
        <Badge variant={config.variant} className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    key: "startDate",
    label: "Tiến độ",
    render: (_, item) => (
      <div className="text-xs text-slate-500">
        <div>{item.startDate}</div>
        <div className="text-slate-400">→ {item.endDate}</div>
      </div>
    ),
  },
  {
    key: "id",
    label: "Chi tiết",
    render: (_, item) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
        onClick={() => onViewDetail(item)}
      >
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];
