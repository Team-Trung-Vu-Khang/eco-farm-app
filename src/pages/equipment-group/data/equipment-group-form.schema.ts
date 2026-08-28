import { z } from "zod";

export const EQUIPMENT_GROUP_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const equipmentGroupFormSchema = z.object({
  code: z.string(),
  name: z.string().trim().min(1, "Vui lòng nhập tên nhóm."),
  description: z.string().trim().default(""),
  status: z.enum(EQUIPMENT_GROUP_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type EquipmentGroupFormInput = z.input<typeof equipmentGroupFormSchema>;
export type EquipmentGroupFormValues = z.output<
  typeof equipmentGroupFormSchema
>;
