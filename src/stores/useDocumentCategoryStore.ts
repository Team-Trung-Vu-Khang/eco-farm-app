import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  initialDocumentCategories,
  type DocumentCategory,
} from "../pages/document-category/data/constants";

interface DocumentCategoryState {
  // State
  documentCategories: DocumentCategory[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setDocumentCategories: (categories: DocumentCategory[]) => void;
  addCategory: (category: Omit<DocumentCategory, "id" | "createdAt">) => void;
  updateCategory: (id: number, category: Partial<DocumentCategory>) => void;
  deleteCategory: (id: number) => void;
  toggleStatus: (id: number) => void;
  getCategoryById: (id: number) => DocumentCategory | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const useDocumentCategoryStore = create<DocumentCategoryState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        documentCategories: initialDocumentCategories,
        isLoading: false,
        error: null,

        // Actions
        setDocumentCategories: (documentCategories) =>
          set({ documentCategories }, false, "setDocumentCategories"),

        addCategory: (categoryData) =>
          set(
            (state) => {
              const newCategory: DocumentCategory = {
                ...categoryData,
                id: Math.max(0, ...state.documentCategories.map((c) => c.id)) + 1,
                createdAt: new Date().toISOString().split("T")[0],
              };
              return {
                documentCategories: [newCategory, ...state.documentCategories],
              };
            },
            false,
            "addCategory",
          ),

        updateCategory: (id, categoryData) =>
          set(
            (state) => ({
              documentCategories: state.documentCategories.map((category) =>
                category.id === id
                  ? { ...category, ...categoryData }
                  : category,
              ),
            }),
            false,
            "updateCategory",
          ),

        deleteCategory: (id) =>
          set(
            (state) => ({
              documentCategories: state.documentCategories.filter(
                (category) => category.id !== id,
              ),
            }),
            false,
            "deleteCategory",
          ),

        toggleStatus: (id) =>
          set(
            (state) => ({
              documentCategories: state.documentCategories.map((category) =>
                category.id === id
                  ? {
                      ...category,
                      status: category.status === "active" ? "inactive" : "active",
                    }
                  : category,
              ),
            }),
            false,
            "toggleStatus",
          ),

        getCategoryById: (id) => {
          return get().documentCategories.find((category) => category.id === id);
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),

        reset: () =>
          set(
            {
              documentCategories: initialDocumentCategories,
              isLoading: false,
              error: null,
            },
            false,
            "reset",
          ),
      }),
      {
        name: "document-category-storage",
        partialize: (state) => ({ documentCategories: state.documentCategories }),
      },
    ),
    {
      name: "DocumentCategoryStore",
    },
  ),
);

export default useDocumentCategoryStore;
