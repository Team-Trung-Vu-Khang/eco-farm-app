import type { MasterDataRecord } from "@/features/master-data";
import type { PositionGroupFormValues } from "../data/position-group-form.schema";

export type PositionGroup = MasterDataRecord<"position-groups">;
export type PositionGroupFormData = PositionGroupFormValues;
