import type {
  ContactFormData,
  ContactGroupFormData,
} from "../types/types";

export const emptyContactFormData: ContactFormData = {
  entityName: "",
  groupId: "",
  department: "",
  position: "",
  fullName: "",
  phone: "",
  email: "",
  note: "",
  status: "active",
};

export const emptyContactGroupFormData: ContactGroupFormData = {
  code: "",
  name: "",
  description: "",
  status: "active",
};
