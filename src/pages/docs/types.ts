type Docs = {
  id: string;
  crop: string;
  variety: string;
  season: string[];
  createdAt: number;
  updatedAt: number;
  applyLevel?: number;
  keywords?: string[];
  quickSummary?: string;
  illustration?: File | undefined | null;
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
