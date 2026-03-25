import {
  DISTRICTS,
  ENTERPRISES,
  LAND_TYPES,
  PROVINCES,
  TERRAIN_TYPES,
} from "../constants";

function getNameById(
  options: Array<{ id: string; name: string }>,
  value: string | undefined,
) {
  if (!value) {
    return "";
  }

  return options.find((option) => option.id === value)?.name || value;
}

export function getProvinceName(provinceId: string) {
  return getNameById(PROVINCES, provinceId);
}

export function getDistrictName(districtId: string) {
  return getNameById(DISTRICTS, districtId);
}

export function getEnterpriseName(enterpriseId: string) {
  return getNameById(ENTERPRISES, enterpriseId);
}

export function getLandTypeName(landType: string) {
  return getNameById(LAND_TYPES, landType);
}

export function getTerrainTypeName(terrain: string) {
  return getNameById(TERRAIN_TYPES, terrain);
}
