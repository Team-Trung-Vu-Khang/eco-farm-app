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
import { useDebounce } from "../../../shared/hooks/useDebounce";

export function useLandPage() {
  const { toast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState<string>("all");

  const { items, response, loading } = useCatalog("soil-types", {
    params: {
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value);
      setCurrentIndex(1);
    }
  };

  const { createCatalog, updateCatalog, deleteCatalog } =
    useCatalogMutations("soil-types");
  const { uploadStorageFile, isPending: isUploading } = useUploadStorageFile();

  const data: (Omit<Land, "code"> & { code?: string })[] = useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      code: item.code || undefined,
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

      const payload: any = {
        name: values.name || "",
        imageUrl: finalImageUrl,
        description: values.description || "",
        status: "active" as const,
      };

      if (editItem) {
        payload.code = values.code;
        await updateCatalog.mutateAsync({ id: editItem.id, data: payload });
        toast({
          title: "Thành công",
          description: "Đã cập nhật thông tin loại đất",
        });
      } else {
        if (values.code) {
          payload.code = values.code;
        }
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
    response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    handleSearch,
    handleFilterChange,
  };
}
