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
  coordinates: z.array(coordinateSchema).optional(),
  status: z.enum(["active", "inactive", "archived"]).optional(),
  regionId: z.union([z.string(), z.number()]).optional(),
  plots: z.array(z.any()).optional(),
  createdAt: z.string().optional(),
});

export const regionInfoSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, "Vui lòng nhập tên vùng"),
  enterpriseId: z.string().optional(),
  cropIds: z.array(z.string()).optional(),
  area: z.number().min(0).optional(),
  provinceId: z.string().trim().min(1, "Vui lòng chọn Tỉnh / Thành phố"),
  wardId: z.string().trim().min(1, "Vui lòng chọn Phường / Xã"),
  address: z.string().optional(),
  landType: z.string().optional(),
  terrain: z.string().optional(),
  note: z.string().optional(),
});

export const regionFormSchema = regionInfoSchema
  .extend({
    isDetailed: z.boolean().optional(),
    coordinates: z.array(coordinateSchema).optional(),
    centerPoint: z
      .object({
        lat: z.number({ error: "Vĩ độ phải là số" }).optional(),
        lng: z.number({ error: "Kinh độ phải là số" }).optional(),
      })
      .optional(),
    metadataJson: z
      .object({
        address: z.string().optional(),
      })
      .optional(),
    subAreas: z.array(subAreaSchema).optional(),
    status: z.enum(["active", "inactive", "archived"]).optional(),
    createdAt: z.string().optional(),
    id: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isDetailed !== false) {
      if (!data.coordinates || data.coordinates.length < 3) {
        ctx.addIssue({
          code: "custom",
          message: "Vùng trồng cần ít nhất 3 điểm",
          path: ["coordinates"],
        });
      }
      if (data.subAreas && data.subAreas.length > 0) {
        data.subAreas.forEach((sub, idx) => {
          if (!sub.coordinates || sub.coordinates.length < 3) {
            ctx.addIssue({
              code: "custom",
              message: "Khu vực cần ít nhất 3 điểm",
              path: ["subAreas", idx, "coordinates"],
            });
          }
        });
      }
    } else {
      if (data.centerPoint?.lat === undefined || isNaN(data.centerPoint.lat)) {
        ctx.addIssue({
          code: "custom",
          message: "Vui lòng nhập vĩ độ",
          path: ["centerPoint", "lat"],
        });
      }
      if (data.centerPoint?.lng === undefined || isNaN(data.centerPoint.lng)) {
        ctx.addIssue({
          code: "custom",
          message: "Vui lòng nhập kinh độ",
          path: ["centerPoint", "lng"],
        });
      }
    }
  });

export type RegionFormValues = z.infer<typeof regionFormSchema>;
export type RegionInfoFormValues = z.infer<typeof regionInfoSchema>;
export type SubAreaFormValues = z.infer<typeof subAreaSchema>;
