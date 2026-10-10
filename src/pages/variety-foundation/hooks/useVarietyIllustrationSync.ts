import React, { useRef, useState, useEffect, useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { VarietyFoundationFormValues } from "../schemas/varietyFoundationSchema";
import { useCropById, useCrops } from "../../../features/foundation";

interface UseVarietyIllustrationSyncProps {
  methods: UseFormReturn<VarietyFoundationFormValues>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function useVarietyIllustrationSync({
  methods,
  fileInputRef,
}: UseVarietyIllustrationSyncProps) {
  const [illustrationPreview, setIllustrationPreview] = useState<string>("");
  const isUserUploadedRef = useRef<boolean>(false);
  const watchedCrop = methods.watch("crop");

  const { items: crops } = useCrops({
    params: { domainCode: "CROP", status: "active", page: 0, size: 100 },
  });

  const { data: cropData } = useCropById(Number(watchedCrop), {
    enabled: Boolean(watchedCrop && !isNaN(Number(watchedCrop))),
  });

  const prevCropIdRef = useRef<string>("");
  const appliedCropIdRef = useRef<string>("");

  useEffect(() => {
    if (!watchedCrop) {
      prevCropIdRef.current = "";
      appliedCropIdRef.current = "";
      if (!isUserUploadedRef.current) {
        setIllustrationPreview("");
        methods.setValue("illustration", null, { shouldValidate: true });
      }
      return;
    }

    const currentCrop =
      crops.find((c) => String(c.id) === String(watchedCrop)) || cropData;

    const cropChanged = watchedCrop !== prevCropIdRef.current;

    if (cropChanged) {
      prevCropIdRef.current = watchedCrop;

      const currentIllustration = methods.getValues("illustration");
      const isFile = currentIllustration instanceof File;
      const isCustom = isUserUploadedRef.current || isFile;

      if (!isCustom) {
        if (currentCrop) {
          const img = currentCrop.imageUrl || "";
          setIllustrationPreview(img);
          methods.setValue("illustration", img || null, {
            shouldValidate: true,
          });
          appliedCropIdRef.current = watchedCrop;
        } else {
          // Waiting for cropData to fetch
          appliedCropIdRef.current = "";
          setIllustrationPreview("");
          methods.setValue("illustration", null, { shouldValidate: true });
        }
      } else {
        // User has a custom uploaded illustration, keep it
        appliedCropIdRef.current = watchedCrop;
      }
    } else if (
      appliedCropIdRef.current !== watchedCrop &&
      currentCrop &&
      String(currentCrop.id) === String(watchedCrop)
    ) {
      // Data for newly selected crop just arrived asynchronously
      appliedCropIdRef.current = watchedCrop;
      const currentIllustration = methods.getValues("illustration");
      const isFile = currentIllustration instanceof File;
      const isCustom = isUserUploadedRef.current || isFile;

      if (!isCustom) {
        const img = currentCrop.imageUrl || "";
        setIllustrationPreview(img);
        methods.setValue("illustration", img || null, { shouldValidate: true });
      }
    }
  }, [watchedCrop, crops, cropData, methods]);

  const onPickIllustration = useCallback(
    (file?: File | null) => {
      if (!file) return;
      isUserUploadedRef.current = true;
      methods.setValue("illustration", file, { shouldValidate: true });
      setIllustrationPreview(URL.createObjectURL(file));
    },
    [methods],
  );

  const onRemoveIllustration = useCallback(() => {
    isUserUploadedRef.current = false;
    methods.setValue("illustration", null, { shouldValidate: true });
    setIllustrationPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [fileInputRef, methods]);

  const initIllustration = useCallback(
    (preview: string, isCustom: boolean, cropId: string) => {
      setIllustrationPreview(preview);
      isUserUploadedRef.current = isCustom;
      prevCropIdRef.current = cropId;
      appliedCropIdRef.current = cropId;
    },
    [],
  );

  return {
    illustrationPreview,
    setIllustrationPreview,
    isUserUploaded: isUserUploadedRef.current,
    onPickIllustration,
    onRemoveIllustration,
    initIllustration,
  };
}
