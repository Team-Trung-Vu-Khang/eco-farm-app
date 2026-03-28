import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { AmendmentMethod } from "../types/amendment-method";
import {
  getMethodLevelColor,
  getMethodTypeConfig,
} from "./amendmentMethodData";

export const amendmentMethodColumns: Column<AmendmentMethod>[] = [
  {
    key: "code",
    label: "Mã",
    render: (val) => (
      <span className="font-mono text-xs font-medium text-slate-500">
        {val}
      </span>
    ),
  },
  {
    key: "name",
    label: "Phương pháp",
    render: (val, item) => (
      <div className="flex flex-col">
        <span className="font-medium text-slate-700">{val}</span>
        <span
          className="max-w-[200px] truncate text-xs text-slate-500"
          title={item.target}
        >
          {item.target}
        </span>
      </div>
    ),
  },
  {
    key: "type",
    label: "Phân loại",
    render: (val) => {
      const config = getMethodTypeConfig(val as AmendmentMethod["type"]);

      return (
        <Badge
          variant="outline"
          className={`${config.className} border font-normal`}
        >
          {config.label}
        </Badge>
      );
    },
  },
  {
    key: "cost",
    label: "Chi phí",
    render: (val) => (
      <div
        className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${getMethodLevelColor(val as string, "cost")}`}
      >
        {val}
      </div>
    ),
  },
  {
    key: "difficulty",
    label: "Độ khó",
    render: (val) => (
      <div
        className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${getMethodLevelColor(val as string, "difficulty")}`}
      >
        {val}
      </div>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (val) => (
      <Badge
        variant={val === "active" ? "secondary" : "outline"}
        className={
          val === "active"
            ? "bg-green-50 text-green-700 hover:bg-green-100"
            : "text-slate-500"
        }
      >
        {val === "active" ? "Đang áp dụng" : "Ngưng"}
      </Badge>
    ),
  },
];
