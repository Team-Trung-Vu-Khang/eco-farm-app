import { useContactForm } from "./useContactForm";

export function useContactCreate() {
  return useContactForm({ mode: "create" });
}
