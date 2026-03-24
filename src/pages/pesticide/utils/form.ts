import type { Pesticide, PesticideFormData } from "../types";

export const createEmptyPesticideFormData = (): PesticideFormData => ({
  code: "",
  name: "",
  group: "",
  form: "",
  actionType: "",
  origin: "",
  activeIngredient: "",
  usage: "",
  note: "",
  hashtags: [],
  technicalDocType: "file",
  technicalDocContent: "",
  technicalDocFile: null,
  selectedSupplierId: "",
  quantity: "",
  unit: "",
  packaging: "",
});

export const createPesticideFormDataFromItem = (
  item: Pesticide,
): PesticideFormData => ({
  code: item.code,
  name: item.name,
  group: item.group,
  form: item.form,
  actionType: item.actionType,
  origin: item.origin,
  activeIngredient: item.activeIngredient,
  usage: "",
  note: "",
  hashtags: ["HieuQuaCao", "AnToan"],
  technicalDocType: "file",
  technicalDocContent: "",
  technicalDocFile: null,
  selectedSupplierId: "sup1",
  quantity: "500",
  unit: "Chai",
  packaging: "Thùng 24 chai",
});
