import { type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ProvinceRow } from "../types";
import { CodeBadge } from "@/components/CodeBadge";

export const columns: Column<ProvinceRow>[] = [
  {
    key: "code",
    label: "Mã Tỉnh/Thành",
    render: (value: unknown) => <CodeBadge value={value} />,
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
