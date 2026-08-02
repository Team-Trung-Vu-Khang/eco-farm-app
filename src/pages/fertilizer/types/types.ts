export interface SupplierDetail {
  supplierId: string;
  quantity: string;
  unit: string;
  packaging: string;
}

export interface FertilizerFormData {
  code: string;
  name: string;
  nutritionalContentId: string;
  originId: string;
  applicationStageId: string;
  physicalFormId: string;
  nutrientContent: string;
  description: string;
  hashtags: string[];
  imageUrl?: string;
  supplierDetails: SupplierDetail[];
  usage: string;
  documents: { name: string; size: number; file?: File }[];
}
