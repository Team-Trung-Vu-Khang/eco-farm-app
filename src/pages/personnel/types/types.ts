import type { Personnel } from "../../stores/usePersonnelStore";

export type PersonnelStatus = Personnel["status"];

export interface PersonnelFormData {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  address: string;
  taxCode: string;
  taxAddress: string;
  avatar: string;
  department: string;
  position: string;
  team: string;
  status: PersonnelStatus;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  bankBranch: string;
}

export const emptyPersonnelFormData: PersonnelFormData = {
  fullName: "",
  phone: "",
  email: "",
  province: "",
  district: "",
  address: "",
  taxCode: "",
  taxAddress: "",
  avatar: "",
  department: "",
  position: "",
  team: "",
  status: "active",
  bankName: "",
  accountNumber: "",
  accountHolder: "",
  bankBranch: "",
};
