import { Button, DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getContactColumns, getContactFilters } from "../../data/columns";
import type { Contact, ContactGroup } from "../../types/types";

interface ContactTabProps {
  contacts: Contact[];
  groups: ContactGroup[];
  loading?: boolean;
  pageSize: number;
  currentIndex: number;
  totalPages?: number;
  totalElements?: number;
  onDelete: (item: Contact) => void;
  onSearch: (value: string) => void;
  onIndexChange: (value: number) => void;
  onPageSize: (value: number) => void;
  onFilterChange: (key: string, value: string) => void;
}

export function ContactTab({
  contacts,
  groups,
  loading,
  pageSize,
  currentIndex,
  totalPages,
  totalElements,
  onDelete,
  onSearch,
  onIndexChange,
  onPageSize,
  onFilterChange,
}: ContactTabProps) {
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
        columns={getContactColumns()}
        data={contacts}
        searchable
        onEdit={(item) => setLocation(`/contact/${item.id}/edit`)}
        onDelete={onDelete}
        searchPlaceholder="Tìm kiếm liên hệ..."
        filters={getContactFilters(groups)}
        loading={loading}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalPages={totalPages}
        totalElements={totalElements}
        onSearch={onSearch}
        onIndexChange={onIndexChange}
        onPageSize={onPageSize}
        onFilterChange={onFilterChange}
        selectable={false}
      />
    </div>
  );
}
