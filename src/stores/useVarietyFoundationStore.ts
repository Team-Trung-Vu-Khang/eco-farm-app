import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { VarietyFoundation } from "../pages/variety-foundation/types";
import { initialData } from "../pages/variety-foundation/mocks";

interface VarietyFoundationState {
  varieties: VarietyFoundation[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addVarietyFoundation: (
    varietyFoundation: Omit<VarietyFoundation, "id" | "updatedAt" | "status" | "documents">,
  ) => void;
  updateVarietyFoundation: (id: string, varietyFoundation: Partial<VarietyFoundation>) => void;
  deleteVarietyFoundation: (id: string) => void;
  getVarietyFoundationById: (id: string) => VarietyFoundation | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useVarietyFoundationStore = create<VarietyFoundationState>()(
  devtools(
    persist(
      (set, get) => ({
        varieties: initialData,
        isLoading: false,
        error: null,

        addVarietyFoundation: (data) => {
          set(
            (state) => {
              const newId = (
                Math.max(
                  0,
                  ...state.varieties.map((v) => parseInt(v.id) || 0),
                ) + 1
              ).toString();

              // Convert illustration File to URL if needed
              const illustrationUrl =
                data.illustration instanceof File
                  ? URL.createObjectURL(data.illustration)
                  : data.illustration;

              const newVarietyFoundation: VarietyFoundation = {
                id: newId,
                varietyFoundationCode: data.varietyFoundationCode,
                varietyFoundationName: data.varietyFoundationName,
                crop: data.crop,
                scientificName: data.scientificName,
                origin: data.origin,
                growthDuration: data.growthDuration,
                averageYield: data.averageYield,
                description: data.description,
                illustration: illustrationUrl,
                contentType: data.contentType,
                pdfFile: data.pdfFile,
                editorContent: data.editorContent,
                documents:
                  data.contentType === "pdf" && data.pdfFile
                    ? [
                        {
                          name: data.pdfFile.name,
                          url: URL.createObjectURL(data.pdfFile),
                        },
                      ]
                    : [],
                status: "active",
                updatedAt: new Date().toISOString().split("T")[0],
              };

              return {
                varieties: [newVarietyFoundation, ...state.varieties],
              };
            },
            false,
            "addVarietyFoundation",
          );
        },

        updateVarietyFoundation: (id, data) => {
          set(
            (state) => ({
              varieties: state.varieties.map((v) => {
                if (v.id === id) {
                  // Convert illustration File to URL if needed
                  const illustrationUrl =
                    data.illustration instanceof File
                      ? URL.createObjectURL(data.illustration)
                      : data.illustration;

                  const updatedVarietyFoundation = {
                    ...v,
                    ...data,
                    illustration: illustrationUrl ?? v.illustration,
                    updatedAt: new Date().toISOString().split("T")[0],
                  };

                  // Sync documents if contentType or pdfFile changed
                  if (
                    data.contentType !== undefined ||
                    data.pdfFile !== undefined
                  ) {
                    const contentType = data.contentType ?? v.contentType;
                    const pdfFile = data.pdfFile ?? v.pdfFile;

                    updatedVarietyFoundation.documents =
                      contentType === "pdf" && pdfFile
                        ? [
                            {
                              name: pdfFile.name,
                              url: URL.createObjectURL(pdfFile),
                            },
                          ]
                        : [];
                  }

                  return updatedVarietyFoundation;
                }
                return v;
              }),
            }),
            false,
            "updateVarietyFoundation",
          );
        },

        deleteVarietyFoundation: (id) => {
          set(
            (state) => ({
              varieties: state.varieties.filter((v) => v.id !== id),
            }),
            false,
            "deleteVarietyFoundation",
          );
        },

        getVarietyFoundationById: (id) => {
          return get().varieties.find((v) => v.id === id);
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),
      }),
      {
        name: "varietyFoundation-storage",
        partialize: (state) => ({ varieties: state.varieties }),
      },
    ),
    { name: "VarietyFoundationStore" },
  ),
);

export default useVarietyFoundationStore;
