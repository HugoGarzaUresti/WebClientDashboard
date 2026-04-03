export const shareService = {
  async listSharedDocuments(userId: string) {
    return [{ userId }];
  },
};
