import type { Contact } from "@/stores/useContactStore";
import type {
  ContactGroupCreateRequest,
  ContactGroupRecord,
} from "@/features/contact-group";
import type { ContactGroupFormValues } from "../data/contact-group-form.schema";

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

export type ContactGroup = ContactGroupRecord;
export type ContactGroupFormData = ContactGroupFormValues;

export type { Contact };
