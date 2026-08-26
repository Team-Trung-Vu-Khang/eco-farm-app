import type {
  ContactFormData,
  ContactGroupFormData,
} from "../types/types";

export const emptyContactFormData: ContactFormData = {
  entityName: "",
  groupIds: [],
  department: "",
  position: "",
  fullName: "",
  phone: "",
  email: "",
  note: "",
  status: "active",
};

export const emptyContactGroupFormData: ContactGroupFormData = {
  name: "",
  description: "",
  status: "active",
};
