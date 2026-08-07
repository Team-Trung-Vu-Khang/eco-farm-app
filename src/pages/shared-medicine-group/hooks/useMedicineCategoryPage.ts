import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMasterData, useMasterDataMutations } from "@/features/master-data";
import type {
  MasterDataCatalog,
  MasterDataStatus,
} from "@/features/master-data/types/master-data.type";
import type { MedicineCategoryFormValues } from "../data/schema";
import { emptyMedicineCategoryFormData } from "../data/schema";
import { MOCK_MEDICINE_DATA } from "../data/mocks";

export type MedicineCategoryItem = {
  id: number;
  code: string;
  name: string;
  description?: string;
  status: MasterDataStatus;
};

export function useMedicineCategoryPage(catalog: MasterDataCatalog) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MasterDataStatus | "all">("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<MedicineCategoryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MedicineCategoryItem | null>(null);

  // MOCK DATA STATE
  const [mockItems, setMockItems] = useState<MedicineCategoryItem[]>(
    MOCK_MEDICINE_DATA[catalog] || [],
  );

  const { items, loading, error, response } = useMasterData(catalog, {
    params: {
      keyword: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { createMasterData, updateMasterData, deleteMasterData } =
    useMasterDataMutations(catalog);

  // Use mock data if API fails or is empty and we have mocks available
  const isMocked = MOCK_MEDICINE_DATA[catalog] !== undefined;

  const data = useMemo(() => {
    if (isMocked) {
      let filtered = [...mockItems];
      if (search.trim()) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.code.toLowerCase().includes(lowerSearch) ||
            item.name.toLowerCase().includes(lowerSearch),
        );
      }
      if (status !== "all") {
        filtered = filtered.filter((item) => item.status === status);
      }
      return filtered.slice((currentIndex - 1) * pageSize, currentIndex * pageSize);
    }
    return items as MedicineCategoryItem[];
  }, [items, isMocked, mockItems, search, status, currentIndex, pageSize]);

  const mockResponse = useMemo(() => {
    if (isMocked) {
      let filtered = [...mockItems];
      if (search.trim()) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.code.toLowerCase().includes(lowerSearch) ||
            item.name.toLowerCase().includes(lowerSearch),
        );
      }
      if (status !== "all") {
        filtered = filtered.filter((item) => item.status === status);
      }
      return {
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / pageSize),
      };
    }
    return response;
  }, [isMocked, mockItems, search, status, response, pageSize]);

  const handleAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: MedicineCategoryItem) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: MedicineCategoryItem) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const buildPayload = (values: MedicineCategoryFormValues) => ({
    code: values.code?.trim().toUpperCase(),
    name: values.name.trim(),
    description: values.description.trim(),
    displayOrder: 1,
    status: editItem ? values.status : "active",
    metadataJson: {
      source: "manual",
    },
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value === "all" ? "all" : (value as MasterDataStatus));
      setCurrentIndex(1);
    }
  };

  const handleSubmit = async (values: MedicineCategoryFormValues) => {
    const payload = buildPayload(values);

    if (!payload.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập tên phân loại.",
        variant: "destructive",
      });
      return;
    }

    if (isMocked) {
      if (editItem) {
        setMockItems((prev) =>
          prev.map((item) =>
            item.id === editItem.id ? { ...item, ...payload } : item,
          ),
        );
      } else {
        setMockItems((prev) => [
          ...prev,
          {
            id: Date.now(),
            code: payload.code || `CODE_${Date.now()}`,
            name: payload.name,
            description: payload.description,
            status: payload.status as MasterDataStatus,
          },
        ]);
      }
      toast({
        title: "Thành công (MOCK)",
        description: editItem ? "Đã cập nhật phân loại." : "Đã thêm phân loại mới.",
      });
      setFormOpen(false);
      return;
    }

    try {
      if (editItem) {
        await updateMasterData.mutateAsync({
          id: editItem.id,
          data: payload,
        });
      } else {
        await createMasterData.mutateAsync(payload);
      }

      toast({
        title: "Thành công",
        description: editItem ? "Đã cập nhật phân loại." : "Đã thêm phân loại mới.",
      });
      setFormOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";

      toast({
        title: editItem ? "Không thể cập nhật" : "Không thể thêm",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      if (isMocked) {
        setMockItems((prev) => prev.filter((item) => item.id !== deleteItem.id));
        toast({
          title: "Thành công (MOCK)",
          description: "Đã xóa phân loại.",
        });
      } else {
        try {
          await deleteMasterData.mutateAsync(deleteItem.id);
          toast({
            title: "Thành công",
            description: "Đã xóa phân loại.",
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";

          toast({
            title: "Không thể xóa",
            description: message,
            variant: "destructive",
          });
        }
      }
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    data,
    loading: isMocked ? false : loading,
    submitting: isMocked
      ? false
      : createMasterData.isPending || updateMasterData.isPending,
    error: isMocked ? null : error,
    response: mockResponse,
    search,
    setSearch,
    status,
    setStatus,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    handleSearch,
    handleFilterChange,
  };
}
