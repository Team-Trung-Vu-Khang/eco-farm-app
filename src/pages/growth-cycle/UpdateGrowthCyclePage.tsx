import PageWrapper from "@/components/PageWrapper";
import { useCatalog } from "@/features/foundation";
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
import {
  useProductionSubjects,
  useProductionSubjectVariants,
  useUserGrowthCycleTemplateById,
  useUserGrowthCycleTemplateMutations,
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

  const numericId = Number(
    String(params?.id).replace(/^(foundation-|user-)/, ""),
  );

  const { data: currentCycle, isLoading } = useUserGrowthCycleTemplateById(
    numericId,
    { enabled: !!numericId },
  );
  const { updateTemplate } = useUserGrowthCycleTemplateMutations();
  const { items: crops } = useProductionSubjects({
    params: { domainCode: "CROP", size: 100 },
  });
  const { items: cropVarieties } = useProductionSubjectVariants({
    params: { domainCode: "CROP", size: 100 },
  });
  const { items: cropGroups } = useCatalog("crop-groups", {
    params: { page: 0, size: 100, status: "active" },
  });
  const { uploadFile } = useFileUpload();

  const form = useForm<GrowthCycleFormValues>({
    resolver: zodResolver(growthCycleFormSchema),
    mode: "onChange",
  });

  const { watch, reset } = form;
  const watchedScope = watch("scope");
  const watchedName = watch("name");
  const watchedGroupIds = watch("groupIds") || [];
  const watchedCropIds = watch("cropIds") || [];
  const watchedVarietyIds = watch("varietyIds") || [];
  const watchedStages = watch("stages") || [];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (currentCycle && !isLoaded) {
      const metadata: Record<string, unknown> = currentCycle.metadataJson || {};
      const cropIds = (currentCycle.productionSubjects || [])
        .map((item: { id?: number }) => item.id)
        .filter((id: number | undefined): id is number => id != null);
      const varietyIds = (currentCycle.productionSubjectVariants || [])
        .map((item: { id?: number }) => item.id)
        .filter((id: number | undefined): id is number => id != null);
      const groupIds = (currentCycle.productionSubjectGroups || [])
        .map((item: { id?: number }) => item.id)
        .filter((id: number | undefined): id is number => id != null);
      groupIds.push(...(currentCycle.productionSubjectGroupIds || []));
      cropIds.push(...(currentCycle.productionSubjectIds || []));
      varietyIds.push(...(currentCycle.productionSubjectVariantIds || []));
      // Keep the legacy fallback so an already cached old response can still
      // be opened while the new Season response is rolling out.
      const legacyCropId = currentCycle.productionSubject?.id;
      const legacyVarietyId = currentCycle.productionSubjectVariant?.id;
      if (cropIds.length === 0 && legacyCropId) cropIds.push(legacyCropId);
      if (varietyIds.length === 0 && legacyVarietyId) {
        varietyIds.push(legacyVarietyId);
      }
      const totalDaysVal =
        currentCycle.stages?.reduce(
          (sum: number, s: any) => sum + (s.durationDays || 0),
          0,
        ) ?? 0;

      reset({
        name: currentCycle.name ?? "",
        cycleType: String(metadata.cycleType || "plant") as "plant" | "animal",
        scope:
          currentCycle.scopeType === "SUBJECT_GROUP"
            ? "group"
            : varietyIds.length > 0
              ? "variety"
              : "crop",
        groupIds: groupIds.map(String),
        cropIds: cropIds.map(String),
        varietyIds: varietyIds.map(String),
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

  const groupNames = watchedGroupIds.map(
    (id) => cropGroups.find((group) => String(group.id) === id)?.name || id,
  );

  const handleComplete = async (values: GrowthCycleFormValues) => {
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
                folder: "growth-cycle-stages",
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

      // UI-only multi-select for now — the backend still only accepts a
      // single production subject/variant per template, so only the first
      // pick of whichever scope is active gets sent. For "group" (a
      // client-side-only grouping, not a real production subject) we fall
      // back to the first crop belonging to that group.
      const scopePayload =
        values.scope === "group"
          ? {
              scopeType: "SUBJECT_GROUP" as const,
              productionSubjectGroupIds: values.groupIds.map(Number),
              productionSubjectIds: [],
              productionSubjectVariantIds: [],
            }
          : values.scope === "variety"
            ? {
                scopeType: "SUBJECT_VARIANT" as const,
                productionSubjectGroupIds: [],
                productionSubjectIds: [],
                productionSubjectVariantIds: values.varietyIds.map(Number),
              }
            : {
                scopeType: "SUBJECT" as const,
                productionSubjectGroupIds: [],
                productionSubjectIds: values.cropIds.map(Number),
                productionSubjectVariantIds: [],
              };

      await updateTemplate.mutateAsync({
        id: numericId,
        data: {
          domainCode: "CROP",
          code: currentCycle?.code || undefined,
          name: values.name.trim(),
          ...scopePayload,
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
      <PageWrapper title="Đang tải..." description="Vui lòng chờ">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </PageWrapper>
    );

  return (
    <PageWrapper
      title="Cập nhật chu kỳ sinh trưởng"
      description={`Chỉnh sửa thông tin cho ${watchedName || "chu kỳ này"}`}
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
                    <span className="text-muted-foreground">Tên chu kỳ:</span>
                    <span className="font-medium">
                      {watchedName || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      {watchedScope === "group"
                        ? "Nhóm cây trồng:"
                        : watchedScope === "crop"
                          ? "Cây trồng:"
                          : "Giống cây trồng:"}
                    </span>
                    <span className="font-medium">
                      {(watchedScope === "group"
                        ? groupNames
                        : watchedScope === "crop"
                          ? watchedCropIds.map(
                              (id) =>
                                crops.find((crop) => String(crop.id) === id)
                                  ?.name || id,
                            )
                          : watchedVarietyIds.map(
                              (id) =>
                                cropVarieties.find(
                                  (variety) => String(variety.id) === id,
                                )?.name || id,
                            )
                      ).join(", ") || "-"}
                    </span>
                  </div>
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
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Số giai đoạn:</span>
                    <span className="font-medium">
                      {watchedStages.length} giai đoạn
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      Tổng thời gian:
                    </span>
                    <span className="font-medium">
                      {formatDaysToDuration(totalDays) || "0 ngày"}
                    </span>
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
