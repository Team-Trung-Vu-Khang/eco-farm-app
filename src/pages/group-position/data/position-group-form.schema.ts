import { z } from "zod";

export const POSITION_GROUP_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const positionGroupFormSchema = z.object({
  code: z.string().trim(),
  name: z.string().trim().min(1, "Vui lòng nhập tên nhóm."),
  description: z.string().trim(),
  status: z.enum(POSITION_GROUP_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type PositionGroupFormValues = z.infer<typeof positionGroupFormSchema>;
