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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AquacultureGrowthCycleSteps } from "./components/AquacultureGrowthCycleSteps";
import {
  AQUACULTURE_GROWTH_CYCLE_SPECIES,
  AQUACULTURE_GROWTH_CYCLE_VARIETIES,
} from "./data/aquacultureGrowthCycleData";
import { useAquacultureCreateGrowthCycleForm } from "./hooks/useAquacultureCreateGrowthCycleForm";
import {
  growthCycleFormSchema,
  type GrowthCycleFormValues,
} from "../growth-cycle/schemas/growthCycleSchema";
import { parseDurationToDays } from "../growth-cycle/utils/duration";

export default function CreateAquacultureGrowthCyclePage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const form = useForm<GrowthCycleFormValues>({
    resolver: zodResolver(growthCycleFormSchema),
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

  const selectedSpecies = AQUACULTURE_GROWTH_CYCLE_SPECIES.find(
    (item) => item.id === watchedCropId,
  );
  const selectedVariety = AQUACULTURE_GROWTH_CYCLE_VARIETIES.find(
    (item) => item.id === watchedVariety,
  );

  const { handleComplete, setLocation, isSubmitting } =
    useAquacultureCreateGrowthCycleForm();

  return (
    <AdminLayout
      isDev={true}
      title="Thêm mới chu kỳ thủy hải sản"
      description="Thiết lập chu kỳ nuôi cho tôm, cá, nghêu và các đối tượng thủy sản khác"
      actions={[
        <Button
          variant="outline"
          size="sm"
          className="-ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => setLocation("/aquaculture-growth-cycle")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>,
      ]}
    >
      <Card>
        <CardContent className="p-6">
          <FormProvider {...form}>
            <AquacultureGrowthCycleSteps
              schema={growthCycleFormSchema}
              onComplete={() => setConfirmOpen(true)}
              onCancel={() => setLocation("/aquaculture-growth-cycle")}
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
            <AlertDialogTitle>Xác nhận tạo chu kỳ thủy hải sản</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3" asChild>
              <div>
                <p>Bạn có chắc chắn muốn thêm chu kỳ thủy hải sản mới này?</p>
                <div className="space-y-2 rounded-lg bg-slate-50 p-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Phạm vi:</span>
                    <span className="font-medium">
                      {watchedScope === "crop"
                        ? "Theo loài nuôi"
                        : "Theo giống / dòng"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Loài nuôi:</span>
                    <span className="font-medium">
                      {selectedSpecies?.name || watchedCropId || "-"}
                    </span>
                  </div>
                  {watchedScope === "variety" && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Giống / dòng:</span>
                      <span className="font-medium">
                        {selectedVariety?.name || watchedVariety || "-"}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Số giai đoạn:</span>
                    <span className="font-medium">{watchedStages.length}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Tổng thời gian:</span>
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
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận tạo mới
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
