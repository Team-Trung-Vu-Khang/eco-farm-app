import type { Bank } from "../types/types";

export const emptyBankFormData: Bank = {
  id: "",
  name: "",
  logo: "",
  fullName: "",
  shortName: "",
  bin: "",
  swiftCode: "",
  status: "active",
  transferSupported: true,
  lookupSupported: true,
  displayOrder: 0,
};
