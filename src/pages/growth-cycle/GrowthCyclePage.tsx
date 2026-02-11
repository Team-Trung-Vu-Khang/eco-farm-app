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
import { Hash, Layers, Plus, Sprout } from "lucide-react";
import type { GrowthCycle } from "./types";
import useGrowthCycleStore from "../../stores/useGrowthCycleStore";

const columns: Column<GrowthCycle>[] = [
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
    key: "name",
    label: "Chu kỳ",
    render: (value) => (
      <div className="flex items-center gap-2">
        <Sprout className="w-4 h-4 text-primary" />
        <span className="font-semibold">{value}</span>
      </div>
    ),
  },
  {
    key: "scope",
    label: "Phạm vi",
    render: (value) => (
      <Badge
        variant={value === "crop" ? "default" : "secondary"}
        className="text-[10px] font-bold uppercase"
      >
        {value === "crop" ? "Theo loại" : "Theo giống"}
      </Badge>
    ),
  },
  {
    key: "totalDays",
    label: "Thời gian",
    render: (value) => (
      <Badge
        variant="secondary"
        className="bg-blue-50 text-blue-700 border-blue-100 text-[10px] font-bold uppercase tracking-wider"
      >
        {value} NGÀY
      </Badge>
    ),
  },
  {
    key: "numStages",
    label: "Số giai đoạn",
    render: (value) => (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
        <Layers className="w-3.5 h-3.5 opacity-60" />
        {value} giai đoạn
      </div>
    ),
  },
];

const GrowthCyclePage = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { growthCycles, deleteGrowthCycle } = useGrowthCycleStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<GrowthCycle | null>(null);

  const handleDelete = (item: GrowthCycle) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleEdit = (item: GrowthCycle) => {
    setLocation(`/growth-cycle/${item.id}/edit`);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteGrowthCycle(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa chu kỳ sinh trưởng" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý chu kỳ sinh trưởng"
      description="Các giai đoạn phát triển của cây trồng"
      actions={
        <div className="flex gap-2">
          {/* <Button variant="outline" size="sm" className="h-9 px-3 border-dashed hover:bg-muted/50">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button> */}
          <Link href="/growth-cycle/create">
            <Button
              size="sm"
              className="h-9 px-3 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm mới
            </Button>
          </Link>
        </div>
      }
    >
      <DataTable
        data={growthCycles}
        selectable
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm chu kỳ..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
};

export default GrowthCyclePage;
