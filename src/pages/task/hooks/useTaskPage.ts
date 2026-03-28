import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useTaskStore, { type Task } from "../../../stores/useTaskStore";

export function useTaskPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const tasks = useTaskStore((state) => state.tasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Task | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleAdd = () => {
    setLocation("/task/create");
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

  const stats = {
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    overdue: tasks.filter((task) => task.status === "overdue").length,
  };

  return {
    tasks,
    stats,
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
