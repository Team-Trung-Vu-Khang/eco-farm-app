import { z } from "zod";

export const ENTERPRISE_CERTIFICATE_ENTITY_TYPES = [
  "workspace",
  "region",
] as const;

export const ENTERPRISE_CERTIFICATE_CONTENT_TYPES = [
  "editor",
  "file",
] as const;

const enterpriseCertificateBasicInfoSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã chứng nhận."),
  name: z.string().trim().min(1, "Vui lòng nhập tên chứng nhận."),
  standardType: z.string().trim().min(1, "Vui lòng chọn loại tiêu chuẩn."),
  organization: z.string().trim().min(1, "Vui lòng chọn tổ chức cấp."),
});

const enterpriseCertificateTimingSchema = z.object({
  issuedDate: z.string().trim().min(1, "Vui lòng chọn ngày cấp."),
  expiryDate: z.string().trim().min(1, "Vui lòng chọn ngày hết hạn."),
});

const enterpriseCertificateEntitySchema = z
  .object({
    entityType: z.enum(ENTERPRISE_CERTIFICATE_ENTITY_TYPES, {
      message: "Vui lòng chọn phạm vi cấp chứng nhận.",
    }),
    entityId: z.string().trim().default(""),
    entityName: z.string().trim().default(""),
    targetIds: z.array(z.string().trim()).default([]),
    targetNames: z.array(z.string().trim()).default([]),
  })
  .superRefine((value, ctx) => {
    if (value.entityType === "workspace") {
      if (!value.entityId.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn đối tượng cấp.",
          path: ["entityId"],
        });
      }

      if (!value.entityName.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn đối tượng cấp.",
          path: ["entityName"],
        });
      }
      return;
    }

    if (value.targetIds.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn ít nhất một vùng canh tác.",
        path: ["targetIds"],
      });
    }
  });

const enterpriseCertificateContentSchema = z
  .object({
    contentType: z.enum(ENTERPRISE_CERTIFICATE_CONTENT_TYPES, {
      message: "Vui lòng chọn kiểu nội dung.",
    }),
    content: z.string().trim().default(""),
    fileUrl: z.string().trim().default(""),
    attachments: z.array(z.string().trim()).default([]),
  })
  .superRefine((value, ctx) => {
    if (value.contentType === "editor" && !value.content.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng nhập nội dung chứng nhận.",
        path: ["content"],
      });
    }

    if (value.contentType === "file" && !value.fileUrl.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng tải file chứng nhận.",
        path: ["fileUrl"],
      });
    }
  });

export const enterpriseCertificateFormSchema = z
  .object({
    ...enterpriseCertificateBasicInfoSchema.shape,
    ...enterpriseCertificateTimingSchema.shape,
    ...enterpriseCertificateEntitySchema.shape,
    ...enterpriseCertificateContentSchema.shape,
  })
  .superRefine((value, ctx) => {
    if (value.entityType === "workspace") {
      if (!value.entityId.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn đối tượng cấp.",
          path: ["entityId"],
        });
      }

      if (!value.entityName.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn đối tượng cấp.",
          path: ["entityName"],
        });
      }
    }

    if (value.entityType === "region" && value.targetIds.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn ít nhất một vùng canh tác.",
        path: ["targetIds"],
      });
    }

    if (value.contentType === "editor" && !value.content.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng nhập nội dung chứng nhận.",
        path: ["content"],
      });
    }

    if (value.contentType === "file" && !value.fileUrl.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng tải file chứng nhận.",
        path: ["fileUrl"],
      });
    }
  });

export const enterpriseCertificateBasicInfoStepSchema =
  enterpriseCertificateBasicInfoSchema;
export const enterpriseCertificateTimingStepSchema =
  enterpriseCertificateTimingSchema;
export const enterpriseCertificateEntityStepSchema =
  enterpriseCertificateEntitySchema;
export const enterpriseCertificateContentStepSchema =
  enterpriseCertificateContentSchema;

export type EnterpriseCertificateFormInput = z.input<
  typeof enterpriseCertificateFormSchema
>;
export type EnterpriseCertificateFormValues = z.output<
  typeof enterpriseCertificateFormSchema
>;

export const defaultEnterpriseCertificateFormValues: EnterpriseCertificateFormValues =
  {
    code: "",
    name: "",
    standardType: "",
    organization: "",
    issuedDate: "",
    expiryDate: "",
    entityType: "workspace",
    entityId: "",
    entityName: "Workspace hiện tại",
    targetIds: [],
    targetNames: [],
    contentType: "editor",
    content: "",
    fileUrl: "",
    attachments: [],
  };
