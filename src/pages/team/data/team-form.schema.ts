import { z } from "zod";

export const TEAM_FORM_STATUSES = ["active", "inactive"] as const;

export const teamFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã đội nhóm."),
  name: z.string().trim().min(1, "Vui lòng nhập tên đội nhóm."),
  department: z.string().trim().optional(),
  leader: z.string().trim().optional(),
  description: z.string().trim().optional(),
  status: z.enum(TEAM_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;

export const emptyTeamFormValues: TeamFormValues = {
  code: "",
  name: "",
  department: "",
  leader: "",
  description: "",
  status: "active",
};
