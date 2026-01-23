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
import { Calendar, Hash, Leaf, Plus, Sprout } from "lucide-react";
import type { Docs } from "./types";
import { initialData } from "./mocks";

const columns: Column<Docs>[] = [
  {
    key: "illustration",
    label: "Hình ảnh",
    render: (value) => (
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border shadow-sm">
        {value ? (
          <img
            src={value instanceof File ? URL.createObjectURL(value) : value}
            className="w-full h-full object-cover"
          />
        ) : (
          <Sprout className="w-6 h-6 text-muted-foreground/30" />
        )}
      </div>
    ),
  },
  {
    key: "id",
    label: "Mã mẫu",
    render: (value) => (
      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border w-fit">
        <Hash className="w-3 h-3 opacity-60" />
        {value}
      </div>
    ),
  },
  {
    key: "crop",
    label: "Cây trồng",
    render: (_, rowValue) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <Leaf className="w-3.5 h-3.5 text-green-600" />
          <span className="font-semibold text-foreground tracking-tight">
            {rowValue.crop}
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground ml-5">
          {rowValue.variety}
        </span>
      </div>
    ),
  },
  {
    key: "season",
    label: "Mùa vụ",
    render: (value) => (
      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
        {value?.map((item: string) => (
          <Badge
            key={item}
            variant="secondary"
            className="text-xs px-2.5 py-0.5 font-semibold bg-blue-50 text-blue-700 border-blue-100 shadow-sm"
          >
            {item}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "applyLevel",
    label: "Áp dụng",
    render: (value) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden hidden md:block">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${value ?? 0}%` }}
          />
        </div>
        <span className="text-[11px] font-bold text-muted-foreground">
          {value ?? 0}%
        </span>
      </div>
    ),
  },
  {
    key: "updatedAt",
    label: "Cập nhật",
    render: (value) => (
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
        <Calendar className="w-3 h-3 opacity-60" />
        {dateFormat(value)}
      </div>
    ),
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
      description="Xem và quản lý danh sách các tài liệu quy trình canh tác"
      actions={
        <Link href="docs/create">
          <Button
            data-testid="add-crop"
            className="shadow-sm hover:shadow-md transition-all active:scale-95"
          >
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
        searchPlaceholder="Tìm mã mẫu, cây trồng, mùa vụ..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
