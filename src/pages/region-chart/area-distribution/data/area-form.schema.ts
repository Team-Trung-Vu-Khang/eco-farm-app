import { z } from "zod";

const coordinateSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const plotSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  code: z.string().optional(),
  name: z.string().min(1, "Vui lòng nhập tên lô"),
  acreage: z.number().min(0, "Diện tích không hợp lệ").optional(),
  elevation: z.number({ error: "Vui lòng nhập số" }).optional(),
  contourInterval: z.number({ error: "Vui lòng nhập số" }).optional(),
  coordinates: z
    .array(coordinateSchema)
    .min(3, "Lô cần ít nhất 3 điểm")
    .optional(),
});

export const areaInfoSchema = z.object({
  // enterpriseId: z.string().min(1, "Vui lòng chọn đơn vị sở hữu"),
  enterpriseId: z.string().optional(),
  regionId: z.number({
    error: "Vui lòng chọn vùng trồng",
  }),
  code: z.string().optional(),
  name: z.string().min(1, "Vui lòng nhập tên khu vực"),
  acreage: z.number().min(0).optional(),
  soilType: z.string().optional(),
  terrainFeature: z.string().optional(),
  note: z.string().optional(),
});

export const areaFormSchema = areaInfoSchema.extend({
  coordinates: z.array(coordinateSchema).min(3, "Khu vực cần ít nhất 3 điểm"),
  plots: z.array(plotSchema).optional(),
  status: z.enum(["active", "inactive", "archived"]).optional(),
  id: z.number().optional(),
});

export type AreaFormValues = z.infer<typeof areaFormSchema>;
export type PlotFormValues = z.infer<typeof plotSchema>;
