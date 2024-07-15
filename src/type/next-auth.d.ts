import { DefaultSession } from "next-auth";
import "next-auth/jwt";
import { UserRole } from "./types";


declare module "next-auth" {
  interface Session {
    user: {
        roles?: UserRole[]

    } & DefaultSession["user"];
  }

  interface User {
    roles?: UserRole[]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: UserRole[]
  }
}