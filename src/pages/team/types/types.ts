export interface TeamFormData {
  code: string;
  name: string;
  leader: string;
  department: string;
  description: string;
  status: "active" | "inactive";
}

export const emptyTeamFormData: TeamFormData = {
  code: "",
  name: "",
  leader: "",
  department: "",
  description: "",
  status: "active",
};
