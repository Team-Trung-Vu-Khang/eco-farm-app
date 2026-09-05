export interface PackagingVariantLike {
  quantity?: number | null;
  packagingType?: { id?: number; name?: string; code?: string } | null;
  unitBase?: { id?: number; name?: string; code?: string } | null;
}

/**
 * Checks if a variant represents only a base unit (no packaging type).
 */
export function isBaseUnitOnlyVariant(
  variant?: PackagingVariantLike | null
): boolean {
  if (!variant) return false;
  const hasPkg = Boolean(variant.packagingType?.name || variant.packagingType?.code);
  const hasUnit = Boolean(variant.unitBase?.name || variant.unitBase?.code);
  return !hasPkg && hasUnit;
}

/**
 * Formats a packaging variant object into human-readable text.
 * Mode 1 (Full Spec): "Chai 500 ml", "Bao 25 kg"
 * Mode 2 (Base Unit Only): "Kilogram (KG)" or "kg"
 */
export function formatPackagingVariantText(
  variant?: PackagingVariantLike | null
): string {
  if (!variant) return "";
  const pkgName = variant.packagingType?.name || variant.packagingType?.code || "";
  const unitName = variant.unitBase?.name || variant.unitBase?.code || "";
  const hasPkg = Boolean(pkgName);
  const hasUnit = Boolean(unitName);
  const qty = variant.quantity;

  if (hasPkg && hasUnit) {
    return qty ? `${pkgName} ${qty} ${unitName}` : `${pkgName} ${unitName}`;
  }
  if (hasPkg) {
    return qty ? `${qty} ${pkgName}` : `${pkgName}`;
  }
  if (hasUnit) {
    const unitDisplay = variant.unitBase?.name && variant.unitBase?.code && variant.unitBase.name !== variant.unitBase.code
      ? `${variant.unitBase.name} (${variant.unitBase.code})`
      : unitName;
    return qty ? `${qty} ${unitDisplay}` : `${unitDisplay}`;
  }
  return qty ? `${qty}` : "";
}

/**
 * Formats string representations of packaging specs ("Bao 50 kg", "Chai 1 l", "1 Bao", "2 kg")
 */
export function formatPackagingSpecText(spec: string): string {
  if (!spec) return "";
  return spec.trim();
}
