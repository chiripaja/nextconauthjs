import axios from "axios"
import NextAuth , { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
// Your own logic for dealing with plaintext password strings; be careful!

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password"
}
export const { handlers, signIn, signOut, auth } = NextAuth({
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
  session:{
    strategy:"jwt"
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id
      session.user.datosadicionales="quiero que se me pare como antes"
      return session
    },
  },
})