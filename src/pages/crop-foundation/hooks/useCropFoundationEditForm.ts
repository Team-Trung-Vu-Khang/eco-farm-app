import {
  useToast,
  convertHtmlToLexical,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useRef, useEffect, useState } from "react";
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

  const [initialValues, setInitialValues] =
    useState<Partial<CropFoundationFormValues> | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (!existingData) return;

    const buildInitialValues = async () => {
      setIsInitializing(true);
      try {
        // ── Xây dựng docs ─────────────────────────────────────────────────────
        let docs: {
          farmingTechnique: { type: string; content: any; file: File | null };
          qualityStandard: { type: string; content: any; file: File | null };
        } = {
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

        const buildFarmingDoc = async (farmingDoc: any) => ({
          type: (farmingDoc.type as string) || "editor",
          content: await convertHtmlToLexical(farmingDoc.content || ""),
          file: farmingDoc.fileUrl
            ? new File([], farmingDoc.fileName || "file", {
                type: "application/octet-stream",
              })
            : null,
        });

        // Ưu tiên 1: documents ở root (format cũ)
        if (existingData.documents && existingData.documents.length > 0) {
          const farmingDoc = existingData.documents.find(
            (d: any) => d.name === "Kỹ thuật canh tác",
          );
          if (farmingDoc) {
            docs.farmingTechnique = await buildFarmingDoc(farmingDoc);
          }
        } else if (existingData.metadataJson) {
          const meta = existingData.metadataJson;
          const metaDocs = Array.isArray(meta.documents)
            ? (meta.documents as any[])
            : null;

          // Ưu tiên 2: metadataJson.documents (format mới)
          if (metaDocs && metaDocs.length > 0) {
            const farmingDoc = metaDocs.find(
              (d: any) => d.name === "Kỹ thuật canh tác",
            );
            if (farmingDoc) {
              docs.farmingTechnique = await buildFarmingDoc(farmingDoc);
            }
          } else if (meta.docs && typeof meta.docs === "object") {
            // Fallback 3: metadataJson.docs (format rất cũ)
            docs = meta.docs as typeof docs;
          }
        }

        // ── Xây dựng form values ──────────────────────────────────────────────
        const meta = existingData.metadataJson || {};

        setInitialValues({
          code: existingData.code || undefined,
          name: existingData.name || "",
          cropGroupId: String(
            existingData.subjectGroup?.id ??
              existingData.subjectGroupId ??
              existingData.cropGroupId ??
              "",
          ),
          cropFoundationType: "",
          variety: "",
          illustration: existingData.imageUrl || null,
          description: existingData.description || "",
          selectedSeedIds: [],
          harvestMethod: existingData.harvestMethod || "manual",
          technicalSpecs: {
            scientificName: existingData.scientificName || "",
            family: existingData.family || "",
            origin: existingData.origin || "",
            temperatureFrom: existingData.temperatureFrom ?? null,
            temperatureTo: existingData.temperatureTo ?? null,
            humidityFrom: existingData.humidityFrom ?? null,
            humidityTo: existingData.humidityTo ?? null,
            phFrom: existingData.phFrom ?? null,
            phTo: existingData.phTo ?? null,
            plantingDensity: existingData.densityDescription || "",
            watering: (meta.watering as string) || "",
          },
          growthCycles: [],
          docs: docs as any,
        });
      } catch (e) {
        console.error("Failed to build initial values", e);
      } finally {
        setIsInitializing(false);
      }
    };

    buildInitialValues();
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
        domainCode: "CROP",
        code: formData.code || undefined,
        name: formData.name || undefined,
        subjectGroupId: Number(formData.cropGroupId),
        description: formData.description || undefined,
        harvestMethod: formData.harvestMethod || undefined,
        imageUrl: illustrationUrl || undefined,
        status: "active" as const,
        // Technical specs — flat theo schema Subject API
        scientificName: formData.technicalSpecs.scientificName || undefined,
        family: formData.technicalSpecs.family || undefined,
        origin: formData.technicalSpecs.origin || undefined,
        temperatureFrom: formData.technicalSpecs.temperatureFrom ?? undefined,
        temperatureTo: formData.technicalSpecs.temperatureTo ?? undefined,
        humidityFrom: formData.technicalSpecs.humidityFrom ?? undefined,
        humidityTo: formData.technicalSpecs.humidityTo ?? undefined,
        phFrom: formData.technicalSpecs.phFrom ?? undefined,
        phTo: formData.technicalSpecs.phTo ?? undefined,
        densityDescription:
          formData.technicalSpecs.plantingDensity || undefined,
        metadataJson: {
          source: "farm-admin",
          watering: formData.technicalSpecs.watering || undefined,
          documents,
        },
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
    isInitializing,
    isSubmitting,
  };
}
