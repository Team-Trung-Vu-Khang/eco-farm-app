import { z } from "zod";

export const historyFormSchema = z
  .object({
    regimenId: z.string().min(1, "Vui lòng chọn vụ mùa / vụ nuôi"),
    workType: z.string().min(1, "Vui lòng chọn loại công việc"),
    startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
    isPlannedMode: z.boolean(),
    planId: z.string().optional(),
    taskId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isPlannedMode) {
      if (!data.planId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn kế hoạch",
          path: ["planId"],
        });
      }
      if (!data.taskId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn công việc",
          path: ["taskId"],
        });
      }
    }
  });

export type HistoryFormSchemaInput = z.infer<typeof historyFormSchema>;
