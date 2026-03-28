import type {
  ContactFormData,
  ContactGroupFormData,
} from "../types/types";

export const emptyContactFormData: ContactFormData = {
  fullName: "",
  phone: "",
  email: "",
  position: "",
  department: "",
  entityName: "",
  groupId: "",
  note: "",
  status: "active",
};

export const emptyContactGroupFormData: ContactGroupFormData = {
  code: "",
  name: "",
  description: "",
  status: "active",
};
