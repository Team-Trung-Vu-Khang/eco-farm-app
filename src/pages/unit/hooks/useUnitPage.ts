import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useUnitStore from "../../../stores/useUnitStore";
import { getUnitColumns } from "../data/columns";
import type { Unit } from "../types/types";

export function useUnitPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const units = useUnitStore((state) => state.units);
  const deleteUnit = useUnitStore((state) => state.deleteUnit);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Unit | null>(null);

  const unitMap = useMemo(
    () =>
      units.reduce(
        (acc, unit) => {
          acc[unit.id] = unit;
          return acc;
        },
        {} as Record<number, Unit>,
      ),
    [units],
  );

  const columns = useMemo(
    () =>
      getUnitColumns({
        unitMap,
        onEditNavigate: (id) => setLocation(`/unit/${id}/edit`),
      }),
    [setLocation, unitMap],
  );

  const handleAdd = () => setLocation("/unit/create");

  const handleEdit = (item: Unit) => setLocation(`/unit/${item.id}/edit`);

  const handleDelete = (item: Unit) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteItem) {
      setDeleteOpen(false);
      return;
    }

    if (deleteItem.isBaseUnit) {
      const hasDependents = units.some((unit) => unit.baseUnitId === deleteItem.id);
      if (hasDependents) {
        toast({
          title: "Không thể xóa",
          description: "Đơn vị này đang là chuẩn quy đổi cho các đơn vị khác.",
          variant: "destructive",
        });
        setDeleteOpen(false);
        return;
      }
    }

    deleteUnit(deleteItem.id);
    toast({ title: "Thành công", description: "Đã xóa đơn vị tính" });
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    units,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleView: (item: Unit) =>
      toast({ title: "Xem chi tiết", description: item.name }),
  };
}
