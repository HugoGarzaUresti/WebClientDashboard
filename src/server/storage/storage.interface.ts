export type SignedUpload = {
  url: string;
  fields?: Record<string, string>;
};

export interface StorageService {
  createSignedUploadUrl(key: string, contentType: string): Promise<SignedUpload>;
}
