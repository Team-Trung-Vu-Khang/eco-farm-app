import { createContext, useContext } from "react";
import type { useEnterpriseCreateForm } from "../hooks/useEnterpriseCreateForm";

export type EnterpriseFormContextType = ReturnType<
  typeof useEnterpriseCreateForm
>;

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
