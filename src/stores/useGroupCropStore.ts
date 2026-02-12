import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { GroupCrop } from "../pages/group-crop/types";
import { initialData } from "../pages/group-crop/mocks";

interface GroupCropState {
  groupCrops: GroupCrop[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addGroupCrop: (groupCrop: Omit<GroupCrop, "id" | "createdAt">) => void;
  updateGroupCrop: (id: number, groupCrop: Partial<GroupCrop>) => void;
  deleteGroupCrop: (id: number) => void;
  getGroupCropById: (id: number) => GroupCrop | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useGroupCropStore = create<GroupCropState>()(
  devtools(
    persist(
      (set, get) => ({
        groupCrops: initialData,
        isLoading: false,
        error: null,

        addGroupCrop: (data) => {
          set(
            (state) => {
              const newId =
                Math.max(0, ...state.groupCrops.map((g) => g.id)) + 1;

              const newGroupCrop: GroupCrop = {
                id: newId,
                code: data.code,
                name: data.name,
                scientificName: data.scientificName,
                category: data.category,
                description: data.description,
                createdAt: new Date().toISOString().split("T")[0],
              };

              return {
                groupCrops: [newGroupCrop, ...state.groupCrops],
              };
            },
            false,
            "addGroupCrop",
          );
        },

        updateGroupCrop: (id, data) => {
          set(
            (state) => ({
              groupCrops: state.groupCrops.map((g) =>
                g.id === id ? { ...g, ...data } : g,
              ),
            }),
            false,
            "updateGroupCrop",
          );
        },

        deleteGroupCrop: (id) => {
          set(
            (state) => ({
              groupCrops: state.groupCrops.filter((g) => g.id !== id),
            }),
            false,
            "deleteGroupCrop",
          );
        },

        getGroupCropById: (id) => {
          return get().groupCrops.find((g) => g.id === id);
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),
      }),
      {
        name: "group-crop-storage",
        partialize: (state) => ({ groupCrops: state.groupCrops }),
      },
    ),
    { name: "GroupCropStore" },
  ),
);

export default useGroupCropStore;
