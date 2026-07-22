import * as z from "zod";

const pdfFileSchema = z
  .union([
    z.instanceof(File),
    z.object({
      name: z.string(),
      size: z.number(),
      url: z.string().optional(),
    }),
  ])
  .nullable()
  .optional();

import { parseDurationToDays } from "../utils/duration";

export const growthStageSchema = z.object({
  id: z.string(),
  name: z
    .string({ error: "Tên giai đoạn không được để trống" })
    .min(1, { message: "Tên giai đoạn không được để trống" }),
  duration: z.union([z.string(), z.number()]).refine(
    (val) => {
      const days = parseDurationToDays(String(val));
      return days > 0;
    },
    { message: "Thời gian không hợp lệ (phải lớn hơn 0 ngày)" },
  ),
  usePdf: z.boolean(),
  pdfFile: pdfFileSchema,
  content: z.string().optional(),
});

export const animalGrowthCycleFormSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Vui lòng nhập tên chu kỳ sinh trưởng." }),
    cycleType: z.enum(["animal", "animal"]),
    scope: z.enum(["crop", "variety"]),
    cropId: z.string().min(1, { message: "Vui lòng chọn loại" }),
    variety: z.string().optional(),
    totalDays: z.number().optional(),
    stages: z
      .array(growthStageSchema)
      .min(1, { message: "Cần ít nhất một giai đoạn" }),
  })
  .refine(
    (data) => {
      if (data.scope === "variety") {
        return !!data.variety;
      }
      return true;
    },
    {
      message: "Vui lòng chọn giống",
      path: ["variety"],
    },
  );

export type AnimalGrowthCycleFormValues = z.infer<typeof animalGrowthCycleFormSchema>;
export type GrowthStageValues = z.infer<typeof growthStageSchema>;
