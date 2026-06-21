// Re-export from the Zustand store so the rest of the group-position
// feature imports from a single source of truth.
export type { PositionGroup } from "../../../stores/usePositionGroupStore";

export type PositionGroupFormData = {
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
};
