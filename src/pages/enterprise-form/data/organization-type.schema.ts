import { z } from "zod";

export const ORGANIZATION_TYPE_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const ORGANIZATION_TYPE_FORM_TYPES = [
  "enterprise",
  "farm_household",
  "cooperative",
] as const;

export const organizationTypeFormSchema = z.object({
  code: z.string(),
  name: z.string().trim().min(1, "Vui lòng nhập tên."),
  description: z.string().trim().default(""),
  type: z.enum(ORGANIZATION_TYPE_FORM_TYPES).default("enterprise"),
  status: z.enum(ORGANIZATION_TYPE_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
  metadataJson: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type OrganizationTypeFormInput = z.input<
  typeof organizationTypeFormSchema
>;
export type OrganizationTypeFormValues = z.output<
  typeof organizationTypeFormSchema
>;
