import type { Position } from "../../../stores/usePositionStore";

export type PositionFormData = Omit<Position, "id" | "createdAt">;
