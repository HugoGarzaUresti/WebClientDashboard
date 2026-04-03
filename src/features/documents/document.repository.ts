export const documentRepository = {
  async listByOwner(ownerId: string) {
    return [{ ownerId }];
  },
};
