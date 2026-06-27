import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useRef } from "react";
import { useLocation } from "wouter";

import { safeConvertLexicalToHtml } from "@/utils/commons";
import { useCropMutations } from "../../../features/foundation";
import { useFileUpload } from "../../../features/storage";

import type { CropFoundationFormValues } from "../schemas/cropFoundationSchema";

export function useCropFoundationForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const uploadedFilesCache = useRef<
    Map<File, { fileUrl: string; fileName?: string }>
  >(new Map());
  const { createCrop } = useCropMutations();
  const { uploadFile } = useFileUpload();

  const handleComplete = async (formData: CropFoundationFormValues) => {
    try {
      // 1. Upload illustration if it's a File
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

      // Prepare documents array for API
      const documents = [];
      const farmingFile = finalDocs.farmingTechnique.file;

      let farmingFileUrl: string | undefined = undefined;
      let farmingFileName: string | undefined = undefined;

      if (farmingFile instanceof File) {
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
        cropGroupId: Number(formData.cropGroupId),
        description: formData.description || undefined,
        harvestMethod: formData.harvestMethod || undefined,
        imageUrl: illustrationUrl,
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

      createCrop.mutate(payload, {
        onSuccess: () => {
          toast({
            title: "Thành công",
            description: `Đã khởi tạo cây trồng "${formData.name}"`,
          });
          setLocation("/crop-foundation");
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: err.message,
          });
        },
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi tải file lên",
      });
    }
  };

  const handleCancel = () => setLocation("/crop-foundation");

  return {
    handleComplete,
    handleCancel,
    isPending: createCrop.isPending,
  };
}
