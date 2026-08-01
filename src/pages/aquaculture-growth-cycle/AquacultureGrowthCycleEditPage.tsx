import PageWrapper from "@/components/PageWrapper";
import {
  useProductionSubjects,
  useProductionSubjectVariants,
  useUserGrowthCycleTemplateById,
  useUserGrowthCycleTemplateMutations,
} from "@/features/foundation";
import { useFileUpload } from "@/features/storage";
import {
  animalGrowthCycleFormSchema,
  type AnimalGrowthCycleFormValues,
} from "@/pages/animal-husbandry-zone/animal-growth-cycle/schemas/animalGrowthCycleSchema";
import {
  formatDaysToDuration,
  parseDurationToDays,
} from "@/pages/growth-cycle/utils/duration";
import { safeConvertLexicalToHtml } from "@/utils/commons";
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
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useRoute } from "wouter";
import { AquacultureGrowthCycleSteps } from "./components/AquacultureGrowthCycleSteps";

export default function AquacultureGrowthCycleEditPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/aquaculture-growth-cycle/:id/edit");
  const { toast } = useToast();

  const numericId = Number(
    String(params?.id).replace(/^(foundation-|user-)/, ""),
  );

  const { data: currentCycle, isLoading } = useUserGrowthCycleTemplateById(
    numericId,
    { enabled: !!numericId },
  );
  const { updateTemplate } = useUserGrowthCycleTemplateMutations();
  const { items: crops } = useProductionSubjects({
    params: { domainCode: "AQUACULTURE", size: 100 },
  });
  const { items: cropVarieties } = useProductionSubjectVariants({
    params: { domainCode: "AQUACULTURE", size: 100 },
  });
  const { uploadFile } = useFileUpload();

  const form = useForm<AnimalGrowthCycleFormValues>({
    resolver: zodResolver(animalGrowthCycleFormSchema),
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
      const cropIdVal = currentCycle.productionSubject?.id;
      const varietyIdVal = currentCycle.productionSubjectVariant?.id;
      const totalDaysVal =
        currentCycle.stages?.reduce(
          (sum: number, s: any) => sum + (s.durationDays || 0),
          0,
        ) ?? 0;

      reset({
        name: currentCycle.name ?? "",
        cycleType: String(metadata.cycleType || "plant") as any,
        scope: varietyIdVal ? "variety" : "crop",
        cropId: cropIdVal ? String(cropIdVal) : "",
        variety: varietyIdVal ? String(varietyIdVal) : "",
        totalDays: totalDaysVal,
        stages: (currentCycle.stages || []).map((s: any) => {
          let usePdf = false;
          let content = "";
          let pdfFile = null;

          const doc = s.documents?.[0];
          if (doc) {
            usePdf = true;
            pdfFile = {
              name: doc.name || "document.pdf",
              size: doc.sizeBytes || 0,
              url: doc.fileUrl,
            };
          } else {
            content = s.description || "";
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

  const varietyName =
    cropVarieties.find((variety) => String(variety.id) === watchedVariety)
      ?.name || watchedVariety;

  const handleComplete = async (values: AnimalGrowthCycleFormValues) => {
    if (!numericId) return;

    setIsSubmitting(true);
    try {
      // Upload PDFs and prepare stages
      const preparedStages = await Promise.all(
        values.stages.map(async (stage, index) => {
          let documents: any[] = [];
          let description = "";

          if (stage.usePdf) {
            if (stage.pdfFile instanceof File) {
              const res = await uploadFile.mutateAsync({
                file: stage.pdfFile,
                folder: "aquaculture-growth-cycle-stages",
              });
              if (res.fileUrl) {
                documents = [
                  {
                    documentType: "pdf",
                    name: stage.pdfFile.name,
                    fileUrl: res.fileUrl,
                    fileName: res.fileName || stage.pdfFile.name,
                    mimeType: "application/pdf",
                    sizeBytes: stage.pdfFile.size,
                    displayOrder: 1,
                  },
                ];
              }
            } else if (stage.pdfFile && "url" in stage.pdfFile) {
              documents = [
                {
                  documentType: "pdf",
                  name: stage.pdfFile.name,
                  fileUrl: stage.pdfFile.url,
                  fileName: stage.pdfFile.name,
                  mimeType: "application/pdf",
                  sizeBytes: stage.pdfFile.size || 0,
                  displayOrder: 1,
                },
              ];
            }
          } else {
            description = (await safeConvertLexicalToHtml(stage.content)) || "";
          }

          return {
            id: isNaN(Number(stage.id)) ? undefined : Number(stage.id),
            name: stage.name,
            durationDays: parseDurationToDays(String(stage.duration)),
            description: description,
            documents: documents,
            displayOrder: index + 1,
          };
        }),
      );

      const metadataJson = { cycleType: values.cycleType };

      const cropIdVal = Number(values.cropId);
      const varietyIdVal =
        values.scope === "variety" && values.variety
          ? Number(values.variety)
          : undefined;

      await updateTemplate.mutateAsync({
        id: numericId,
        data: {
          domainCode: "AQUACULTURE",
          code: currentCycle?.code || undefined,
          name: values.name.trim(),
          productionSubjectId: cropIdVal,
          productionSubjectVariantId: varietyIdVal ?? null,
          description: currentCycle?.description || "Chu kỳ sinh trưởng",
          stages: preparedStages,
          displayOrder: currentCycle?.displayOrder || 1,
          status: "active",
          metadataJson: metadataJson,
        },
      });

      toast({
        title: "Thành công",
        description: "Đã cập nhật chu kỳ nuôi trồng thủy sản",
      });
      setLocation("/aquaculture-growth-cycle");
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
      <PageWrapper title="Đang tải..." description="Vui lòng chờ">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </PageWrapper>
    );

  return (
    <PageWrapper
      title="Cập nhật chu kỳ nuôi trồng thủy sản"
      description={`Chỉnh sửa thông tin cho ${varietyName || watchedCropId}`}
      actions={[
        <Button
          variant="outline"
          size="sm"
          className="-ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => setLocation("/aquaculture-growth-cycle")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>,
      ]}
    >
      <Card>
        <CardContent className="p-6">
          <FormProvider {...form}>
            <AquacultureGrowthCycleSteps
              schema={animalGrowthCycleFormSchema}
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
            <AlertDialogTitle>
              Xác nhận cập nhật chu kỳ nuôi trồng thủy sản
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
                      {watchedScope === "crop"
                        ? "Theo loài nuôi"
                        : "Theo giống"}
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
    </PageWrapper>
  );
}
