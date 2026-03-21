import { Link } from "wouter";
import { Plus } from "lucide-react";
import {
  Badge,
  Button,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ContactGroup } from "@/stores/useContactStore";

interface GroupTabProps {
  groups: ContactGroup[];
  onAdd: () => void;
  onEdit: (item: ContactGroup) => void;
  onDelete: (item: ContactGroup) => void;
}

export function GroupTab({ groups, onAdd, onEdit, onDelete }: GroupTabProps) {
  const groupColumns: Column<ContactGroup>[] = [
    { key: "code", label: "Mã nhóm" },
    { key: "name", label: "Tên nhóm" },
    { key: "description", label: "Mô tả" },
    {
      key: "contactCount",
      label: "Số liên hệ",
      render: (value) => <Badge variant="secondary">{value} người</Badge>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Nhóm danh bạ</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý các nhóm để phân loại danh bạ
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/contact/create">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Tạo liên hệ
            </Button>
          </Link>
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm nhóm
          </Button>
        </div>
      </div>
      <DataTable
        columns={groupColumns}
        data={groups}
        onEdit={onEdit}
        onDelete={onDelete}
        searchPlaceholder="Tìm kiếm nhóm danh bạ..."
      />
    </div>
  );
}
