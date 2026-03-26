import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  Activity,
  ActivityType,
  AmendmentCycle,
  AmendmentCycleFormData,
} from "../types/amendment-cycle";
import {
  createEmptyAmendmentCycleForm,
  getCycleConditionColor,
  INITIAL_AMENDMENT_CYCLES,
  PREDEFINED_ACTIVITIES,
} from "../data/amendmentCycleData";

export function useAmendmentCyclePage() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [data, setData] = useState<AmendmentCycle[]>(INITIAL_AMENDMENT_CYCLES);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editItem, setEditItem] = useState<AmendmentCycle | null>(null);
  const [deleteItem, setDeleteItem] = useState<AmendmentCycle | null>(null);
  const [detailItem, setDetailItem] = useState<AmendmentCycle | null>(null);
  const [formData, setFormData] = useState<AmendmentCycleFormData>(
    createEmptyAmendmentCycleForm(),
  );
  const [activitySearch, setActivitySearch] = useState("");
  const [isActivityListOpen, setIsActivityListOpen] = useState(false);
  const [customActivityType, setCustomActivityType] =
    useState<ActivityType>("biological");

  const filteredActivities = PREDEFINED_ACTIVITIES.filter((activity) =>
    activity.text.toLowerCase().includes(activitySearch.toLowerCase()),
  );

  const handleAdd = () => {
    setEditItem(null);
    setFormData(createEmptyAmendmentCycleForm());
    setActivitySearch("");
    setIsActivityListOpen(false);
    setFormOpen(true);
  };

  const handleEdit = (item: AmendmentCycle) => {
    setEditItem(item);
    setFormData({ ...item });
    setActivitySearch("");
    setIsActivityListOpen(false);
    setFormOpen(true);
  };

  const handleDelete = (item: AmendmentCycle) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleViewDetail = (item: AmendmentCycle) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  const addActivity = (activity: Activity) => {
    setFormData((current) => {
      if (current.activities?.some((item) => item.text === activity.text)) {
        return current;
      }

      return {
        ...current,
        activities: [...(current.activities || []), activity],
      };
    });

    setActivitySearch("");
    setIsActivityListOpen(false);
  };

  const handleAddCustomActivity = () => {
    if (!activitySearch.trim()) return;
    addActivity({ text: activitySearch.trim(), type: customActivityType });
  };

  const handleRemoveActivity = (index: number) => {
    setFormData((current) => ({
      ...current,
      activities: current.activities?.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSave = () => {
    const nextItem: AmendmentCycle = {
      id: editItem ? editItem.id : Math.random().toString(36).slice(2, 11),
      title: formData.title || "",
      type: formData.type || "short",
      duration: formData.duration || "",
      condition: formData.condition || "",
      outcome: formData.outcome || "",
      activities: formData.activities || [],
      conditionColor: getCycleConditionColor(formData.type),
    };

    if (editItem) {
      setData((prev) =>
        prev.map((item) => (item.id === editItem.id ? nextItem : item)),
      );
      toast({ title: "Thành công", description: "Đã cập nhật chu kỳ cải tạo" });
    } else {
      setData((prev) => [...prev, nextItem]);
      toast({ title: "Thành công", description: "Đã tạo chu kỳ cải tạo mới" });
    }

    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa chu kỳ cải tạo" });
    }

    setDeleteOpen(false);
  };

  return {
    activitySearch,
    addActivity,
    customActivityType,
    data,
    deleteItem,
    deleteOpen,
    detailItem,
    detailOpen,
    editItem,
    filteredActivities,
    formData,
    formOpen,
    handleAdd,
    handleAddCustomActivity,
    handleConfirmDelete,
    handleDelete,
    handleEdit,
    handleRemoveActivity,
    handleSave,
    handleViewDetail,
    isActivityListOpen,
    setActivitySearch,
    setCustomActivityType,
    setDeleteOpen,
    setDetailOpen,
    setFormData,
    setFormOpen,
    setIsActivityListOpen,
    setViewMode,
    viewMode,
  };
}
