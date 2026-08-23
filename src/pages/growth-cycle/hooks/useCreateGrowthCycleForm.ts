import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useUserGrowthCycleTemplateMutations,
  useProductionSubjects,
  useProductionSubjectVariants,
} from "../../../features/foundation";
import { useFileUpload } from "../../../features/storage";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import { parseDurationToDays } from "../utils/duration";
import { getDummyCropGroupName } from "../utils/dummyCropGroups";
import type { GrowthCycleFormValues } from "../schemas/growthCycleSchema";

export function useCreateGrowthCycleForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { createTemplate } = useUserGrowthCycleTemplateMutations();
  const { items: crops } = useProductionSubjects({ params: { domainCode: "CROP", size: 100 } });
  const { items: cropVarieties } = useProductionSubjectVariants({ params: { domainCode: "CROP", size: 100 } });
  const { uploadFile } = useFileUpload();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (values: GrowthCycleFormValues) => {
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

      // UI-only multi-select for now — the backend still only accepts a
      // single production subject/variant per template, so only the first
      // pick of whichever scope is active gets sent. For "group" (a
      // client-side-only grouping, not a real production subject) we fall
      // back to the first crop belonging to that group.
      let cropIdVal: number;
      let varietyIdVal: number | undefined;

      if (values.scope === "variety" && values.varietyIds[0]) {
        const variety = cropVarieties.find(
          (v) => String(v.id) === values.varietyIds[0],
        );
        cropIdVal = Number(variety?.subject?.id ?? crops[0]?.id ?? 0);
        varietyIdVal = Number(values.varietyIds[0]);
      } else if (values.scope === "group" && values.groupIds[0]) {
        const matchingCrop = crops.find(
          (c) => getDummyCropGroupName(c.id) === values.groupIds[0],
        );
        cropIdVal = Number(matchingCrop?.id ?? crops[0]?.id ?? 0);
        varietyIdVal = undefined;
      } else {
        cropIdVal = Number(values.cropIds[0] ?? crops[0]?.id ?? 0);
        varietyIdVal = undefined;
      }

      await createTemplate.mutateAsync({
        domainCode: "CROP",
        name: values.name.trim(),
        productionSubjectId: cropIdVal,
        productionSubjectVariantId: varietyIdVal ?? null,
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

  return {
    varieties: cropVarieties,
    crops,
    handleComplete,
    setLocation,
    isSubmitting,
  };
}
