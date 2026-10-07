import { z } from "zod";

export const regionBasicFormSchema = z.object({
  id: z.number().optional(),
  code: z.string().optional(),
  name: z.string().trim().min(1, "Vui lòng nhập tên vùng"),
  cropIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 cây trồng"),
  area: z.coerce.number().optional(),
  provinceId: z.string().trim().min(1, "Vui lòng chọn Tỉnh / Thành phố"),
  wardId: z.string().trim().min(1, "Vui lòng chọn Phường / Xã"),
  address: z.string().optional(),
  landType: z.string().optional(),
  terrain: z.string().optional(),
  note: z.string().optional(),
  addressLocation: z
    .object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
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
  cropSeedToggles: z.record(z.string(), z.boolean()).optional(),
  varietyIds: z.array(z.number().int()).optional(),
  useSpecificSeeds: z.boolean().optional(),
  isSeedSelectionValid: z.boolean().optional(),
  varietyCropMap: z.record(z.string(), z.string()).optional(),
  varietyLabels: z.record(z.string(), z.string()).optional(),
  varietySeedMap: z.record(z.string(), z.array(z.number())).optional(),
  seedLabels: z.record(z.string(), z.string()).optional(),
});

export type RegionBasicFormValues = z.infer<typeof regionBasicFormSchema>;
