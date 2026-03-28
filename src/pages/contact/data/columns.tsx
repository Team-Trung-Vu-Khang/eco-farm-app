import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Contact, ContactGroup } from "../types/types";

export const groupColumns: Column<ContactGroup>[] = [
  { key: "code", label: "Mã nhóm" },
  { key: "name", label: "Tên nhóm" },
  { key: "description", label: "Mô tả" },
  {
    key: "contactCount",
    label: "Số liên hệ",
    render: (value) => <Badge variant="secondary">{value} người</Badge>,
  },
];

export function getContactColumns(
  groups: ContactGroup[],
): Column<Contact>[] {
  return [
    { key: "fullName", label: "Họ và tên" },
    { key: "phone", label: "Số điện thoại" },
    { key: "email", label: "Email" },
    { key: "department", label: "Phòng ban" },
    { key: "position", label: "Chức vụ" },
    { key: "entityName", label: "Đơn vị" },
    {
      key: "groupId",
      label: "Nhóm danh bạ",
      render: (value) => {
        const group = groups.find((g) => g.id === value);
        return group ? (
          <Badge variant="secondary">{group.name}</Badge>
        ) : (
          <span className="text-muted-foreground text-sm">Chưa phân nhóm</span>
        );
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "outline"}>
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
