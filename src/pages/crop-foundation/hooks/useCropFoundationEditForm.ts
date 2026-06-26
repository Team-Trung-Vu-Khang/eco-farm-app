import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";

import { useCropById, useCropMutations } from "../../../features/foundation";
import { useFileUpload } from "../../../features/storage";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import { initialEditorValue } from "../data/mocks";
import type {
  CreateCropFoundationForm,
  GrowthCycleDetail,
} from "../types/types";

export function useCropFoundationEditForm() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedFilesCache = useRef<
    Map<File, { fileUrl: string; fileName?: string }>
  >(new Map());

  const cropId = id ? parseInt(id, 10) : 0;
  const { data: existingData } = useCropById(cropId, { enabled: !!cropId });
  const { updateCrop } = useCropMutations();
  const { uploadFile } = useFileUpload();

  const [formData, setFormData] = useState<CreateCropFoundationForm>({
    code: "",
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
    growthCycles: [],
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

  // Initialize form data from api
  useEffect(() => {
    if (existingData) {
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
          const meta =
            typeof existingData.metadataJson === "string"
              ? JSON.parse(existingData.metadataJson)
              : existingData.metadataJson;
          if (meta.docs) docs = meta.docs;
        } catch (e) {
          console.error("Failed to parse metadataJson");
        }
      }

      const specs = existingData.technicalSpecs || {};
      const tempRange =
        specs.temperatureFrom && specs.temperatureTo
          ? `${specs.temperatureFrom}-${specs.temperatureTo}`
          : "";
      const humidityRange =
        specs.humidityFrom && specs.humidityTo
          ? `${specs.humidityFrom}-${specs.humidityTo}`
          : "";
      const phRange =
        specs.phFrom && specs.phTo ? `${specs.phFrom}-${specs.phTo}` : "";

      setFormData({
        code: existingData.code || "",
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
          tempRange,
          humidityRange,
          phRange,
          plantingDensity: specs.plantingDensity || "",
          watering: "",
        },
        growthCycles: [],
        // @ts-ignore
        docs,
      });
    }
  }, [existingData]);

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

  const handleRemoveGrowthCycle = (cycleId: string) => {
    setFormData((prev) => ({
      ...prev,
      growthCycles: prev.growthCycles.filter((c) => c.id !== cycleId),
    }));
  };

  const handleUpdateGrowthCycle = (
    cycleId: string,
    updates: Partial<GrowthCycleDetail>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      growthCycles: prev.growthCycles.map((c) =>
        c.id === cycleId ? { ...c, ...updates } : c,
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
    if (!id) return;

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
          illustrationUrl = res.fileUrl || res.url;
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
            folder: "crops/documents",
          });
          farmingFileUrl = res.fileUrl || res.url;
          farmingFileName = res.fileName || res.name || farmingFile.name;
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

      const tempRange = formData.technicalSpecs.tempRange;
      const humidityRange = formData.technicalSpecs.humidityRange;
      const phRange = formData.technicalSpecs.phRange;

      const payload = {
        code: formData.code || undefined,
        name: formData.name || undefined,
        cropGroupId: Number(formData.cropGroupId),
        description: formData.description || undefined,
        harvestMethod: formData.harvestMethod || undefined,
        imageUrl: illustrationUrl || undefined,
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

      updateCrop.mutate(
        { id: parseInt(id, 10), data: payload },
        {
          onSuccess: () => {
            toast({
              title: "Thành công",
              description: `Đã cập nhật cây trồng "${formData.name}"`,
            });
            setLocation(`/crop-foundation/${id}`);
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
    } catch (error: any) {
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
    isPending: updateCrop.isPending || uploadFile.isPending,
  };
}
