import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  convertHtmlToLexical,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CROP_OPTIONS } from "../../../constants/crops";
import { initialEditorValue } from "../../docs/mocks";
import { safeConvertLexicalToHtml, isContaintHtmlTag } from "@/utils/commons";
import useVarietyStore from "../../../stores/useVarietyStore";
import { MAX_IMAGE_SIZE } from "../data/constants";
import type { CreateVarietyForm } from "../types/types";

interface UseVarietyFormPageOptions {
  mode: "create" | "edit";
}

export function useVarietyFormPage({ mode }: UseVarietyFormPageOptions) {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addVariety, getVarietyById, updateVariety } = useVarietyStore();

  const existingVariety =
    mode === "edit" && params?.id ? getVarietyById(params.id) : undefined;

  const [formData, setFormData] = useState<CreateVarietyForm>(() => ({
    varietyCode: existingVariety?.varietyCode || "",
    varietyName: existingVariety?.varietyName || "",
    scientificName: existingVariety?.scientificName || "",
    crop: existingVariety?.crop || "",
    origin: existingVariety?.origin || "",
    growthDuration: existingVariety?.growthDuration || "",
    averageYield: existingVariety?.averageYield || "",
    description: existingVariety?.description || "",
    illustration:
      existingVariety?.illustration instanceof File
        ? existingVariety.illustration
        : null,
    contentType: existingVariety?.contentType || "pdf",
    pdfFile: existingVariety?.pdfFile || null,
    editorContent: existingVariety?.editorContent || "",
  }));
  const [illustrationPreview, setIllustrationPreview] = useState<string>(
    typeof existingVariety?.illustration === "string"
      ? existingVariety.illustration
      : "",
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const hydrateEditorContent = async () => {
      if (
        formData.contentType !== "editor" ||
        !formData.editorContent ||
        !isContaintHtmlTag(formData.editorContent)
      ) {
        return;
      }

      const content = await convertHtmlToLexical(formData.editorContent);
      if (isMounted) {
        setFormData((prev) => ({
          ...prev,
          editorContent: content as unknown as string,
        }));
      }
    };

    void hydrateEditorContent();

    return () => {
      isMounted = false;
    };
  }, [formData.contentType, formData.editorContent]);

  const updateField = <K extends keyof CreateVarietyForm>(
    key: K,
    value: CreateVarietyForm[K],
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
        const content = await convertHtmlToLexical(formData.editorContent);
        setFormData((prev) => ({
          ...prev,
          contentType: value,
          editorContent: content as unknown as string,
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, contentType: value }));
  };

  const handleComplete = async () => {
    const editorContent = await safeConvertLexicalToHtml(formData.editorContent);

    if (mode === "edit" && params?.id) {
      updateVariety(params.id, {
        editorContent,
        contentType: formData.contentType,
        pdfFile: formData.pdfFile,
        varietyCode: formData.varietyCode,
        varietyName: formData.varietyName,
        scientificName: formData.scientificName,
        crop: formData.crop,
        origin: formData.origin,
        growthDuration: formData.growthDuration,
        averageYield: formData.averageYield,
        description: formData.description,
        illustration: formData.illustration || existingVariety?.illustration,
      });

      toast({
        title: "Thành công",
        description: `Đã cập nhật giống cây "${formData.varietyName}"`,
      });
    } else {
      addVariety({
        varietyCode: formData.varietyCode,
        varietyName: formData.varietyName,
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
        description: `Đã tạo giống cây "${formData.varietyName}"`,
      });
    }

    setLocation("/variety");
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
    goBack: () => setLocation("/variety"),
    notFound: mode === "edit" && !existingVariety,
    existingVariety,
    isClassificationValid:
      formData.varietyCode.trim().length > 0 &&
      formData.varietyName.trim().length > 0 &&
      formData.crop.trim().length > 0,
    isDocumentsValid:
      formData.contentType === "editor" || Boolean(formData.pdfFile),
  };
}
