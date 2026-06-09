import {
  AdminLayout,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Card,
  CardContent,
  StepperForm,
  useToast,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft } from "lucide-react";
import type { CreateGrowthCycleForm, GrowthStage } from "./types/types";
import { CROP_OPTIONS } from "../../constants/crops";
import useGrowthCycleStore from "../../stores/useGrowthCycleStore";
import useVarietyStore from "../../stores/useVarietyStore";
import { initialEditorValue } from "./data/mocks";
import { GrowthCycleBasicInfoStep } from "./components/steps/GrowthCycleBasicInfoStep";
import { GrowthCycleStagesStep } from "./components/steps/GrowthCycleStagesStep";
import { GrowthCycleConfirmStep } from "./components/steps/GrowthCycleConfirmStep";

function createInitialFormData(): CreateGrowthCycleForm {
  return {
    scope: "crop",
    cropId: "",
    variety: "",
    totalDays: 0,
    stages: [
      {
        id: "1",
        name: "Giai đoạn 1",
        duration: 0,
        usePdf: false,
        content: initialEditorValue,
      },
    ],
  };
}

export default function UpdateGrowthCyclePage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/growth-cycle/:id/edit");
  const { toast } = useToast();
  const { growthCycles, updateGrowthCycle } = useGrowthCycleStore();
  const { varieties } = useVarietyStore();
  const currentCycle =
    match && params?.id
      ? growthCycles.find((cycle) => cycle.id === params.id)
      : undefined;

  const [formData, setFormData] = useState<CreateGrowthCycleForm>(() => {
    if (!currentCycle) return createInitialFormData();

    return {
      scope: currentCycle.scope || "variety",
      cropId: currentCycle.cropId,
      variety: currentCycle.variety,
      totalDays: currentCycle.totalDays,
      stages: currentCycle.stages,
    };
  });

  const totalDays = useMemo(
    () =>
      formData.stages.reduce(
        (sum, stage) => sum + (Number(stage.duration) || 0),
        0,
      ),
    [formData.stages],
  );

  // Filtered varieties based on selected crop
  const filteredVarieties = useMemo(() => {
    if (!formData.cropId) return [];
    return varieties.filter((v) => v.crop === formData.cropId);
  }, [formData.cropId, varieties]);

  const varietyName =
    varieties.find((variety) => variety.id === formData.variety)?.varietyName ||
    formData.variety;

  const handleComplete = () => {
    if (!params?.id) return;

    const cropName =
      CROP_OPTIONS.find((c) => c.name === formData.cropId)?.name ||
      formData.cropId;
    const resolvedVarietyName =
      varieties.find((variety) => variety.id === formData.variety)
        ?.varietyName || formData.variety;

    updateGrowthCycle(params.id, {
      name: `Chu kỳ sinh trưởng ${cropName}${resolvedVarietyName ? ` - ${resolvedVarietyName}` : ""}`,
      scope: formData.scope,
      cropId: formData.cropId,
      cropName: cropName,
      variety: formData.variety,
      totalDays,
      stages: formData.stages.map((s) => ({
        ...s,
        pdfFile:
          s.pdfFile instanceof File
            ? { name: s.pdfFile.name, size: s.pdfFile.size }
            : s.pdfFile,
      })),
    });

    toast({
      title: "Thành công",
      description: "Đã cập nhật chu kỳ sinh trưởng",
    });
    setLocation("/growth-cycle");
  };

  const onAddStage = () => {
    const nextId = (formData.stages.length + 1).toString();
    setFormData((prev) => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          id: nextId,
          name: `Giai đoạn ${nextId}`,
          duration: 0,
          usePdf: false,
          content: initialEditorValue,
        },
      ],
    }));
  };

  const onRemoveStage = (id: string) => {
    if (formData.stages.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      stages: prev.stages.filter((s) => s.id !== id),
    }));
  };

  const updateStage = (id: string, updates: Partial<GrowthStage>) => {
    setFormData((prev) => ({
      ...prev,
      stages: prev.stages.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const steps: Step[] = [
    {
      id: "basic",
      title: "Bước 1",
      description: "Thông tin chung",
      content: (
        <GrowthCycleBasicInfoStep
          formData={formData}
          filteredVarieties={filteredVarieties}
          onScopeChange={(scope) =>
            setFormData((prev) => ({ ...prev, scope, variety: "" }))
          }
          onCropChange={(cropId) =>
            setFormData((prev) => ({ ...prev, cropId, variety: "" }))
          }
          onVarietyChange={(variety) =>
            setFormData((prev) => ({ ...prev, variety }))
          }
        />
      ),
      isValid:
        formData.cropId !== "" &&
        (formData.scope === "crop" || formData.variety !== ""),
    },
    {
      id: "stages",
      title: "Bước 2",
      description: "Danh sách giai đoạn",
      content: (
        <GrowthCycleStagesStep
          stages={formData.stages}
          onAddStage={onAddStage}
          onRemoveStage={onRemoveStage}
          onUpdateStage={updateStage}
        />
      ),
      isValid: formData.stages.every((stage) => stage.name.trim() !== ""),
    },
    {
      id: "confirm",
      title: "Bước 3",
      description: "Xác nhận",
      content: (
        <GrowthCycleConfirmStep
          formData={{ ...formData, totalDays }}
          varieties={varieties}
        />
      ),
      isValid: true,
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title="Cập nhật chu kỳ sinh trưởng"
      description={`Chỉnh sửa thông tin cho ${varietyName || formData.cropId}`}
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => setLocation("/growth-cycle")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={() => setConfirmOpen(true)}
            onCancel={() => setLocation("/growth-cycle")}
            completeLabel="Lưu thay đổi"
          />
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xác nhận cập nhật chu kỳ sinh trưởng
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3" asChild>
              <div>
                <p>Bạn có chắc chắn muốn lưu thay đổi cho chu kỳ này?</p>
                <div className="rounded-lg bg-slate-50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Chu kỳ:</span>
                    <span className="font-medium">
                      {varietyName || formData.cropId}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Phạm vi:</span>
                    <span className="font-medium">
                      {formData.scope === "crop"
                        ? "Theo loại cây"
                        : "Theo giống"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Số giai đoạn:</span>
                    <span className="font-medium">
                      {formData.stages.length}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      Tổng thời gian:
                    </span>
                    <span className="font-medium">{totalDays} ngày</span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleComplete}>
              Xác nhận cập nhật
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
