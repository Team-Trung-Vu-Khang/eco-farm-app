import { useMemo, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import usePlanStore from "../../../stores/usePlanStore";
import useTaskStore, { type Task } from "../../../stores/useTaskStore";

export function useTaskPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const search = useSearch();

  const allTasks = useTaskStore((state) => state.tasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const plans = usePlanStore((state) => state.plans);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Task | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentDate, setCurrentDate] = useState(new Date());

  // `?planId=` scopes the page to a single plan ("Phân bổ công việc" from a plan).
  const planId = new URLSearchParams(search).get("planId") || "";
  const plan = useMemo(
    () => (planId ? plans.find((p) => String(p.id) === planId) : undefined),
    [planId, plans],
  );

  // Tasks created before `planId` existed only carry the plan name, so fall back to it.
  const tasks = useMemo(() => {
    if (!planId) return allTasks;
    return allTasks.filter(
      (task) =>
        task.planId === planId || (!!plan?.name && task.plan === plan.name),
    );
  }, [allTasks, plan?.name, planId]);

  const isPlanScoped = !!planId;
  const planNotFound = isPlanScoped && !plan;

  const handleAdd = () => {
    setLocation(planId ? `/task/create?planId=${planId}` : "/task/create");
  };

  const handleEdit = (task: Task) => {
    setLocation(`/task/${task.id}/edit`);
  };

  const handleView = (task: Task) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  const handleDelete = (task: Task) => {
    setDeleteItem(task);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteTask(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa công việc" });
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  const clearPlanScope = () => setLocation("/task");

  const stats = {
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    overdue: tasks.filter((task) => task.status === "overdue").length,
  };

  return {
    tasks,
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
    detailOpen,
    setDetailOpen,
    selectedTask,
    handleAdd,
    handleEdit,
    handleView,
    handleDelete,
    handleConfirmDelete,
  };
}
