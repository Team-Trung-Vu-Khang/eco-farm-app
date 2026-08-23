import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  useProductionSubjectGroups,
  useProductionSubjectGroupMutations,
  type ProductionSubjectGroupResponse,
  type ProductionSubjectGroupRequest,
} from "../../../features/foundation";

export interface GroupAquaFormData {
  code?: string;
  name: string;
  biological: string;
  description: string;
}

const emptyFormData: GroupAquaFormData = {
  name: "",
  biological: "",
  description: "",
};

export function useGroupAquaPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [status, setStatus] = useState<string>("all");

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

  const filters = [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Ngừng hoạt động", value: "inactive" },
        { label: "Đã lưu trữ", value: "archived" },
      ],
    },
  ];

  // ─── API hooks ─────────────────────────────────────────────────────────────
  const { items, response, loading, error } = useProductionSubjectGroups({
    params: {
      domainCode: "AQUACULTURE",
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });
  const { createSubjectGroup, updateSubjectGroup, deleteSubjectGroup } =
    useProductionSubjectGroupMutations();

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
  const [editItem, setEditItem] = useState<ProductionSubjectGroupResponse | null>(null);
  const [deleteItem, setDeleteItem] = useState<ProductionSubjectGroupResponse | null>(
    null,
  );
  const [formData, setFormData] = useState<GroupAquaFormData>(emptyFormData);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: ProductionSubjectGroupResponse) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name ?? "",
      biological: item.biological ?? "",
      description: item.description ?? "",
    });
    setFormOpen(true);
  };

  const handleDelete = (item: ProductionSubjectGroupResponse) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = (data: GroupAquaFormData) => {
    const payload: ProductionSubjectGroupRequest = {
      domainCode: "AQUACULTURE",
      name: data.name,
      description: data.description || undefined,
      biological: data.biological || undefined,
      status: "active" as const,
    };

    if (data.code) {
      payload.code = data.code;
    }

    if (editItem) {
      updateSubjectGroup.mutate(
        { id: editItem.id, data: payload },
        {
          onSuccess: () => {
            toast({
              title: "Thành công",
              description: "Đã cập nhật thông tin nhóm thủy sản",
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
      createSubjectGroup.mutate(payload, {
        onSuccess: () => {
          toast({
            title: "Thành công",
            description: "Đã thêm nhóm thủy sản mới",
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
    deleteSubjectGroup.mutate(deleteItem.id, {
      onSuccess: () => {
        toast({ title: "Thành công", description: "Đã xóa nhóm thủy sản" });
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
    groupAquas: items,
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
    filters,
    handleFilterChange,
    handleSubmit,
    handleConfirmDelete,
    isPending:
      createSubjectGroup.isPending ||
      updateSubjectGroup.isPending ||
      deleteSubjectGroup.isPending,
  };
}
