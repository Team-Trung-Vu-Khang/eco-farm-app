export interface Variety {
  id: string;
  illustration: string | File | null;
  crop: string;
  varietyCode: string;
  varietyName: string;
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
  crop: string;
  description: string;
  illustration: File | null;
  contentType: "pdf" | "editor";
  pdfFile: File | null;
  editorContent: string;
}
