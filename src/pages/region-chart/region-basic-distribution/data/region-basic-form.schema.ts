import { z } from "zod";

export const regionBasicFormSchema = z.object({
  id: z.number().optional(),
  code: z.string().optional(),
  name: z.string().min(1, "Vui lòng nhập tên vùng"),
  cropIds: z.array(z.string()),
  area: z.coerce.number().optional(),
  provinceId: z.string().optional(),
  wardId: z.string().optional(),
  address: z.string().optional(),
  landType: z.string().optional(),
  terrain: z.string().optional(),
  note: z.string().optional(),
  centerPoint: z
    .object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
  metadataJson: z
    .object({
      address: z.string().optional(),
    })
    .optional(),
  isDetailed: z.boolean().optional(),
  status: z.enum(["active", "inactive", "archived"]),
  farmingMethodId: z
    .number({ message: "Vui lòng chọn phương pháp" })
    .int()
    .min(1, "Vui lòng chọn phương pháp"),
  rearingMethodId: z.number().int().optional(),
  irrigationSystemId: z.number().int().optional(),
  seedIds: z.array(z.number().int()).optional(),
  cropSeedToggles: z.record(z.boolean()).optional(),
  varietyIds: z.array(z.number().int()).optional(),
  useSpecificSeeds: z.boolean().optional(),
  isSeedSelectionValid: z.boolean().optional(),
  varietyCropMap: z.record(z.string()).optional(),
  varietySeedMap: z.record(z.array(z.number())).optional(),
  seedLabels: z.record(z.string()).optional(),
});

export type RegionBasicFormValues = z.infer<typeof regionBasicFormSchema>;
