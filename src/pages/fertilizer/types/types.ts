export interface SupplierDetail {
  supplierId: string;
  quantity: string;
  unit: string;
  packaging: string;
}

export interface FertilizerFormData {
  code: string;
  name: string;
  type: string;
  nutrientContent: string;
  description: string;
  hashtags: string[];
  imageUrl?: string;
  supplierDetails: SupplierDetail[];
}
