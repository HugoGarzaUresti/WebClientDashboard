export const authRepository = {
  async findByEmail(email: string) {
    return { email };
  },
};
