import type { RegisterInput } from "./auth.types";

export const authService = {
  async register(input: RegisterInput) {
    return {
      ...input,
      id: "todo",
    };
  },
};
