import { formatPackagingVariantText } from "./supplyFormatUtils";

interface CatalogItem {
  id: number;
  name: string;
  code?: string;
}

function findBaseUnit(
  searchStr: string | null | undefined,
  baseUnits: CatalogItem[],
): CatalogItem | null {
  if (!searchStr || !searchStr.trim() || !baseUnits || baseUnits.length === 0) {
    return null;
  }

  // Strip trailing bracketed code tags like (UN010)
  const cleanStr = searchStr
    .replace(/\s*\([A-Z0-9_\-]+\)$/i, "")
    .trim()
    .toLowerCase();
  if (!cleanStr) return null;

  // 1. Exact match on name
  let matched = baseUnits.find((u) => u.name.toLowerCase() === cleanStr);
  if (matched) return matched;

  // 2. Exact match on code
  matched = baseUnits.find((u) => u.code && u.code.toLowerCase() === cleanStr);
  if (matched) return matched;

  // 3. Match parenthetical symbol inside u.name (e.g., "Mililit (ml)" -> symbol "ml")
  for (const u of baseUnits) {
    const symbolMatch = u.name.match(/\(([^)]+)\)/);
    if (symbolMatch && symbolMatch[1]) {
      const symbol = symbolMatch[1].trim().toLowerCase();
      if (symbol === cleanStr) return u;
    }
  }

  // 4. Substring / includes match
  matched = baseUnits.find(
    (u) =>
      cleanStr.includes(u.name.toLowerCase()) ||
      u.name.toLowerCase().includes(cleanStr),
  );
  if (matched) return matched;

  return null;
}

function findPackagingType(
  searchStr: string | null | undefined,
  packagingTypes: CatalogItem[],
): CatalogItem | null {
  if (
    !searchStr ||
    !searchStr.trim() ||
    !packagingTypes ||
    packagingTypes.length === 0
  ) {
    return null;
  }

  const cleanStr = searchStr.trim().toLowerCase();

  let matched = packagingTypes.find((t) => t.name.toLowerCase() === cleanStr);
  if (matched) return matched;

  matched = packagingTypes.find(
    (t) => t.code && t.code.toLowerCase() === cleanStr,
  );
  if (matched) return matched;

  matched = packagingTypes.find(
    (t) =>
      cleanStr.includes(t.name.toLowerCase()) ||
      t.name.toLowerCase().includes(cleanStr),
  );
  if (matched) return matched;

  return null;
}

export function parsePackagingSpecs(
  specs: string[],
  packagingTypes: CatalogItem[],
  baseUnits: CatalogItem[],
) {
  if (!specs || specs.length === 0) return [];

  return specs
    .map((spec, idx) => {
      const raw = spec.trim();
      const parts = raw.split(/\s+/);

      // Find numeric index
      const numIdx = parts.findIndex((p) => {
        const val = parseFloat(p);
        return !isNaN(val) && isFinite(val);
      });

      let quantity: number | null = null;
      let packagingTypeName: string | null = null;
      let unitBaseName: string | null = null;

      if (numIdx !== -1) {
        quantity = parseFloat(parts[numIdx]);
        if (isNaN(quantity) || !isFinite(quantity)) quantity = null;

        const beforeStr = parts.slice(0, numIdx).join(" ").trim();
        const afterStr = parts
          .slice(numIdx + 1)
          .join(" ")
          .trim();

        if (beforeStr && afterStr) {
          packagingTypeName = beforeStr;
          unitBaseName = afterStr;
        } else if (beforeStr) {
          packagingTypeName = beforeStr;
        } else if (afterStr) {
          const matchedUnit = findBaseUnit(afterStr, baseUnits);
          if (matchedUnit) {
            unitBaseName = afterStr;
          } else {
            packagingTypeName = afterStr;
          }
        }
      } else {
        // No number -> check if raw string matches a base unit
        const matchedUnit = findBaseUnit(raw, baseUnits);
        if (matchedUnit) {
          unitBaseName = raw;
        } else {
          packagingTypeName = raw;
        }
      }

      let pkgType = findPackagingType(packagingTypeName, packagingTypes);
      let unit = findBaseUnit(unitBaseName, baseUnits);

      // Fallback 1: If pkgType not found, check if packagingTypeName is actually a base unit
      if (!pkgType && packagingTypeName && !unit) {
        const matchedBaseUnit = findBaseUnit(packagingTypeName, baseUnits);
        if (matchedBaseUnit) {
          unit = matchedBaseUnit;
          pkgType = null;
        }
      }

      // Fallback 2: If unit is still null, try matching raw spec against base units
      if (!unit) {
        unit = findBaseUnit(raw, baseUnits);
      }

      return {
        packagingTypeId: pkgType ? pkgType.id : null,
        unitBaseId: unit ? unit.id : null,
        quantity: quantity,
        displayOrder: idx,
      };
    })
    .filter((item) => item.unitBaseId !== null) // API requires unitBaseId to be non-null
    .map((item, newIdx) => ({
      ...item,
      displayOrder: newIdx,
    }));
}

// Convert packagingVariants array from API back to string specs list for the frontend form states
export function formatPackagingSpecs(
  variants: {
    quantity?: number | null;
    packagingType?: { name: string } | null;
    unitBase?: { name: string } | null;
  }[],
): string[] {
  if (!variants || variants.length === 0) return [];
  return variants.map((v) => formatPackagingVariantText(v));
}
