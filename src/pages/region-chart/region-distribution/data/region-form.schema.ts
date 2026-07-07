import { z } from "zod";

const coordinateSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const subAreaSchema = z.object({
  id: z.string().optional(),
  code: z.string().optional(),
  name: z.string().min(1, "Vui lòng nhập tên khu vực"),
  area: z.number().min(0).optional(),
  landType: z.string().optional(),
  terrain: z.string().optional(),
  coordinates: z.array(coordinateSchema).min(3, "Khu vực cần ít nhất 3 điểm"),
  status: z.enum(["active", "inactive", "archived"]).optional(),
  regionId: z.union([z.string(), z.number()]).optional(),
  plots: z.array(z.any()).optional(),
  createdAt: z.string().optional(),
});

export const regionInfoSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, "Vui lòng nhập tên vùng"),
  enterpriseId: z.string().optional(),
  cropId: z.string().optional(),
  area: z.number().min(0).optional(),
  provinceId: z.string().optional(),
  wardId: z.string().optional(),
  address: z.string().optional(),
  landType: z.string().optional(),
  terrain: z.string().optional(),
  note: z.string().optional(),
});

export const regionFormSchema = regionInfoSchema.extend({
  coordinates: z.array(coordinateSchema).min(3, "Vùng trồng cần ít nhất 3 điểm"),
  subAreas: z.array(subAreaSchema).optional(),
  status: z.enum(["active", "inactive", "archived"]).optional(),
  createdAt: z.string().optional(),
  id: z.number().optional(),
});

export type RegionFormValues = z.infer<typeof regionFormSchema>;
export type RegionInfoFormValues = z.infer<typeof regionInfoSchema>;
export type SubAreaFormValues = z.infer<typeof subAreaSchema>;
