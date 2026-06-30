import { z } from "zod";

export const contactGroupFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã nhóm."),
  name: z.string().trim().min(1, "Vui lòng nhập tên nhóm."),
  description: z.string().default(""),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
  metadataJson: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type ContactGroupFormValues = z.infer<typeof contactGroupFormSchema>;
