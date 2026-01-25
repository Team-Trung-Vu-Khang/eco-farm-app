export interface Variety {
  id: string;
  illustration: string | File | null;
  crop: string;
  varietyCode: string;
  varietyName: string;
  scientificName?: string;
  origin?: string;
  growthDuration?: string;
  averageYield?: string;
  description: string;
  documents: {
    name: string;
    url: string;
  }[];
  status: "active" | "inactive";
  updatedAt: string;
}

export interface CreateVarietyForm {
  varietyCode: string;
  varietyName: string;
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
