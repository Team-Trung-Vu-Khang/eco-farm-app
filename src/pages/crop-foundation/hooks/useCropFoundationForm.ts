import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

import { useCropMutations } from "../../../features/foundation";
import { useFileUpload } from "../../../features/storage";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import { initialEditorValue } from "../data/mocks";
import type {
  CreateCropFoundationForm,
  GrowthCycleDetail,
} from "../types/types";

export function useCropFoundationForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedFilesCache = useRef<Map<File, { fileUrl: string; fileName?: string }>>(new Map());
  const { createCrop } = useCropMutations();

  const { uploadFile } = useFileUpload();

  const [formData, setFormData] = useState<CreateCropFoundationForm>({
    code: "TREE-" + Math.floor(1000 + Math.random() * 9000),
    name: "",
    cropGroupId: "",
    cropFoundationType: "",
    variety: "",
    illustration: null,
    description: "",
    selectedSeedIds: [],
    harvestMethod: "manual",
    technicalSpecs: {
      scientificName: "",
      family: "",
      origin: "",
      tempRange: "",
      humidityRange: "",
      phRange: "",
      plantingDensity: "",
      watering: "",
    },
    growthCycles: [
      {
        id: "1",
        name: "Kiến thiết cơ bản",
        stages: ["Gieo hạt", "Cây con"],
        estimatedDays: "10",
      },
    ],
    docs: {
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
    },
  });

  const [seedSearch, setSeedSearch] = useState("");
  const [illustrationPreview, setIllustrationPreview] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!formData.illustration) {
      setIllustrationPreview(null);
      return;
    }
    if (typeof formData.illustration === "string") {
      setIllustrationPreview(formData.illustration);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setIllustrationPreview(reader.result as string);
    };
    reader.readAsDataURL(formData.illustration as File);
  }, [formData.illustration]);

  const handleUpdateField = (
    field: keyof CreateCropFoundationForm,
    value: any,
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "cropGroupId") {
        newData.cropFoundationType = "";
        newData.variety = "";
      } else if (field === "cropFoundationType") {
        newData.variety = "";
      }
      return newData;
    });
  };

  const handleUpdateTechnicalSpecs = (
    updates: Partial<typeof formData.technicalSpecs>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      technicalSpecs: { ...prev.technicalSpecs, ...updates },
    }));
  };

  const handleAddGrowthCycle = () => {
    const newId = (formData.growthCycles.length + 1).toString();
    setFormData((prev) => ({
      ...prev,
      growthCycles: [
        ...prev.growthCycles,
        { id: newId, name: "", stages: [], estimatedDays: "" },
      ],
    }));
  };

  const handleRemoveGrowthCycle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      growthCycles: prev.growthCycles.filter((c) => c.id !== id),
    }));
  };

  const handleUpdateGrowthCycle = (
    id: string,
    updates: Partial<GrowthCycleDetail>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      growthCycles: prev.growthCycles.map((c) =>
        c.id === id ? { ...c, ...updates } : c,
      ),
    }));
  };

  const handleUpdateDocs = (
    docKey: "farmingTechnique" | "qualityStandard",
    updates: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      docs: {
        ...prev.docs,
        [docKey]: { ...prev.docs[docKey], ...updates },
      },
    }));
  };

  const handleComplete = async () => {
    try {
      // 1. Upload illustration if it's a File
      let illustrationUrl = formData.illustration as string | undefined;
      if (formData.illustration instanceof File) {
        if (uploadedFilesCache.current.has(formData.illustration)) {
          illustrationUrl = uploadedFilesCache.current.get(formData.illustration)?.fileUrl;
        } else {
          const res = await uploadFile.mutateAsync({
            file: formData.illustration,
            folder: "crops-illustrations",
          });
          illustrationUrl = res.fileUrl || res.url;
          if (illustrationUrl) {
            uploadedFilesCache.current.set(formData.illustration, { fileUrl: illustrationUrl });
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
            folder: "crops/documents",
          });
          farmingFileUrl = res.fileUrl || res.url;
          farmingFileName = res.fileName || res.name || farmingFile.name;
          if (farmingFileUrl) {
            uploadedFilesCache.current.set(farmingFile, { fileUrl: farmingFileUrl, fileName: farmingFileName });
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

      // parse tempRange back to from/to
      const tempRange = formData.technicalSpecs.tempRange;
      const humidityRange = formData.technicalSpecs.humidityRange;
      const phRange = formData.technicalSpecs.phRange;

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
          temperatureFrom: tempRange
            ? Number(tempRange.split("-")[0]) || undefined
            : undefined,
          temperatureTo: tempRange
            ? Number(tempRange.split("-")[1]) || undefined
            : undefined,
          humidityFrom: humidityRange
            ? Number(humidityRange.split("-")[0]) || undefined
            : undefined,
          humidityTo: humidityRange
            ? Number(humidityRange.split("-")[1]) || undefined
            : undefined,
          phFrom: phRange
            ? Number(phRange.split("-")[0]) || undefined
            : undefined,
          phTo: phRange
            ? Number(phRange.split("-")[1]) || undefined
            : undefined,
          plantingDensity: formData.technicalSpecs.plantingDensity || undefined,
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
    formData,
    seedSearch,
    setSeedSearch,
    illustrationPreview,
    fileInputRef,
    handleUpdateField,
    handleUpdateTechnicalSpecs,
    handleAddGrowthCycle,
    handleRemoveGrowthCycle,
    handleUpdateGrowthCycle,
    handleUpdateDocs,
    handleComplete,
    handleCancel,
    isPending: createCrop.isPending,
  };
}
