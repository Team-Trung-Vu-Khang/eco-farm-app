import { useContactForm } from "./useContactForm";

export function useContactEdit() {
  return useContactForm({ mode: "edit" });
}
