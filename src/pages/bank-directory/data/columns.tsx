import {
  Badge,
  Checkbox,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import BankLogo from "../../bank/components/BankLogo";
import type { Bank } from "../types/types";

const STATUS_LABELS: Record<string, string> = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
  archived: "Đã lưu trữ",
};

export const bankDirectoryColumns: Column<Bank>[] = [
  {
    key: "name",
    label: "Ngân hàng",
    render: (value, item) => (
      <div className="flex items-center gap-3 py-1">
        <BankLogo
          bankName={item.shortName ?? (value as string)}
          logo={item.logo}
          className="rounded-md p-1 shadow-sm transition-transform group-hover:scale-105"
        />
        <div className="flex flex-col">
          <span className="font-bold text-base leading-tight">
            {item.fullName ?? value}
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[260px]">
            {item.shortName}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "id",
    label: "Mã",
    render: (value) => (
      <span className="font-mono text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md tracking-widest">
        {value as string}
      </span>
    ),
  },
  {
    key: "bin",
    label: "BIN",
    render: (value) =>
      value ? (
        <span className="font-mono text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md tracking-widest">
          {value as string}
        </span>
      ) : (
        <span className="text-sm text-slate-400 italic">—</span>
      ),
  },
  {
    key: "swiftCode",
    label: "SWIFT Code",
    render: (value) =>
      value ? (
        <span className="font-mono text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md tracking-widest">
          {value as string}
        </span>
      ) : (
        <span className="text-sm text-slate-400 italic">—</span>
      ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge
        variant="outline"
        className={
          value === "active"
            ? "rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700"
            : value === "inactive"
              ? "rounded-full border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-600"
              : "rounded-full border-amber-200 bg-amber-50 px-2.5 py-1 font-medium text-amber-700"
        }
      >
        {STATUS_LABELS[String(value)] ?? String(value)}
      </Badge>
    ),
  },
  {
    key: "transferSupported",
    label: "Chuyển khoản",
    render: (value) =>
      typeof value === "boolean" ? (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={value}
            disabled
            className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=unchecked]:bg-white"
          />
        </div>
      ) : (
        <span className="text-sm text-slate-400 italic">—</span>
      ),
  },
  {
    key: "lookupSupported",
    label: "Tra cứu",
    render: (value) =>
      typeof value === "boolean" ? (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={value}
            disabled
            className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=unchecked]:bg-white"
          />
        </div>
      ) : (
        <span className="text-sm text-slate-400 italic">—</span>
      ),
  },
];
