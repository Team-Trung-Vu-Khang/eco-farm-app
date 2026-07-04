import * as z from "zod";

export const seedSelectionSchema = z.object({
  cropGroupId: z.string().min(1, "Vui lòng chọn nhóm cây trồng"),
  cropId: z.string().min(1, "Vui lòng chọn cây trồng"),
  cropVarietyId: z.string().min(1, "Vui lòng chọn giống cây"),
  cropName: z.string().optional(),
  varietyName: z.string().optional(),
  varietyCode: z.string().optional(),
  baseIllustrationUrl: z.string().optional(),
  avgYieldFrom: z.number().nullable().optional(),
  avgYieldTo: z.number().nullable().optional(),
});

export const seedDetailsSchema = z.object({
  supplierOrganizationId: z.string().min(1, "Vui lòng chọn nhà cung cấp"),
  supplierName: z.string().optional(),
  origin: z.string().optional(),
  expiryDate: z.date({
    error: "Vui lòng chọn hạn sử dụng",
  }),
  yield: z.string().optional(),
  uniformity: z
    .number()
    .min(0, "Tối thiểu 0%")
    .max(100, "Tối đa 100%")
    .optional(),
  germinationRate: z
    .number()
    .min(0, "Tối thiểu 0%")
    .max(100, "Tối đa 100%")
    .optional(),
  illustration: z.any().optional(), // File
});

export const seedDocumentationSchema = z.object({
  description: z.string().optional(),
  editorContent: z.any().optional(),
  pdfFile: z.any().optional(),
  contentType: z.enum(["pdf", "editor"]),
});

export const createSeedSchema = seedSelectionSchema
  .merge(seedDetailsSchema)
  .merge(seedDocumentationSchema);

export type CreateSeedFormValues = z.infer<typeof createSeedSchema>;
