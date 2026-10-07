import type { FarmCultivationZoneResponse } from "@/features/farm/types/farm.type";
import type { FarmWorkflowScopeRequest } from "../types/farm-workflow.type";

export interface GeographicalSelectionLike {
  type?: "region" | "area" | "plot";
  regionId?: string;
  areaId?: string;
  plotId?: string;
}

export function toWorkflowScopes(
  selections: GeographicalSelectionLike[],
): FarmWorkflowScopeRequest[] {
  return selections.map((selection) => ({
    scopeType:
      selection.type === "plot"
        ? "PLOT"
        : selection.type === "area"
          ? "AREA"
          : "REGION",
    scopeId: Number(selection.plotId || selection.areaId || selection.regionId),
  }));
}

export function extractWorkflowScopesFromZones(
  zoneSelections: GeographicalSelectionLike[],
  cultivationZones?: FarmCultivationZoneResponse[],
): FarmWorkflowScopeRequest[] {
  if (!cultivationZones || cultivationZones.length === 0) return [];

  const selectedZoneIds = new Set(
    zoneSelections.map((s) => Number(s.regionId)).filter(Boolean),
  );
  const result: FarmWorkflowScopeRequest[] = [];
  const addedKeys = new Set<string>();

  cultivationZones.forEach((zone) => {
    if (selectedZoneIds.has(zone.id) && Array.isArray(zone.scopes)) {
      zone.scopes.forEach((s) => {
        let scopeId: number | undefined;
        if (s.scopeType === "PLOT" && s.plot?.id) {
          scopeId = s.plot.id;
        } else if (s.scopeType === "AREA" && s.area?.id) {
          scopeId = s.area.id;
        } else if (s.scopeType === "REGION" && s.region?.id) {
          scopeId = s.region.id;
        } else if ((s as any).scopeId) {
          scopeId = Number((s as any).scopeId);
        }

        if (scopeId) {
          const key = `${s.scopeType}-${scopeId}`;
          if (!addedKeys.has(key)) {
            addedKeys.add(key);
            result.push({
              scopeType: s.scopeType,
              scopeId: scopeId,
            });
          }
        }
      });
    }
  });

  return result;
}

export function buildFinalWorkflowScopes(
  selections: GeographicalSelectionLike[],
  zoneSelections: GeographicalSelectionLike[],
  cultivationZones?: FarmCultivationZoneResponse[],
): FarmWorkflowScopeRequest[] {
  const scopesFromSelections = toWorkflowScopes(selections);
  const scopesFromZones = extractWorkflowScopesFromZones(
    zoneSelections,
    cultivationZones,
  );

  const combinedMap = new Map<string, FarmWorkflowScopeRequest>();
  [...scopesFromSelections, ...scopesFromZones].forEach((s) => {
    if (s.scopeId && !isNaN(s.scopeId)) {
      combinedMap.set(`${s.scopeType}-${s.scopeId}`, s);
    }
  });

  return Array.from(combinedMap.values());
}
