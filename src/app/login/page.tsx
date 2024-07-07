import { signIn } from "@/auth"
import { AuthError } from "next-auth";
export default function NamePage() {
  return (
    <form
      action={async (formData) => {
        
        "use server"
        try {
          await signIn("credentials", {
            username:formData.get('username'),
            password:formData.get('password'),
          })
          return {success:true}
        } catch (error) {
          if(error instanceof AuthError){
            return {error:error.cause?.err?.message};
          }
          return {error:"error 500"}
        }
        
      }}
    >
      <label>
        Email
        <input name="username" type="text" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  );
}


