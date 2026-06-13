import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  convertHtmlToLexical,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CROP_OPTIONS } from "../../../constants/crops";
import { initialEditorValue } from "../../docs/mocks";
import { safeConvertLexicalToHtml, isContaintHtmlTag } from "@/utils/commons";
import useVarietyFoundationStore from "../../../stores/useVarietyFoundationStore";
import { MAX_IMAGE_SIZE } from "../data/constants";
import type { CreateVarietyFoundationForm } from "../types/types";

interface UseVarietyFoundationFormPageOptions {
  mode: "create" | "edit";
}

export function useVarietyFoundationFormPage({ mode }: UseVarietyFoundationFormPageOptions) {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addVarietyFoundation, getVarietyFoundationById, updateVarietyFoundation } = useVarietyFoundationStore();

  const existingVarietyFoundation =
    mode === "edit" && params?.id ? getVarietyFoundationById(params.id) : undefined;

  const [formData, setFormData] = useState<CreateVarietyFoundationForm>(() => ({
    varietyFoundationCode: existingVarietyFoundation?.varietyFoundationCode || "",
    varietyFoundationName: existingVarietyFoundation?.varietyFoundationName || "",
    scientificName: existingVarietyFoundation?.scientificName || "",
    crop: existingVarietyFoundation?.crop || "",
    origin: existingVarietyFoundation?.origin || "",
    growthDuration: existingVarietyFoundation?.growthDuration || "",
    averageYield: existingVarietyFoundation?.averageYield || "",
    description: existingVarietyFoundation?.description || "",
    illustration:
      existingVarietyFoundation?.illustration instanceof File
        ? existingVarietyFoundation.illustration
        : null,
    contentType: existingVarietyFoundation?.contentType || "pdf",
    pdfFile: existingVarietyFoundation?.pdfFile || null,
    editorContent: existingVarietyFoundation?.editorContent || "",
  }));
  const [illustrationPreview, setIllustrationPreview] = useState<string>(
    typeof existingVarietyFoundation?.illustration === "string"
      ? existingVarietyFoundation.illustration
      : "",
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);



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
    const editorContent = await safeConvertLexicalToHtml(formData.editorContent);

    if (mode === "edit" && params?.id) {
      updateVarietyFoundation(params.id, {
        editorContent,
        contentType: formData.contentType,
        pdfFile: formData.pdfFile,
        varietyFoundationCode: formData.varietyFoundationCode,
        varietyFoundationName: formData.varietyFoundationName,
        scientificName: formData.scientificName,
        crop: formData.crop,
        origin: formData.origin,
        growthDuration: formData.growthDuration,
        averageYield: formData.averageYield,
        description: formData.description,
        illustration: formData.illustration || existingVarietyFoundation?.illustration,
      });

      toast({
        title: "Thành công",
        description: `Đã cập nhật giống cây (nền tảng) "${formData.varietyFoundationName}"`,
      });
    } else {
      addVarietyFoundation({
        varietyFoundationCode: formData.varietyFoundationCode,
        varietyFoundationName: formData.varietyFoundationName,
        scientificName: formData.scientificName,
        crop: formData.crop,
        origin: formData.origin,
        growthDuration: formData.growthDuration,
        averageYield: formData.averageYield,
        description: formData.description,
        illustration: formData.illustration,
        contentType: formData.contentType,
        pdfFile: formData.pdfFile,
        editorContent,
      });

      toast({
        title: "Thành công",
        description: `Đã tạo giống cây (nền tảng) "${formData.varietyFoundationName}"`,
      });
    }

    setLocation("/variety-foudation");
  };

  const selectedCrop = useMemo(
    () => CROP_OPTIONS.find((crop) => crop.name === formData.crop),
    [formData.crop],
  );

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
    notFound: mode === "edit" && !existingVarietyFoundation,
    existingVarietyFoundation,
    isClassificationValid:
      formData.varietyFoundationCode.trim().length > 0 &&
      formData.varietyFoundationName.trim().length > 0 &&
      formData.crop.trim().length > 0,
    isDocumentsValid:
      formData.contentType === "editor" || Boolean(formData.pdfFile),
  };
}
