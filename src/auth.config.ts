
import axios from "axios";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
          console.log({credentials})
          if(credentials===null) return null;
          // logic to salt and hash password
          // logic to verify if user exists
          try {
            const {data} =await axios.post('http://localhost:3002/api/user/auth', {
              usuario: credentials?.username,
              password: credentials?.password,
            })
            if(data){
              console.log("entro al if")
              user={ id:data.id, name: data.usuario, email: data.password }
            }
            
          } catch (error) {
            console.log("enrto al catch")
            throw new Error("User not found.")
          }
        
  
         
          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("User not found.")
          }
   
          // return user object with the their profile data
          return user
        },
      }),
  ],
} satisfies NextAuthConfig;