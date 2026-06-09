import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Contact, ContactGroup } from "../types/types";

export const groupColumns: Column<ContactGroup>[] = [
  {
    key: "code",
    label: "Mã nhóm",
    render: (value) =>
      value ? (
        <Badge
          variant="outline"
          className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-700"
        >
          {value}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">Chưa có</span>
      ),
  },
  {
    key: "name",
    label: "Tên nhóm",
    render: (value) =>
      value ? (
        <Badge
          variant="secondary"
          className="rounded-full bg-primary/10 px-2.5 py-1 text-primary"
        >
          {value}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">Chưa có</span>
      ),
  },
  {
    key: "description",
    label: "Mô tả",
    render: (value) =>
      value ? (
        <span className="max-w-[28rem] text-sm text-slate-600">{value}</span>
      ) : (
        <span className="text-muted-foreground text-sm">Chưa có mô tả</span>
      ),
  },
  {
    key: "contactCount",
    label: "Số liên hệ",
    render: (value) => (
      <Badge variant="secondary" className="rounded-full px-2.5 py-1">
        {value} người
      </Badge>
    ),
  },
];

export function getContactColumns(
  groups: ContactGroup[],
): Column<Contact>[] {
  return [
    { key: "fullName", label: "Họ và tên" },
    { key: "phone", label: "Số điện thoại" },
    { key: "email", label: "Email" },
    {
      key: "department",
      label: "Phòng ban",
      render: (value) =>
        value ? (
          <Badge variant="outline" className="rounded-full px-2.5 py-1">
            {value}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">Chưa có</span>
        ),
    },
    {
      key: "position",
      label: "Chức vụ",
      render: (value) =>
        value ? (
          <Badge variant="secondary" className="rounded-full px-2.5 py-1">
            {value}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">Chưa có</span>
        ),
    },
    {
      key: "entityName",
      label: "Đơn vị",
      render: (value) =>
        value ? (
          <Badge
            variant="secondary"
            className="rounded-full bg-primary/10 px-2.5 py-1 text-primary"
          >
            {value}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">Chưa liên kết</span>
        ),
    },
    {
      key: "groupId",
      label: "Nhóm danh bạ",
      render: (value) => {
        const group = groups.find((g) => g.id === value);
        return group ? (
          <Badge
            variant="secondary"
            className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700"
          >
            {group.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">Chưa phân nhóm</span>
        );
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge
          variant={value === "active" ? "default" : "outline"}
          className="rounded-full px-2.5 py-1"
        >
          {value === "active" ? "Đang làm việc" : "Đã nghỉ việc"}
        </Badge>
      ),
    },
  ];
}

export function getContactFilters(groups: ContactGroup[]) {
  return [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Đang làm việc", value: "active" },
        { label: "Đã nghỉ việc", value: "inactive" },
      ],
    },
    {
      key: "department",
      label: "Phòng ban",
      options: [
        { label: "Kinh doanh", value: "Kinh doanh" },
        { label: "Kế toán", value: "Kế toán" },
        { label: "Kỹ thuật", value: "Kỹ thuật" },
        { label: "Hành chính", value: "Hành chính" },
      ],
    },
    {
      key: "groupId",
      label: "Nhóm danh bạ",
      options: groups.map((group) => ({
        label: group.name,
        value: group.id.toString(),
      })),
    },
  ];
}
