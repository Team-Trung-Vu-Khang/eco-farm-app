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

  // Strip trailing bracketed code tags like (UN010) or (UN001)
  const cleanStr = searchStr
    .replace(/\s*\([A-Z0-9_\-]+\)$/i, "")
    .trim()
    .toLowerCase();
  if (!cleanStr) return null;

  // Pre-parse units info for strict matching
  const parsedUnits = baseUnits.map((u) => {
    const fullName = u.name.trim().toLowerCase();
    const mainName = u.name
      .replace(/\s*\([^)]+\)/, "")
      .trim()
      .toLowerCase();
    const symbolMatch = u.name.match(/\(([^)]+)\)/);
    const symbol =
      symbolMatch && symbolMatch[1] ? symbolMatch[1].trim().toLowerCase() : "";
    const code = u.code ? u.code.trim().toLowerCase() : "";
    return { unit: u, fullName, mainName, symbol, code };
  });

  // 1. Exact match on fullName (e.g., "kilogam (kg)", "gam (g)", "lít (l)")
  let matched = parsedUnits.find((p) => p.fullName === cleanStr);
  if (matched) return matched.unit;

  // 2. Exact match on mainName (e.g., "kilogam", "gam", "lít", "mililit", "tấn")
  matched = parsedUnits.find((p) => p.mainName === cleanStr);
  if (matched) return matched.unit;

  // 3. Exact match on symbol inside parentheses (e.g., "kg", "g", "l", "ml", "m")
  matched = parsedUnits.find((p) => p.symbol && p.symbol === cleanStr);
  if (matched) return matched.unit;

  // 4. Exact match on code (e.g., "un001", "un008")
  matched = parsedUnits.find((p) => p.code && p.code === cleanStr);
  if (matched) return matched.unit;

  // 5. Clean parenthetical symbols from cleanStr if present
  const cleanWithoutSymbol = cleanStr.replace(/\s*\([^)]+\)/, "").trim();
  if (cleanWithoutSymbol && cleanWithoutSymbol !== cleanStr) {
    matched = parsedUnits.find(
      (p) =>
        p.mainName === cleanWithoutSymbol || p.symbol === cleanWithoutSymbol,
    );
    if (matched) return matched.unit;
  }

  // 6. Whole-word / token match (e.g., token match without arbitrary substring inclusion)
  const tokens = cleanStr.split(/\s+/);
  matched = parsedUnits.find(
    (p) =>
      tokens.includes(p.mainName) ||
      (p.symbol && tokens.includes(p.symbol)) ||
      (p.code && tokens.includes(p.code)),
  );
  if (matched) return matched.unit;

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

  const parsedTypes = packagingTypes.map((t) => {
    const fullName = t.name.trim().toLowerCase();
    const mainName = t.name
      .replace(/\s*\([^)]+\)/, "")
      .trim()
      .toLowerCase();
    const code = t.code ? t.code.trim().toLowerCase() : "";
    return { type: t, fullName, mainName, code };
  });

  // 1. Exact match on fullName
  let matched = parsedTypes.find((p) => p.fullName === cleanStr);
  if (matched) return matched.type;

  // 2. Exact match on mainName
  matched = parsedTypes.find((p) => p.mainName === cleanStr);
  if (matched) return matched.type;

  // 3. Exact match on code
  matched = parsedTypes.find((p) => p.code && p.code === cleanStr);
  if (matched) return matched.type;

  // 4. Whole-word / token match
  const tokens = cleanStr.split(/\s+/);
  matched = parsedTypes.find(
    (p) => tokens.includes(p.mainName) || (p.code && tokens.includes(p.code)),
  );
  if (matched) return matched.type;

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
