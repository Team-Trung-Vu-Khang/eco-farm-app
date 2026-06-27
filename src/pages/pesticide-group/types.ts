import type { MasterDataStatus } from "@/features/master-data/types/master-data.type";
import type { PesticidePurposeFormValues } from "./data/pesticide-purpose-form.schema";

export interface PesticideCategoryItem {
  id: number;
  code: string;
  name: string;
  description: string;
  status: MasterDataStatus;
  createdAt: string;
}

export interface PesticideCategoryFormData {
  code: string;
  name: string;
  description: string;
  status: MasterDataStatus;
}

export type PesticidePurposeFormData = PesticidePurposeFormValues;

export type PesticideWhoClass = "Ia" | "Ib" | "II" | "III" | "IV";

export interface PesticideToxicityItem extends PesticideCategoryItem {
  whoClass: PesticideWhoClass;
  colorBand: string;
  ld50Range: string;
}

export interface PesticideToxicityFormData extends PesticideCategoryFormData {
  whoClass: PesticideWhoClass;
  colorBand: string;
  ld50Range: string;
}

export type PesticideGroupTab = "purpose" | "toxicity" | "origin";
