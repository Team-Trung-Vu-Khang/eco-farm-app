import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { BankAccount } from "../../../stores/useBankStore";
import BankLogo from "../components/BankLogo";

export const bankColumns: Column<BankAccount>[] = [
  {
    key: "bankName",
    label: "Ngân hàng",
    render: (value, item) => (
      <div className="flex items-center gap-3">
        <BankLogo bankName={value as string} logo={item.logo} />
        <div className="font-medium">{value}</div>
      </div>
    ),
  },
  { key: "accountNumber", label: "Số tài khoản" },
  { key: "accountHolder", label: "Chủ tài khoản" },
  { key: "branch", label: "Chi nhánh" },
  { key: "note", label: "Ghi chú" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "outline"}>
        {value === "active" ? "Hoạt động" : "Không hoạt động"}
      </Badge>
    ),
  },
];
