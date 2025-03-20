import { User, UserProfile } from "simpu-api-sdk";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      auth: User;
      token: string;
      profile: UserProfile;
    } & DefaultSession["user"];
  }
}

declare global {
  interface Window {
    gapi: any;
  }
}
