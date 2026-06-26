import { z } from "zod";

export const bankFormSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập mã ngân hàng.")
    .regex(/^[A-Za-z0-9]+$/, "Mã ngân hàng chỉ được chứa chữ và số."),
  name: z.string().optional(),
  shortName: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên ngắn."),
  fullName: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên đầy đủ."),
  logo: z.string().trim().min(1, "Vui lòng tải logo ngân hàng."),
  bin: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập BIN.")
    .regex(/^\d+$/, "BIN chỉ được chứa số."),
  swiftCode: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .refine(
      (value) => value === "" || /^[A-Z0-9]{8}([A-Z0-9]{3})?$/.test(value),
      "SWIFT Code phải có 8 hoặc 11 ký tự chữ/số.",
    )
    .optional(),
  status: z.enum(["active", "inactive", "archived"], {
    errorMap: () => ({ message: "Vui lòng chọn trạng thái." }),
  }),
  transferSupported: z.boolean(),
  lookupSupported: z.boolean(),
  displayOrder: z
    .number({
      invalid_type_error: "Vui lòng nhập display order hợp lệ.",
      required_error: "Vui lòng nhập display order hợp lệ.",
    })
    .int("Display order phải là số nguyên.")
    .nonnegative("Display order phải lớn hơn hoặc bằng 0."),
});

export type BankFormValues = z.infer<typeof bankFormSchema>;
