import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useDepartmentStore, { type Department } from "../../../stores/useDepartmentStore";

export function useDepartment() {
  const { toast } = useToast();

  const departments = useDepartmentStore((state) => state.departments);
  const addDepartment = useDepartmentStore((state) => state.addDepartment);
  const updateDepartment = useDepartmentStore((state) => state.updateDepartment);
  const deleteDepartment = useDepartmentStore((state) => state.deleteDepartment);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Department | null>(null);
  const [deleteItem, setDeleteItem] = useState<Department | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    status: "active" as "active" | "inactive",
  });

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      status: "active",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: Department) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: Department) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      updateDepartment(editItem.id, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật phòng ban",
      });
    } else {
      addDepartment(formData);
      toast({
        title: "Thành công",
        description: "Đã thêm phòng ban mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteDepartment(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa phòng ban",
      });
    }
    setDeleteOpen(false);
  };

  return {
    departments,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
  };
}
