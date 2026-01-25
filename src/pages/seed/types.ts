export interface Variety {
  id: string;
  illustration: string | File | null;
  crop: string;
  varietyCode: string;
  varietyName: string;
  supplier: string;
  origin: string;
  germinationRate: number;
  uniformity: number;
  yield: string;
  description: string;
  documents: {
    name: string;
    url: string;
  }[];
  representative?: string;
  phone?: string;
  status: "active" | "inactive";
  updatedAt: string;
  editorContent?: string;
}

export interface CreateVarietyForm {
  varietyCode: string;
  varietyName: string;
  cropGroup: string;
  crop: string;
  supplier: string;
  origin: string;
  germinationRate: number;
  uniformity: number;
  yield: string;
  description: string;
  illustration: File | null;
  expiryDate: Date | undefined;
  contentType: "pdf" | "editor";
  pdfFile: File | null;
  editorContent: string;
}

export interface SeedFilter {
  crops: string[];
  suppliers: string[];
  origins: string[];
}
