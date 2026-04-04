import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  createEmptyTreatmentPlanForm,
  initialTreatmentPlans,
} from "../data/soilAmendmentTreatmentData";
import type { TreatmentPlan, TreatmentPlanFormData } from "../types/treatment";

function normalizeTreatmentPlanForm(
  plan?: Partial<TreatmentPlan> | null,
): TreatmentPlanFormData {
  return {
    ...createEmptyTreatmentPlanForm(),
    ...plan,
    authors:
      plan?.authors && plan.authors.length > 0
        ? plan.authors
        : createEmptyTreatmentPlanForm().authors,
    goalTags: plan?.goalTags || plan?.objectives || [],
    soilProblems: plan?.soilProblems || [],
    cropGroupTags: plan?.cropGroupTags || [],
    applicableObjects: plan?.applicableObjects || [],
    applicableCrops: plan?.applicableCrops || [],
    terrainTypes: plan?.terrainTypes || [],
    inspectionParameters: plan?.inspectionParameters || [],
    qualityChecklist: plan?.qualityChecklist || [],
    materialItems: plan?.materialItems || [],
    attachments: plan?.attachments || [],
    supportingMethodIds: plan?.supportingMethodIds || [],
  };
}

export function useSoilAmendmentTreatmentPage() {
  const { toast } = useToast();
  const [data, setData] = useState<TreatmentPlan[]>(initialTreatmentPlans);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<TreatmentPlan | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TreatmentPlan | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterIntensity, setFilterIntensity] = useState("");
  const [formData, setFormData] = useState<TreatmentPlanFormData>(
    createEmptyTreatmentPlanForm(),
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const matchKeyword =
          item.code.toLowerCase().includes(keyword) ||
          item.name.toLowerCase().includes(keyword) ||
          item.soilIssue.toLowerCase().includes(keyword);
        if (!matchKeyword) return false;
      }

      if (filterStatus && item.status !== filterStatus) return false;
      if (filterIntensity && item.intensity !== filterIntensity) return false;

      return true;
    });
  }, [data, searchKeyword, filterStatus, filterIntensity]);

  const selectedPlan = useMemo(() => {
    if (filteredData.length === 0) return null;
    return (
      filteredData.find((item) => item.id === selectedId) ?? filteredData[0]
    );
  }, [filteredData, selectedId]);

  const stats = useMemo(
    () => ({
      planning: data.filter((item) => item.status === "planning").length,
      inProgress: data.filter((item) => item.status === "in_progress").length,
      completed: data.filter((item) => item.status === "completed").length,
    }),
    [data],
  );

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(normalizeTreatmentPlanForm());
    setSelectedId(null);
    setFormOpen(true);
  };

  const handleEdit = (item: TreatmentPlan) => {
    setEditingItem(item);
    setSelectedId(item.id);
    setFormData(normalizeTreatmentPlanForm(item));
    setFormOpen(true);
  };

  const handleDelete = (item: TreatmentPlan) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa phác đồ" });
    }
    setDeleteOpen(false);
  };

  const handleSubmit = () => {
    if (!formData.code || !formData.name || !formData.zone) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập mã, tên và khu vực của phác đồ",
        variant: "destructive",
      });
      return;
    }

    const normalizedPayload = {
      ...normalizeTreatmentPlanForm(formData),
      objectives: formData.goalTags || formData.objectives || [],
      goalTags: formData.goalTags || formData.objectives || [],
      selectedMethods: [
        ...(formData.primaryMethodId ? [formData.primaryMethodId] : []),
        ...((formData.supportingMethodIds || []).filter(
          (item) => item !== formData.primaryMethodId,
        ) as number[]),
      ],
    } as TreatmentPlanFormData;

    if (editingItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? ({
                ...item,
                ...normalizedPayload,
              } as TreatmentPlan)
            : item,
        ),
      );
      toast({ title: "Thành công", description: "Đã cập nhật phác đồ" });
    } else {
      const newItem: TreatmentPlan = {
        ...(normalizedPayload as TreatmentPlan),
        id: Math.max(...data.map((item) => item.id), 0) + 1,
        status: "planning",
        procedures: [],
        seasonalPhases: [],
      };
      setData((prev) => [newItem, ...prev]);
      setSelectedId(newItem.id);
      toast({ title: "Thành công", description: "Đã tạo phác đồ mới" });
    }

    setFormOpen(false);
  };

  return {
    deleteOpen,
    editingItem,
    filteredData,
    filterIntensity,
    filterStatus,
    formData,
    formOpen,
    handleConfirmDelete,
    handleCreate,
    handleDelete,
    handleEdit,
    handleSubmit,
    searchKeyword,
    selectedId,
    selectedPlan,
    setDeleteOpen,
    setFilterIntensity,
    setFilterStatus,
    setFormData,
    setFormOpen,
    setSearchKeyword,
    setSelectedId,
    stats,
  };
}
