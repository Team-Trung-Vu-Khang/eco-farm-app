export interface Material {
  id: number;
  code: string;
  name: string;
  type: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface MaterialSupplierDetail {
  supplierId: string;
  quantity: string;
  unit: string;
  packaging: string;
}

export interface MaterialFormData {
  code: string;
  name: string;
  type: string;
  description: string;
  hashtags: string[];
  imageUrl?: string;
  supplierDetails: MaterialSupplierDetail[];
}
