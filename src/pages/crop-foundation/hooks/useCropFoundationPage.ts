import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

import { useCrops, useCropMutations } from "../../../features/foundation";
import type { FoundationCropResponse } from "../../../features/foundation";

export function useCropFoundationPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const { items: cropFoundations, loading, error } = useCrops();
  const { deleteCrop } = useCropMutations();
  
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<FoundationCropResponse | null>(null);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Lỗi tải dữ liệu",
        description: error,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleDelete = (item: FoundationCropResponse) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleView = (item: FoundationCropResponse) => {
    setLocation(`/crop-foundation/${item.id}`);
  };

  const handleEdit = (item: FoundationCropResponse) => {
    setLocation(`/crop-foundation/${item.id}/edit`);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteCrop.mutate(deleteItem.id, {
        onSuccess: () => {
          toast({ title: "Thành công", description: "Đã xóa cây trồng" });
          setDeleteOpen(false);
          setDeleteItem(null);
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: err.message,
          });
          setDeleteOpen(false);
        },
      });
    }
  };

  return {
    cropFoundations,
    loading,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleView,
    handleEdit,
    handleConfirmDelete,
    isPending: deleteCrop.isPending,
  };
}

