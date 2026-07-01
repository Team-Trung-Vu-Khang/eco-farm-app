import { z } from "zod";

export const POSITION_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const POSITION_DOCUMENT_TYPES = ["editor", "pdf"] as const;

export const positionDocumentSchema = z
  .object({
    id: z.coerce.number().int().positive().optional(),
    type: z.enum(POSITION_DOCUMENT_TYPES, {
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
        path: ["content"],
        message: "Vui lòng nhập nội dung tài liệu.",
      });
    }

    if (value.type === "pdf" && !value.fileUrl.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fileUrl"],
        message: "Vui lòng tải file tài liệu.",
      });
    }

    if (value.type === "pdf" && !value.fileName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fileName"],
        message: "Vui lòng tải file tài liệu.",
      });
    }
  });

export const positionFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã chức vụ."),
  name: z.string().trim().min(1, "Vui lòng nhập tên chức vụ."),
  positionGroupId: z.string().trim().min(1, "Vui lòng chọn nhóm chức vụ."),
  description: z.string().trim(),
  responsibilityDescription: z.string().trim(),
  displayOrder: z.coerce
    .number({
      message: "Vui lòng nhập thứ tự hiển thị hợp lệ.",
    })
    .int("Thứ tự hiển thị phải là số nguyên.")
    .nonnegative("Thứ tự hiển thị phải lớn hơn hoặc bằng 0.")
    .default(1),
  documents: z.array(positionDocumentSchema).default([]),
  status: z.enum(POSITION_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type PositionDocumentFormValues = z.output<typeof positionDocumentSchema>;
export type PositionFormInput = z.input<typeof positionFormSchema>;
export type PositionFormValues = z.output<typeof positionFormSchema>;
