import { Link, useLocation } from "wouter";
import { Plus } from "lucide-react";
import {
  Badge,
  Button,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Contact, ContactGroup } from "@/stores/useContactStore";

interface ContactTabProps {
  contacts: Contact[];
  groups: ContactGroup[];
  onDelete: (item: Contact) => void;
}

export function ContactTab({ contacts, groups, onDelete }: ContactTabProps) {
  const [, setLocation] = useLocation();

  const contactColumns: Column<Contact>[] = [
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

  const contactFilters = [
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Sổ danh bạ</h3>
          <p className="text-sm text-muted-foreground">
            Danh sách thông tin liên hệ của đơn vị
          </p>
        </div>
        <Link href="/contact/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm liên hệ
          </Button>
        </Link>
      </div>
      <DataTable
        columns={contactColumns}
        data={contacts}
        onView={(item) => setLocation(`/contact/${item.id}/edit`)}
        onEdit={(item) => setLocation(`/contact/${item.id}/edit`)}
        onDelete={onDelete}
        searchPlaceholder="Tìm kiếm liên hệ..."
        filters={contactFilters}
        selectable
      />
    </div>
  );
}
