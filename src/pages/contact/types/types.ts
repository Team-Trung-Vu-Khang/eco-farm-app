import type { Contact, ContactGroup } from "@/stores/useContactStore";

export type CategoryType = "contacts" | "groups";

export interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  position: string;
  department: string;
  entityName: string;
  groupId: string;
  note: string;
  status: "active" | "inactive";
}

export type ContactGroupFormData = Omit<
  ContactGroup,
  "id" | "createdAt" | "contactCount"
>;

export type { Contact, ContactGroup };
