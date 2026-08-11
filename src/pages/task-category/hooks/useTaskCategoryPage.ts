import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  emptyTaskCategoryFormData,
  mockTaskCategories,
} from "../data/constants";
import type {
  TaskCategory,
  TaskCategoryDomain,
  TaskCategoryFormData,
} from "../types/types";

let nextId = mockTaskCategories.length + 1;

const domainCodePrefix: Record<TaskCategoryDomain, string> = {
  crop: "TT",
  animal: "CN",
  aquaculture: "TS",
};

export function useTaskCategoryPage() {
  const { toast } = useToast();

  const [taskCategories, setTaskCategories] = useState<TaskCategory[]>(
    mockTaskCategories,
  );

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<TaskCategory | null>(null);
  const [deleteItem, setDeleteItem] = useState<TaskCategory | null>(null);
  const [formData, setFormData] = useState<TaskCategoryFormData>(
    emptyTaskCategoryFormData,
  );
  const [isPending, setIsPending] = useState(false);

  const handleAdd = (domain: TaskCategoryDomain = "crop") => {
    setEditItem(null);
    setFormData({ ...emptyTaskCategoryFormData, domain });
    setFormOpen(true);
  };

  const handleEdit = (item: TaskCategory) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      domain: item.domain,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: TaskCategory) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async (values: TaskCategoryFormData) => {
    setIsPending(true);
    try {
      if (editItem) {
        setTaskCategories((prev) =>
          prev.map((item) =>
            item.id === editItem.id
              ? {
                  ...item,
                  name: values.name,
                  description: values.description || "",
                  domain: values.domain,
                  status: values.status || item.status,
                }
              : item,
          ),
        );
        toast({
          title: "Thành công",
          description: "Đã cập nhật công việc",
        });
      } else {
        const newId = nextId++;
        const newItem: TaskCategory = {
          id: newId,
          code: `${domainCodePrefix[values.domain]}${String(newId).padStart(
            3,
            "0",
          )}`,
          name: values.name,
          description: values.description || "",
          domain: values.domain,
          status: "active",
          createdAt: new Date().toISOString().split("T")[0],
        };
        setTaskCategories((prev) => [newItem, ...prev]);
        toast({
          title: "Thành công",
          description: "Đã thêm công việc mới",
        });
      }
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
        setTaskCategories((prev) =>
          prev.filter((item) => item.id !== deleteItem.id),
        );
        toast({ title: "Thành công", description: "Đã xóa công việc" });
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
    taskCategories,
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
    loading: false,
    isPending,
  };
}
