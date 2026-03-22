import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { EnterpriseFormData } from "../types";

interface EnterpriseFormContextType {
  formData: EnterpriseFormData;
  setFormData: Dispatch<SetStateAction<EnterpriseFormData>>;
  // Add other properties if they are used in the context
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
