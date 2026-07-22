import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useRoute } from "wouter";
import {
  growthCycleFormSchema,
  type GrowthCycleFormValues,
} from "@/pages/growth-cycle/schemas/growthCycleSchema";
import { AquacultureGrowthCycleSteps } from "./components/AquacultureGrowthCycleSteps";
import { aquacultureGrowthCycles } from "./data/mocks";

export default function AquacultureGrowthCycleEditPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/aquaculture-growth-cycle/:id/edit");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCycle = useMemo(
    () => aquacultureGrowthCycles.find((item) => item.id === params?.id) ?? null,
    [params?.id],
  );

  const form = useForm<GrowthCycleFormValues>({
    resolver: zodResolver(growthCycleFormSchema),
    mode: "onChange",
    defaultValues: currentCycle
      ? {
          name: currentCycle.name,
          cropId: currentCycle.cropId || "",
          variety: currentCycle.variety || "",
          totalDays: currentCycle.totalDays || 0,
          scope: currentCycle.scope || "crop",
          cycleType: "animal",
          stages: currentCycle.stages.map((stage, index) => ({
            id: stage.id || String(index + 1),
            name: stage.name,
            duration: stage.duration || "",
            usePdf: stage.usePdf ?? false,
            content: stage.content || "",
          })),
        }
      : {
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

  const watchedStages = form.watch("stages") || [];

  const handleSubmit = async (values: GrowthCycleFormValues) => {
    setIsSubmitting(true);
    try {
      // Demo page: keep the edit flow local and return to list after success.
      void values;
      toast({
        title: "Thành công",
        description: "Đã lưu thay đổi chu kỳ thủy hải sản",
      });
      setLocation("/aquaculture-growth-cycle");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentCycle) {
    return (
      <AdminLayout
        isDev={true}
        title="Không tìm thấy chu kỳ"
        description="Chu kỳ thủy hải sản bạn chọn không tồn tại."
        actions={
          <Button variant="outline" onClick={() => setLocation("/aquaculture-growth-cycle")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        }
      >
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Không có dữ liệu phù hợp để chỉnh sửa.
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      isDev={true}
      title="Chỉnh sửa chu kỳ thủy hải sản"
      description={`Cập nhật lại thông tin cho ${currentCycle.name}`}
      actions={
        <Button variant="outline" onClick={() => setLocation("/aquaculture-growth-cycle")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      }
    >
      <Card>
        <CardContent className="p-6">
          <FormProvider {...form}>
            <AquacultureGrowthCycleSteps
              schema={growthCycleFormSchema}
              onComplete={form.handleSubmit(handleSubmit)}
              onCancel={() => setLocation("/aquaculture-growth-cycle")}
              isSubmitting={isSubmitting}
            />
          </FormProvider>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
