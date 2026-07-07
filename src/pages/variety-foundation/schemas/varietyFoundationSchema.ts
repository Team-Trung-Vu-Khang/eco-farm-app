import { z } from "zod";

export const classificationSchema = z.object({
  crop: z.string().min(1, "Vui lòng chọn loài cây trồng"),
  varietyFoundationCode: z.string().optional(),
  varietyFoundationName: z.string().min(1, "Tên giống không được để trống"),
  scientificName: z.string().optional(),
  origin: z.string().optional(),
});

export const characteristicsSchema = z.object({
  illustration: z.any().nullable().optional(),
  growthDuration: z.string().optional(),
  averageYield: z.string().optional(),
  description: z.string().optional(),
});

export const docsSchema = z.object({
  contentType: z.enum(["editor", "pdf"]),
  pdfFile: z.any().nullable().optional(),
  editorContent: z.any().optional(),
});

export const varietyFoundationSchema = classificationSchema
  .merge(characteristicsSchema)
  .merge(docsSchema);

export type VarietyFoundationFormValues = z.infer<
  typeof varietyFoundationSchema
>;
