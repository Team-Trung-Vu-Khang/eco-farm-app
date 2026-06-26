export interface StorageFileUploadResponse {
  bucket: string;
  objectKey: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  etag: string;
}

