'use client'
import { useSession } from 'next-auth/react'


export const Profile = () => {
    const session = useSession()
  return (
    <div>
  
        <h1 className='hidden'>aca se ve todo    <pre>{JSON.stringify(session, null, 2)}</pre></h1>
        <h5 className="hidden mt-4 text-xl font-semibold text-gray-600 lg:block">{session?.data?.user?.name}</h5>
        <span className="hidden text-gray-400 lg:block">{session?.data?.user?.email}</span>
        </div>
  )
}
