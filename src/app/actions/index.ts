'use server'

import { signIn } from "@/auth"
import { AuthError } from "next-auth";



export async function docredentials(username:string,password:string) {
    try {
       const response=await signIn("credentials",{username,password,redirect:false})
       console.log("-.----")
       console.log(response.Error)
       return response
    } catch (error) {
        console.log("entro error 500")
        if(error instanceof AuthError){
            return {error:error.cause?.err?.message};
          }
          return {error}
    }
} 