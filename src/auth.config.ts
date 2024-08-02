import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import axios from "axios";
import { UserRole } from "./type/types";
 
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
      },
      
      authorize: async (credentials) => {
        let user = null
        
        if(credentials===null) return null;
       
        try {
          const {data} =await axios.post(`${process.env.apiurl}/Usuario/VerificaAcceso`, {
            usuario: credentials?.username,
            clave: credentials?.password
          })
      
        
          if(data){
            user={ id:data.empleado.idEmpleado, name: data.empleado.nombres, email:data.empleado.dni,roles:data.empleado.roles}
           
          }          
        } catch (error) {
          throw new Error("User not found.")
        }
      

       
        if (!user) {
          throw new Error("User not found.")
        }
 
        return user
      },
    }),
  ],
  
  callbacks: {
    jwt({ token, user }) {
      if (user) {  
        token.id = user.id,
        token.roles=user.roles  as UserRole[]
        token.roles = user.roles as UserRole[]
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.roles=token.roles  as UserRole[]
      return session
    },
  },
} satisfies NextAuthConfig