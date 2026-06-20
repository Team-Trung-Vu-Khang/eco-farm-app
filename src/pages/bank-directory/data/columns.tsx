import { type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import BankLogo from "../../bank/components/BankLogo";
import type { Bank } from "../types/types";

export const bankDirectoryColumns: Column<Bank>[] = [
  {
    key: "name",
    label: "Ngân hàng",
    render: (value, item) => (
      <div className="flex items-center gap-3 py-1">
        <BankLogo
          bankName={value as string}
          logo={item.logo}
          className="rounded-md p-1 shadow-sm group-hover:scale-105 transition-transform"
        />
        <div className="flex flex-col">
          <span className="font-bold text-base leading-tight">{value}</span>
          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[260px]">
            {item.fullName}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "address",
    label: "Địa chỉ",
    render: (value, item) => (
      <div className="flex flex-col gap-0.5 max-w-[200px]">
        {value ? (
          <span className="text-sm text-slate-700 line-clamp-2">
            {value as string}
          </span>
        ) : (
          <span className="text-sm text-slate-400 italic">—</span>
        )}
        {item.bin && (
          <span className="text-xs text-slate-400 font-mono">
            BIN: {item.bin}
          </span>
        )}
      </div>
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
    key: "bicCode",
    label: "BIC Code",
    render: (value) =>
      value ? (
        <span className="font-mono text-sm font-semibold text-violet-700 bg-violet-50 px-2 py-1 rounded-md tracking-widest">
          {value as string}
        </span>
      ) : (
        <span className="text-sm text-slate-400 italic">—</span>
      ),
  },
  {
    key: "routingCode",
    label: "Routing/ABA",
    render: (value) =>
      value ? (
        <span className="font-mono text-sm font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md tracking-widest">
          {value as string}
        </span>
      ) : (
        <span className="text-sm text-slate-400 italic">—</span>
      ),
  },
];
