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

export const growthCycleFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Vui lòng nhập tên chu kỳ sinh trưởng." }),
    cycleType: z.literal("plant"),
    scope: z.enum(["group", "crop", "variety"]),
    groupIds: z.array(z.string()),
    cropIds: z.array(z.string()),
    varietyIds: z.array(z.string()),
    totalDays: z.number().optional(),
    stages: z
      .array(growthStageSchema)
      .min(1, { message: "Cần ít nhất một giai đoạn" }),
  })
  // `superRefine` (rather than `.refine` on `scope`) so the error lands on
  // the actual array field (groupIds/cropIds/varietyIds) that the multi-
  // select UI edits — react-hook-form + zodResolver only re-validates the
  // field named in `setValue(..., { shouldValidate: true })`, so an error
  // parked on `scope` never clears when the user picks items and only the
  // array field gets revalidated.
  .superRefine((data, ctx) => {
    if (data.scope === "group" && data.groupIds.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Vui lòng chọn ít nhất một nhóm cây trồng",
        path: ["groupIds"],
      });
    }
    if (data.scope === "crop" && data.cropIds.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Vui lòng chọn ít nhất một cây trồng",
        path: ["cropIds"],
      });
    }
    if (data.scope === "variety" && data.varietyIds.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Vui lòng chọn ít nhất một giống cây trồng",
        path: ["varietyIds"],
      });
    }
  });

export type GrowthCycleFormValues = z.infer<typeof growthCycleFormSchema>;
export type GrowthStageValues = z.infer<typeof growthStageSchema>;
