export interface Equipment {
  id: number;
  code: string;
  name: string;
  type: string;
  status: "active" | "maintenance" | "inactive";
  description: string;
  maintainanceInterval: string;
  createdAt: string;
  technicalDocType?: "file" | "editor";
  technicalDocContent?: string;
  supplierDetails?: SupplierDetail[];
}

export interface SupplierDetail {
  supplierId: string;
  quantity: string;
  unit: string;
  warranty: string;
}

export interface EquipmentFormData {
  code: string;
  name: string;
  type: string;
  status: string;
  maintainanceInterval: string;
  description: string;
  imageUrl?: string;
  technicalDocType: "file" | "editor";
  technicalDocContent: string;
  supplierDetails: SupplierDetail[];
}
