import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import { FileDown, Image as ImageIcon, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

import { cropTypeOptions, harvestMethodOptions, initialData } from "./mocks";
import type { Crop } from "./types";

export default function CropPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [sourceData, setSourceData] = useState<Crop[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Crop | null>(null);

  const tableFilters = [
    {
      key: "cropType",
      label: "Loại cây",
      options: cropTypeOptions,
    },
    {
      key: "harvestMethod",
      label: "Hình thức thu hoạch",
      options: harvestMethodOptions,
    },
  ];

  const columns: Column<Crop>[] = [
    {
      key: "code",
      label: "Mã cây",
      render: (value: string, item: Crop) => (
        <Link href={`/crop/${item.id}`}>
          <span className="text-green-600 hover:text-green-700 hover:underline cursor-pointer transition-colors">
            {value}
          </span>
        </Link>
      ),
    },
    {
      key: "illustration",
      label: "Hình ảnh",
      render: (value: string | null) => (
        <div className="w-12 h-12 rounded-lg border bg-muted overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <img
              src={value}
              alt="Crop"
              className="w-full h-full object-cover transition-transform hover:scale-110"
            />
          ) : (
            <ImageIcon className="w-5 h-5 text-muted-foreground/40" />
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Tên cây",
      render: (value: string, item: Crop) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{value}</span>
          {item.technicalSpecs?.scientificName && (
            <span className="text-[11px] text-muted-foreground italic font-medium">
              {item.technicalSpecs.scientificName}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "cropType",
      label: "Loại cây",
      render: (value: string) => (
        <span className="text-sm font-medium text-muted-foreground">
          {value}
        </span>
      ),
    },
    {
      key: "cropGroup",
      label: "Nhóm cây",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      ),
    },
    {
      key: "harvestMethod",
      label: "Thu hoạch",
      render: (value: string) => {
        const option = harvestMethodOptions.find(
          (opt: any) => opt.value === value,
        );
        return (
          <span className="text-sm text-muted-foreground italic">
            {option ? option.label : value}
          </span>
        );
      },
    },
  ];

  const handleDelete = (item: Crop) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleView = (item: Crop) => {
    setLocation(`/crop/${item.id}`);
  };

  const handleEdit = (item: Crop) => {
    setLocation(`/crop/${item.id}`);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setSourceData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa cây trồng" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý cây trồng"
      description="Danh mục các loại cây trồng có trên thị trường"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white">
            <FileDown className="w-4 h-4 mr-2 text-green-600" />
            Xuất Excel
          </Button>
          <Link href="/crop/create">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Thêm mới
            </Button>
          </Link>
        </div>
      }
    >
      <DataTable
        columns={columns}
        data={sourceData}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
        searchPlaceholder="Tìm kiếm cây trồng..."
        selectable
        filters={tableFilters}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
