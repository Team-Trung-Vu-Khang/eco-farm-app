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
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useCreateGrowthCycleForm } from "./hooks/useCreateGrowthCycleForm";
import { GrowthCycleBasicInfoStep } from "./components/steps/GrowthCycleBasicInfoStep";
import { GrowthCycleStagesStep } from "./components/steps/GrowthCycleStagesStep";
import { GrowthCycleConfirmStep } from "./components/steps/GrowthCycleConfirmStep";

export default function CreateGrowthCyclePage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const {
    formData,
    setFormData,
    totalDays,
    filteredVarieties,
    varieties,
    handleComplete,
    onAddStage,
    onRemoveStage,
    updateStage,
    setLocation,
  } = useCreateGrowthCycleForm();

  const steps: Step[] = useMemo(
    () => [
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
    ],
    [
      filteredVarieties,
      formData,
      onAddStage,
      onRemoveStage,
      setFormData,
      totalDays,
      updateStage,
      varieties,
    ],
  );

  return (
    <AdminLayout
      title="Thêm mới chu kỳ sinh trưởng"
      description="Thiết lập các giai đoạn phát triển cho cây trồng"
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
            completeLabel="Hoàn thành"
          />
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận tạo chu kỳ sinh trưởng</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3" asChild>
              <div>
                <p>Bạn có chắc chắn muốn thêm chu kỳ sinh trưởng mới này?</p>
                <div className="rounded-lg bg-slate-50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Phạm vi:</span>
                    <span className="font-medium">
                      {formData.scope === "crop" ? "Theo loại cây" : "Theo giống"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Loại cây:</span>
                    <span className="font-medium">{formData.cropId}</span>
                  </div>
                  {formData.scope === "variety" && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Giống cây:</span>
                      <span className="font-medium">
                        {varieties.find((variety) => variety.id === formData.variety)
                          ?.varietyName || formData.variety}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Số giai đoạn:</span>
                    <span className="font-medium">{formData.stages.length}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Tổng thời gian:</span>
                    <span className="font-medium">{totalDays} ngày</span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleComplete}>
              Xác nhận tạo mới
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
