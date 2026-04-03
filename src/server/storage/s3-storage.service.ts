import type { StorageService } from "./storage.interface";

export const s3StorageService: StorageService = {
  async createSignedUploadUrl(key: string, contentType: string) {
    return {
      url: `s3://${key}`,
      fields: {
        contentType,
      },
    };
  },
};
