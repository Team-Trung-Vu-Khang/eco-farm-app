import { useQueries } from "@tanstack/react-query";
import { farmSupplyApi } from "../api/farm-supply.api";
import type {
  CatalogRef,
  ClassificationGroup,
  DomainCode,
  SupplyType,
} from "../types";

export interface SupplyCatalogOptions {
  type: SupplyType;
  domainCode?: DomainCode;
}

/**
 * Bundles the master-data catalogs a supply form needs:
 * packaging types, base units, classification groups, target subjects
 * and certificate standards. All queries share a 5-min stale time.
 *
 * `domainCode` is optional: pass it when the form needs target-subject
 * options (pesticide/biological) to avoid a wasted request otherwise.
 */
export function useSupplyCatalog({ type, domainCode }: SupplyCatalogOptions) {
  const results = useQueries({
    queries: [
      {
        queryKey: ["supply-catalog", "packaging-types"],
        queryFn: () => farmSupplyApi.listPackagingTypes(),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["supply-catalog", "base-units"],
        queryFn: () => farmSupplyApi.listBaseUnits(),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["supply-catalog", "subjects", domainCode],
        queryFn: () => farmSupplyApi.getTargetSubjects(domainCode!),
        staleTime: 5 * 60 * 1000,
        enabled: Boolean(domainCode),
      },
      {
        queryKey: ["supply-catalog", "certificate-standards"],
        queryFn: () => farmSupplyApi.listCertificateStandards(),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["supply-catalog", "groups", type],
        queryFn: () => farmSupplyApi.getClassificationGroups(type),
        staleTime: 5 * 60 * 1000,
      },
    ],
  });

  const [packagingTypes, baseUnits, subjects, certificates, groups] = results;

  return {
    packagingTypes: (packagingTypes.data ?? []) as CatalogRef[],
    baseUnits: (baseUnits.data ?? []) as CatalogRef[],
    subjects: (subjects.data ?? []) as CatalogRef[],
    certificates: (certificates.data ?? []) as CatalogRef[],
    groups: (groups.data ?? []) as ClassificationGroup[],
    isLoading: results.some((r) => r.isLoading),
    errors: results.map((r) => r.error).filter(Boolean),
  };
}