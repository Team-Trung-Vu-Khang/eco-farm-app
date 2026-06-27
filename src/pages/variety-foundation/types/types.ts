export interface VarietyFoundationDocument {
  name: string;
  url: string;
}

export interface VarietyFoundation {
  id: string;
  illustration: string | File | null;
  crop: string;
  varietyFoundationCode: string;
  varietyFoundationName: string;
  scientificName?: string;
  origin?: string;
  growthDuration?: string;
  averageYield?: string;
  description: string;
  seedType?: string;
  documents: VarietyFoundationDocument[];
  contentType?: "pdf" | "editor";
  pdfFile?: File | null;
  editorContent?: string;
  status: "active" | "inactive";
  updatedAt: string;
}

export interface CreateVarietyFoundationForm {
  varietyFoundationCode: string;
  varietyFoundationName: string;
  scientificName: string;
  crop: string;
  origin: string;
  growthDuration: string;
  averageYield: string;
  description: string;
  illustration: File | null;
  contentType: "pdf" | "editor";
  pdfFile: File | null;
  editorContent: string;
}
