import { useCallback, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import {
  AdminLayout,
  StepperForm,
  useToast,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useAmendmentPlanStore, {
  type AllocationItem,
} from "../../stores/useAmendmentPlanStore";
import usePersonnelStore from "../../stores/usePersonnelStore";
import useRegimenStore from "../../stores/useRegimenStore";
import useSeasonStore from "@/stores/useSeasonStore";
import useRegionStore from "@/stores/useRegionStore";
import { PersonnelSelectDialog } from "./components/PersonnelSelectDialog";
import { AmendmentPlanConfirmationStep } from "./components/AmendmentPlanConfirmationStep";
import { AmendmentPlanGeneralStep } from "./components/AmendmentPlanGeneralStep";
import { AmendmentPlanProcessStep } from "./components/AmendmentPlanProcessStep";
import { AmendmentPlanScopeStep } from "./components/AmendmentPlanScopeStep";
import type { GeographicalSelection } from "./types";
import {
  AMENDMENT_PROCESSES,
  buildSelectionsFromPlan,
  buildSelectionSummary,
  calculateSelectedArea,
  createAllocationItem,
  createInitialAmendmentPlanFormData,
  deriveSelectionState,
  getSelectedStages,
} from "./utils";

export default function AmendmentPlanCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [, params] = useRoute("/amendment-plan/:id/edit");
  const isEdit = !!params?.id;

  const addPlan = useAmendmentPlanStore((state) => state.addPlan);
  const updatePlan = useAmendmentPlanStore((state) => state.updatePlan);
  const getPlanById = useAmendmentPlanStore((state) => state.getPlanById);
  const regimens = useRegimenStore((state) => state.regimens);
  const personnel = usePersonnelStore((state) => state.personnel);
  const { seasons } = useSeasonStore();
  const { regions } = useRegionStore();

  const existingPlan =
    isEdit && params?.id ? getPlanById(Number(params.id)) : undefined;
  const initialEditState = useMemo(() => {
    if (!existingPlan) {
      return {
        formData: createInitialAmendmentPlanFormData(),
        selections: [] as GeographicalSelection[],
        selectedEnterpriseId: "",
      };
    }

    const reconstructedSelections = buildSelectionsFromPlan(
      existingPlan,
      regions,
    );

    return {
      formData: {
        code: existingPlan.code,
        name: existingPlan.name,
        technician: existingPlan.technician,
        priority: existingPlan.priority || "medium",
        description: existingPlan.description || "",
        seasonId: existingPlan.seasonId || "",
        selectedRegionId: existingPlan.selectedRegionId || "",
        selectedZoneIds: existingPlan.selectedZoneIds || [],
        crop: existingPlan.crop || "",
        variety: existingPlan.variety || "",
        selectedPlotIds: existingPlan.selectedPlotIds || [],
        currentPH: existingPlan.currentPH || "",
        targetPH: existingPlan.targetPH || "",
        targetIssue: existingPlan.target_issue,
        purpose: existingPlan.processId ? "amendment" : "treatment",
        processId: existingPlan.processId || "",
        regimenId: existingPlan.regimenId || "",
        selectedStages: getSelectedStages(
          existingPlan.processId || "",
          existingPlan.regimenId || "",
          regimens,
        ),
        allocations: existingPlan.allocations || [],
        startDate: existingPlan.startDate,
        endDate: existingPlan.endDate,
        budget: String(existingPlan.budget),
      },
      selections: reconstructedSelections.selections,
      selectedEnterpriseId: reconstructedSelections.selectedEnterpriseId,
    };
  }, [existingPlan, regimens, regions]);

  const [personnelDialogOpen, setPersonnelDialogOpen] = useState(false);
  const [selections, setSelections] = useState<GeographicalSelection[]>(
    initialEditState.selections,
  );
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState(
    initialEditState.selectedEnterpriseId,
  );
  const [formData, setFormData] = useState(initialEditState.formData);

  const calculateArea = useCallback(
    () => calculateSelectedArea(regions, formData.selectedPlotIds),
    [formData.selectedPlotIds, regions],
  );

  const selectionSummary = useMemo(
    () => buildSelectionSummary(selections, regions),
    [regions, selections],
  );

  const selectedProcess = useMemo(
    () =>
      AMENDMENT_PROCESSES.find((process) => process.id === formData.processId),
    [formData.processId],
  );

  const handleGeographicalConfirm = useCallback(
    (nextSelections: GeographicalSelection[]) => {
      setSelections(nextSelections);

      const nextSelectionState = deriveSelectionState(
        nextSelections,
        regions,
        formData.crop,
        formData.variety,
      );

      setFormData((current) => ({
        ...current,
        ...nextSelectionState,
      }));
    },
    [formData.crop, formData.variety, regions],
  );

  const handleProcessChange = (id: string) => {
    const selected = AMENDMENT_PROCESSES.find((process) => process.id === id);
    if (!selected) return;

    setFormData((current) => ({
      ...current,
      processId: id,
      regimenId: "",
      selectedStages: selected.stages,
      name: current.name || `Kế hoạch ${selected.name.toLowerCase()}`,
    }));
  };

  const handleAddAllocation = useCallback(
    (item: Omit<AllocationItem, "id">) => {
      setFormData((current) => ({
        ...current,
        allocations: [...current.allocations, createAllocationItem(item)],
      }));
    },
    [],
  );

  const handleRemoveAllocation = useCallback((id: number) => {
    setFormData((current) => ({
      ...current,
      allocations: current.allocations.filter((item) => item.id !== id),
    }));
  }, []);

  const handleComplete = () => {
    let currentStatus: "planning" | "in_progress" | "completed" | "cancelled" =
      "planning";

    if (isEdit && params?.id) {
      const existingPlan = getPlanById(Number(params.id));
      if (existingPlan) {
        currentStatus = existingPlan.status;
      }
    }

    const zone =
      regions.find(
        (region) => String(region.id) === String(formData.selectedRegionId),
      )?.name || "";

    const planData = {
      code: formData.code,
      name: formData.name,
      zone,
      target_issue: formData.targetIssue,
      technician: formData.technician,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: currentStatus,
      area: Number(calculateArea()),
      budget: Number(formData.budget) || 0,
      methodCount: formData.allocations.length,
      priority: formData.priority,
      seasonId: formData.seasonId,
      description: formData.description,
      currentPH: formData.currentPH,
      targetPH: formData.targetPH,
      processId: formData.processId,
      regimenId: formData.regimenId,
      selectedRegionId: formData.selectedRegionId,
      selectedZoneIds: formData.selectedZoneIds,
      selectedPlotIds: formData.selectedPlotIds,
      crop: formData.crop,
      variety: formData.variety,
      purpose: formData.purpose,
      allocations: formData.allocations,
    };

    if (isEdit && params?.id) {
      updatePlan(Number(params.id), planData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật kế hoạch cải tạo",
      });
    } else {
      addPlan(planData);
      toast({
        title: "Thành công",
        description: "Đã tạo kế hoạch cải tạo",
      });
    }

    setLocation("/amendment-plan");
  };

  const steps: Step[] = [
    {
      id: "general",
      title: "Thông tin chung",
      description: "Định danh và mức độ ưu tiên",
      content: (
        <AmendmentPlanGeneralStep
          formData={formData}
          personnel={personnel}
          seasons={seasons.map((season) => ({
            id: season.id,
            name: season.name,
          }))}
          setFormData={setFormData}
          setPersonnelDialogOpen={setPersonnelDialogOpen}
        />
      ),
      isValid: !!formData.code && !!formData.name,
    },
    {
      id: "scope",
      title: "Phạm vi & Cây trồng",
      description: "Chọn đất và giống cây",
      content: (
        <AmendmentPlanScopeStep
          calculateArea={calculateArea}
          formData={formData}
          handleGeographicalConfirm={handleGeographicalConfirm}
          regions={regions}
          selectedEnterpriseId={selectedEnterpriseId}
          selectionSummary={selectionSummary}
          selections={selections}
          setFormData={setFormData}
          setSelectedEnterpriseId={setSelectedEnterpriseId}
          setSelections={setSelections}
        />
      ),
      isValid: formData.selectedPlotIds.length > 0 && !!formData.crop,
    },
    {
      id: "process",
      title: "Quy trình & Giai đoạn",
      description: "Lộ trình cải tạo",
      content: (
        <AmendmentPlanProcessStep
          formData={formData}
          handleAddAllocation={handleAddAllocation}
          handleProcessChange={handleProcessChange}
          handleRemoveAllocation={handleRemoveAllocation}
          regimens={regimens}
          selectedProcess={selectedProcess}
          setFormData={setFormData}
        />
      ),
      isValid:
        formData.purpose === "amendment"
          ? !!formData.processId
          : !!formData.regimenId,
    },
    {
      id: "confirmation",
      title: "Xác nhận & Kích hoạt",
      description: "Tổng quan kế hoạch",
      content: (
        <AmendmentPlanConfirmationStep
          calculateArea={calculateArea}
          formData={formData}
          regions={regions}
          seasons={seasons.map((season) => ({
            id: season.id,
            name: season.name,
          }))}
          selectedProcess={selectedProcess}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title={isEdit ? "Cập nhật kế hoạch cải tạo" : "Lập kế hoạch cải tạo mới"}
      description="Xây dựng phương án xử lý đất, phân bổ nguồn lực và giám sát thực hiện"
    >
      <div className="mx-auto max-w-5xl">
        <StepperForm
          completeLabel={isEdit ? "Cập nhật" : "Kích hoạt Kế hoạch"}
          onCancel={() => setLocation("/amendment-plan")}
          onComplete={handleComplete}
          steps={steps}
        />
      </div>

      <PersonnelSelectDialog
        onConfirm={(name) =>
          setFormData((current) => ({ ...current, technician: name }))
        }
        onOpenChange={setPersonnelDialogOpen}
        open={personnelDialogOpen}
        selectedName={formData.technician}
      />
    </AdminLayout>
  );
}
