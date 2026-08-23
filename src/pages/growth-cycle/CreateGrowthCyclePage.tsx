import PageWrapper from "@/components/PageWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import {
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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { GrowthCycleSteps } from "./components/GrowthCycleSteps";
import { useCreateGrowthCycleForm } from "./hooks/useCreateGrowthCycleForm";
import {
  growthCycleFormSchema,
  type GrowthCycleFormValues,
} from "./schemas/growthCycleSchema";
import { parseDurationToDays } from "./utils/duration";

export default function CreateGrowthCyclePage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const form = useForm<GrowthCycleFormValues>({
    resolver: zodResolver(growthCycleFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      groupIds: [],
      cropIds: [],
      varietyIds: [],
      totalDays: 0,
      scope: "crop",
      cycleType: "plant",
      stages: [
        {
          id: "1",
          content: "",
          duration: "",
          usePdf: false,
          name: "Giai đoạn 1",
        },
      ],
    },
  });

  const { watch } = form;
  const watchedScope = watch("scope");
  const watchedGroupIds = watch("groupIds") || [];
  const watchedCropIds = watch("cropIds") || [];
  const watchedVarietyIds = watch("varietyIds") || [];
  const watchedStages = watch("stages") || [];

  const totalDays = useMemo(
    () =>
      watchedStages.reduce(
        (sum, stage) => sum + parseDurationToDays(String(stage.duration)),
        0,
      ),
    [watchedStages],
  );

  const { varieties, crops, handleComplete, setLocation, isSubmitting } =
    useCreateGrowthCycleForm();

  return (
    <PageWrapper
      title="Thêm mới chu kỳ sinh trưởng"
      description="Thiết lập các giai đoạn phát triển cho cây trồng"
      actions={[
        <Button
          key="back-button"
          variant="outline"
          size="sm"
          className="-ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => setLocation("/growth-cycle")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>,
      ]}
    >
      <Card>
        <CardContent className="p-6">
          <FormProvider {...form}>
            <GrowthCycleSteps
              schema={growthCycleFormSchema}
              varieties={varieties}
              crops={crops}
              onComplete={() => setConfirmOpen(true)}
              onCancel={() => setLocation("/growth-cycle")}
              isSubmitting={isSubmitting}
            />
          </FormProvider>
        </CardContent>
      </Card>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => !isSubmitting && setConfirmOpen(open)}
      >
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
                      {watchedScope === "group"
                        ? "Theo nhóm cây trồng"
                        : watchedScope === "crop"
                          ? "Theo cây trồng"
                          : "Theo giống cây trồng"}
                    </span>
                  </div>
                  {watchedScope === "group" && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Nhóm đã chọn:
                      </span>
                      <span className="font-medium">
                        {watchedGroupIds.length} nhóm
                      </span>
                    </div>
                  )}
                  {watchedScope === "crop" && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Cây trồng đã chọn:
                      </span>
                      <span className="font-medium">
                        {crops
                          .filter((crop) =>
                            watchedCropIds.includes(String(crop.id)),
                          )
                          .map((crop) => crop.name)
                          .join(", ") || "-"}
                      </span>
                    </div>
                  )}
                  {watchedScope === "variety" && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Giống đã chọn:
                      </span>
                      <span className="font-medium">
                        {varieties
                          .filter((variety) =>
                            watchedVarietyIds.includes(String(variety.id)),
                          )
                          .map((variety) => variety.name)
                          .join(", ") || "-"}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Số giai đoạn:</span>
                    <span className="font-medium">{watchedStages.length}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      Tổng thời gian:
                    </span>
                    <span className="font-medium">{totalDays}</span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              onClick={(e) => {
                e.preventDefault();
                handleComplete(form.getValues());
              }}
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Xác nhận tạo mới
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
