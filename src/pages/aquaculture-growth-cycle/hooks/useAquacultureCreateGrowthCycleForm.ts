import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useUserGrowthCycleTemplateMutations,
  useProductionSubjects,
  useProductionSubjectVariants,
} from "@/features/foundation";
import { useFileUpload } from "@/features/storage";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import { parseDurationToDays } from "@/pages/growth-cycle/utils/duration";
import type { AnimalGrowthCycleFormValues } from "@/pages/animal-husbandry-zone/animal-growth-cycle/schemas/animalGrowthCycleSchema";

export function useAquacultureCreateGrowthCycleForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { createTemplate } = useUserGrowthCycleTemplateMutations();
  const { items: crops } = useProductionSubjects({
    params: { domainCode: "AQUACULTURE", size: 100 },
  });
  const { items: cropVarieties } = useProductionSubjectVariants({
    params: { domainCode: "AQUACULTURE", size: 100 },
  });
  const { uploadFile } = useFileUpload();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (values: AnimalGrowthCycleFormValues) => {
    setIsSubmitting(true);
    try {
      const preparedStages = await Promise.all(
        values.stages.map(async (stage, index) => {
          let documents: any[] = [];
          let description = "";

          if (stage.usePdf && stage.pdfFile instanceof File) {
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

      const groupIds = values.groupIds.map(Number).filter(Number.isFinite);
      const cropIds = values.cropIds.map(Number).filter(Number.isFinite);
      const varietyIds = values.varietyIds.map(Number).filter(Number.isFinite);
      const scopeType = values.scope === "group" ? "SUBJECT_GROUP" : values.scope === "variety" ? "SUBJECT_VARIANT" : "SUBJECT";

      await createTemplate.mutateAsync({
        domainCode: "AQUACULTURE",
        name: values.name.trim(),
        scopeType,
        productionSubjectGroupIds: values.scope === "group" ? groupIds : [],
        productionSubjectIds: values.scope === "crop" ? cropIds : [],
        productionSubjectVariantIds: values.scope === "variety" ? varietyIds : [],
        description: "Chu kỳ nuôi thủy sản",
        stages: preparedStages,
        displayOrder: 1,
        status: "active",
        metadataJson: metadataJson,
      });

      toast({
        title: "Thành công",
        description: "Đã tạo chu kỳ nuôi thủy sản mới",
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

  return {
    crops,
    varieties: cropVarieties,
    handleComplete,
    setLocation,
    isSubmitting,
  };
}
