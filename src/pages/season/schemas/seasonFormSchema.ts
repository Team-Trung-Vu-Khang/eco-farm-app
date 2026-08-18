import * as z from "zod";

export const seasonStageSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({ error: "Tên giai đoạn không được để trống" })
    .min(1, { message: "Tên giai đoạn không được để trống" }),
  description: z.string().optional(),
  durationDays: z.number().optional(),
  displayOrder: z.number().optional(),
  documents: z.array(z.any()).default([]),
});

export const seasonFormSchema = z.object({
  code: z.string().optional(),
  name: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập tên mùa vụ." }),
  description: z.string().optional(),
  domainCode: z.enum(["CROP", "LIVESTOCK", "AQUACULTURE"]),
  selectedPrimaryId: z.string().optional(),
  selectedChildId: z.string().optional(),
  productionSubjectId: z.number().optional(),
  productionSubjectVariantId: z.number().optional(),
  stages: z
    .array(seasonStageSchema)
    .min(1, { message: "Cần ít nhất một giai đoạn" }),
  displayOrder: z.number().optional(),
  status: z.enum(["active", "inactive", "archived"]),
});

export type SeasonFormValues = z.infer<typeof seasonFormSchema>;
export type SeasonStageValues = z.infer<typeof seasonStageSchema>;
