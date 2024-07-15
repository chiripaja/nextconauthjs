

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
        <button className="px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group">
          <CiLogout />
          <span className="group-hover:text-gray-700">Logout</span>
        </button>
      </form>
    </>
  )
}
