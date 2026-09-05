import { formatPackagingVariantText } from "./supplyFormatUtils";

export function parsePackagingSpecs(
  specs: string[],
  packagingTypes: { id: number; name: string }[],
  baseUnits: { id: number; name: string }[]
) {
  if (!specs || specs.length === 0) return [];

  return specs.map((spec, idx) => {
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
      const afterStr = parts.slice(numIdx + 1).join(" ").trim();

      if (beforeStr && afterStr) {
        packagingTypeName = beforeStr;
        unitBaseName = afterStr;
      } else if (beforeStr) {
        packagingTypeName = beforeStr;
      } else if (afterStr) {
        const matchedUnit = baseUnits.find(
          (u) => u.name.toLowerCase() === afterStr.toLowerCase()
        );
        if (matchedUnit) {
          unitBaseName = afterStr;
        } else {
          packagingTypeName = afterStr;
        }
      }
    } else {
      // No number -> check if raw string matches a base unit (Base Unit Only mode)
      const matchedUnit = baseUnits.find(
        (u) => u.name.toLowerCase() === raw.toLowerCase()
      );
      if (matchedUnit) {
        unitBaseName = raw;
      } else {
        packagingTypeName = raw;
      }
    }

    let pkgType = packagingTypeName
      ? packagingTypes.find(
          (t) => t.name.toLowerCase() === packagingTypeName!.toLowerCase()
        ) ||
        packagingTypes.find((t) =>
          t.name.toLowerCase().includes(packagingTypeName!.toLowerCase())
        )
      : null;

    let unit = unitBaseName
      ? baseUnits.find(
          (u) => u.name.toLowerCase() === unitBaseName!.toLowerCase()
        ) ||
        baseUnits.find((u) =>
          u.name.toLowerCase().includes(unitBaseName!.toLowerCase())
        )
      : null;

    // Fallback: If pkgType not found, check if packagingTypeName actually matches a base unit
    if (!pkgType && packagingTypeName && !unit) {
      const matchedBaseUnit = baseUnits.find(
        (u) => u.name.toLowerCase() === packagingTypeName!.toLowerCase()
      );
      if (matchedBaseUnit) {
        unit = matchedBaseUnit;
        pkgType = null;
      }
    }

    return {
      packagingTypeId: pkgType ? pkgType.id : null,
      unitBaseId: unit ? unit.id : null,
      quantity: quantity,
      displayOrder: idx,
    };
  });
}

// Convert packagingVariants array from API back to string specs list for the frontend form states
export function formatPackagingSpecs(
  variants: { quantity?: number | null; packagingType?: { name: string } | null; unitBase?: { name: string } | null }[]
): string[] {
  if (!variants || variants.length === 0) return [];
  return variants.map((v) => formatPackagingVariantText(v));
}
