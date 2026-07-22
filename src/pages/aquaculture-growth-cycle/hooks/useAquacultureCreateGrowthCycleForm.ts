import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useGrowthCycleTemplateMutations } from "@/features/foundation";
import { useFileUpload } from "@/features/storage";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import { parseDurationToDays } from "@/pages/growth-cycle/utils/duration";
import type { GrowthCycleFormValues } from "@/pages/growth-cycle/schemas/growthCycleSchema";

export function useAquacultureCreateGrowthCycleForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { createTemplate } = useGrowthCycleTemplateMutations();
  const { uploadFile } = useFileUpload();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (values: GrowthCycleFormValues) => {
    setIsSubmitting(true);
    try {
      const preparedStages = await Promise.all(
        values.stages.map(async (stage, index) => {
          let documentData: any = undefined;

          if (stage.usePdf && stage.pdfFile instanceof File) {
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
            name: stage.name,
            durationDays: parseDurationToDays(String(stage.duration)),
            description: stage.name,
            document: documentData,
            displayOrder: index + 1,
          };
        }),
      );

      await createTemplate.mutateAsync({
        name: values.name.trim(),
        cropId: Number(values.cropId),
        cropVarietyId:
          values.scope === "variety" && values.variety
            ? Number(values.variety)
            : undefined,
        cropGroupId: 1,
        expectedDays: values.stages.reduce(
          (sum, s) => sum + parseDurationToDays(String(s.duration)),
          0,
        ),
        description: "Chu kỳ thủy hải sản",
        stages: preparedStages,
        displayOrder: 1,
        status: "active",
        metadataJson: { cycleType: values.cycleType },
      });

      toast({
        title: "Thành công",
        description: "Đã tạo chu kỳ thủy hải sản mới",
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
    handleComplete,
    setLocation,
    isSubmitting,
  };
}
