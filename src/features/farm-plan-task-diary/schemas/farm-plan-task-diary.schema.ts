import { z } from "zod";
import { photoRequestSchema, harvestItemSchema, supplyUsageRequestSchema, supplyUsageSchema } from "@/features/farm-daily-diary/schemas/farm-daily-diary.schema";


export const executorProgressSchema = z.object({
  personnelId: z.number().int().positive("ID nhân sự không hợp lệ"),
  progressPercent: z.number().min(0, "Tiến độ tối thiểu 0%").max(100, "Tiến độ tối đa 100%"),
});

export const planTaskDiaryLineSchema = z.object({
  taskId: z.number().int().positive("ID công việc không hợp lệ").optional().nullable(),
  description: z.string().min(1, "Nội dung mô tả công việc không được để trống"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày kết thúc phải có định dạng YYYY-MM-DD"),
  progressPercent: z.number().min(0).max(100).nullable().optional(),
  executorProgress: z.array(executorProgressSchema).nullable().optional(),
  supplies: z.array(supplyUsageRequestSchema).nullable().optional(),
});

export const createPlanTaskDiaryEntrySchema = z.object({
  planId: z.number().int().positive("Kế hoạch là bắt buộc"),
  stageId: z.number().int().positive("Giai đoạn là bắt buộc"),
  workflowId: z.number().int().positive().nullable().optional(),
  seasonId: z.number().int().positive().nullable().optional(),
  submittedByPersonnelId: z.number().int().positive().nullable().optional(),
  description: z.string().nullable().optional(),
  photos: z.array(photoRequestSchema).nullable().optional(),
  lines: z.array(planTaskDiaryLineSchema).min(1, "Nhật ký theo kế hoạch phải chứa ít nhất một công việc"),
  harvestItems: z.array(harvestItemSchema).nullable().optional(),
});

export const updatePlanTaskDiaryEntrySchema = createPlanTaskDiaryEntrySchema.partial();

export type CreatePlanTaskDiaryEntrySchemaInput = z.infer<typeof createPlanTaskDiaryEntrySchema>;
export type UpdatePlanTaskDiaryEntrySchemaInput = z.infer<typeof updatePlanTaskDiaryEntrySchema>;
