

import { signOut } from '@/auth'
import { redirect } from 'next/navigation'
import { CiLogout } from 'react-icons/ci'


export const LogoutBtn = () => {

  return (
    <>
      <form
        action={async () => {
          "use server"
          await signOut({ redirect: false })
          redirect('/login')
        }}
      >
        <button className="px-4 py-3 flex items-center space-x-4 rounded-md text-white group hover:text-gray-300">
          <CiLogout />
          <span className="">Logout</span>
        </button>
      </form>
    </>
  )
}
