import NextAuth, { DefaultSession, User } from "next-auth";
import { DefaultJWT } from "@auth/core/jwt";

declare module "next-auth" {
  // Extend session to hold the access_token
  interface Session {
    User: {
      id: string;
    };
  }

  // Extend token to hold the access_token before it gets put into session
  interface JWT {
    access_token: string & DefaultJWT;
  }
}
