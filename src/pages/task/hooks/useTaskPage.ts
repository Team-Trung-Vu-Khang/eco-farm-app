import {
  useDeleteFarmTask,
  useFarmTaskStats,
  useFarmTasks,
} from "@/features/farm-task";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import { useLocation, useSearch } from "wouter";
import usePlanStore from "../../../stores/usePlanStore";
import type { Task } from "../../../stores/useTaskStore";
import { farmTaskToLegacyTask } from "../utils/task-mappers";
import type {
  FarmTaskPriority,
  FarmTaskStatus,
} from "@/features/farm-task";

const mapStatusFilterToApi = (status: string): FarmTaskStatus | undefined => {
  switch (status) {
    case "pending":
      return "TODO";
    case "in-progress":
      return "DOING";
    case "completed":
      return "DONE";
    case "overdue":
      return "CANCELLED";
    default:
      return undefined;
  }
};

const mapPriorityFilterToApi = (priority: string): FarmTaskPriority | undefined => {
  switch (priority) {
    case "low":
      return "LOW";
    case "high":
      return "HIGH";
    case "medium":
      return "MEDIUM";
    default:
      return undefined;
  }
};

export function useTaskPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const search = useSearch();

  const plans = usePlanStore((state) => state.plans);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Task["status"]>(
    "all",
  );
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | Task["priority"]
  >("all");
  const [originFilter, setOriginFilter] = useState<
    "all" | "PLANNED" | "AD_HOC"
  >("all");
  const [currentIndex, setCurrentIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const planId = new URLSearchParams(search).get("planId") || "";
  const plan = useMemo(
    () => (planId ? plans.find((p) => String(p.id) === planId) : undefined),
    [planId, plans],
  );

  const debouncedSearch = useDebounce(searchKeyword, 300);

  const taskQueryParams = useMemo(
    () => ({
      keyword: debouncedSearch.trim() || undefined,
      planId: planId || undefined,
      status:
        statusFilter === "all" ? undefined : mapStatusFilterToApi(statusFilter),
      priority:
        priorityFilter === "all"
          ? undefined
          : mapPriorityFilterToApi(priorityFilter),
      origin: originFilter === "all" ? undefined : originFilter,
      page: currentIndex - 1,
      size: viewMode === "calendar" ? 500 : pageSize,
    }),
    [
      currentIndex,
      debouncedSearch,
      originFilter,
      pageSize,
      planId,
      priorityFilter,
      statusFilter,
      viewMode,
    ],
  );

  const statsQueryParams = useMemo(
    () => ({
      keyword: debouncedSearch.trim() || undefined,
      planId: planId || undefined,
      priority:
        priorityFilter === "all"
          ? undefined
          : mapPriorityFilterToApi(priorityFilter),
      origin: originFilter === "all" ? undefined : originFilter,
    }),
    [debouncedSearch, originFilter, planId, priorityFilter],
  );

  const {
    items,
    response,
    loading: tasksLoading,
  } = useFarmTasks({
    params: taskQueryParams,
  });

  const { item: statsResponse } = useFarmTaskStats({
    params: statsQueryParams,
  });

  const deleteMutation = useDeleteFarmTask({
    onSuccess: () => {
      toast({ title: "Thành công", description: "Đã xóa công việc" });
    },
    onError: (error) => {
      toast({
        title: "Không thể xóa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const tasks = useMemo(
    () => items.map((task) => farmTaskToLegacyTask(task)),
    [items],
  );

  const isPlanScoped = !!planId;
  const planNotFound = isPlanScoped && !plan;

  const handleSearchChange = (value: string) => {
    setSearchKeyword(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatusFilter(value as "all" | Task["status"]);
      setCurrentIndex(1);
    }
    if (key === "priority") {
      setPriorityFilter(value as "all" | Task["priority"]);
      setCurrentIndex(1);
    }
    if (key === "origin") {
      setOriginFilter(value as "all" | "PLANNED" | "AD_HOC");
      setCurrentIndex(1);
    }
  };

  const handleAdd = () => {
    setLocation(planId ? `/task/create?planId=${planId}` : "/task/create");
  };

  const handleEdit = (task: Task) => {
    setLocation(`/task/${task.id}/edit`);
  };

  const handleView = (task: Task) => {
    setLocation(
      planId ? `/task/${task.id}?planId=${planId}` : `/task/${task.id}`,
    );
  };

  const handleDelete = (task: Task) => {
    setDeleteItem(task);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      await deleteMutation.deleteFarmTask(deleteItem.id);
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  const clearPlanScope = () => setLocation("/task");

  const stats = {
    pending: statsResponse?.todoTasks ?? 0,
    inProgress: statsResponse?.doingTasks ?? 0,
    completed: statsResponse?.doneTasks ?? 0,
    overdue: statsResponse?.cancelledTasks ?? 0,
  };

  return {
    tasks,
    tasksLoading,
    response,
    stats,
    plan,
    planId,
    isPlanScoped,
    planNotFound,
    clearPlanScope,
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    deleteOpen,
    setDeleteOpen,
    searchKeyword,
    handleSearchChange,
    statusFilter,
    priorityFilter,
    originFilter,
    handleFilterChange,
    currentIndex,
    setCurrentIndex,
    pageSize,
    setPageSize,
    handleAdd,
    handleEdit,
    handleView,
    handleDelete,
    handleConfirmDelete,
  };
}
