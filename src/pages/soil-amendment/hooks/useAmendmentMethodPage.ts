import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  AmendmentMethod,
  AmendmentMethodFormData,
} from "../types/amendment-method";
import {
  createEmptyAmendmentMethodForm,
  INITIAL_AMENDMENT_METHODS,
} from "../data/amendmentMethodData";

export function useAmendmentMethodPage() {
  const { toast } = useToast();
  const [data, setData] = useState<AmendmentMethod[]>(INITIAL_AMENDMENT_METHODS);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AmendmentMethod | null>(
    null,
  );
  const [formData, setFormData] = useState<AmendmentMethodFormData>(
    createEmptyAmendmentMethodForm(),
  );

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData(createEmptyAmendmentMethodForm());
    setFormOpen(true);
  };

  const handleEdit = (item: AmendmentMethod) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setFormOpen(true);
  };

  const handleDelete = (item: AmendmentMethod) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleViewDetail = (item: AmendmentMethod) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ mã và tên phương pháp",
        variant: "destructive",
      });
      return;
    }

    if (selectedItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? ({ ...item, ...formData } as AmendmentMethod)
            : item,
        ),
      );
      toast({ title: "Thành công", description: "Đã cập nhật phương pháp" });
    } else {
      setData((prev) => [
        ...prev,
        {
          ...(formData as AmendmentMethod),
          id: Math.random().toString(36).slice(2, 11),
        },
      ]);
      toast({ title: "Thành công", description: "Đã thêm phương pháp mới" });
    }

    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setData((prev) => prev.filter((item) => item.id !== selectedItem.id));
      toast({ title: "Thành công", description: "Đã xóa phương pháp" });
    }

    setDeleteOpen(false);
  };

  return {
    data,
    deleteOpen,
    detailOpen,
    formData,
    formOpen,
    handleAdd,
    handleConfirmDelete,
    handleDelete,
    handleEdit,
    handleSubmit,
    handleViewDetail,
    selectedItem,
    setDeleteOpen,
    setDetailOpen,
    setFormData,
    setFormOpen,
  };
}
