import axios from "axios"
import NextAuth , { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { UserRole } from "./type/types";

import authConfig from "@/auth.config";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password"
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  session:{
    strategy:"jwt"
  },
 ...authConfig
})