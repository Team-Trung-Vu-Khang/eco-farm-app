export interface Pesticide {
  id: number;
  code: string;
  name: string;
  group: string;
  form: string;
  actionType: string;
  origin: string;
  activeIngredient: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface PesticideFormData {
  code: string;
  name: string;
  group: string;
  form: string;
  actionType: string;
  origin: string;
  activeIngredient: string;
  usage: string;
  note: string;
  hashtags: string[];
  imageUrl?: string;
  technicalDocType: "file" | "editor";
  technicalDocFile?: File | null;
  technicalDocContent: string;
  selectedSupplierId: string;
  quantity: string;
  unit: string;
  packaging: string;
}
