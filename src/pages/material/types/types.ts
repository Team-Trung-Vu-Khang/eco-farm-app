import type { OrganizationOption } from "@/components/organizations/PartnerSelectorDialog";

export interface Material {
  id: number;
  code?: string;
  name: string;
  type?: string;
  description?: string;
  status?: "active" | "inactive";
  createdAt?: string;
  hashtags?: string[];
  imageUrl?: string;

  // Single & Multi classification group
  materialGroupId?: string;
  technologyLevelId?: string;
  valueChainId?: string;
  technologyLevelIds?: string[];
  valueChainIds?: string[];

  // Origin & Supply fields
  manufacturerOrigin?: OrganizationOption | string | null;
  importerRegistrant?: OrganizationOption | string | null;
  distributor?: OrganizationOption | string | null;
  packagingSpecs?: string[];
  formType?: "basic" | "advanced";
}

export interface MaterialFormData {
  code: string;
  name: string;
  type: string;
  description: string;
  hashtags: string[];
  imageUrl?: string;
  imageFile?: File | null;

  materialGroupId: string;
  technologyLevelId: string;
  valueChainId: string;
  technologyLevelIds: string[];
  valueChainIds: string[];

  // Origin & Supply fields
  manufacturerOrigin: OrganizationOption | null;
  importerRegistrant: OrganizationOption | null;
  distributor: OrganizationOption | null;
  packagingSpecs: string[];
}
