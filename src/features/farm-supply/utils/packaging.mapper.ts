export function parsePackagingSpecs(
  specs: string[],
  packagingTypes: { id: number; name: string }[],
  baseUnits: { id: number; name: string }[]
) {
  if (!specs || specs.length === 0) return [];

  return specs.map((spec, idx) => {
    const parts = spec.trim().split(/\s+/);
    let packagingTypeName = parts[0] || "Chai";
    let quantityStr = parts[1] || "1";
    let unitBaseName = parts[2] || "l";

    // Find numeric index to handle spaces in packaging type or unit base names
    const numIdx = parts.findIndex((p) => {
      const val = parseFloat(p);
      return !isNaN(val) && isFinite(val);
    });

    if (numIdx !== -1) {
      packagingTypeName = parts.slice(0, numIdx).join(" ") || "Chai";
      quantityStr = parts[numIdx];
      unitBaseName = parts.slice(numIdx + 1).join(" ") || "l";
    }

    const qty = parseFloat(quantityStr) || 1;

    let pkgType = packagingTypes.find(
      (t) => t.name.toLowerCase() === packagingTypeName.toLowerCase()
    );
    if (!pkgType && packagingTypes.length > 0) {
      // Try partial match
      pkgType = packagingTypes.find((t) =>
        t.name.toLowerCase().includes(packagingTypeName.toLowerCase())
      );
      if (!pkgType) {
        pkgType = packagingTypes[0];
      }
    }

    let unit = baseUnits.find(
      (u) => u.name.toLowerCase() === unitBaseName.toLowerCase()
    );
    if (!unit && baseUnits.length > 0) {
      // Try partial match
      unit = baseUnits.find((u) =>
        u.name.toLowerCase().includes(unitBaseName.toLowerCase())
      );
      if (!unit) {
        unit = baseUnits[0];
      }
    }

    return {
      packagingTypeId: pkgType?.id ?? 1,
      unitBaseId: unit?.id ?? 1,
      quantity: qty,
      displayOrder: idx,
    };
  });
}

// Convert packagingVariants array from API back to string specs list for the frontend form states
export function formatPackagingSpecs(
  variants: { quantity: number; packagingType?: { name: string }; unitBase?: { name: string } }[]
): string[] {
  if (!variants) return [];
  return variants.map((v) => {
    const pkg = v.packagingType?.name || "Chai";
    const unit = v.unitBase?.name || "l";
    return `${pkg} ${v.quantity} ${unit}`;
  });
}
