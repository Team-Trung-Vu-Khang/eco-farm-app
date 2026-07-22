import { z } from "zod";

// ─── Scope ────────────────────────────────────────────────────────────────────

export const cultivationZoneScopeSchema = z.object({
  scopeType: z.enum(["REGION", "AREA", "PLOT"]),
  scopeId: z.number().int().positive("Vui lòng chọn đơn vị địa lý hợp lệ"),
});

// ─── Main form schema ─────────────────────────────────────────────────────────

export const cultivationZoneFormSchema = z.object({
  /** Tên vùng chăn nuôi — bắt buộc */
  name: z.string().min(1, "Vui lòng nhập tên vùng chăn nuôi"),

  /** Mã vùng chăn nuôi — tuỳ chọn, tự sinh nếu bỏ trống */
  code: z.string().optional(),

  /** Đơn vị sở hữu — tuỳ chọn */
  enterpriseId: z.string().optional(),

  /** Phạm vi địa lý — ít nhất 1 đơn vị */
  selections: z.array(z.any()).min(1, "Vui lòng chọn ít nhất 1 phạm vi địa lý"),

  scopes: z.array(cultivationZoneScopeSchema).optional(),

  /** Phương pháp chăn nuôi — bắt buộc */
  farmingMethodId: z
    .number({ message: "Vui lòng chọn phương pháp chăn nuôi" })
    .int()
    .min(1, "Vui lòng chọn phương pháp chăn nuôi"),

  /** Hệ thống cấp nước/chuồng trại — bắt buộc */
  irrigationSystemId: z
    .number({ message: "Vui lòng chọn hệ thống cấp nước/chuồng trại" })
    .int()
    .min(1, "Vui lòng chọn hệ thống cấp nước/chuồng trại"),

  /** Giống/hạt giống — tuỳ chọn */
  seedIds: z.array(z.number().int().positive()).optional(),

  /** Chứng nhận — tuỳ chọn */
  certificateIds: z.array(z.number().int().positive()).optional(),

  /** Nhân sự — tuỳ chọn */
  personnelIds: z.array(z.number().int().positive()).optional(),

  /** Ghi chú */
  notes: z.string().optional(),

  /** Trạng thái */
  status: z
    .enum(["active", "inactive", "archived"])
    .optional()
    .default("active"),

  // ─── Internal helpers (không gửi lên API) ────────────────────────────
  /** ID nếu đang ở edit mode */
  id: z.number().int().optional(),
});

export type CultivationZoneFormValues = z.infer<
  typeof cultivationZoneFormSchema
>;

export type CultivationZoneScopeFormValues = z.infer<
  typeof cultivationZoneScopeSchema
>;
