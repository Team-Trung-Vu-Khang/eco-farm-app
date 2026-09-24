import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ByProductGroupRecord } from "@/features/master-data/types/master-data.type";

export const byProductGroupColumns: Column<ByProductGroupRecord>[] = [
  {
    key: "code",
    label: "Mã nhóm",
    render: (value) => (
      <span className="font-mono font-medium text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
        {String(value || "—")}
      </span>
    ),
  },
  {
    key: "name",
    label: "Tên nhóm phụ phẩm",
    render: (value) => <span className="font-medium text-slate-800">{String(value || "—")}</span>,
  },
  {
    key: "description",
    label: "Mô tả",
    render: (value) => (
      <span className="text-slate-600 text-xs truncate max-w-[300px] block">
        {String(value || "—")}
      </span>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => {
      const isAct = value === "active";
      return (
        <Badge variant={isAct ? "default" : "secondary"} className="text-xs">
          {isAct ? "Hoạt động" : value === "archived" ? "Đã lưu trữ" : "Không hoạt động"}
        </Badge>
      );
    },
  },
];
