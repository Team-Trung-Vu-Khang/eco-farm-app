import { useState, useMemo } from "react";
import { Plus, ArrowRightLeft } from "lucide-react";
import { useLocation } from "wouter";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Unit } from "./constants";
import useUnitStore from "../../stores/useUnitStore";

const TYPE_LABELS: Record<string, string> = {
  mass: "Khối lượng",
  volume: "Thể tích",
  length: "Độ dài",
  area: "Diện tích",
  quantity: "Số lượng",
  time: "Thời gian",
  other: "Khác",
};

export default function UnitPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Zustand store
  const units = useUnitStore((state) => state.units);
  const deleteUnit = useUnitStore((state) => state.deleteUnit);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Unit | null>(null);

  // Create a map for quick lookup of base unit names
  const unitMap = useMemo(() => {
    return units.reduce(
      (acc, unit) => {
        acc[unit.id] = unit;
        return acc;
      },
      {} as Record<number, Unit>,
    );
  }, [units]);

  const columns: Column<Unit>[] = [
    { key: "code", label: "Mã" },
    {
      key: "name",
      label: "Tên đơn vị",
      render: (value, row) => (
        <span
          className="font-medium text-primary cursor-pointer hover:underline"
          onClick={() => setLocation(`/unit/${row.id}/edit`)}
        >
          {value}
        </span>
      ),
    },
    {
      key: "type",
      label: "Loại",
      render: (value) => (
        <Badge variant="outline" className="capitalize">
          {TYPE_LABELS[value as string] || value}
        </Badge>
      ),
    },
    {
      key: "conversionFactor",
      label: "Quy đổi (Chuẩn)",
      render: (_, row) => {
        if (row.isBaseUnit) {
          return (
            <Badge className="bg-emerald-600 hover:bg-emerald-700">
              Đơn vị chuẩn
            </Badge>
          );
        }

        if (row.baseUnitId && unitMap[row.baseUnitId]) {
          const baseUnit = unitMap[row.baseUnitId];
          return (
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <ArrowRightLeft className="w-3 h-3" />
              <span>
                1 {row.code} = {row.conversionFactor.toLocaleString("vi-VN")}{" "}
                {baseUnit.code}
              </span>
            </div>
          );
        }

        return <span className="text-muted-foreground">-</span>;
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {value === "active" ? "Hoạt động" : "Ngừng hoạt động"}
        </Badge>
      ),
    },
  ];

  const handleAdd = () => {
    setLocation("/unit/create");
  };

  const handleEdit = (item: Unit) => {
    setLocation(`/unit/${item.id}/edit`);
  };

  const handleDelete = (item: Unit) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      if (deleteItem.isBaseUnit) {
        // Prevent deleting base unit if it's used by others
        const hasDependents = units.some((u) => u.baseUnitId === deleteItem.id);
        if (hasDependents) {
          toast({
            title: "Không thể xóa",
            description:
              "Đơn vị này đang là chuẩn quy đổi cho các đơn vị khác.",
            variant: "destructive",
          });
          setDeleteOpen(false);
          return;
        }
      }

      deleteUnit(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa đơn vị tính" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý đơn vị"
      description="Quản lý danh sách đơn vị tính và quy tắc quy đổi về đơn vị chuẩn (kg, lít...)"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm đơn vị
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={units}
        onView={(item) =>
          toast({ title: "Xem chi tiết", description: item.name })
        }
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm đơn vị..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
