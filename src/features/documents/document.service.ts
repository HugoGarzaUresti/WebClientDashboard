export const documentService = {
  async listDocuments(ownerId: string) {
    return [{ ownerId }];
  },
};
