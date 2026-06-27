import { z } from "zod";

export const STANDARD_FORM_STATUSES = ["active", "inactive"] as const;
export const STANDARD_DOCUMENT_TYPES = ["editor", "pdf"] as const;

export const standardDocumentFormSchema = z
  .object({
    type: z.enum(STANDARD_DOCUMENT_TYPES, {
      message: "Vui lòng chọn loại tài liệu.",
    }),
    name: z.string().trim().min(1, "Vui lòng nhập tên tài liệu."),
    content: z.string().trim().default(""),
    fileUrl: z.string().trim().default(""),
    fileName: z.string().trim().default(""),
  })
  .superRefine((value, ctx) => {
    if (value.type === "editor" && !value.content.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng nhập nội dung tài liệu.",
        path: ["content"],
      });
    }

    if (value.type === "pdf" && !value.fileUrl.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng tải file PDF.",
        path: ["fileUrl"],
      });
    }
  });

export const standardFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã tiêu chuẩn."),
  name: z.string().trim().min(1, "Vui lòng nhập tên tiêu chuẩn."),
  stampUrl: z.string().trim().min(1, "Vui lòng tải dấu mộc."),
  validityMonths: z.coerce
    .number()
    .int("Thời hạn hiệu lực phải là số nguyên.")
    .min(0, "Thời hạn hiệu lực không được âm."),
  organizationIds: z.array(z.coerce.number().int()).default([]),
  description: z.string().trim().default(""),
  status: z.enum(STANDARD_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
  documents: z
    .array(standardDocumentFormSchema)
    .min(1, "Vui lòng thêm ít nhất một tài liệu."),
});

export type StandardDocumentFormInput = z.input<typeof standardDocumentFormSchema>;
export type StandardDocumentFormValues = z.output<typeof standardDocumentFormSchema>;
export type StandardFormInput = z.input<typeof standardFormSchema>;
export type StandardFormValues = z.output<typeof standardFormSchema>;
