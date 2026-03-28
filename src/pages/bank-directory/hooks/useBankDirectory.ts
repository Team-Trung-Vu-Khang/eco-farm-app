import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { bankList } from "../../../constants/banks";
import { emptyBankFormData } from "../data/constants";
import type { Bank } from "../types/types";

export function useBankDirectory() {
  const { toast } = useToast();
  const [data, setData] = useState<Bank[]>(bankList);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Bank | null>(null);
  const [deleteItem, setDeleteItem] = useState<Bank | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const [formData, setFormData] = useState<Bank>(emptyBankFormData);

  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyBankFormData);
    setLogoPreview("");
    setFormOpen(true);
  };

  const handleEdit = (item: Bank) => {
    setEditItem(item);
    setFormData({
      id: item.id,
      name: item.name,
      logo: item.logo,
      fullName: item.fullName,
    });
    setLogoPreview(item.logo);
    setFormOpen(true);
  };

  const handleDelete = (item: Bank) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setFormData((prev) => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview("");
    setFormData((prev) => ({ ...prev, logo: "" }));
  };

  const handleSubmit = () => {
    if (editItem) {
      setData((prev: Bank[]) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, ...formData } : item,
        ),
      );
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin ngân hàng",
      });
    } else {
      const newItem: Bank = {
        ...formData,
        id: formData.id || String(Date.now()),
      };
      setData((prev: Bank[]) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm ngân hàng mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev: Bank[]) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa ngân hàng",
      });
    }
    setDeleteOpen(false);
  };

  return {
    data,
    formData,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    logoPreview,
    updateFormData: (updates: Partial<Bank>) =>
      setFormData((prev) => ({ ...prev, ...updates })),
    handleAdd,
    handleEdit,
    handleDelete,
    handleLogoUpload,
    handleRemoveLogo,
    handleSubmit,
    handleConfirmDelete,
  };
}
