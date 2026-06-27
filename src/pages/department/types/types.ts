import type { MasterDataRecord } from "@/features/master-data";
import type { DepartmentFormValues } from "../data/department-form.schema";

export type DepartmentItem = MasterDataRecord<"departments">;

export const emptyDepartmentFormValues: DepartmentFormValues = {
  code: "",
  name: "",
  description: "",
  status: "active",
};
