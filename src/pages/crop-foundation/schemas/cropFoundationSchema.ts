import { z } from "zod";

const documentSectionSchema = z.object({
  type: z.enum(["editor", "pdf"]),
  content: z.any(),
  file: z.any().nullable().optional(),
});

export const technicalSpecsSchema = z
  .object({
    scientificName: z.string().optional(),
    family: z.string().optional(),
    origin: z.string().optional(),
    temperatureFrom: z
      .number({ error: "Vui lòng nhập số hợp lệ" })
      .min(-50, "Nhiệt độ tối thiểu -50°C")
      .max(100, "Nhiệt độ tối đa 100°C")
      .nullable()
      .optional(),
    temperatureTo: z
      .number({ error: "Vui lòng nhập số hợp lệ" })
      .min(-50, "Nhiệt độ tối thiểu -50°C")
      .max(100, "Nhiệt độ tối đa 100°C")
      .nullable()
      .optional(),
    humidityFrom: z
      .number({ error: "Vui lòng nhập số hợp lệ" })
      .min(0, "Độ ẩm tối thiểu 0%")
      .max(100, "Độ ẩm tối đa 100%")
      .nullable()
      .optional(),
    humidityTo: z
      .number({ error: "Vui lòng nhập số hợp lệ" })
      .min(0, "Độ ẩm tối thiểu 0%")
      .max(100, "Độ ẩm tối đa 100%")
      .nullable()
      .optional(),
    phFrom: z
      .number({ error: "Vui lòng nhập số hợp lệ" })
      .min(0, "Độ pH tối thiểu 0")
      .max(14, "Độ pH tối đa 14")
      .nullable()
      .optional(),
    phTo: z
      .number({ error: "Vui lòng nhập số hợp lệ" })
      .min(0, "Độ pH tối thiểu 0")
      .max(14, "Độ pH tối đa 14")
      .nullable()
      .optional(),
    plantingDensity: z.string().optional(),
    watering: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.temperatureFrom != null &&
      data.temperatureTo != null &&
      data.temperatureFrom > data.temperatureTo
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Nhiệt độ 'Từ' không được lớn hơn 'Đến'",
        path: ["temperatureFrom"],
      });
      ctx.addIssue({
        code: "custom",
        message: "Nhiệt độ 'Từ' không được lớn hơn 'Đến'",
        path: ["temperatureTo"],
      });
    }
    if (
      data.humidityFrom != null &&
      data.humidityTo != null &&
      data.humidityFrom > data.humidityTo
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Độ ẩm 'Từ' không được lớn hơn 'Đến'",
        path: ["humidityFrom"],
      });
      ctx.addIssue({
        code: "custom",
        message: "Độ ẩm 'Từ' không được lớn hơn 'Đến'",
        path: ["humidityTo"],
      });
    }
    if (data.phFrom != null && data.phTo != null && data.phFrom > data.phTo) {
      ctx.addIssue({
        code: "custom",
        message: "Độ pH 'Từ' không được lớn hơn 'Đến'",
        path: ["phFrom"],
      });
      ctx.addIssue({
        code: "custom",
        message: "Độ pH 'Từ' không được lớn hơn 'Đến'",
        path: ["phTo"],
      });
    }
  });

export const basicInfoSchema = z.object({
  code: z.string().min(1, "Mã giống cây không được để trống"),
  name: z.string().min(1, "Tên giống cây không được để trống"),
  cropGroupId: z.string().min(1, "Vui lòng chọn nhóm cây trồng"),
  cropFoundationType: z.string().optional(),
  variety: z.string().optional(),
  illustration: z.any().nullable().optional(),
  description: z.string().optional(),
  harvestMethod: z.string().optional(),
});

export const cropFoundationSchema = basicInfoSchema.extend({
  selectedSeedIds: z.array(z.string()).optional(),
  technicalSpecs: technicalSpecsSchema,
  growthCycles: z.array(z.any()).optional(),
  docs: z.object({
    farmingTechnique: documentSectionSchema,
    qualityStandard: documentSectionSchema,
  }),
});

export type CropFoundationFormValues = z.infer<typeof cropFoundationSchema>;
