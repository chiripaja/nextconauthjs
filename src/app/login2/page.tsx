'use client'
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { docredentials } from '../actions';
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router=useRouter()
  const handleSubmit = async (event:FormEvent) => {
 
    event.preventDefault(); 
    try {
      const response=await docredentials(username,password)
      console.log({response})
      if(!!response.error){
        console.log("entro al falso cusuario contraseña falsa")
      }else{
        router.push("/")
      }
      
     
    } catch (error) {
      console.log("entro al catch")
    }
  
   
  
    //
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Sign In</button>
    </form>
  );
}
