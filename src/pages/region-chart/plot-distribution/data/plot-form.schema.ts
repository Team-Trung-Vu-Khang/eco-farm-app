import { z } from "zod";

const coordinateSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const plotFormSchema = z.object({
  enterpriseId: z.number().optional(),
  regionId: z.number({
    error: "Vui lòng chọn vùng trồng",
  }),
  areaId: z.number({
    error: "Vui lòng chọn khu vực",
  }),
  code: z.string().optional(),
  name: z.string().min(1, "Vui lòng nhập tên lô"),
  acreage: z.number({
    error: "Vui lòng nhập diện tích hợp lệ",
  }).min(0.01, "Diện tích phải lớn hơn 0"),
  contourInterval: z.string().optional(),
  elevation: z.number({
    error: "Vui lòng nhập độ cao hợp lệ",
  }).optional(),
  coordinates: z.array(coordinateSchema).min(3, "Lô trồng cần ít nhất 3 điểm ranh giới"),
});

export type PlotFormValues = z.infer<typeof plotFormSchema>;
