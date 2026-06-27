import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation, useParams } from "wouter";
import {
  useCropVarietyById,
  useCropVarietyMutations,
} from "../../../features/foundation";
import { useFileUpload } from "../../../features/storage";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import { useRef, useMemo, useState } from "react";
import type { VarietyFoundationFormValues } from "../schemas/varietyFoundationSchema";

function parseDurationToDays(duration: string): number | undefined {
  if (!duration) return undefined;
  let totalDays = 0;

  const yearMatch = duration.match(/(\d+)\s*năm/i);
  if (yearMatch) totalDays += parseInt(yearMatch[1], 10) * 365;

  const monthMatch = duration.match(/(\d+)\s*tháng/i);
  if (monthMatch) totalDays += parseInt(monthMatch[1], 10) * 30;

  const dayMatch = duration.match(/(\d+)\s*ngày/i);
  if (dayMatch) totalDays += parseInt(dayMatch[1], 10);

  if (totalDays === 0) {
    const asNum = Number(duration);
    if (!isNaN(asNum) && asNum > 0) return asNum;
    return undefined;
  }

  return totalDays;
}

function formatDaysToDuration(days: number | undefined): string {
  if (!days) return "";
  let remaining = days;
  const years = Math.floor(remaining / 365);
  remaining %= 365;
  const months = Math.floor(remaining / 30);
  remaining %= 30;

  const parts = [];
  if (years > 0) parts.push(`${years} năm`);
  if (months > 0) parts.push(`${months} tháng`);
  if (remaining > 0) parts.push(`${remaining} ngày`);

  if (parts.length === 0) return "";
  return parts.join(" ");
}

export function useVarietyFoundationEditForm() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const varietyId = id ? parseInt(id, 10) : 0;
  const { data: existingData, isLoading: isLoadingVariety } =
    useCropVarietyById(varietyId, { enabled: !!varietyId });

  const { updateCropVariety } = useCropVarietyMutations();
  const { uploadFile } = useFileUpload();

  const uploadedFilesCache = useRef<
    Map<File, { fileUrl: string; fileName?: string }>
  >(new Map());

  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues =
    useMemo((): Partial<VarietyFoundationFormValues> | null => {
      if (!existingData) return null;

      let metadata: any = {};
      if (existingData.metadataJson) {
        try {
          const meta = existingData.metadataJson || {};
          metadata = meta;
        } catch (e) {
          console.error("Failed to parse metadataJson");
        }
      }

      const docs = existingData.documents || [];
      const pdfDoc = docs.find((d) => d.type === "pdf");
      const editorDoc = docs.find((d) => d.type === "editor");

      let contentType: "pdf" | "editor" = "editor";
      if (pdfDoc) contentType = "pdf";

      return {
        varietyFoundationCode: existingData.code || "",
        varietyFoundationName: existingData.name || "",
        scientificName: metadata.scientificName || "",
        crop: String(existingData.cropId),
        origin: existingData.origin || "",
        growthDuration: formatDaysToDuration(existingData.growthDurationDays),
        averageYield:
          existingData.avgYieldFrom || existingData.avgYieldTo
            ? `${existingData.avgYieldFrom || 0}-${existingData.avgYieldTo || 0}`
            : "",
        description: existingData.description || "",
        illustration: metadata.illustrationUrl || null,
        contentType,
        pdfFile: pdfDoc?.fileUrl
          ? new File([], pdfDoc.fileName || pdfDoc.name || "document.pdf", {
              type: "application/pdf",
            })
          : (null as any),
        editorContent: editorDoc?.content || "",
      };
    }, [existingData]);

  const handleComplete = async (formData: VarietyFoundationFormValues) => {
    if (!varietyId) return;
    setIsSubmitting(true);

    try {
      let illustrationUrl = formData.illustration as unknown as
        | string
        | undefined;
      if (formData.illustration instanceof File) {
        if (uploadedFilesCache.current.has(formData.illustration)) {
          illustrationUrl = uploadedFilesCache.current.get(
            formData.illustration,
          )?.fileUrl;
        } else {
          const res = await uploadFile.mutateAsync({
            file: formData.illustration,
            folder: "varieties-illustrations",
          });
          illustrationUrl = res.fileUrl;
          if (illustrationUrl) {
            uploadedFilesCache.current.set(formData.illustration, {
              fileUrl: illustrationUrl,
            });
          }
        }
      } else if (formData.illustration === null) {
        illustrationUrl = undefined;
      }

      let pdfUrl: string | undefined = undefined;
      let pdfName: string | undefined = undefined;

      if (
        formData.contentType === "pdf" &&
        formData.pdfFile instanceof File &&
        formData.pdfFile.size > 0
      ) {
        if (uploadedFilesCache.current.has(formData.pdfFile)) {
          const cached = uploadedFilesCache.current.get(formData.pdfFile);
          pdfUrl = cached?.fileUrl;
          pdfName = cached?.fileName;
        } else {
          const res = await uploadFile.mutateAsync({
            file: formData.pdfFile,
            folder: "varieties-documents",
          });
          pdfUrl = res.fileUrl;
          pdfName = res.fileName || formData.pdfFile.name;
          if (pdfUrl) {
            uploadedFilesCache.current.set(formData.pdfFile, {
              fileUrl: pdfUrl,
              fileName: pdfName,
            });
          }
        }
      } else if (formData.contentType === "pdf" && existingData) {
        const existingPdf = existingData.documents?.find(
          (d) => d.type === "pdf",
        );
        if (existingPdf) {
          pdfUrl = existingPdf.fileUrl;
          pdfName = existingPdf.fileName || existingPdf.name;
        }
      }

      const editorContent = await safeConvertLexicalToHtml(
        formData.editorContent,
      );

      const documents = [];

      if (formData.contentType === "pdf" && pdfUrl) {
        documents.push({
          type: "pdf",
          name: pdfName || "Tài liệu kỹ thuật",
          fileUrl: pdfUrl,
          fileName: pdfName,
        });
      } else if (formData.contentType === "editor" && editorContent) {
        documents.push({
          type: "editor",
          name: "Kỹ thuật canh tác",
          content: editorContent,
        });
      }

      const metadataJson = {
        illustrationUrl,
        scientificName: formData.scientificName,
      };

      const payload = {
        code: formData.varietyFoundationCode,
        name: formData.varietyFoundationName,
        cropId: Number(formData.crop),
        description: formData.description,
        origin: formData.origin,
        growthDurationDays: parseDurationToDays(formData.growthDuration || ""),
        avgYieldFrom: formData.averageYield
          ? Number(formData.averageYield.split("-")[0]) || undefined
          : undefined,
        avgYieldTo: formData.averageYield
          ? Number(formData.averageYield.split("-")[1]) || undefined
          : undefined,
        status: "active" as const,
        metadataJson,
        documents,
      };

      updateCropVariety.mutate(
        { id: varietyId, data: payload as any },
        {
          onSuccess: () => {
            setIsSubmitting(false);
            toast({
              title: "Thành công",
              description: `Đã cập nhật giống cây (nền tảng) "${formData.varietyFoundationName}"`,
            });
            setLocation("/variety-foundation");
          },
          onError: (err: any) => {
            setIsSubmitting(false);
            toast({
              variant: "destructive",
              title: "Lỗi",
              description:
                err?.response?.data?.message ||
                err?.message ||
                "Không thể cập nhật giống cây (nền tảng)",
            });
          },
        },
      );
    } catch (err: any) {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: err?.message || "Đã xảy ra lỗi khi cập nhật",
      });
    }
  };

  const handleCancel = () => {
    setLocation("/variety-foundation");
  };

  return {
    initialValues,
    handleComplete,
    handleCancel,
    isLoadingVariety,
    isSubmitting,
  };
}
