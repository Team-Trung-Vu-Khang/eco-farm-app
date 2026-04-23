import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  convertHtmlToLexical,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useTreatmentStore } from "@/stores/useTreatmentStore";
import { safeConvertLexicalToHtml, isContaintHtmlTag } from "@/utils/commons";
import type { CreateTreatmentFormData } from "../types/createTreatment.types";
import type {
  Treatment,
  TreatmentAttachment,
  TreatmentAuthor,
  TreatmentMaterialItem,
  TreatmentProcedure,
} from "../types/treatment.types";
import type { ApplicableCropConfig } from "../types/createTreatment.types";

const initialFormData: CreateTreatmentFormData = {
  id: `PD-${Date.now()}`,
  code: `PT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
  name: "",

  // Step 1
  zone: "",
  intensity: "medium",
  soilProblems: [],
  targetSeverity: "M0",
  soilIssue: "",
  startDate: "",
  endDate: "",
  duration: "",
  budgetRange: "",

  // Step 2
  responsibleUnit: "",
  priority: "medium",
  cropGroupTags: [],
  applicableObjects: [],
  applicableCrops: [],
  applicableCropConfigs: [],
  terrainTypes: [],
  authors: [{ id: Date.now(), name: "", qualification: "", organization: "" }],

  // Step 3
  primaryMethodId: undefined,
  supportingMethodIds: [],
  goalTags: [],
  currentSurvey: "",
  importantNotes: "",
  expectedOutcomeSummary: "",

  // Step 4
  procedures: [],
  attachments: [],
  inspectionParameters: [],
  qualityChecklist: [],
};

function createProcedureRow(nextStepNumber: number): TreatmentProcedure {
  return {
    id: Date.now(),
    stepNumber: nextStepNumber,
    name: "",
    description: "",
    startDay: undefined,
    endDay: undefined,
    detailedInstructions: "",
    dosage: "",
    timing: "",
    technique: "",
    materials: [],
    equipment: [],
    stageMaterials: [],
    estimatedDays: 0,
    warnings: [],
    tips: [],
    expectedOutcome: "",
    qualityCheckpoints: [],
    attachments: [],
  };
}

function createMaterialRow(): TreatmentMaterialItem {
  return {
    id: Date.now(),
    category: "pesticide",
    name: "",
    dosageMin: "",
    dosageMax: "",
    unit: "g/l",
  };
}

function createCropConfigRow(): ApplicableCropConfig {
  return {
    id: Math.random().toString(36).substr(2, 9),
    groupName: "",
    specificCrops: [],
  };
}

export function useCreateTreatmentPage(id?: string) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { treatments, addTreatment, updateTreatment } = useTreatmentStore();
  const [formData, setFormData] =
    useState<CreateTreatmentFormData>(initialFormData);

  // Load existing data if editing
  useEffect(() => {
    let isMounted = true;

    if (id) {
      const existing = treatments.find((t) => String(t.id) === id);
      if (existing) {
        const hydrateData = async () => {
          let soilIssue = existing.soilIssue || "";
          if (soilIssue && isContaintHtmlTag(soilIssue)) {
            soilIssue = (await convertHtmlToLexical(soilIssue)) as any;
          }

          let importantNotes = existing.importantNotes || "";
          if (importantNotes && isContaintHtmlTag(importantNotes)) {
            importantNotes = (await convertHtmlToLexical(importantNotes)) as any;
          }

          let expectedOutcomeSummary = existing.expectedOutcomeSummary || "";
          if (
            expectedOutcomeSummary &&
            isContaintHtmlTag(expectedOutcomeSummary)
          ) {
            expectedOutcomeSummary = (await convertHtmlToLexical(
              expectedOutcomeSummary,
            )) as any;
          }

          const hydratedProcedures = await Promise.all(
            (existing.procedures || []).map(async (p) => {
              let detailedInstructions = p.detailedInstructions || "";
              if (
                detailedInstructions &&
                isContaintHtmlTag(detailedInstructions)
              ) {
                detailedInstructions = (await convertHtmlToLexical(
                  detailedInstructions,
                )) as any;
              }

              let expectedOutcome = p.expectedOutcome || "";
              if (expectedOutcome && isContaintHtmlTag(expectedOutcome)) {
                expectedOutcome = (await convertHtmlToLexical(
                  expectedOutcome,
                )) as any;
              }

              let warnings = p.warnings;
              if (Array.isArray(warnings)) {
                warnings = warnings.join("\n");
              }
              if (warnings && isContaintHtmlTag(warnings)) {
                warnings = (await convertHtmlToLexical(warnings)) as any;
              }

              let qualityCheckpoints = p.qualityCheckpoints;
              if (Array.isArray(qualityCheckpoints)) {
                qualityCheckpoints = qualityCheckpoints.join("\n");
              }
              if (
                qualityCheckpoints &&
                isContaintHtmlTag(qualityCheckpoints)
              ) {
                qualityCheckpoints = (await convertHtmlToLexical(
                  qualityCheckpoints,
                )) as any;
              }

              return {
                ...p,
                detailedInstructions,
                expectedOutcome,
                warnings,
                qualityCheckpoints,
              };
            }),
          );

          if (isMounted) {
            setFormData({
              id: String(existing.id),
              code: existing.code,
              name: existing.name,
              zone: existing.zone || "",
              intensity: "medium", // Default or extract if added later
              soilProblems: existing.soilProblems || [],
              targetSeverity: existing.severity,
              soilIssue: soilIssue,
              startDate: existing.startDate || "",
              endDate: existing.endDate || "",
              duration: existing.duration || "",
              budgetRange: existing.budgetRange || "",
              responsibleUnit: existing.responsibleUnit || "",
              priority: existing.priority || "medium",
              cropGroupTags: existing.cropGroupTags || [],
              applicableObjects: existing.applicableObjects || [],
              applicableCrops: existing.applicableCrops || [],
              applicableCropConfigs:
                (existing as any).applicableCropConfigs || [],
              terrainTypes: existing.terrainTypes || [],
              authors:
                existing.authors && existing.authors.length > 0
                  ? existing.authors
                  : [
                      {
                        id: Date.now(),
                        name: "",
                        qualification: "",
                        organization: "",
                      },
                    ],
              primaryMethodId: existing.primaryMethodId,
              supportingMethodIds: existing.supportingMethodIds || [],
              goalTags: existing.goalTags || [],
              currentSurvey: existing.currentSurvey || "",
              importantNotes: importantNotes,
              expectedOutcomeSummary: expectedOutcomeSummary,
              procedures: hydratedProcedures,
              attachments: existing.attachments || [],
              inspectionParameters: existing.inspectionParameters || [],
              qualityChecklist: existing.qualityChecklist || [],
              diseaseType: existing.disease,
            });
          }
        };
        void hydrateData();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [id, treatments]);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [uploadingProcedureId, setUploadingProcedureId] = useState<
    number | null
  >(null);

  const updateForm = <K extends keyof CreateTreatmentFormData>(
    key: K,
    value: CreateTreatmentFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleComplete = async () => {
    const isEdit = !!id;
    const disease = formData.diseaseType || "Chưa xác định";
    const severity = (formData.targetSeverity as any) || "M0";
    const soilIssueHtml = await safeConvertLexicalToHtml(formData.soilIssue);
    const importantNotesHtml = await safeConvertLexicalToHtml(
      formData.importantNotes,
    );
    const expectedOutcomeSummaryHtml = await safeConvertLexicalToHtml(
      formData.expectedOutcomeSummary,
    );

    const cropGroups = Array.from(
      new Set(
        formData.applicableCropConfigs
          .map((c) => c.groupName)
          .filter((n) => !!n),
      ),
    );
    const specificCrops = Array.from(
      new Set(formData.applicableCropConfigs.flatMap((c) => c.specificCrops)),
    );

    // const qualityChecklistHtml = await safeConvertLexicalToHtml(
    //   formData.qualityChecklist,
    // );

    const serializedProcedures = await Promise.all(
      formData.procedures.map(async (p) => ({
        ...p,
        detailedInstructions: await safeConvertLexicalToHtml(
          p.detailedInstructions,
        ),
        expectedOutcome: await safeConvertLexicalToHtml(p.expectedOutcome),
        warnings: await safeConvertLexicalToHtml(p.warnings),
        qualityCheckpoints: await safeConvertLexicalToHtml(p.qualityCheckpoints),
      })),
    );

    const commonData: Partial<Treatment> = {
      code: formData.code,
      name: formData.name,
      cropType: cropGroups[0] || "Cây ăn quả",
      crop: specificCrops[0] || "Đa dạng",
      disease,
      severity,
      authors: formData.authors,
      attachments: formData.attachments,
      procedures: serializedProcedures,
      zone: formData.zone,
      soilIssue: soilIssueHtml,
      soilProblems: formData.soilProblems,
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration: formData.duration,
      budgetRange: formData.budgetRange,
      responsibleUnit: formData.responsibleUnit,
      priority: formData.priority,
      cropGroupTags: cropGroups,
      applicableObjects: formData.applicableObjects,
      applicableCrops: specificCrops,
      applicableCropConfigs: formData.applicableCropConfigs,
      terrainTypes: formData.terrainTypes,
      primaryMethodId: formData.primaryMethodId,
      supportingMethodIds: formData.supportingMethodIds,
      goalTags: formData.goalTags,
      currentSurvey: formData.currentSurvey,
      importantNotes: importantNotesHtml,
      expectedOutcomeSummary: expectedOutcomeSummaryHtml,
      inspectionParameters: formData.inspectionParameters,
      qualityChecklist: formData.qualityChecklist,

      // Legacy steps mapping for backward compatibility
      steps: formData.procedures.map((p) => ({
        id: p.id,
        step: p.stepNumber,
        name: p.name,
        description: p.description || p.detailedInstructions,
        materialId: "",
        materialName: p.stageMaterials[0]?.name || "",
        dosage: p.stageMaterials[0]?.dosageMin || "",
        timing: p.timing || `Ngày ${p.startDay}`,
        applicationMethod: p.technique,
        dosagePerArea: "",
        duration: "",
        frequency: "",
        cost: "",
        costPerArea: "",
        safetyPeriod: "",
        ppeRequired: "",
        weatherConditions: "",
        notes: "",
      })),
    };

    if (isEdit) {
      updateTreatment(Number(id), commonData);
      toast({
        title: "Thành công",
        description: `Đã cập nhật phác đồ "${formData.name}"`,
      });
    } else {
      const newId = Math.max(...treatments.map((t) => t.id), 0) + 1;
      const newTreatment: Treatment = {
        ...(commonData as Treatment),
        id: newId,
        variety: "Mặc định",
        seed: "F1",
        author: formData.authors[0]?.name || "Chưa cập nhật",
        authorTitle: formData.authors[0]?.qualification || "Chuyên gia",
        approvedBy: "Phòng Kỹ thuật",
        approvalDate: new Date().toISOString().split("T")[0],
        version: "1.0",
        totalCost: formData.budgetRange || "Đang dự toán",
        totalDuration: formData.duration || "Chưa xác định",
        safetyRating: "medium",
        efficacyRate: "85%",
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };

      addTreatment(newTreatment);
      toast({
        title: "Thành công",
        description: `Đã tạo phác đồ "${formData.name}"`,
      });
    }

    setLocation("/treatment");
  };

  // Authors Management
  const addAuthor = () => {
    updateForm("authors", [
      ...formData.authors,
      { id: Date.now(), name: "", qualification: "", organization: "" },
    ]);
  };

  const removeAuthor = (id: number) => {
    if (formData.authors.length === 1) return;
    updateForm(
      "authors",
      formData.authors.filter((a) => a.id !== id),
    );
  };

  const updateAuthor = (
    id: number,
    key: keyof Omit<TreatmentAuthor, "id">,
    value: string,
  ) => {
    updateForm(
      "authors",
      formData.authors.map((a) => (a.id === id ? { ...a, [key]: value } : a)),
    );
  };

  // Procedures Management
  const addProcedure = () => {
    updateForm("procedures", [
      ...formData.procedures,
      createProcedureRow(formData.procedures.length + 1),
    ]);
  };

  const removeProcedure = (id: number) => {
    updateForm(
      "procedures",
      formData.procedures
        .filter((p) => p.id !== id)
        .map((p, idx) => ({ ...p, stepNumber: idx + 1 })),
    );
  };

  const updateProcedureField = <K extends keyof TreatmentProcedure>(
    id: number,
    key: K,
    value: TreatmentProcedure[K],
  ) => {
    updateForm(
      "procedures",
      formData.procedures.map((p) =>
        p.id === id ? { ...p, [key]: value } : p,
      ),
    );
  };

  const updateProcedure = (
    id: number,
    callback: (current: TreatmentProcedure) => TreatmentProcedure,
  ) => {
    updateForm(
      "procedures",
      formData.procedures.map((p) => (p.id === id ? callback(p) : p)),
    );
  };

  // Stage Materials Management
  const addMaterialToProcedure = (
    procedureId: number,
    data?: Partial<Omit<TreatmentMaterialItem, "id">>,
  ) => {
    updateForm(
      "procedures",
      formData.procedures.map((p) =>
        p.id === procedureId
          ? {
              ...p,
              stageMaterials: [
                ...(p.stageMaterials || []),
                { ...createMaterialRow(), ...data },
              ],
            }
          : p,
      ),
    );
  };

  const removeMaterialFromProcedure = (
    procedureId: number,
    materialId: number,
  ) => {
    updateForm(
      "procedures",
      formData.procedures.map((p) =>
        p.id === procedureId
          ? {
              ...p,
              stageMaterials: p.stageMaterials.filter(
                (m) => m.id !== materialId,
              ),
            }
          : p,
      ),
    );
  };

  const updateStageMaterial = (
    procedureId: number,
    materialId: number,
    key: keyof Omit<TreatmentMaterialItem, "id">,
    value: string,
  ) => {
    updateForm(
      "procedures",
      formData.procedures.map((p) =>
        p.id === procedureId
          ? {
              ...p,
              stageMaterials: p.stageMaterials.map((m) =>
                m.id === materialId ? { ...m, [key]: value } : m,
              ),
            }
          : p,
      ),
    );
  };

  const handleUploadFiles =
    (type: "pdf" | "image" | "video") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const newAttachments: TreatmentAttachment[] = Array.from(files).map(
        (file, idx) => ({
          id: Date.now() + idx,
          name: file.name,
          fileType: type,
          url: URL.createObjectURL(file), // Mock URL
          size: `${(file.size / 1024).toFixed(1)} KB`,
        }),
      );

      if (uploadingProcedureId) {
        updateProcedure(uploadingProcedureId, (p) => ({
          ...p,
          attachments: [...(p.attachments || []), ...newAttachments],
        }));
        setUploadingProcedureId(null);
      } else {
        updateForm("attachments", [
          ...formData.attachments,
          ...newAttachments,
        ]);
      }

      // Reset input value to allow uploading the same file again if needed
      e.target.value = "";
    };

  return {
    formData,
    setFormData,
    updateForm,
    handleComplete,
    addAuthor,
    removeAuthor,
    updateAuthor,
    addProcedure,
    removeProcedure,
    updateProcedureField,
    updateProcedure,
    addMaterialToProcedure,
    removeMaterialFromProcedure,
    updateStageMaterial,
    handleUploadFiles,
    uploadingProcedureId,
    setUploadingProcedureId,
    pdfInputRef,
    imageInputRef,
    videoInputRef,
    addCropConfig: () =>
      setFormData((prev) => ({
        ...prev,
        applicableCropConfigs: [
          ...prev.applicableCropConfigs,
          createCropConfigRow(),
        ],
      })),
    removeCropConfig: (id: string) =>
      setFormData((prev) => ({
        ...prev,
        applicableCropConfigs: prev.applicableCropConfigs.filter(
          (c) => c.id !== id,
        ),
      })),
    updateCropConfig: (id: string, updates: Partial<ApplicableCropConfig>) => {
      setFormData((prev) => ({
        ...prev,
        applicableCropConfigs: prev.applicableCropConfigs.map((c) =>
          c.id === id ? { ...c, ...updates } : c,
        ),
      }));
    },
    goBack: () => setLocation("/treatment"),
  };
}
