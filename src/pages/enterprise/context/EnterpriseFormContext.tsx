import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Control } from "react-hook-form";
import type { useEnterpriseCreateForm } from "../hooks/useEnterpriseCreateForm";
import type {
  EnterpriseFormInput,
  EnterpriseFormValues,
} from "../data/enterprise-form.schema";
import type { EnterpriseFormData } from "../types";

interface EnterpriseFormContextType {
  formData: EnterpriseFormData;
  setFormData: Dispatch<SetStateAction<EnterpriseFormData>>;
  control: Control<EnterpriseFormInput>;
  steps: ReturnType<typeof useEnterpriseCreateForm>["steps"];
  showConfirmDialog: boolean;
  setShowConfirmDialog: Dispatch<SetStateAction<boolean>>;
  submitForm: () => void;
  setLocation: ReturnType<typeof useEnterpriseCreateForm>["setLocation"];
  handleComplete: ReturnType<typeof useEnterpriseCreateForm>["handleComplete"];
  [key: string]: any;
}

export const EnterpriseFormContext =
  createContext<EnterpriseFormContextType | null>(null);

export const useEnterpriseFormContext = () => {
  const context = useContext(EnterpriseFormContext);
  if (!context) {
    throw new Error(
      "useEnterpriseFormContext must be used within an EnterpriseFormContext.Provider",
    );
  }
  return context;
};
