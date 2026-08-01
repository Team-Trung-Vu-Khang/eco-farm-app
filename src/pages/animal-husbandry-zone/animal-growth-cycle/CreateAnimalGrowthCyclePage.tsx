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
import { AnimalGrowthCycleSteps } from "./components/AnimalGrowthCycleSteps";
import { useCreateAnimalGrowthCycleForm } from "./hooks/useCreateAnimalGrowthCycleForm";
import {
  animalGrowthCycleFormSchema,
  type AnimalGrowthCycleFormValues,
} from "./schemas/animalGrowthCycleSchema";
import { parseDurationToDays } from "./utils/duration";

export default function CreateAnimalGrowthCyclePage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const form = useForm<AnimalGrowthCycleFormValues>({
    resolver: zodResolver(animalGrowthCycleFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      cropId: "",
      variety: "",
      totalDays: 0,
      scope: "crop",
      cycleType: "animal",
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
  const watchedCropId = watch("cropId");
  const watchedVariety = watch("variety");
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
    useCreateAnimalGrowthCycleForm();

  return (
    <PageWrapper
      title="Thêm mới chu kỳ sinh trưởng"
      description="Thiết lập các giai đoạn phát triển cho vật nuôi"
      actions={[
        <Button
          variant="outline"
          size="sm"
          className="-ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => setLocation("/animal-growth-cycle")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>,
      ]}
    >
      <Card>
        <CardContent className="p-6">
          <FormProvider {...form}>
            <AnimalGrowthCycleSteps
              schema={animalGrowthCycleFormSchema}
              varieties={varieties}
              crops={crops}
              onComplete={() => setConfirmOpen(true)}
              onCancel={() => setLocation("/animal-growth-cycle")}
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
                      {watchedScope === "crop" ? "Theo vật nuôi" : "Theo giống"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Vật nuôi:</span>
                    <span className="font-medium">
                      {crops.find((c) => String(c.id) === watchedCropId)
                        ?.name || watchedCropId}
                    </span>
                  </div>
                  {watchedScope === "variety" && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Giống vật nuôi:
                      </span>
                      <span className="font-medium">
                        {varieties.find(
                          (variety) => String(variety.id) === watchedVariety,
                        )?.name || watchedVariety}
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
