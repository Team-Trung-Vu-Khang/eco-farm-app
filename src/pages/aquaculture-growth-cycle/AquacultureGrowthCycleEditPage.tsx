import { safeConvertLexicalToHtml } from "@/utils/commons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminLayout,
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
  useUserGrowthCycleTemplateById,
  useUserGrowthCycleTemplateMutations,
} from "@/features/foundation";
import { useFileUpload } from "@/features/storage";
import { AquacultureGrowthCycleSteps } from "./components/AquacultureGrowthCycleSteps";
import {
  animalGrowthCycleFormSchema,
  type AnimalGrowthCycleFormValues,
} from "@/pages/animal-husbandry-zone/animal-growth-cycle/schemas/animalGrowthCycleSchema";
import { formatDaysToDuration, parseDurationToDays } from "@/pages/growth-cycle/utils/duration";

export default function AquacultureGrowthCycleEditPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/aquaculture-growth-cycle/:id/edit");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const numericId = Number(String(params?.id).replace(/^(foundation-|user-)/, ""));

  const { data: currentCycle, isLoading } = useUserGrowthCycleTemplateById(
    numericId,
    { enabled: !!numericId },
  );
  const { updateTemplate } = useUserGrowthCycleTemplateMutations();
  const { uploadFile } = useFileUpload();

  const form = useForm<AnimalGrowthCycleFormValues>({
    resolver: zodResolver(animalGrowthCycleFormSchema),
    mode: "onChange",
  });

  const { reset } = form;

  useEffect(() => {
    if (currentCycle && !isLoaded) {
      const metadata: Record<string, unknown> = currentCycle.metadataJson || {};
      const cropIdVal = currentCycle.productionSubject?.id;
      const varietyIdVal = currentCycle.productionSubjectVariant?.id;
      const totalDaysVal = currentCycle.stages?.reduce((sum: number, s: any) => sum + (s.durationDays || 0), 0) ?? 0;

      reset({
        name: currentCycle.name ?? "",
        cycleType: String(metadata.cycleType || "aquaculture") as "plant" | "animal",
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

  const handleSubmit = async (values: AnimalGrowthCycleFormValues) => {
    if (!numericId) return;

    setIsSubmitting(true);
    try {
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
          description: currentCycle?.description || "Chu kỳ nuôi thủy sản",
          stages: preparedStages,
          displayOrder: currentCycle?.displayOrder || 1,
          status: "active",
          metadataJson: { cycleType: values.cycleType },
        },
      });

      toast({
        title: "Thành công",
        description: "Đã lưu thay đổi chu kỳ thủy hải sản",
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

  if (isLoading || !isLoaded) {
    return (
      <AdminLayout isDev={true} title="Đang tải..." description="Vui lòng chờ">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      isDev={true}
      title="Chỉnh sửa chu kỳ thủy hải sản"
      description={`Cập nhật lại thông tin cho ${currentCycle.name}`}
      actions={[
        <Button variant="outline" onClick={() => setLocation("/aquaculture-growth-cycle")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      ]}
    >
      <Card>
        <CardContent className="p-6">
          <FormProvider {...form}>
            <AquacultureGrowthCycleSteps
              schema={animalGrowthCycleFormSchema}
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
