
'use client'
import { signOut } from '@/auth'


export const LogoutBtn = () => {

    

 return <button onClick={() => signOut()}>Signout</button>
}
