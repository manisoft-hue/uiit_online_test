import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    studentId?: string | null;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      studentId?: string | null;
      role: string;
    } & DefaultSession["user"];
  }
}
