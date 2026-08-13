import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useUnitStore from "../../../stores/useUnitStore";
import useMaterialStore from "../../../stores/useMaterialStore";
import { getUnitColumns } from "../data/columns";
import type { Unit } from "../types/types";
import type { Material } from "../../material/types/types";

export function useUnitPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const units = useUnitStore((state) => state.units);
  const deleteUnit = useUnitStore((state) => state.deleteUnit);
  const materials = useMaterialStore((state) => state.materials);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Unit | null>(null);

  const materialMap = useMemo(
    () =>
      materials.reduce(
        (acc, m) => {
          acc[m.id] = m;
          return acc;
        },
        {} as Record<number, Material>,
      ),
    [materials],
  );

  const columns = useMemo(
    () =>
      getUnitColumns({
        units,
        materialMap,
        onEditNavigate: (id) => setLocation(`/unit/${id}/edit`),
      }),
    [setLocation, units, materialMap],
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
    handleView: (item: Unit) => {
      const fromMat = materialMap[item.sourceMaterialId || 0]?.name || "Vật tư";
      const toMat = materialMap[item.targetMaterialId || 0]?.name || "Vật tư";
      toast({
        title: "Xem chi tiết",
        description: `Quy đổi: 1 ${fromMat} = ${item.conversionFactor} ${toMat}`,
      });
    },
  };
}
