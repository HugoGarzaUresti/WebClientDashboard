export const shareRepository = {
  async listSharedDocuments(userId: string) {
    return [{ userId }];
  },
};
