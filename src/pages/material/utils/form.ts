import type {
  MaterialFormData,
  MaterialSupplierDetail,
  Material,
} from "../types/types";

export const createEmptyMaterialFormData = (): MaterialFormData => ({
  code: "",
  name: "",
  type: "",
  description: "",
  hashtags: [],
  supplierDetails: [],
});

export const createMaterialFormDataFromItem = (
  item: Material,
): MaterialFormData => ({
  code: item.code,
  name: item.name,
  type: item.type,
  description: item.description,
  hashtags: ["BenBi", "TietKiem"],
  supplierDetails: [
    {
      supplierId: "sup1",
      quantity: "50",
      unit: "Cuộn",
      packaging: "Cuộn 1000m",
    },
  ],
});

export const createEmptyTempSupplier = (): MaterialSupplierDetail => ({
  supplierId: "",
  quantity: "",
  unit: "",
  packaging: "",
});
