// ─── Supply Conversion Rule Types ─────────────────────────────────────────────

/**
 * Equipment is NOT supported for conversion rules (see note mục 2.4).
 */
export type ConversionRuleSupplyType = "medicine" | "fertilizer" | "material";

export interface SupplyItemRef {
  id: number;
  code: string;
  sku: string;
  name: string;
  source: "MASTER" | "OWNER";
  workspaceId: number | null;
}

export interface SupplyConversionRuleResponse {
  id: number;
  source: "MASTER" | "OWNER";
  workspaceId: number | null;
  domainCode: string;
  /**
   * REST returns lowercase ("material"); GraphQL returns uppercase ("MATERIAL").
   * FE must normalize when comparing.
   */
  supplyType: string;
  fromSupplyItem: SupplyItemRef;
  quantity: number;
  toSupplyItem: SupplyItemRef;
  createdAt: string;
  updatedAt: string;
}

export interface SupplyConversionRuleRequest {
  fromSupplyItemId: number;
  /** Must be > 0. Max 12 integer digits + 8 decimal digits. */
  quantity: number;
  toSupplyItemId: number;
}

export interface SupplyConversionRuleQueryParams {
  keyword?: string;
  domainCode?: string;
  supplyType?: ConversionRuleSupplyType;
  page?: number;
  size?: number;
  /** Farm endpoint only — filter to show only OWNER rules */
  onlyOwner?: boolean;
}

// ─── Deletion Impact Types ────────────────────────────────────────────────────

export type DeletionImpactResourceType = "SUPPLY_CONVERSION_RULE";

export interface DeletionImpactBlocker {
  /** Currently only "SUPPLY_CONVERSION_RULE"; may expand later. */
  resourceType: DeletionImpactResourceType;
  /** Shape depends on resourceType. Currently always SupplyConversionRuleResponse. */
  resourceData: SupplyConversionRuleResponse;
}

export interface DeletionImpactResponse {
  content: DeletionImpactBlocker[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
