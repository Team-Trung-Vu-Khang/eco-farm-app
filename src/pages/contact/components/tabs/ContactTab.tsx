import { Link, useLocation } from "wouter";
import { Plus } from "lucide-react";
import {
  Button,
  DataTable,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { getContactColumns, getContactFilters } from "../../data/columns";
import type { Contact, ContactGroup } from "../../types/types";

interface ContactTabProps {
  contacts: Contact[];
  groups: ContactGroup[];
  onDelete: (item: Contact) => void;
}

export function ContactTab({ contacts, groups, onDelete }: ContactTabProps) {
  const [, setLocation] = useLocation();

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
        columns={getContactColumns(groups)}
        data={contacts}
        onView={(item) => setLocation(`/contact/${item.id}/edit`)}
        onEdit={(item) => setLocation(`/contact/${item.id}/edit`)}
        onDelete={onDelete}
        searchPlaceholder="Tìm kiếm liên hệ..."
        filters={getContactFilters(groups)}
        selectable
      />
    </div>
  );
}
