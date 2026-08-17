import type { OrganizationOption } from "@/components/organizations/PartnerSelectorDialog";

export interface Equipment {
  id: number;
  code: string;
  name: string;
  technologyLevelId: string;
  valueChainId: string;
  financialManagementId: string;
  status: "active" | "maintenance" | "inactive";
  description: string;
  maintainanceInterval: string;
  createdAt: string;
  technicalDocType?: "file" | "editor";
  technicalDocContent?: string;
  supplierDetails?: SupplierDetail[];

  // New Fields matching desc-equipment-feature-for-domain.json
  sku: string;
  machineName: string;
  model?: string;
  productImage?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  manufactureYear?: number;
  technologyLevelGroup?: string;
  assetManagementGroup?: string;
  valueChainGroup?: string[];
  machineType?: string[];
  powerCapacity?: string;
  workingCapacity?: string;
  fuelEnergyType?: string;
  dimensions?: string;
  weight?: string;
  otherSpecifications?: string;
  fuelConsumptionRate?: string;
  maintenanceSchedule?: string;
  mainAccessories?: string;
  manufacturerOrigin?: OrganizationOption | null;
  importerRegistrant?: OrganizationOption | null;
  distributor?: OrganizationOption | null;
  referencePrice?: string;
  packagingSpecs?: string[];
  hashtags?: string[];
}

export interface SupplierDetail {
  supplierId: string;
  quantity: string;
  unit: string;
  warranty: string;
}

export interface EquipmentFormData {
  code: string;
  name: string;
  technologyLevelId: string;
  valueChainId: string;
  financialManagementId: string;
  status: string;
  maintainanceInterval: string;
  description: string;
  imageUrl?: string;
  imageFile?: File | null;
  technicalDocType: "file" | "editor";
  technicalDocContent: string;
  supplierDetails: SupplierDetail[];

  // New Fields matching desc-equipment-feature-for-domain.json
  sku: string;
  machineName: string;
  model: string;
  productImage: string;
  manufacturer: string;
  countryOfOrigin: string;
  manufactureYear: number | "";
  technologyLevelGroup: string;
  assetManagementGroup: string;
  valueChainGroup: string[];
  machineType: string[];
  powerCapacity: string;
  workingCapacity: string;
  fuelEnergyType: string;
  dimensions: string;
  weight: string;
  otherSpecifications: string;
  fuelConsumptionRate: string;
  maintenanceSchedule: string;
  mainAccessories: string;
  manufacturerOrigin: OrganizationOption | null;
  importerRegistrant: OrganizationOption | null;
  distributor: OrganizationOption | null;
  referencePrice: string;
  packagingSpecs: string[];
  hashtags: string[];
}
