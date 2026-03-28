import type { BranchFormData } from "../types/types";

export const emptyBranchFormData: BranchFormData = {
  code: "",
  name: "",
  enterpriseId: "",
  enterpriseName: "",
  taxCode: "",
  taxAddress: "",
  website: "",
  address: "",
  city: "",
  district: "",
  ward: "",
  imageUrl: "",
  latitude: 10.7769,
  longitude: 106.7009,
  status: "active",
  contactInfos: [],
  contacts: [],
  bankAccounts: [],
};

export const branchStatusOptions = [
  { label: "Hoạt động", value: "active" },
  { label: "Không hoạt động", value: "inactive" },
] as const;

export const branchEnterpriseNames: Record<string, string> = {
  "1": "Công ty CP Nông nghiệp Xanh EcoFarm",
  "2": "HTX Rau sạch Thanh Hà",
  "3": "Nông hộ Nguyễn Văn A",
};

export const branchLocationNameMaps = {
  province: { hcm: "TP.HCM", hn: "Hà Nội", dn: "Đà Nẵng" },
  district: { q1: "Quận 1", q3: "Quận 3", badinh: "Ba Đình" },
  ward: { p1: "Phường 1", p2: "Phường 2", kimma: "Kim Mã" },
} as const;

export const branchLocationCodeMaps = {
  province: { "TP.HCM": "hcm", "Hà Nội": "hn", "Đà Nẵng": "dn" },
  district: { "Quận 1": "q1", "Quận 3": "q3", "Ba Đình": "badinh" },
  ward: { "Phường 1": "p1", "Phường 2": "p2", "Kim Mã": "kimma" },
} as const;
