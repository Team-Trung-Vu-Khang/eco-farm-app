import type { BranchRecord } from "@/features/branch";
import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export type BranchTableRow = BranchRecord & {
  enterpriseName: string;
  phone: string;
  email: string;
};

export const branchColumns: Column<BranchTableRow>[] = [
  {
    key: "code",
    label: "Mã",
    render: (value) => (
      <Badge
        variant="outline"
        className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-700"
      >
        {value as string}
      </Badge>
    ),
  },
  { key: "name", label: "Tên chi nhánh" },
  {
    key: "enterpriseName",
    label: "Đơn vị chủ quản",
    render: (value) =>
      value ? (
        <Badge
          variant="secondary"
          className="rounded-full bg-primary/10 px-2.5 py-1 text-primary"
        >
          {value as string}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">Chưa liên kết</span>
      ),
  },
  { key: "phone", label: "Điện thoại" },
  { key: "email", label: "Email" },
  { key: "address", label: "Địa chỉ", width: "200px" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge
        variant={value === "active" ? "default" : "outline"}
        className="rounded-full px-2.5 py-1"
      >
        {value === "active" ? "Hoạt động" : "Không hoạt động"}
      </Badge>
    ),
  },
];

export const branchFilters = [
  {
    key: "status",
    label: "Trạng thái",
    options: [
      { label: "Hoạt động", value: "active" },
      { label: "Không hoạt động", value: "inactive" },
    ],
  },
] as const;
