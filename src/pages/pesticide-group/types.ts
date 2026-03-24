export type PesticideGroupStatus = "active" | "inactive";

export interface PesticideCategoryItem {
  id: number;
  code: string;
  name: string;
  description: string;
  status: PesticideGroupStatus;
  createdAt: string;
}

export interface PesticideCategoryFormData {
  code: string;
  name: string;
  description: string;
  status: PesticideGroupStatus;
}

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
