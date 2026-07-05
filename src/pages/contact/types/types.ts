import type { ContactRecord } from "@/features/contact";
import type { ContactGroupRecord } from "@/features/contact-group";
import type { ContactGroupFormValues } from "../data/contact-group-form.schema";
import type { ContactFormValues } from "../data/contact-form.schema";

export type CategoryType = "contacts" | "groups";

export type ContactFormData = ContactFormValues;

export type Contact = ContactRecord;
export type ContactGroup = ContactGroupRecord;
export type ContactGroupFormData = ContactGroupFormValues;
