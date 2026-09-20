export type WHOClass = "I" | "II" | "III" | "IV";
export type MaterialCategory =
  | "Equipment"
  | "Fertilizer"
  | "Pesticide"
  | "Material";

export interface CategoryOption {
  id: MaterialCategory;
  name: string;
  icon: any;
  color: string;
}

export interface MaterialItem {
  id: string; // Unique ID (e.g., pesticide-1)
  originalId: number;
  code: string;
  name: string;
  category: MaterialCategory;
  subCategory: string;
  status: "active" | "inactive" | "maintenance";
  createdAt: string;
  manufacturer?: string;
  toxicityClass?: WHOClass;
  phi?: number;
  source?: "MASTER" | "OWNER";
  rawSupplyItem?: any;
  originalData: any; // The original object from store or transformed API response
}

export interface MaterialFilters {
  search: string;
  categories: MaterialCategory[];
  status: ("active" | "inactive" | "maintenance")[];
  toxicityGroupIds: number[];
  phiRange: [number, number];
  onlyOwner: boolean;
}

// Re-export specific types from stores for convenience in detail views
export type { Pesticide } from "../../pesticide/types";
export type { Fertilizer } from "../../fertilizer/data/constants";
export type { Material } from "../../material/types/types";
export type { Equipment } from "../../equipment/types";
