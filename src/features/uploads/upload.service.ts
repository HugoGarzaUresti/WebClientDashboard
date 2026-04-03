import type { CreateUploadInput } from "./upload.types";

export const uploadService = {
  async createUploadRequest(input: CreateUploadInput) {
    return {
      ...input,
      status: "PENDING",
    };
  },
};
