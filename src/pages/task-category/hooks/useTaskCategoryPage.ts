import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useQuery } from "@tanstack/react-query";
import {
  taskCategoryApi,
  type TaskCategoryRecord,
  type TaskCategoryStatus,
} from "@/features/task-category";
import { emptyTaskCategoryFormData } from "../data/constants";
import { taskCategoryDomainLabel } from "../data/constants";
import type { TaskCategoryDomain, TaskCategoryFormData } from "../types/types";
import { useDebounce } from "@/shared/hooks/useDebounce";

const domainCodePrefix: Record<TaskCategoryDomain, string> = {
  crop: "CV",
  animal: "LV",
  aquaculture: "AQ",
};

const domainCodeMap: Record<
  TaskCategoryDomain,
  "CROP" | "LIVESTOCK" | "AQUACULTURE"
> = {
  crop: "CROP",
  animal: "LIVESTOCK",
  aquaculture: "AQUACULTURE",
};

const ALL = "all" as const;
type StatusFilter = TaskCategoryStatus | typeof ALL;

export function useTaskCategoryPage() {
  const { toast } = useToast();
  const [activeDomain, setActiveDomain] = useState<TaskCategoryDomain>("crop");
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<string>();
  const [status, setStatus] = useState<StatusFilter>();
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<TaskCategoryRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<TaskCategoryRecord | null>(null);
  const [formData, setFormData] = useState<TaskCategoryFormData>(
    emptyTaskCategoryFormData,
  );
  const [isPending, setIsPending] = useState(false);

  const domainCode = domainCodeMap[activeDomain];

  const searchDebounce = useDebounce(search, 400);

  const categoriesQuery = useQuery({
    queryKey: [
      "admin-task-categories",
      domainCode,
      searchDebounce,
      stage,
      status,
      pageSize,
      currentIndex,
    ],
    queryFn: () =>
      taskCategoryApi.listAdmin({
        domainCode,
        keyword: searchDebounce.trim() || undefined,
        stage: stage || undefined,
        status: status === ALL ? undefined : status,
        page: Math.max(currentIndex - 1, 0),
        size: pageSize,
      }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const stagesQuery = useQuery({
    queryKey: ["admin-task-category-stages", domainCode],
    queryFn: () => taskCategoryApi.listAdminStages({ domainCode }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleAdd = (domain: TaskCategoryDomain = "crop") => {
    setActiveDomain(domain);
    setEditItem(null);
    setFormData({ ...emptyTaskCategoryFormData, domain });
    setFormOpen(true);
  };

  const handleEdit = (item: TaskCategoryRecord) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      description: item.example,
      domain:
        item.domainCode === "CROP"
          ? "crop"
          : item.domainCode === "LIVESTOCK"
            ? "animal"
            : "aquaculture",
      status: item.status === "archived" ? "inactive" : item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: TaskCategoryRecord) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async (values: TaskCategoryFormData) => {
    setIsPending(true);
    try {
      const domainCode = domainCodeMap[values.domain];
      const payload = {
        domainCode,
        stage: editItem?.stage || taskCategoryDomainLabel[values.domain],
        code:
          editItem?.code || `${domainCodePrefix[values.domain]}-${Date.now()}`,
        name: values.name.trim(),
        example: values.description.trim(),
        displayOrder: editItem?.displayOrder || 10,
        status: values.status || "active",
        metadataJson: editItem?.metadataJson || { source: "manual" },
      } as const;

      if (editItem) {
        await taskCategoryApi.updateAdmin(editItem.id, payload);
        toast({
          title: "Thành công",
          description: "Đã cập nhật công việc",
        });
      } else {
        await taskCategoryApi.createAdmin(payload);
        toast({
          title: "Thành công",
          description: "Đã thêm công việc mới",
        });
      }
      await categoriesQuery.refetch();
      setFormOpen(false);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: e.message || "Đã xảy ra lỗi",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      setIsPending(true);
      try {
        await taskCategoryApi.deleteAdmin(deleteItem.id);
        toast({ title: "Thành công", description: "Đã xóa công việc" });
        await categoriesQuery.refetch();
        setDeleteOpen(false);
        setDeleteItem(null);
      } catch (e: any) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: e.message || "Đã xảy ra lỗi",
        });
      } finally {
        setIsPending(false);
      }
    }
  };

  return {
    taskCategories: categoriesQuery.data?.content ?? [],
    response: categoriesQuery.data ?? null,
    stages: stagesQuery.data ?? [],
    activeDomain,
    setActiveDomain: (domain: TaskCategoryDomain) => {
      setActiveDomain(domain);
      setCurrentIndex(1);
      setStage("");
    },
    search,
    handleSearch: (value: string) => {
      setSearch(value);
      setCurrentIndex(1);
    },
    handleFilterChange: (key: string, value: string) => {
      if (key === "stage") {
        setStage(value === ALL ? undefined : value);
      }
      if (key === "status") {
        setStatus(value === ALL ? undefined : (value as TaskCategoryStatus));
      }
      setCurrentIndex(1);
    },
    pageSize,
    setPageSize: (size: number) => {
      setPageSize(size);
      setCurrentIndex(1);
    },
    currentIndex,
    setCurrentIndex,
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
    loading: categoriesQuery.isLoading || stagesQuery.isLoading,
    error: categoriesQuery.error?.message ?? null,
    isPending: isPending || categoriesQuery.isFetching,
  };
}
