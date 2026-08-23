import type { BranchRecord } from "@/features/branch";
import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CodeBadge } from "@/components/CodeBadge";

export type BranchTableRow = BranchRecord & {
  enterpriseName: string;
  phone: string;
  email: string;
};

export const branchColumns: Column<BranchTableRow>[] = [
  {
    key: "code",
    label: "Mã",
    render: (value) => <CodeBadge value={value} />,
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
  {
    key: "address",
    label: "Địa chỉ",
    width: "400px",
    render: (value) => (
      <div className="min-w-[400px] whitespace-normal break-words leading-6">
        {(value as string) || "-"}
      </div>
    ),
  },
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
