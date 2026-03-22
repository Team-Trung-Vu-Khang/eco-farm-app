export interface Enterprise {
  id: number;
  code: string;
  name: string;
  type: string;
  address: string;
  taxCode: string;
  representative: string;
  phone: string;
}

export interface Contract {
  id: number | string;
  code: string;
  name: string;
  type: string;
  signDate: string;
  status: string;
  partyA: string | Enterprise;
  partyB: string | Enterprise;
  createdAt: string;
  updatedAt?: string;
  isAppendix?: boolean;
  parentContractCode?: string | null;
  contentType?: "file" | "editor";
  contentFileName?: string;
  contentText?: string;
  commodities?: CommodityItem[];
}

export type ContractStatus =
  | "draft"
  | "pending"
  | "active"
  | "expired"
  | "terminated";

export interface CommodityItem {
  id: string;
  commodityType: string;
  commodityId: string;
  commodityName: string;
  commodityCode: string;
  specType: "general" | "detailed";
  packagingSpec: string;
  quantity: string;
  unit: string;
}

export interface ContractFormData {
  code: string;
  name: string;
  nature: string;
  value: string;
  currency: string;
  signDate: string;
  isAppendix: boolean;
  parentContractId: string;
  contentType: "file" | "editor";
  contentFile?: File | null;
  contentText: string;
  commodities: CommodityItem[];
  partyAId: string;
  partyBId: string;
}
