import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useUserGrowthCycleTemplateMutations,
  useProductionSubjects,
  useProductionSubjectVariants,
} from "../../../../features/foundation";
import { useFileUpload } from "../../../../features/storage";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import { parseDurationToDays } from "../utils/duration";
import type { AnimalGrowthCycleFormValues } from "../schemas/animalGrowthCycleSchema";

export function useCreateAnimalGrowthCycleForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { createTemplate } = useUserGrowthCycleTemplateMutations();
  const { items: crops } = useProductionSubjects({ params: { domainCode: "LIVESTOCK", size: 100 } });
  const { items: cropVarieties } = useProductionSubjectVariants({ params: { domainCode: "LIVESTOCK", size: 100 } });
  const { uploadFile } = useFileUpload();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (values: AnimalGrowthCycleFormValues) => {
    setIsSubmitting(true);
    try {
      // Upload PDFs and prepare stages
      const preparedStages = await Promise.all(
        values.stages.map(async (stage, index) => {
          let documents: any[] = [];
          let description = "";

          if (stage.usePdf && stage.pdfFile instanceof File) {
            const res = await uploadFile.mutateAsync({
              file: stage.pdfFile,
              folder: "animal-growth-cycle-stages",
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
          } else {
            description = (await safeConvertLexicalToHtml(stage.content)) || "";
          }

          return {
            name: stage.name,
            durationDays: parseDurationToDays(String(stage.duration)),
            description: description,
            documents: documents,
            displayOrder: index + 1,
          };
        }),
      );

      const metadataJson = { cycleType: values.cycleType };

      const cropIds = values.cropIds.map(Number);
      const varietyIds = values.varietyIds.map(Number);
      const scopeType = values.scope === "group"
        ? "SUBJECT_GROUP"
        : values.scope === "variety"
          ? "SUBJECT_VARIANT"
          : "SUBJECT";

      await createTemplate.mutateAsync({
        domainCode: "LIVESTOCK",
        name: values.name.trim(),
        scopeType,
        subjectGroupIds: values.scope === "group" ? values.groupIds.map(Number) : [],
        subjectIds: values.scope === "crop" ? cropIds : [],
        subjectVariantIds: values.scope === "variety" ? varietyIds : [],
        description: "Chu kỳ sinh trưởng",
        stages: preparedStages,
        displayOrder: 1,
        status: "active",
        metadataJson: metadataJson,
      });

      toast({
        title: "Thành công",
        description: "Đã tạo chu kỳ sinh trưởng mới",
      });
      setLocation("/animal-growth-cycle");
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

  return {
    varieties: cropVarieties,
    crops,
    handleComplete,
    setLocation,
    isSubmitting,
  };
}
