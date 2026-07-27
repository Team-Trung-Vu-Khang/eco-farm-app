import { z } from "zod";

// ─── Scope ────────────────────────────────────────────────────────────────────

export const cultivationZoneScopeSchema = z.object({
  scopeType: z.enum(["REGION", "AREA", "PLOT"]),
  scopeId: z.number().int().positive("Vui lòng chọn đơn vị địa lý hợp lệ"),
});

// ─── Main form schema ─────────────────────────────────────────────────────────

export const cultivationZoneFormSchema = z.object({
  /** Tên vùng canh tác — bắt buộc */
  name: z.string().min(1, "Vui lòng nhập tên vùng canh tác"),

  /** Mã vùng canh tác — tuỳ chọn, tự sinh nếu bỏ trống */
  code: z.string().optional(),

  /** Phạm vi địa lý — ít nhất 1 đơn vị */
  selections: z.array(z.any()).min(1, "Vui lòng chọn ít nhất 1 phạm vi địa lý"),

  scopes: z.array(cultivationZoneScopeSchema).optional(),

  /** Phương pháp canh tác — bắt buộc */
  farmingMethodId: z
    .number({ message: "Vui lòng chọn phương pháp canh tác" })
    .int()
    .min(1, "Vui lòng chọn phương pháp canh tác"),

  /** Phương pháp chăn nuôi / nuôi trồng / tưới tiêu — tuỳ chọn */
  rearingMethodId: z.number().int().optional(),

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
