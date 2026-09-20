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
  // Dấu mộc là tuỳ chọn, giống tài liệu đính kèm
  stampUrl: z.string().trim().default(""),
  validityMonths: z.coerce
    .number()
    .int("Thời hạn hiệu lực phải là số nguyên.")
    .min(0, "Thời hạn hiệu lực không được âm."),
  organizationIds: z.array(z.coerce.number().int()).default([]),
  description: z.string().trim().default(""),
  status: z.enum(STANDARD_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
  // Tài liệu là tuỳ chọn; nếu có thêm thì từng tài liệu vẫn phải hợp lệ
  documents: z.array(standardDocumentFormSchema).default([]),
});

export type StandardDocumentFormInput = z.input<typeof standardDocumentFormSchema>;
export type StandardDocumentFormValues = z.output<typeof standardDocumentFormSchema>;
export type StandardFormInput = z.input<typeof standardFormSchema>;
export type StandardFormValues = z.output<typeof standardFormSchema>;
