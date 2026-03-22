import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import usePersonnelStore, { type Personnel } from "../../../stores/usePersonnelStore";

export function usePersonnel() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const personnel = usePersonnelStore((state) => state.personnel);
  const deletePersonnel = usePersonnelStore((state) => state.deletePersonnel);
  const bulkAddPersonnel = usePersonnelStore((state) => state.bulkAddPersonnel);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Personnel | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const handleDelete = (item: Personnel) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deletePersonnel(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa nhân sự khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  const handleImportData = (newData: any[]) => {
    bulkAddPersonnel(newData);
    toast({
      title: "Thành công",
      description: `Đã nhập ${newData.length} nhân sự mới`,
    });
  };

  return {
    personnel,
    deleteOpen,
    setDeleteOpen,
    importOpen,
    setImportOpen,
    handleDelete,
    handleConfirmDelete,
    handleImportData,
    setLocation,
  };
}
