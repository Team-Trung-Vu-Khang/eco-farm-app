import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  initialEnterprises,
  type Enterprise,
} from "../pages/enterprise/data/constants";

interface EnterpriseState {
  // State
  enterprises: Enterprise[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setEnterprises: (enterprises: Enterprise[]) => void;
  addEnterprise: (enterprise: Omit<Enterprise, "id" | "createdAt">) => void;
  updateEnterprise: (id: number, enterprise: Partial<Enterprise>) => void;
  deleteEnterprise: (id: number) => void;
  getEnterpriseById: (id: number | null | undefined) => Enterprise | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const useEnterpriseStore = create<EnterpriseState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        enterprises: initialEnterprises,
        isLoading: false,
        error: null,

        // Actions
        setEnterprises: (enterprises) =>
          set({ enterprises }, false, "setEnterprises"),

        addEnterprise: (enterpriseData) =>
          set(
            (state) => {
              const newEnterprise: Enterprise = {
                ...enterpriseData,
                id: Math.max(0, ...state.enterprises.map((e) => e.id)) + 1,
                createdAt: new Date().toISOString().split("T")[0],
              };
              return {
                enterprises: [newEnterprise, ...state.enterprises],
              };
            },
            false,
            "addEnterprise",
          ),

        updateEnterprise: (id, enterpriseData) =>
          set(
            (state) => ({
              enterprises: state.enterprises.map((enterprise) =>
                enterprise.id === id
                  ? { ...enterprise, ...enterpriseData }
                  : enterprise,
              ),
            }),
            false,
            "updateEnterprise",
          ),

        deleteEnterprise: (id) =>
          set(
            (state) => ({
              enterprises: state.enterprises.filter(
                (enterprise) => enterprise.id !== id,
              ),
            }),
            false,
            "deleteEnterprise",
          ),

        getEnterpriseById: (id) => {
          if (id === null || id === undefined) return undefined;

          return get().enterprises.find((enterprise) => enterprise.id === id);
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),

        reset: () =>
          set(
            {
              enterprises: initialEnterprises,
              isLoading: false,
              error: null,
            },
            false,
            "reset",
          ),
      }),
      {
        name: "enterprise-storage",
        partialize: (state) => ({ enterprises: state.enterprises }),
      },
    ),
    {
      name: "EnterpriseStore",
    },
  ),
);

export default useEnterpriseStore;
