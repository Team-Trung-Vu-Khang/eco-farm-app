import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CodeBadge } from "@/components/CodeBadge";
import type { Contact, ContactGroup } from "../types/types";

export const groupColumns: Column<ContactGroup>[] = [
  {
    key: "code",
    label: "Mã nhóm",
    render: (_value, row) => <CodeBadge value={row.code} />,
  },
  {
    key: "name",
    label: "Tên nhóm",
    render: (_value, row) =>
      row.name ? (
        <Badge
          variant="secondary"
          className="rounded-full bg-primary/10 px-2.5 py-1 text-primary"
        >
          {row.name}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">Chưa có</span>
      ),
  },
  {
    key: "description",
    label: "Mô tả",
    render: (_value, row) =>
      row.description ? (
        <span className="max-w-[28rem] text-sm text-slate-600">
          {row.description}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">Chưa có mô tả</span>
      ),
  },
  {
    key: "contactCount",
    label: "Số liên hệ",
    render: (_value, row) => (
      <Badge variant="secondary" className="rounded-full px-2.5 py-1">
        {row.contactCount} người
      </Badge>
    ),
  },
];

export function getContactColumns(): Column<Contact>[] {
  return [
    { key: "fullName", label: "Họ và tên" },
    { key: "phone", label: "Số điện thoại" },
    { key: "email", label: "Email" },
    {
      key: "department",
      label: "Phòng ban",
      render: (_value, row) =>
        row.department?.name ? (
          <Badge variant="outline" className="rounded-full px-2.5 py-1">
            {row.department.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">Chưa có</span>
        ),
    },
    {
      key: "position",
      label: "Chức vụ",
      render: (_value, row) =>
        row.position ? (
          <Badge variant="secondary" className="rounded-full px-2.5 py-1">
            {row.position}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">Chưa có</span>
        ),
    },
    {
      key: "entityName",
      label: "Đơn vị",
      render: (_value, row) =>
        row.entityName ? (
          <Badge
            variant="secondary"
            className="rounded-full bg-primary/10 px-2.5 py-1 text-primary"
          >
            {row.entityName}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">Chưa liên kết</span>
        ),
    },
    {
      key: "group",
      label: "Nhóm danh bạ",
      render: (_value, row) => {
        return row.group?.name ? (
          <Badge
            variant="secondary"
            className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700"
          >
            {row.group.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">Chưa phân nhóm</span>
        );
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (_value, row) => (
        <Badge
          variant={row.status === "active" ? "default" : "outline"}
          className="rounded-full px-2.5 py-1"
        >
          {row.status === "active"
            ? "Đang làm việc"
            : row.status === "inactive"
              ? "Đã nghỉ việc"
              : "Đã lưu trữ"}
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
        { label: "Đã lưu trữ", value: "archived" },
      ],
    },
    {
      key: "groupId",
      label: "Nhóm danh bạ",
      options: [
        ...groups.map((group) => ({
          label: group.name,
          value: group.id.toString(),
        })),
      ],
    },
  ];
}
