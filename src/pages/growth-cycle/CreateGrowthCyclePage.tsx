import { zodResolver } from "@hookform/resolvers/zod";
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
  Form,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
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
      cropId: "",
      variety: "",
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
    useCreateGrowthCycleForm();

  return (
    <AdminLayout
      isDev={true}
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
          <FormProvider {...form}>
            <Form {...form}>
              <GrowthCycleSteps
                schema={growthCycleFormSchema}
                varieties={varieties}
                crops={crops}
                onComplete={() => setConfirmOpen(true)}
                onCancel={() => setLocation("/growth-cycle")}
                isSubmitting={isSubmitting}
              />
            </Form>
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
                      {watchedScope === "crop" ? "Theo loại cây" : "Theo giống"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Loại cây:</span>
                    <span className="font-medium">{watchedCropId}</span>
                  </div>
                  {watchedScope === "variety" && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Giống cây:</span>
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
                    <span className="font-medium">{totalDays} ngày</span>
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
    </AdminLayout>
  );
}
