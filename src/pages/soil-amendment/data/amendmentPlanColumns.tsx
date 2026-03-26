import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Badge, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Edit, Eye, MapPin, Trash2 } from "lucide-react";
import type { AmendmentPlan } from "../../../stores/useAmendmentPlanStore";
import { getStatusConfig } from "../utils";

interface AmendmentPlanColumnsOptions {
  onDelete: (item: AmendmentPlan) => void;
  onEdit: (item: AmendmentPlan) => void;
  onViewDetail: (item: AmendmentPlan) => void;
}

export function createAmendmentPlanColumns({
  onDelete,
  onEdit,
  onViewDetail,
}: AmendmentPlanColumnsOptions): Column<AmendmentPlan>[] {
  return [
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
      label: "Tên kế hoạch",
      render: (value, item) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{value}</span>
          <span
            className="max-w-[200px] truncate text-xs text-slate-500"
            title={item.target_issue}
          >
            {item.target_issue}
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
      key: "technician",
      label: "Phụ trách",
      render: (value) => <span className="text-sm text-slate-700">{value}</span>,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => {
        const status = getStatusConfig(String(value));
        return (
          <Badge className={status.className} variant={status.variant}>
            {status.label}
          </Badge>
        );
      },
    },
    {
      key: "startDate",
      label: "Tiến độ",
      render: (_, item) => (
        <div className="flex flex-col gap-0.5 text-xs text-slate-500">
          <div className="flex items-center justify-between gap-2">
            <span>BĐ:</span>
            <span className="font-medium">{item.startDate}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>KT:</span>
            <span className="font-medium">{item.endDate}</span>
          </div>
        </div>
      ),
    },
    {
      key: "id",
      label: "Hành động",
      render: (_, item) => (
        <div className="flex items-center gap-1">
          <Button
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
            onClick={() => onViewDetail(item)}
            size="sm"
            variant="ghost"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
            onClick={() => onEdit(item)}
            size="sm"
            variant="ghost"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            onClick={() => onDelete(item)}
            size="sm"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}
