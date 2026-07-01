import type { FarmDepartmentResponse } from "@/features/master-data";
import type { DepartmentFormValues } from "../data/department-form.schema";

export type DepartmentItem = FarmDepartmentResponse;

export const emptyDepartmentFormValues: DepartmentFormValues = {
  code: "",
  name: "",
  description: "",
  status: "active",
};
