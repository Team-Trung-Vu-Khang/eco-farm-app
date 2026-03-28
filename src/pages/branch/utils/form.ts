import {
  branchLocationCodeMaps,
  branchLocationNameMaps,
} from "../data/constants";

export function getBranchLocationName(
  code: string,
  type: "province" | "district" | "ward",
) {
  return branchLocationNameMaps[type][
    code as keyof (typeof branchLocationNameMaps)[typeof type]
  ] || "";
}

export function getBranchLocationCode(
  value: string | undefined,
  type: "province" | "district" | "ward",
) {
  if (!value) return "";

  return branchLocationCodeMaps[type][
    value as keyof (typeof branchLocationCodeMaps)[typeof type]
  ] || "";
}

export function buildBranchFullAddress({
  address,
  ward,
  district,
  city,
}: {
  address: string;
  ward: string;
  district: string;
  city: string;
}) {
  return [address, ward, district, city].filter(Boolean).join(", ");
}
