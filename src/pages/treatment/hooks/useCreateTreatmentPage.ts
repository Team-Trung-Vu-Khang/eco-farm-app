import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useTreatmentStore } from "@/stores/useTreatmentStore";
import type { CreateTreatmentFormData } from "../types/createTreatment.types";
import type {
  Treatment,
  TreatmentAttachment,
  TreatmentAuthor,
  TreatmentMaterialItem,
  TreatmentProcedure,
} from "../types/treatment.types";

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

export function useCreateTreatmentPage(id?: string) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { treatments, addTreatment, updateTreatment } = useTreatmentStore();
  const [formData, setFormData] =
    useState<CreateTreatmentFormData>(initialFormData);

  // Load existing data if editing
  useEffect(() => {
    if (id) {
      const existing = treatments.find((t) => String(t.id) === id);
      if (existing) {
        setFormData({
          id: String(existing.id),
          code: existing.code,
          name: existing.name,
          zone: existing.zone || "",
          intensity: "medium", // Default or extract if added later
          soilProblems: existing.soilProblems || [],
          targetSeverity: existing.severity,
          soilIssue: existing.soilIssue || "",
          startDate: existing.startDate || "",
          endDate: existing.endDate || "",
          duration: existing.duration || "",
          budgetRange: existing.budgetRange || "",
          responsibleUnit: existing.responsibleUnit || "",
          priority: existing.priority || "medium",
          cropGroupTags: existing.cropGroupTags || [],
          applicableObjects: existing.applicableObjects || [],
          applicableCrops: existing.applicableCrops || [],
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
          importantNotes: existing.importantNotes || "",
          expectedOutcomeSummary: existing.expectedOutcomeSummary || "",
          procedures: existing.procedures || [],
          attachments: existing.attachments || [],
          inspectionParameters: existing.inspectionParameters || [],
          qualityChecklist: existing.qualityChecklist || [],
          diseaseType: existing.disease,
        });
      }
    }
  }, [id, treatments]);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const updateForm = <K extends keyof CreateTreatmentFormData>(
    key: K,
    value: CreateTreatmentFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
    const isEdit = !!id;
    const disease = formData.diseaseType || "Chưa xác định";
    const severity = (formData.targetSeverity as any) || "M0";

    const commonData: Partial<Treatment> = {
      code: formData.code,
      name: formData.name,
      cropType: formData.cropGroupTags[0] || "Cây ăn quả",
      crop: formData.applicableCrops[0] || "Đa dạng",
      disease,
      severity,
      authors: formData.authors,
      attachments: formData.attachments,
      procedures: formData.procedures,
      zone: formData.zone,
      soilIssue: formData.soilIssue,
      soilProblems: formData.soilProblems,
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration: formData.duration,
      budgetRange: formData.budgetRange,
      responsibleUnit: formData.responsibleUnit,
      priority: formData.priority,
      cropGroupTags: formData.cropGroupTags,
      applicableObjects: formData.applicableObjects,
      applicableCrops: formData.applicableCrops,
      terrainTypes: formData.terrainTypes,
      primaryMethodId: formData.primaryMethodId,
      supportingMethodIds: formData.supportingMethodIds,
      goalTags: formData.goalTags,
      currentSurvey: formData.currentSurvey,
      importantNotes: formData.importantNotes,
      expectedOutcomeSummary: formData.expectedOutcomeSummary,
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
  const addMaterialToProcedure = (procedureId: number) => {
    updateForm(
      "procedures",
      formData.procedures.map((p) =>
        p.id === procedureId
          ? {
              ...p,
              stageMaterials: [
                ...(p.stageMaterials || []),
                createMaterialRow(),
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

      updateForm("attachments", [...formData.attachments, ...newAttachments]);
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
    pdfInputRef,
    imageInputRef,
    videoInputRef,
    goBack: () => setLocation("/treatment"),
  };
}
