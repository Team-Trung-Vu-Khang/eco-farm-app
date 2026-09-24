import { z } from "zod";

export const byProductSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên phụ phẩm"),
  code: z.string().optional(),
  imageUrl: z.string().optional(),

  registrationNumber: z.string().optional(),
  scientificTechnicalName: z.string().optional(),
  byProductOrigins: z.array(z.string()).optional(),
  byProductPhysicoChemicals: z.array(z.string()).optional(),
  byProductToxicityRegulations: z.array(z.string()).optional(),

  detailedComposition: z.string().optional(),
  description: z.string().optional(),

  indications: z.string().optional(),
  applicationStage: z.string().optional(),
  effectStage: z.string().optional(),
  targetCrops: z.array(z.string()).optional(),
  recommendedDosage: z.string().optional(),
  applicationMethod: z.string().optional(),
  usageNotes: z.string().optional(),
  shelfLife: z.string().optional(),

  toxicityInfo: z.string().optional(),
  protectiveMeasures: z.string().optional(),
  firstAid: z.any().optional(),
  legalStatus: z.enum(["allowed", "restricted", "banned"]).optional(),
  legalDescription: z.string().optional(),
  standardsCompliance: z.array(z.string()).optional(),

  referencePrice: z.string().optional(),
  packagingSpecs: z.array(z.string()).optional(),
  hashtags: z.array(z.string()).optional(),
});
