import { isContaintHtmlTag, safeConvertLexicalToHtml } from "@/utils/commons";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  useCropVarietyById,
  useCropVarietyMutations,
  useCrops,
} from "../../../features/foundation";
import { useFileUpload } from "../../../features/storage";
import { initialEditorValue } from "../../docs/mocks";
import { MAX_IMAGE_SIZE } from "../data/constants";
import type { CreateVarietyFoundationForm } from "../types/types";

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

interface UseVarietyFoundationFormPageOptions {
  mode: "create" | "edit";
}

export function useVarietyFoundationFormPage({
  mode,
}: UseVarietyFoundationFormPageOptions) {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const varietyId = mode === "edit" && params?.id ? Number(params.id) : 0;
  const { data: existingData, isLoading: isFetching } = useCropVarietyById(
    varietyId,
    { enabled: !!varietyId },
  );
  const { createCropVariety, updateCropVariety } = useCropVarietyMutations();
  const { uploadFile } = useFileUpload();

  const [formData, setFormData] = useState<CreateVarietyFoundationForm>({
    varietyFoundationCode: "",
    varietyFoundationName: "",
    scientificName: "",
    crop: "",
    origin: "",
    growthDuration: "",
    averageYield: "",
    description: "",
    illustration: null,
    contentType: "editor",
    pdfFile: null,
    editorContent: "",
  });

  const [illustrationPreview, setIllustrationPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const uploadedFilesCache = useRef<
    Map<File, { fileUrl: string; fileName?: string }>
  >(new Map());

  useEffect(() => {
    if (mode === "edit" && existingData) {
      let metadata: any = {};
      if (existingData.metadataJson) {
        try {
          metadata =
            typeof existingData.metadataJson === "string"
              ? JSON.parse(existingData.metadataJson)
              : existingData.metadataJson;
        } catch (e) {
          console.error("Failed to parse metadataJson");
        }
      }

      const docs = existingData.documents || [];
      const pdfDoc = docs.find((d) => d.type === "pdf");
      const editorDoc = docs.find((d) => d.type === "editor");

      let contentType: "pdf" | "editor" = "editor";
      if (pdfDoc) contentType = "pdf";

      setFormData({
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
      });

      if (metadata.illustrationUrl) {
        setIllustrationPreview(metadata.illustrationUrl);
      }
    }
  }, [existingData, mode]);

  const updateField = <K extends keyof CreateVarietyFoundationForm>(
    key: K,
    value: CreateVarietyFoundationForm[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onPickIllustration = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Lỗi", description: "Vui lòng chọn file ảnh." });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast({ title: "Lỗi", description: "Ảnh quá lớn (tối đa 5MB)." });
      return;
    }
    setFormData((prev) => ({ ...prev, illustration: file }));
    setIllustrationPreview(URL.createObjectURL(file));
  };

  const handleContentTypeChange = async (value: "pdf" | "editor") => {
    if (value === "editor") {
      if (!formData.editorContent) {
        setFormData((prev) => ({
          ...prev,
          contentType: value,
          editorContent: initialEditorValue as unknown as string,
        }));
        return;
      }

      if (isContaintHtmlTag(formData.editorContent)) {
        setFormData((prev) => ({
          ...prev,
          contentType: value,
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, contentType: value }));
  };

  const handleComplete = async () => {
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
          illustrationUrl = res.fileUrl || res.url;
          if (illustrationUrl) {
            uploadedFilesCache.current.set(formData.illustration, {
              fileUrl: illustrationUrl,
            });
          }
        }
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
          pdfUrl = res.fileUrl || res.url;
          pdfName = res.fileName || res.name || formData.pdfFile.name;
          if (pdfUrl) {
            uploadedFilesCache.current.set(formData.pdfFile, {
              fileUrl: pdfUrl,
              fileName: pdfName,
            });
          }
        }
      } else if (formData.contentType === "pdf" && existingData) {
        // preserve existing pdf if not changed
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

      const metadataJson = JSON.stringify({
        illustrationUrl,
        scientificName: formData.scientificName,
      });

      const payload = {
        code: formData.varietyFoundationCode,
        name: formData.varietyFoundationName,
        cropId: Number(formData.crop),
        description: formData.description,
        origin: formData.origin,
        growthDurationDays: parseDurationToDays(formData.growthDuration),
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

      if (mode === "edit" && varietyId) {
        updateCropVariety.mutate(
          { id: varietyId, data: payload as any },
          {
            onSuccess: () => {
              toast({
                title: "Thành công",
                description: `Đã cập nhật giống cây (nền tảng) "${formData.varietyFoundationName}"`,
              });
              setLocation("/variety-foudation");
            },
            onError: (err) => {
              toast({
                variant: "destructive",
                title: "Lỗi",
                description: err.message,
              });
            },
          },
        );
      } else {
        createCropVariety.mutate(payload as any, {
          onSuccess: () => {
            toast({
              title: "Thành công",
              description: `Đã tạo giống cây (nền tảng) "${formData.varietyFoundationName}"`,
            });
            setLocation("/variety-foudation");
          },
          onError: (err) => {
            toast({
              variant: "destructive",
              title: "Lỗi",
              description: err.message,
            });
          },
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi tải file lên",
      });
    }
  };

  const { items: apiCrops } = useCrops();

  const selectedCrop = useMemo(() => {
    const crop = apiCrops.find((c) => String(c.id) === formData.crop);
    if (!crop) return undefined;
    return {
      name: crop.name,
      image: crop.imageUrl || "",
      group: crop.cropGroupName || "",
    };
  }, [formData.crop, apiCrops]);

  return {
    mode,
    formData,
    updateField,
    illustrationPreview,
    setIllustrationPreview,
    fileInputRef,
    pdfInputRef,
    onPickIllustration,
    handleContentTypeChange,
    handleComplete,
    selectedCrop,
    goBack: () => setLocation("/variety-foudation"),
    notFound: mode === "edit" && !isFetching && !existingData,
    existingVarietyFoundation: existingData,
    isClassificationValid:
      formData.varietyFoundationCode.trim().length > 0 &&
      formData.varietyFoundationName.trim().length > 0 &&
      formData.crop.trim().length > 0,
    isDocumentsValid:
      formData.contentType === "editor" || Boolean(formData.pdfFile),
    isPending:
      createCropVariety.isPending ||
      updateCropVariety.isPending ||
      uploadFile.isPending,
  };
}
