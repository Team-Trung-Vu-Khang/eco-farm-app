type Docs = {
  id: string;
  scope: "crop" | "variety" | "category";
  cropId: string;
  variety: string;
  crop: string; // Keep for backward compatibility or display name
  season: string[];
  createdAt: number;
  updatedAt: number;
  applyLevel?: number;
  keywords?: string[];
  quickSummary?: string;
  attachments?: Array<CreateDocsAttachment>;
  specifications?: Array<CreateDocsSpecification>;
};

type CreateDocsSpecification = {
  specName: string;
  specValue: string;
};

type CreateDocsAttachment = {
  attachmentName: string;
  attachmentValue: string;
};

type CreateDocsForm = Docs;

export type {
  Docs,
  CreateDocsForm,
  CreateDocsAttachment,
  CreateDocsSpecification,
};
