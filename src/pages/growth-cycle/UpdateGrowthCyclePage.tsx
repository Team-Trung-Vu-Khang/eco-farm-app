import { safeConvertLexicalToHtml } from "@/utils/commons";
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
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useRoute } from "wouter";
import {
  useCrops,
  useCropVarieties,
  useGrowthCycleTemplateById,
  useGrowthCycleTemplateMutations,
} from "../../features/foundation";
import { useFileUpload } from "../../features/storage";
import { GrowthCycleSteps } from "./components/GrowthCycleSteps";
import {
  growthCycleFormSchema,
  type GrowthCycleFormValues,
} from "./schemas/growthCycleSchema";
import { formatDaysToDuration, parseDurationToDays } from "./utils/duration";

export default function UpdateGrowthCyclePage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/growth-cycle/:id/edit");
  const { toast } = useToast();
  const { data: currentCycle, isLoading } = useGrowthCycleTemplateById(
    Number(params?.id),
    { enabled: !!params?.id },
  );
  const { updateTemplate } = useGrowthCycleTemplateMutations();
  const { items: crops } = useCrops();
  const { items: cropVarieties } = useCropVarieties();
  const { uploadFile } = useFileUpload();

  const form = useForm<GrowthCycleFormValues>({
    resolver: zodResolver(growthCycleFormSchema),
    mode: "onChange",
  });

  const { watch, reset } = form;
  const watchedScope = watch("scope");
  const watchedCropId = watch("cropId");
  const watchedVariety = watch("variety");
  const watchedStages = watch("stages") || [];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (currentCycle && !isLoaded) {
      const metadata: Record<string, unknown> = currentCycle.metadataJson || {};
      reset({
        name: currentCycle.name ?? "",
        cycleType: String(metadata.cycleType || "plant") as "plant" | "animal",
        scope: currentCycle.cropVarietyId ? "variety" : "crop",
        cropId: String(currentCycle.cropId),
        variety: currentCycle.cropVarietyId
          ? String(currentCycle.cropVarietyId)
          : "",
        totalDays: currentCycle.expectedDays || 0,
        stages: (currentCycle.stages || []).map((s) => {
          let usePdf = false;
          let content = "";
          let pdfFile = null;

          if (s.document) {
            if (s.document.type === "pdf") {
              usePdf = true;
              pdfFile = {
                name: s.document.fileName || "document.pdf",
                size: 0,
                url: s.document.fileUrl,
              };
            } else if (s.document.type === "editor") {
              content = s.document.content || "";
            }
          } else if (s.description && s.description !== s.name) {
            content = s.description; // fallback to legacy description
          }

          return {
            id: String(s.id),
            name: s.name,
            duration: formatDaysToDuration(s.durationDays || 0),
            usePdf: usePdf,
            content: content,
            pdfFile: pdfFile as any,
          };
        }),
      });
      setIsLoaded(true);
    }
  }, [currentCycle, reset, isLoaded]);

  const totalDays = useMemo(
    () =>
      watchedStages.reduce(
        (sum, stage) => sum + parseDurationToDays(String(stage.duration)),
        0,
      ) || 0,
    [watchedStages],
  );

  // Filtered varieties based on selected crop
  // const filteredVarieties = useMemo(() => {
  //   if (!watchedCropId) return [];
  //   return cropVarieties.filter((v) => String(v.cropId) === watchedCropId);
  // }, [watchedCropId, cropVarieties]);

  const varietyName =
    cropVarieties.find((variety) => String(variety.id) === watchedVariety)
      ?.name || watchedVariety;

  const handleComplete = async (values: GrowthCycleFormValues) => {
    if (!params?.id) return;

    setIsSubmitting(true);
    try {

      // Upload PDFs and prepare stages
      const preparedStages = await Promise.all(
        values.stages.map(async (stage, index) => {
          let documentData: any = undefined;

          if (stage.usePdf) {
            if (stage.pdfFile instanceof File) {
              const res = await uploadFile.mutateAsync({
                file: stage.pdfFile,
                folder: "growth-cycle-stages",
              });
              if (res.fileUrl) {
                documentData = {
                  type: "pdf",
                  name: "Tài liệu kỹ thuật",
                  fileUrl: res.fileUrl,
                  fileName: res.fileName || stage.pdfFile.name,
                };
              }
            } else if (stage.pdfFile && "url" in stage.pdfFile) {
              // Retain existing URL
              documentData = {
                type: "pdf",
                name: "Tài liệu kỹ thuật",
                fileUrl: stage.pdfFile.url,
                fileName: stage.pdfFile.name,
              };
            }
          } else {
            const html = (await safeConvertLexicalToHtml(stage.content)) || "";
            if (html && html !== "<p><br></p>") {
              documentData = {
                type: "editor",
                name: "Tài liệu kỹ thuật",
                content: html,
              };
            }
          }

          return {
            id: isNaN(Number(stage.id)) ? undefined : Number(stage.id), // Send ID if it exists for updates
            name: stage.name,
            durationDays: parseDurationToDays(String(stage.duration)),
            description: stage.name,
            document: documentData,
            displayOrder: index + 1,
          };
        }),
      );

      const metadataJson = { cycleType: values.cycleType };

      await updateTemplate.mutateAsync({
        id: Number(params.id),
        data: {
          code: currentCycle?.code || undefined,
          name: values.name.trim(),
          cropId: Number(values.cropId),
          cropVarietyId:
            values.scope === "variety" && values.variety
              ? Number(values.variety)
              : undefined,
          cropGroupId:
            crops.find((c) => String(c.id) === values.cropId)?.cropGroupId || 1, // Fallback
          expectedDays: totalDays,
          description: currentCycle?.description || "Chu kỳ sinh trưởng",
          stages: preparedStages,
          displayOrder: currentCycle?.displayOrder || 1,
          status: "active",
          metadataJson: metadataJson,
        },
      });

      toast({
        title: "Thành công",
        description: "Đã cập nhật chu kỳ sinh trưởng",
      });
      setLocation("/growth-cycle");
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi trong quá trình tải tệp hoặc lưu dữ liệu",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !isLoaded)
    return (
      <AdminLayout isDev={true} title="Đang tải..." description="Vui lòng chờ">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout
      isDev={true}
      title="Cập nhật chu kỳ sinh trưởng"
      description={`Chỉnh sửa thông tin cho ${varietyName || watchedCropId}`}
      actions={[
        <Button
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
              varieties={cropVarieties}
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
                      {varietyName || watchedCropId}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Phạm vi:</span>
                    <span className="font-medium">
                      {watchedScope === "crop" ? "Theo loại cây" : "Theo giống"}
                    </span>
                  </div>
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
              Xác nhận cập nhật
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
