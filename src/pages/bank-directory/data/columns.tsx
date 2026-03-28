import { type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import BankLogo from "../../bank/components/BankLogo";
import type { Bank } from "../types/types";

export const bankDirectoryColumns: Column<Bank>[] = [
  {
    key: "id",
    label: "ID",
    render: (value) => (
      <span className="font-mono text-muted-foreground">#{value}</span>
    ),
  },
  {
    key: "name",
    label: "Ngân hàng",
    render: (value, item) => (
      <div className="flex items-center gap-4 py-1">
        <BankLogo
          bankName={value as string}
          logo={item.logo}
          className="rounded-xl p-2 shadow-sm group-hover:scale-105 transition-transform"
        />
        <div className="flex flex-col">
          <span className="font-bold text-base leading-tight">{value}</span>
          <span className="text-sm text-muted-foreground line-clamp-1">
            {item.fullName}
          </span>
        </div>
      </div>
    ),
  },
];
