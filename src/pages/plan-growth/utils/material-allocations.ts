import type { MaterialAllocation } from "../types";

export function isEquipmentAllocation(item: MaterialAllocation) {
  return [item.materialCategory, item.materialType].some(
    (value) =>
      typeof value === "string" &&
      /equipment|dụng cụ\s*-\s*máy móc/i.test(value),
  );
}

export function getMaterialDisplayUnit(item: MaterialAllocation) {
  if (item.unit) return item.unit;
  return isEquipmentAllocation(item) ? "Cái / Chiếc" : "";
}

function makeMaterialGroupKey(item: MaterialAllocation) {
  const unitBaseId = isEquipmentAllocation(item) ? 6 : item.unitBaseId ?? "";
  return [
    item.stageId,
    item.supplyItemId ?? "",
    unitBaseId,
  ].join("::");
}

function addQuantities(existing: string, next: string) {
  const total = Number(existing || 0) + Number(next || 0);
  return Number.isFinite(total) ? String(total) : existing;
}

export function groupMaterialAllocations(materials: MaterialAllocation[]) {
  const grouped = new Map<string, MaterialAllocation>();

  for (const item of materials) {
    const key = makeMaterialGroupKey(item);
    const current = grouped.get(key);
    const normalizedItem = isEquipmentAllocation(item)
      ? { ...item, unitBaseId: 6, unit: item.unit || "Cái / Chiếc" }
      : item;

    if (!current) {
      grouped.set(key, normalizedItem);
      continue;
    }

    grouped.set(key, {
      ...current,
      ...normalizedItem,
      quantity: addQuantities(current.quantity, normalizedItem.quantity),
    });
  }

  return Array.from(grouped.values());
}
