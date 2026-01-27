import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import { Download, Sprout } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  cropOptions,
  initialData,
  originOptions,
  supplierOptions,
} from "./mocks";
import type { Variety } from "./types";

const columns: Column<Variety>[] = [
  {
    key: "illustration",
    label: "Hình ảnh",
    render: (value: string | File | null) => (
      <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden border shadow-sm">
        {value ? (
          <img
            src={value instanceof File ? URL.createObjectURL(value) : value}
            className="w-full h-full object-cover"
          />
        ) : (
          <Sprout className="w-8 h-8 text-muted-foreground/30" />
        )}
      </div>
    ),
  },
  {
    key: "varietyCode",
    label: "Mã giống",
    render: (value: string, item: Variety) => (
      <Link href={`/seed/${item.id}`}>
        <span className="text-green-600 hover:text-green-700 hover:underline cursor-pointer transition-colors">
          {value}
        </span>
      </Link>
    ),
  },
  {
    key: "varietyName",
    label: "Tên giống",
    render: (value: string) => (
      <span className="font-bold text-foreground text-sm">{value}</span>
    ),
  },
  {
    key: "supplier",
    label: "Nhà cung cấp",
    render: (value: string) => (
      <span className="text-xs font-medium text-muted-foreground">{value}</span>
    ),
  },
  {
    key: "origin",
    label: "Xuất xứ",
    render: (value: string) => (
      <span className="text-xs font-medium text-muted-foreground">{value}</span>
    ),
  },
  {
    key: "germinationRate",
    label: "Tỷ lệ nảy mầm",
    render: (value: number) => (
      <span className="font-semibold text-green-700">{value}%</span>
    ),
  },
  {
    key: "uniformity",
    label: "Độ đồng đều",
    render: (value: number) => (
      <span className="font-semibold text-green-700">{value}%</span>
    ),
  },
];

const SeedPage = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [sourceData, setSourceData] = useState<Variety[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Variety | null>(null);

  const tableFilters = [
    {
      key: "crop",
      label: "Loại cây",
      options: cropOptions,
    },
    {
      key: "supplier",
      label: "Nhà cung cấp",
      options: supplierOptions,
    },
    {
      key: "origin",
      label: "Xuất xứ",
      options: originOptions,
    },
  ];

  const handleDelete = (item: Variety) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleEdit = (item: Variety) => {
    setLocation(`/seed/${item.id}/edit`);
  };

  const handleView = (item: Variety) => {
    setLocation(`/seed/${item.id}`);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setSourceData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa giống cây trồng" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý hạt giống cây"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất File
          </Button>
          <Link href="/seed/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all active:scale-95">
              Thêm mới
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        <DataTable
          columns={columns}
          data={sourceData}
          selectable
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Tìm kiếm giống cây..."
          filters={tableFilters}
        />
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description={`Bạn có chắc chắn muốn xóa giống cây này?`}
      />
    </AdminLayout>
  );
};

export default SeedPage;
