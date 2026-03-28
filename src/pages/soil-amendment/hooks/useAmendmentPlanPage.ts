import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { AmendmentPlan } from "../../../stores/useAmendmentPlanStore";
import useAmendmentPlanStore from "../../../stores/useAmendmentPlanStore";
import { buildFilterOptions } from "../utils";

export function useAmendmentPlanPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const plans = useAmendmentPlanStore((state) => state.plans);
  const deletePlan = useAmendmentPlanStore((state) => state.deletePlan);
  const getStatistics = useAmendmentPlanStore((state) => state.getStatistics);

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AmendmentPlan | null>(null);

  const stats = getStatistics();

  const tableFilters = useMemo(
    () => [
      {
        key: "status" as const,
        label: "Trạng thái",
        options: [
          { label: "Đang lập KH", value: "planning" },
          { label: "Đang thực hiện", value: "in_progress" },
          { label: "Hoàn thành", value: "completed" },
          { label: "Đã hủy", value: "cancelled" },
        ],
      },
      {
        key: "zone" as const,
        label: "Khu vực",
        options: buildFilterOptions(plans.map((plan) => plan.zone)),
      },
      {
        key: "technician" as const,
        label: "Phụ trách",
        options: buildFilterOptions(plans.map((plan) => plan.technician)),
      },
    ],
    [plans],
  );

  const handleAdd = () => setLocation("/amendment-plan/create");

  const handleEdit = (item: AmendmentPlan) => {
    setDetailOpen(false);
    setLocation(`/amendment-plan/${item.id}/edit`);
  };

  const handleDelete = (item: AmendmentPlan) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleViewDetail = (item: AmendmentPlan) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedItem) return;

    deletePlan(selectedItem.id);
    toast({ title: "Thành công", description: "Đã xóa kế hoạch" });
    setDeleteOpen(false);
    setSelectedItem(null);
  };

  return {
    deleteOpen,
    detailOpen,
    handleAdd,
    handleConfirmDelete,
    handleDelete,
    handleEdit,
    handleViewDetail,
    plans,
    selectedItem,
    setDeleteOpen,
    setDetailOpen,
    setViewMode,
    stats,
    tableFilters,
    viewMode,
  };
}
