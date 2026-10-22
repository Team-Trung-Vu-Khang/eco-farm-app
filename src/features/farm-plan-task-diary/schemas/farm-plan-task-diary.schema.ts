import { z } from "zod";
import {
  photoRequestSchema,
  harvestItemSchema,
  supplyUsageRequestSchema,
} from "@/features/farm-daily-diary/schemas/farm-daily-diary.schema";

export const executorProgressSchema = z.object({
  personnelId: z.number().int().positive("ID nhân sự không hợp lệ"),
  progressPercent: z
    .number()
    .min(0, "Tiến độ tối thiểu 0%")
    .max(100, "Tiến độ tối đa 100%"),
});

export const planTaskDiaryLineSchema = z
  .object({
    taskId: z
      .number()
      .int()
      .positive("ID công việc không hợp lệ")
      .optional()
      .nullable(),
    description: z
      .string()
      .min(1, "Nội dung mô tả công việc không được để trống"),
    endDate: z.string().min(1, "Ngày kết thúc không được để trống"),
    progressPercent: z.number().min(0).max(100).nullable().optional(),
    executorProgress: z.array(executorProgressSchema).nullable().optional(),
    supplies: z.array(supplyUsageRequestSchema).nullable().optional(),
  })
  .refine(
    (data) => {
      // Không kết hợp direct progress với danh sách executor progress không rỗng
      if (
        data.progressPercent !== undefined &&
        data.progressPercent !== null &&
        data.executorProgress &&
        data.executorProgress.length > 0
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Không thể vừa gửi tiến độ trực tiếp vừa gửi tiến độ theo người thực hiện (Executor)",
      path: ["progressPercent"],
    },
  );

export const createPlanTaskDiaryEntrySchema = z.object({
  planId: z.number().int().positive("Kế hoạch là bắt buộc"),
  stageId: z.number().int().positive("Giai đoạn là bắt buộc"),
  workflowId: z.number().int().positive().nullable().optional(),
  seasonId: z.number().int().positive().nullable().optional(),
  submittedByPersonnelId: z.number().int().positive().nullable().optional(),
  warning: z.boolean().optional(),
  description: z.string().nullable().optional(),
  photos: z.array(photoRequestSchema).nullable().optional(),
  lines: z
    .array(planTaskDiaryLineSchema)
    .min(1, "Nhật ký theo kế hoạch phải chứa ít nhất một công việc"),
  harvestItems: z.array(harvestItemSchema).nullable().optional(),
});

export const updatePlanTaskDiaryEntrySchema = createPlanTaskDiaryEntrySchema;

export type CreatePlanTaskDiaryEntrySchemaInput = z.infer<
  typeof createPlanTaskDiaryEntrySchema
>;
export type UpdatePlanTaskDiaryEntrySchemaInput = z.infer<
  typeof updatePlanTaskDiaryEntrySchema
>;
