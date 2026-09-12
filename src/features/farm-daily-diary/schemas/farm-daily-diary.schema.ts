import { z } from "zod";

export const photoRequestSchema = z.object({
  objectKey: z.string().min(1, "Thiếu objectKey ảnh"),
  fileUrl: z.string().min(1, "Thiếu fileUrl ảnh"),
  fileName: z.string().optional(),
  mimeType: z.string().optional(),
  sizeBytes: z.number().optional(),
  thumbnail: z
    .object({
      objectKey: z.string().optional(),
      fileUrl: z.string().optional(),
      fileName: z.string().optional(),
      mimeType: z.string().optional(),
      sizeBytes: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional()
    .nullable(),
});

export const supplyUsageSchema = z.object({
  supplyItemId: z.number({ required_error: "Vui lòng chọn vật tư" }).positive(),
  unitBaseId: z.number({ required_error: "Vui lòng chọn đơn vị tính" }).positive(),
  quantityActual: z.number({ required_error: "Vui lòng nhập số lượng thực tế" }).positive("Số lượng phải lớn hơn 0"),
});
export const supplyUsageRequestSchema = supplyUsageSchema;


export const dailyDiaryLineSchema = z
  .object({
    dailyTaskId: z.number().nullable().optional(),
    name: z.string().min(1, "Tên công việc không được để trống"),
    taskCategoryId: z.number().nullable().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional().default("MEDIUM"),
    startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
    endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
    scopeType: z.enum(["REGION", "AREA", "PLOT"]).nullable().optional(),
    scopeId: z.number().nullable().optional(),
    description: z.string().nullable().optional(),
    supplies: z.array(supplyUsageRequestSchema).optional().default([]),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: "Ngày kết thúc không được trước ngày bắt đầu",
      path: ["endDate"],
    },
  );

export const harvestItemSchema = z.object({
  targetType: z.enum(["ZONE", "ZONE_SUBJECT_VARIANT"], {
    required_error: "Vui lòng chọn loại đối tượng thu hoạch",
  }),
  targetId: z.number({ required_error: "Vui lòng chọn vị trí/cây thu hoạch" }).positive(),
  quantity: z.number({ required_error: "Vui lòng nhập sản lượng thu hoạch" }).positive("Sản lượng phải lớn hơn 0"),
  unitBaseId: z.number({ required_error: "Vui lòng chọn đơn vị tính" }).positive(),
});

export const createDailyDiaryEntrySchema = z
  .object({
    workflowId: z.number({ required_error: "Vui lòng chọn quy trình canh tác" }).positive("Vui lòng chọn quy trình canh tác"),
    seasonId: z.number().optional(),
    purpose: z.enum(
      ["CULTIVATION", "FACILITY_UPGRADE", "TREATMENT", "SOIL_IMPROVEMENT", "HARVEST"],
      { required_error: "Vui lòng chọn mục đích" },
    ),
    description: z.string().optional().default(""),
    photos: z.array(photoRequestSchema).optional().default([]),
    lines: z.array(dailyDiaryLineSchema).optional().default([]),
    harvestItems: z.array(harvestItemSchema).optional().default([]),
  })
  .refine(
    (data) => {
      const hasDescription = Boolean(data.description && data.description.trim().length > 0);
      const hasPhotos = Boolean(data.photos && data.photos.length > 0);
      const hasLines = Boolean(data.lines && data.lines.length > 0);
      const hasHarvest = Boolean(data.harvestItems && data.harvestItems.length > 0);
      return hasDescription || hasPhotos || hasLines || hasHarvest;
    },
    {
      message:
        "Nhật ký cần có ít nhất 1 nội dung (Mô tả, Ảnh chứng từ, Công việc phát sinh hoặc Sản lượng thu hoạch)",
      path: ["description"],
    },
  );

export type CreateDailyDiaryEntryFormValues = z.infer<typeof createDailyDiaryEntrySchema>;
