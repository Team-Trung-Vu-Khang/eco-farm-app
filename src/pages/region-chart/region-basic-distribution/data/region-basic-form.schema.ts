import { z } from "zod";

export const regionBasicFormSchema = z.object({
  id: z.number().optional(),
  code: z.string().optional(),
  name: z.string().min(1, "Vui lòng nhập tên vùng"),
  cropIds: z
    .array(z.string())
    .min(1, "Vui lòng chọn ít nhất 1 đối tượng chính"),
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
});

export type RegionBasicFormValues = z.infer<typeof regionBasicFormSchema>;
