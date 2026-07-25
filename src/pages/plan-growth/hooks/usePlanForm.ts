import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useToast, type Step } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useGrowthCycleStore from "@/stores/useGrowthCycleStore";
import useRegionStore from "@/stores/useRegionStore";
import useSeasonStore from "@/stores/useSeasonStore";
import usePlanStore from "../../../stores/usePlanStore";
import { useTreatmentStore } from "../../../stores/useTreatmentStore";
import { useAmendmentRegimenStore } from "../../../stores/useAmendmentRegimenStore";
import type {
  GeographicalSelection,
  MaterialAllocation,
  PlanFormData,
  TaskAllocation,
} from "../types";
import {
  calculateSelectedArea,
  deriveSelectionState,
  reconstructSelectionsFromPlan,
  summarizeSelections,
  summarizeTaskSelections,
} from "../utils/location";

type DurationParts = {
  years: string;
  months: string;
  days: string;
};

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDurationPartsToDate(startDate: string, parts: DurationParts) {
  const years = Number(parts.years || 0);
  const months = Number(parts.months || 0);
  const days = Number(parts.days || 0);

  if (
    !startDate ||
    [years, months, days].every((value) => !Number.isFinite(value) || value <= 0)
  ) {
    return "";
  }

  const next = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(next.getTime())) return "";

  if (Number.isFinite(years) && years > 0) next.setFullYear(next.getFullYear() + years);
  if (Number.isFinite(months) && months > 0) next.setMonth(next.getMonth() + months);
  if (Number.isFinite(days) && days > 0) next.setDate(next.getDate() + days);

  return formatDateInput(next);
}

function parseDaysToParts(totalDays?: number): DurationParts {
  const value = Number(totalDays || 0);
  if (!Number.isFinite(value) || value <= 0) {
    return { years: "", months: "", days: "" };
  }

  let remaining = Math.floor(value);
  const years = Math.floor(remaining / 365);
  remaining -= years * 365;
  const months = Math.floor(remaining / 30);
  remaining -= months * 30;

  return {
    years: years > 0 ? String(years) : "",
    months: months > 0 ? String(months) : "",
    days: remaining > 0 ? String(remaining) : "",
  };
}

function inferDurationFromDates(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) {
    return { plannedDurationYears: "", plannedDurationMonths: "", plannedDurationDays: "" };
  }

  const start = new Date(`${startDate}T00:00:00`).getTime();
  const end = new Date(`${endDate}T00:00:00`).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
    return { plannedDurationYears: "", plannedDurationMonths: "", plannedDurationDays: "" };
  }

  const diffDays = Math.max(0, Math.round((end - start) / 86400000));
  const parts = parseDaysToParts(diffDays);
  return {
    plannedDurationYears: parts.years,
    plannedDurationMonths: parts.months,
    plannedDurationDays: parts.days,
  };
}

function buildAutoPlanCode(seasonId: string, seasonName: string) {
  const seasonToken = (seasonId || seasonName || "PLAN")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 12) || "PLAN";

  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");

  return `KH-${seasonToken}-${timestamp}`;
}

function createEmptyFormData(): PlanFormData {
  return {
    code: "",
    name: "",
    description: "",
    seasonId: "",
    seasonName: "",
    startDate: "",
    endDate: "",
    plannedDurationYears: "",
    plannedDurationMonths: "",
    plannedDurationDays: "",
    selectedRegionIds: [],
    selectedZoneIds: [],
    selectedPlotIds: [],
    crop: "",
    variety: "",
    purpose: "cultivation",
    growthCycleId: "",
    regimenId: "",
    selectedStages: [],
    status: "draft",
    materialAllocations: [],
    taskAllocations: [],
  };
}

export function usePlanForm(mode: "create" | "edit", basePath = "/plan-growth") {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const [dateWarning, setDateWarning] = useState<string | null>(null);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState("");

  const addPlan = usePlanStore((state) => state.addPlan);
  const updatePlan = usePlanStore((state) => state.updatePlan);
  const getPlanById = usePlanStore((state) => state.getPlanById);
  const seasons = useSeasonStore((state) => state.seasons);
  const { regions } = useRegionStore();
  const { growthCycles } = useGrowthCycleStore();
  const treatments = useTreatmentStore((state) => state.treatments);
  const amendmentRegimensRaw = useAmendmentRegimenStore((state) => state.regimens);

  const regimens = useMemo(() => {
    const mappedTreatments = treatments.map((t) => ({
      id: String(t.id),
      name: t.name,
      description: t.disease || t.name,
      type: "tri-benh" as const,
      provider: t.author || "Chưa rõ",
      category: t.disease || "Điều trị",
      crop: t.crop || "Tất cả",
      steps: t.procedures?.map((p: any) => ({
        id: String(p.id),
        day: p.startDay ? `Ngày ${p.startDay}` : `Ngày ${p.stepNumber}`,
        title: p.name,
        description: p.description,
      })) || [],
    }));

    const mappedAmendments = amendmentRegimensRaw.map((t) => ({
      id: String(t.id),
      name: t.name,
      description: t.soilIssue || t.name,
      type: "cai-tao-dat" as const,
      provider: t.authors?.[0]?.name || "Chưa rõ",
      category: t.soilIssue || "Cải tạo",
      crop: t.cropType || "Tất cả",
      steps: t.procedures?.map((p: any) => ({
        id: String(p.id),
        day: p.timing || `Ngày ${p.stepNumber}`,
        title: p.name,
        description: p.description,
      })) || [],
    }));

    return [...mappedTreatments, ...mappedAmendments];
  }, [treatments, amendmentRegimensRaw]);

  const getSeasonDurationParts = useCallback((season: { duration?: number } | null | undefined) => {
    if (!season || typeof season.duration !== "number") {
      return { years: "", months: "", days: "" };
    }

    return parseDaysToParts(season.duration);
  }, []);

  const plan = mode === "edit" ? getPlanById(Number(params.id)) : undefined;
  const initialSelectionState = useMemo(
    () =>
      mode === "edit" && plan
        ? reconstructSelectionsFromPlan(plan, regions)
        : null,
    [mode, plan, regions],
  );

  const [selections, setSelections] = useState<GeographicalSelection[]>(
    initialSelectionState?.selections || [],
  );
  const [formData, setFormData] = useState<PlanFormData>(() =>
    plan
      ? {
          code: plan.code || "",
          name: plan.name || "",
          description: plan.description || "",
          seasonId: plan.seasonId || "",
          seasonName: plan.seasonName || "",
          startDate: plan.startDate || "",
          endDate: plan.endDate || "",
          ...inferDurationFromDates(plan.startDate, plan.endDate),
          selectedRegionIds: plan.selectedRegionIds || [],
          selectedZoneIds: plan.selectedZoneIds || [],
          selectedPlotIds: plan.selectedPlotIds || [],
          crop: plan.crop || "",
          variety: plan.variety || "",
          purpose: plan.purpose || "cultivation",
          growthCycleId: plan.growthCycleId || "",
          regimenId: plan.regimenId || "",
          selectedStages: plan.selectedStages || [],
          materialAllocations:
            (plan.materialAllocations as MaterialAllocation[]) || [],
          taskAllocations: (plan.taskAllocations as TaskAllocation[]) || [],
          status: plan.status,
        }
      : createEmptyFormData(),
  );

  useEffect(() => {
    if (mode !== "edit" || !plan || regions.length === 0) return;

    setFormData({
      code: plan.code || "",
      name: plan.name || "",
      description: plan.description || "",
      seasonId: plan.seasonId || "",
      seasonName: plan.seasonName || "",
      startDate: plan.startDate || "",
      endDate: plan.endDate || "",
      ...inferDurationFromDates(plan.startDate, plan.endDate),
      selectedRegionIds: plan.selectedRegionIds || [],
      selectedZoneIds: plan.selectedZoneIds || [],
      selectedPlotIds: plan.selectedPlotIds || [],
      crop: plan.crop || "",
      variety: plan.variety || "",
      purpose: plan.purpose || "cultivation",
      growthCycleId: plan.growthCycleId || "",
      regimenId: plan.regimenId || "",
      selectedStages: plan.selectedStages || [],
      materialAllocations:
        (plan.materialAllocations as MaterialAllocation[]) || [],
      taskAllocations: (plan.taskAllocations as TaskAllocation[]) || [],
      status: plan.status,
    });
    setSelections(initialSelectionState?.selections || []);
    setSelectedEnterpriseId(initialSelectionState?.enterpriseId || "");
  }, [initialSelectionState, mode, plan, regions.length]);

  const selectionSummary = useMemo(
    () => summarizeSelections(selections, regions),
    [regions, selections],
  );

  const calculateArea = useCallback(
    () => calculateSelectedArea(formData, regions),
    [formData, regions],
  );

  const handleGeographicalConfirm = (
    newSelections: GeographicalSelection[],
  ) => {
    setSelections(newSelections);

    const nextSelectionState = deriveSelectionState(
      newSelections,
      regions,
      formData.crop,
      formData.variety,
    );

    setFormData((prev) => ({
      ...prev,
      ...nextSelectionState,
    }));
  };

  const handleSeasonChange = (seasonId: string) => {
    const season = seasons.find((item) => item.id === seasonId);
    if (!season) return;
    const durationParts = getSeasonDurationParts(season);

    setFormData((prev) => ({
      ...prev,
      seasonId: season.id,
      seasonName: season.name,
      code: mode === "create" ? buildAutoPlanCode(season.id, season.name) : prev.code,
      endDate:
        addDurationPartsToDate(prev.startDate, {
          years: prev.plannedDurationYears || durationParts.years,
          months: prev.plannedDurationMonths || durationParts.months,
          days: prev.plannedDurationDays || durationParts.days,
        }) || prev.endDate,
      plannedDurationYears: prev.plannedDurationYears || durationParts.years,
      plannedDurationMonths: prev.plannedDurationMonths || durationParts.months,
      plannedDurationDays: prev.plannedDurationDays || durationParts.days,
    }));
    setDateWarning(null);
  };

  const handleDurationPartChange = (
    part: "years" | "months" | "days",
    value: string,
  ) => {
    setFormData((prev) => {
      const nextParts = {
        years: part === "years" ? value : prev.plannedDurationYears,
        months: part === "months" ? value : prev.plannedDurationMonths,
        days: part === "days" ? value : prev.plannedDurationDays,
      };

      return {
        ...prev,
        plannedDurationYears: nextParts.years,
        plannedDurationMonths: nextParts.months,
        plannedDurationDays: nextParts.days,
        endDate:
          addDurationPartsToDate(prev.startDate, nextParts) || prev.endDate,
      };
    });
  };

  const handleStartDateChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      startDate: value,
      endDate:
        addDurationPartsToDate(value, {
          years: prev.plannedDurationYears,
          months: prev.plannedDurationMonths,
          days: prev.plannedDurationDays,
        }) || prev.endDate,
    }));
  };

  const handleAddMaterial = useCallback(
    (item: Omit<MaterialAllocation, "id">) => {
      setFormData((prev) => ({
        ...prev,
        materialAllocations: [
          ...prev.materialAllocations,
          { id: Date.now(), ...item },
        ],
      }));
    },
    [],
  );

  const handleRemoveMaterial = useCallback((id: number) => {
    setFormData((prev) => ({
      ...prev,
      materialAllocations: prev.materialAllocations.filter(
        (item) => item.id !== id,
      ),
    }));
  }, []);

  const handleAddTask = useCallback((item: Omit<TaskAllocation, "id">) => {
    setFormData((prev) => ({
      ...prev,
      taskAllocations: [...prev.taskAllocations, { id: Date.now(), ...item }],
    }));
  }, []);

  const handleRemoveTask = useCallback((id: number) => {
    setFormData((prev) => ({
      ...prev,
      taskAllocations: prev.taskAllocations.filter((item) => item.id !== id),
    }));
  }, []);

  const handleComplete = () => {
    const payload = {
      ...formData,
      area: calculateArea(),
      status: "active" as const,
    };

    if (mode === "edit" && params.id) {
      updatePlan(Number(params.id), payload as any);
      toast({
        title: "Thành công",
        description: `Đã cập nhật kế hoạch ${formData.name}`,
      });
      setLocation(`${basePath}/${params.id}`);
      return;
    }

    addPlan(payload as any);
    toast({
      title: "Thành công",
      description: `Đã tạo kế hoạch ${formData.name}`,
    });
    setLocation(basePath);
  };

  return {
    mode,
    plan,
    params,
    formData,
    setFormData,
    selections,
    setSelections,
    selectedEnterpriseId,
    setSelectedEnterpriseId,
    seasons,
    regions,
    regimens,
    growthCycles,
    selectionSummary,
    dateWarning,
    calculateArea,
    summarizeTaskSelections: (taskSelections: any[] | undefined) =>
      summarizeTaskSelections(taskSelections as any, regions),
    handleSeasonChange,
    handleDurationPartChange,
    handleStartDateChange,
    handleGeographicalConfirm,
    handleAddMaterial,
    handleRemoveMaterial,
    handleAddTask,
    handleRemoveTask,
    handleComplete,
    goBack:
    mode === "edit" && params.id
        ? () => setLocation(`${basePath}/${params.id}`)
        : () => setLocation(basePath),
    pageTitle: mode === "edit" ? "Chỉnh sửa Kế hoạch" : "Lập kế hoạch",
    pageDescription:
      mode === "edit" && plan
        ? `Cập nhật thông tin chi tiết cho kế hoạch ${plan.code}`
        : "Xây dựng lộ trình trồng trọt, phân bổ nguồn lực và giám sát",
    completeLabel: mode === "edit" ? "Lưu thay đổi" : "Kích hoạt Kế hoạch",
  };
}
