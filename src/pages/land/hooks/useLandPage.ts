import { useState, useMemo, useRef } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCatalog } from "../../../features/foundation/hooks/useCatalog";
import { useCatalogMutations } from "../../../features/foundation/hooks/useCatalogMutations";
import { useUploadStorageFile } from "../../../features/storage/hooks/useUploadStorageFile";
import type { Land } from "../../../stores/useLandStore";
import {
  createEmptyLandFormData,
  createLandFormDataFromItem,
  type LandFormData,
} from "../data/land.constants";

export function useLandPage() {
  const { toast } = useToast();
  const { items, loading } = useCatalog("soil-types");
  const { createCatalog, updateCatalog, deleteCatalog } =
    useCatalogMutations("soil-types");
  const { uploadStorageFile, isPending: isUploading } = useUploadStorageFile();

  const data: Land[] = useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      code: item.code || "",
      name: item.name || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      status: (item.status as any) || "active",
      createdAt: item.createdAt ? item.createdAt.split("T")[0] : "",
    }));
  }, [items]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Land | null>(null);
  const [deleteItem, setDeleteItem] = useState<Land | null>(null);

  const selectedFile = useRef<File | null>(null);
  const [formData, setFormData] = useState<LandFormData>(() =>
    createEmptyLandFormData(),
  );

  const isSubmitting =
    createCatalog.isPending ||
    updateCatalog.isPending ||
    deleteCatalog.isPending ||
    isUploading;

  const handleAdd = () => {
    setEditItem(null);
    setFormData(createEmptyLandFormData());
    selectedFile.current = null;
    setFormOpen(true);
  };

  const handleEdit = (item: Land) => {
    setEditItem(item);
    setFormData(createLandFormDataFromItem(item));
    selectedFile.current = null;
    setFormOpen(true);
  };

  const handleDelete = (item: Land) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleFileSelect = (file: File | null) => {
    selectedFile.current = file;
  };

  const handleSubmit = async (values: LandFormData) => {
    try {
      let finalImageUrl = values.imageUrl || "";
      if (selectedFile.current && finalImageUrl.startsWith("blob:")) {
        const uploadRes = await uploadStorageFile({
          folder: "soil-types",
          file: selectedFile.current,
        });
        finalImageUrl = uploadRes.fileUrl;
      }

      const payload = {
        code: values.code || "",
        name: values.name || "",
        imageUrl: finalImageUrl,
        description: values.description || "",
        status: "active" as const,
      };

      if (editItem) {
        await updateCatalog.mutateAsync({ id: editItem.id, data: payload });
        toast({
          title: "Thành công",
          description: "Đã cập nhật thông tin loại đất",
        });
      } else {
        await createCatalog.mutateAsync(payload);
        toast({ title: "Thành công", description: "Đã thêm loại đất mới" });
      }
      setFormOpen(false);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: e.message || "Đã xảy ra lỗi",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      try {
        await deleteCatalog.mutateAsync(deleteItem.id);
        toast({ title: "Thành công", description: "Đã xóa loại đất" });
        setDeleteOpen(false);
      } catch (e: any) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: e.message || "Đã xảy ra lỗi",
        });
      }
    }
  };

  return {
    data,
    loading,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    formData,
    isSubmitting,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFileSelect,
    handleSubmit,
    handleConfirmDelete,
  };
}
