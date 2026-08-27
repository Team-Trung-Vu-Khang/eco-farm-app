import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useRef, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";

import { safeConvertLexicalToHtml } from "@/utils/commons";
import { useCropById, useCropMutations } from "../../../features/foundation";
import { useFileUpload } from "../../../features/storage";
import type { CropFoundationFormValues } from "../schemas/cropFoundationSchema";
import { initialEditorValue } from "../data/mocks";

export function useCropFoundationEditForm() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const uploadedFilesCache = useRef<
    Map<File, { fileUrl: string; fileName?: string }>
  >(new Map());

  const cropId = id ? parseInt(id, 10) : 0;
  const { data: existingData, isLoading: isLoadingCrop } = useCropById(cropId, {
    enabled: !!cropId,
  });
  const { updateCrop } = useCropMutations();
  const { uploadFile } = useFileUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data from api
  const initialValues =
    useMemo((): Partial<CropFoundationFormValues> | null => {
      if (!existingData) return null;

      let docs = {
        farmingTechnique: {
          type: "editor",
          content: initialEditorValue,
          file: null,
        },
        qualityStandard: {
          type: "editor",
          content: initialEditorValue,
          file: null,
        },
      };

      if (existingData.documents && existingData.documents.length > 0) {
        const farmingDoc = existingData.documents.find(
          (d: any) => d.name === "Kỹ thuật canh tác",
        );
        if (farmingDoc) {
          docs.farmingTechnique = {
            type: (farmingDoc.type as any) || "editor",
            content: farmingDoc.content || initialEditorValue,
            file: farmingDoc.fileUrl
              ? new File([], farmingDoc.fileName || "file", {
                  type: "application/octet-stream",
                })
              : (null as any),
          };
        }
      } else if (existingData.metadataJson) {
        // Fallback for older data format
        try {
          const meta = existingData.metadataJson || {};
          if (meta.docs) docs = meta.docs;
        } catch (e) {
          console.error("Failed to parse metadataJson");
        }
      }

      const specs = existingData.technicalSpecs || {};

      return {
        code: existingData.code || undefined,
        name: existingData.name || "",
        cropGroupId: String(existingData.cropGroupId),
        cropFoundationType: "",
        variety: "",
        illustration: existingData.imageUrl || null,
        description: existingData.description || "",
        selectedSeedIds: [],
        harvestMethod: existingData.harvestMethod || "manual",
        technicalSpecs: {
          scientificName: specs.scientificName || "",
          family: specs.family || "",
          origin: specs.origin || "",
          temperatureFrom: specs.temperatureFrom || null,
          temperatureTo: specs.temperatureTo || null,
          humidityFrom: specs.humidityFrom || null,
          humidityTo: specs.humidityTo || null,
          phFrom: specs.phFrom || null,
          phTo: specs.phTo || null,
          plantingDensity: specs.plantingDensity || "",
          watering: specs.watering || "",
        },
        growthCycles: [],
        // @ts-ignore
        docs,
      };
    }, [existingData]);

  const handleComplete = async (formData: CropFoundationFormValues) => {
    if (!id) return;
    setIsSubmitting(true);

    try {
      let illustrationUrl = formData.illustration as string | undefined;
      if (formData.illustration instanceof File) {
        if (uploadedFilesCache.current.has(formData.illustration)) {
          illustrationUrl = uploadedFilesCache.current.get(
            formData.illustration,
          )?.fileUrl;
        } else {
          const res = await uploadFile.mutateAsync({
            file: formData.illustration,
            folder: "crops-illustrations",
          });
          illustrationUrl = res.fileUrl;
          if (illustrationUrl) {
            uploadedFilesCache.current.set(formData.illustration, {
              fileUrl: illustrationUrl,
            });
          }
        }
      }

      const processDocContent = async (doc: any) => {
        if (doc.type === "editor" && typeof doc.content !== "string") {
          return await safeConvertLexicalToHtml(doc.content);
        }
        return doc.content;
      };

      const finalFarmingTechniqueContent = await processDocContent(
        formData.docs.farmingTechnique,
      );
      const finalQualityStandardContent = await processDocContent(
        formData.docs.qualityStandard,
      );

      const finalDocs = {
        farmingTechnique: {
          ...formData.docs.farmingTechnique,
          content: finalFarmingTechniqueContent,
        },
        qualityStandard: {
          ...formData.docs.qualityStandard,
          content: finalQualityStandardContent,
        },
      };

      const documents = [];
      const farmingFile = finalDocs.farmingTechnique.file;

      let farmingFileUrl: string | undefined = undefined;
      let farmingFileName: string | undefined = undefined;

      if (farmingFile instanceof File && farmingFile.size > 0) {
        if (uploadedFilesCache.current.has(farmingFile)) {
          const cached = uploadedFilesCache.current.get(farmingFile);
          farmingFileUrl = cached?.fileUrl;
          farmingFileName = cached?.fileName;
        } else {
          const res = await uploadFile.mutateAsync({
            file: farmingFile,
            folder: "crops-documents",
          });
          farmingFileUrl = res.fileUrl;
          farmingFileName = res.fileName || farmingFile.name;
          if (farmingFileUrl) {
            uploadedFilesCache.current.set(farmingFile, {
              fileUrl: farmingFileUrl,
              fileName: farmingFileName,
            });
          }
        }
      } else if (existingData?.documents) {
        const existingDoc = existingData.documents.find(
          (d: any) => d.name === "Kỹ thuật canh tác",
        );
        if (existingDoc) {
          farmingFileUrl = existingDoc.fileUrl;
          farmingFileName = existingDoc.fileName;
        }
      }

      if (finalDocs.farmingTechnique.content || farmingFileUrl) {
        documents.push({
          type: finalDocs.farmingTechnique.type,
          name: "Kỹ thuật canh tác",
          content:
            typeof finalDocs.farmingTechnique.content === "string"
              ? finalDocs.farmingTechnique.content
              : undefined,
          fileUrl: farmingFileUrl,
          fileName: farmingFileName,
        });
      }

      const payload = {
        code: formData.code || undefined,
        name: formData.name || undefined,
        domainCode: "CROP" as const,
        subjectGroupId: Number(formData.cropGroupId),
        description: formData.description || undefined,
        harvestMethod: formData.harvestMethod || undefined,
        imageUrl: illustrationUrl || undefined,
        status: "active" as const,
        technicalSpecs: {
          scientificName: formData.technicalSpecs.scientificName || undefined,
          family: formData.technicalSpecs.family || undefined,
          origin: formData.technicalSpecs.origin || undefined,
          temperatureFrom: formData.technicalSpecs.temperatureFrom || undefined,
          temperatureTo: formData.technicalSpecs.temperatureTo || undefined,
          humidityFrom: formData.technicalSpecs.humidityFrom || undefined,
          humidityTo: formData.technicalSpecs.humidityTo || undefined,
          phFrom: formData.technicalSpecs.phFrom || undefined,
          phTo: formData.technicalSpecs.phTo || undefined,
          plantingDensity: formData.technicalSpecs.plantingDensity || undefined,
          watering: formData.technicalSpecs.watering || undefined,
        },
        documents,
        metadataJson: { source: "farm-admin" },
      };

      updateCrop.mutate(
        { id: parseInt(id, 10), data: payload },
        {
          onSuccess: () => {
            setIsSubmitting(false);
            toast({
              title: "Thành công",
              description: `Đã cập nhật cây trồng "${formData.name}"`,
            });
            setLocation(`/crop-foundation/${id}`);
          },
          onError: (err) => {
            setIsSubmitting(false);
            toast({
              variant: "destructive",
              title: "Lỗi",
              description: err.message,
            });
          },
        },
      );
    } catch (error: any) {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi tải file lên",
      });
    }
  };

  const handleCancel = () =>
    setLocation(id ? `/crop-foundation/${id}` : "/crop-foundation");

  return {
    initialValues,
    handleComplete,
    handleCancel,
    isLoadingCrop,
    isSubmitting,
  };
}
