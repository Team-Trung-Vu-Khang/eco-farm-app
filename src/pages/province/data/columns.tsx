import { type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ProvinceRow } from "../types";

export const columns: Column<ProvinceRow>[] = [
  {
    key: "code",
    label: "Mã Tỉnh/Thành",
    render: (value: unknown) => (
      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-slate-700">
        {String(value ?? "")}
      </span>
    ),
  },
  {
    key: "fullName",
    label: "Tỉnh/Thành",
    render: (value: unknown) => (
      <div className="space-y-0.5">
        <div className="text-sm font-semibold text-slate-900">
          {String(value ?? "")}
        </div>
      </div>
    ),
  },
];
