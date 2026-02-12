import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Variety } from "../pages/variety/types";
import { initialData } from "../pages/variety/mocks";

interface VarietyState {
  varieties: Variety[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addVariety: (
    variety: Omit<Variety, "id" | "updatedAt" | "status" | "documents">,
  ) => void;
  updateVariety: (id: string, variety: Partial<Variety>) => void;
  deleteVariety: (id: string) => void;
  getVarietyById: (id: string) => Variety | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useVarietyStore = create<VarietyState>()(
  devtools(
    persist(
      (set, get) => ({
        varieties: initialData,
        isLoading: false,
        error: null,

        addVariety: (data) => {
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

              const newVariety: Variety = {
                id: newId,
                varietyCode: data.varietyCode,
                varietyName: data.varietyName,
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
                varieties: [newVariety, ...state.varieties],
              };
            },
            false,
            "addVariety",
          );
        },

        updateVariety: (id, data) => {
          set(
            (state) => ({
              varieties: state.varieties.map((v) => {
                if (v.id === id) {
                  // Convert illustration File to URL if needed
                  const illustrationUrl =
                    data.illustration instanceof File
                      ? URL.createObjectURL(data.illustration)
                      : data.illustration;

                  const updatedVariety = {
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

                    updatedVariety.documents =
                      contentType === "pdf" && pdfFile
                        ? [
                            {
                              name: pdfFile.name,
                              url: URL.createObjectURL(pdfFile),
                            },
                          ]
                        : [];
                  }

                  return updatedVariety;
                }
                return v;
              }),
            }),
            false,
            "updateVariety",
          );
        },

        deleteVariety: (id) => {
          set(
            (state) => ({
              varieties: state.varieties.filter((v) => v.id !== id),
            }),
            false,
            "deleteVariety",
          );
        },

        getVarietyById: (id) => {
          return get().varieties.find((v) => v.id === id);
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),
      }),
      {
        name: "variety-storage",
        partialize: (state) => ({ varieties: state.varieties }),
      },
    ),
    { name: "VarietyStore" },
  ),
);

export default useVarietyStore;
