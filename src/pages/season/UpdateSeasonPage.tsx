import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
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
import { FormProvider, useForm } from "react-hook-form";
import {
  useSeasonById,
  useSeasonMutations,
} from "@/features/master-data/hooks/useSeasons";
import { GrowthCycleSteps } from "../growth-cycle/components/GrowthCycleSteps";
import { AnimalGrowthCycleSteps } from "../animal-husbandry-zone/animal-growth-cycle/components/AnimalGrowthCycleSteps";
import { AquacultureGrowthCycleSteps } from "../aquaculture-growth-cycle/components/AquacultureGrowthCycleSteps";
import {
  growthCycleFormSchema,
  type GrowthCycleFormValues,
} from "../growth-cycle/schemas/growthCycleSchema";
import { animalGrowthCycleFormSchema } from "../animal-husbandry-zone/animal-growth-cycle/schemas/animalGrowthCycleSchema";
import {
  formatDaysToDuration,
  parseDurationToDays,
} from "../growth-cycle/utils/duration";
import {
  useProductionSubjects,
  useProductionSubjectVariants,
} from "../../features/foundation";
import { useFileUpload } from "../../features/storage";
import { safeConvertLexicalToHtml } from "@/utils/commons";

export default function UpdateSeasonPage() {
  const [, params] = useRoute("/season/:id/edit");

  if (!params?.id) {
    return null;
  }

  return <UpdateSeasonContent id={Number(params.id)} />;
}

function UpdateSeasonContent({ id }: { id: number }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: season, isLoading } = useSeasonById(id);
  const { updateSeason } = useSeasonMutations();

  const domainCode = season?.domainCode || "CROP";

  const { items: crops } = useProductionSubjects({
    params: { domainCode, size: 100 },
    enabled: !!season,
  });
  const { items: cropVarieties } = useProductionSubjectVariants({
    params: { domainCode, size: 100 },
    enabled: !!season,
  });
  const { uploadFile } = useFileUpload();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const activeSchema =
    domainCode === "CROP" ? growthCycleFormSchema : animalGrowthCycleFormSchema;

  const form = useForm<any>({
    resolver: zodResolver(activeSchema),
    mode: "onChange",
  });

  const { watch, reset, handleSubmit } = form;
  const watchedScope = watch("scope");
  const watchedCropId = watch("cropId");
  const watchedVariety = watch("variety");
  const watchedStages = watch("stages") || [];

  useEffect(() => {
    if (season && !isLoaded) {
      const cropIdVal = season.productionSubject?.id;
      const varietyIdVal = season.productionSubjectVariant?.id;
      const totalDaysVal =
        season.stages?.reduce(
          (sum: number, s: any) => sum + (s.durationDays || 0),
          0,
        ) ?? 0;

      reset({
        name: season.name ?? "",
        cycleType: domainCode === "CROP" ? "plant" : "animal",
        scope: varietyIdVal ? "variety" : "crop",
        cropId: cropIdVal ? String(cropIdVal) : "",
        variety: varietyIdVal ? String(varietyIdVal) : "",
        totalDays: totalDaysVal,
        stages: (season.stages || []).map((s: any) => {
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
  }, [season, reset, isLoaded, domainCode]);

  const totalDays = useMemo(
    () =>
      watchedStages.reduce(
        (sum, stage) => sum + parseDurationToDays(String(stage.duration)),
        0,
      ) || 0,
    [watchedStages],
  );

  const subjectName =
    crops.find((c) => String(c.id) === watchedCropId)?.name || watchedCropId;

  const varietyName =
    cropVarieties.find((variety) => String(variety.id) === watchedVariety)
      ?.name || watchedVariety;

  const handleComplete = async (values: any) => {
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
                folder: "season-stages",
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

      const cropIdVal = Number(values.cropId);
      const varietyIdVal =
        values.scope === "variety" && values.variety
          ? Number(values.variety)
          : undefined;

      await updateSeason.mutateAsync({
        id: id,
        data: {
          domainCode: domainCode,
          code: season?.code || undefined,
          name: values.name.trim(),
          productionSubjectId: cropIdVal,
          productionSubjectVariantId: varietyIdVal ?? null,
          description: season?.description || "Mùa vụ canh tác",
          stages: preparedStages,
          displayOrder: season?.displayOrder || 1,
          status: "active",
        },
      });

      toast({
        title: "Thành công",
        description: "Đã cập nhật mùa vụ",
      });
      setLocation("/season");
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
      setConfirmOpen(false);
    }
  };

  if (isLoading || !isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!season) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy mùa vụ</h2>
          <Button variant="link" onClick={() => setLocation("/season")}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const domainTitles = {
    CROP: {
      title: "Cập nhật mùa vụ",
      description: `Chỉnh sửa mùa vụ: ${season.name} (Trồng trọt)`,
    },
    LIVESTOCK: {
      title: "Cập nhật vụ nuôi",
      description: `Chỉnh sửa vụ nuôi: ${season.name} (Chăn nuôi)`,
    },
    AQUACULTURE: {
      title: "Cập nhật vụ nuôi thủy sản",
      description: `Chỉnh sửa vụ nuôi thủy sản: ${season.name} (Nuôi trồng thủy sản)`,
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="-ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => setLocation("/season")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {domainTitles[domainCode].title}
          </h1>
          <p className="text-muted-foreground">
            {domainTitles[domainCode].description}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <FormProvider {...form}>
            {domainCode === "CROP" && (
              <GrowthCycleSteps
                schema={growthCycleFormSchema}
                varieties={cropVarieties}
                crops={crops}
                onComplete={() => setConfirmOpen(true)}
                onCancel={() => setLocation("/season")}
                isSubmitting={isSubmitting}
              />
            )}
            {domainCode === "LIVESTOCK" && (
              <AnimalGrowthCycleSteps
                schema={animalGrowthCycleFormSchema}
                varieties={cropVarieties}
                crops={crops}
                onComplete={() => setConfirmOpen(true)}
                onCancel={() => setLocation("/season")}
                isSubmitting={isSubmitting}
              />
            )}
            {domainCode === "AQUACULTURE" && (
              <AquacultureGrowthCycleSteps
                schema={animalGrowthCycleFormSchema}
                onComplete={() => setConfirmOpen(true)}
                onCancel={() => setLocation("/season")}
                isSubmitting={isSubmitting}
              />
            )}
          </FormProvider>
        </CardContent>
      </Card>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => !isSubmitting && setConfirmOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận cập nhật mùa vụ</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3" asChild>
              <div>
                <p>Bạn có chắc chắn muốn cập nhật mùa vụ này?</p>
                <div className="rounded-lg bg-slate-50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Loại mùa vụ:</span>
                    <span className="font-semibold text-slate-800">
                      {domainCode === "CROP"
                        ? "Trồng trọt"
                        : domainCode === "LIVESTOCK"
                          ? "Chăn nuôi"
                          : "Nuôi trồng thủy sản"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Phạm vi:</span>
                    <span className="font-medium">
                      {watchedScope === "crop"
                        ? "Theo đối tượng"
                        : "Theo giống / dòng"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Đối tượng:</span>
                    <span className="font-medium">{subjectName || "-"}</span>
                  </div>
                  {watchedScope === "variety" && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Giống / dòng:
                      </span>
                      <span className="font-medium">{varietyName || "-"}</span>
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
                form.handleSubmit(handleComplete)();
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
    </div>
  );
}
