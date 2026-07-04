import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useCatalog, useCatalogMutations } from "../../../features/foundation";
import type { CatalogRecordResponse } from "../../../features/foundation";

export interface GroupCropFormData {
  code: string;
  name: string;
  biological: string;
  description: string;
}

const emptyFormData: GroupCropFormData = {
  code: "",
  name: "",
  biological: "",
  description: "",
};

// Helper: lấy biological từ attributes trả về của API
const getBiological = (item: CatalogRecordResponse): string =>
  (item.attributes?.biological as string) ?? "";

export function useGroupCropPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  // ─── API hooks ─────────────────────────────────────────────────────────────
  const { items, response, loading, error } = useCatalog("crop-groups", {
    params: {
      keyword: debouncedSearch.trim() || undefined,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });
  const { createCatalog, updateCatalog, deleteCatalog } =
    useCatalogMutations("crop-groups");

  // Lỗi fetch list → chỉ toast, không throw/hiển thị banner
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

  // ─── UI state ──────────────────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<CatalogRecordResponse | null>(null);
  const [deleteItem, setDeleteItem] = useState<CatalogRecordResponse | null>(
    null,
  );
  const [formData, setFormData] = useState<GroupCropFormData>(emptyFormData);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: CatalogRecordResponse) => {
    setEditItem(item);
    setFormData({
      code: item.code ?? "",
      name: item.name ?? "",
      biological: getBiological(item),
      description: item.description ?? "",
    });
    setFormOpen(true);
  };

  const handleDelete = (item: CatalogRecordResponse) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = (data: GroupCropFormData) => {
    // biological được lưu vào attributes.biological vì API catalog không có field riêng
    const payload = {
      code: data.code || undefined,
      name: data.name || undefined,
      description: data.description || undefined,
      status: "active" as const,
      attributes: data.biological ? { biological: data.biological } : undefined,
    };

    if (editItem) {
      updateCatalog.mutate(
        { id: editItem.id, data: payload },
        {
          onSuccess: () => {
            toast({
              title: "Thành công",
              description: "Đã cập nhật thông tin nhóm cây trồng",
            });
            setFormOpen(false);
          },
          onError: (err) => {
            toast({
              variant: "destructive",
              title: "Lỗi",
              description: err.message,
            });
          },
        },
      );
    } else {
      createCatalog.mutate(payload, {
        onSuccess: () => {
          toast({
            title: "Thành công",
            description: "Đã thêm nhóm cây trồng mới",
          });
          setFormOpen(false);
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: err.message,
          });
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteItem) return;
    deleteCatalog.mutate(deleteItem.id, {
      onSuccess: () => {
        toast({ title: "Thành công", description: "Đã xóa nhóm cây trồng" });
        setDeleteOpen(false);
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
  };

  return {
    groupCrops: items,
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    loading,
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
    isPending:
      createCatalog.isPending ||
      updateCatalog.isPending ||
      deleteCatalog.isPending,
  };
}
