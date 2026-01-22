import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import { useState } from "react";
import { Link, useLocation } from "wouter";

import { dateFormat } from "@/utils/commons";
import { Plus } from "lucide-react";
import type { Docs } from "./types";
import { initialData } from "./mocks";

const columns: Column<Docs>[] = [
  { key: "id", label: "Mã mẫu" },
  { key: "illustration", label: "Hình ảnh" },
  {
    key: "crop",
    label: "Cây trồng",
    render: (_, rowValue) => (
      <div>
        <p>{rowValue.crop}</p>
        <p className="text-[11px] text-gray-500">{rowValue.variety}</p>
      </div>
    ),
  },
  {
    key: "season",
    label: "Mùa vụ",
    render: (value) => (
      <div className="flex gap-1">
        {value?.map((item: unknown) => (
          <Badge variant="default">{String(item)}</Badge>
        ))}
      </div>
    ),
  },
  {
    key: "createdAt",
    label: "Câp nhật lần cuối",
    render: (value) => dateFormat(value),
  },
];

export default function DocsPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [data, setData] = useState<Docs[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Docs | null>(null);

  const handleDelete = (item: Docs) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleEdit = (item: Docs) => {
    setLocation(`/docs/update/${item.id}`);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa cây trồng" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý tài liệu kỹ thuật"
      description=""
      actions={
        <Link href="docs/create">
          <Button data-testid="add-crop">
            <Plus className="w-4 h-4 mr-2" />
            Thêm tài liệu kỹ thuật
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        selectable
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm tài liệu kỹ thuật..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
