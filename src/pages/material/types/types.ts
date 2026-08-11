export interface Material {
  id: number;
  code: string;
  name: string;
  type: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;

  // Single classification group
  materialGroupId?: string;

  // Origin & Supply fields
  manufacturerOrigin?: string[];
  importerRegistrant?: string[];
  distributor?: string[];
  packagingSpecs?: string[];
}

export interface MaterialFormData {
  code: string;
  name: string;
  type: string;
  description: string;
  hashtags: string[];
  imageUrl?: string;

  materialGroupId: string;

  // Origin & Supply fields
  manufacturerOrigin: string[];
  importerRegistrant: string[];
  distributor: string[];
  packagingSpecs: string[];
}
