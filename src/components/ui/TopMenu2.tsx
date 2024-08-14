

import React from 'react'
import { LogoutBtn } from '../LogoutBtn';
import { useSession } from 'next-auth/react';
import { IoCalendarOutline, IoCheckboxOutline } from 'react-icons/io5';
import { SidebarItem2 } from './SidebarItem2';
import { auth } from '@/auth';
import Link from 'next/link';
import { BsHospital } from 'react-icons/bs';
const menuItems = [
  {
    icon: <IoCalendarOutline />,
    title: 'Admision',
    path: '/sihce/admision'
  },
  {
    icon: <IoCheckboxOutline />,
    title: 'Triaje',
    path: '/sihce/triaje'
  },
]

export const TopMenu2 = async () => {
  const session = await auth()
  const webadmin = session?.user?.roles?.some(role => role.idRol === 1165);
  const cetriaje = session?.user?.roles?.some(role => role.idRol === 101);
  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-blue-600 text-sm py-3">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
        <div className="flex  justify-between">

          <span className="flex text-xl font-semibold text-white focus:outline-none focus:opacity-80" > <BsHospital className='mr-2'/> HRHVM </span>
          <div className="flex-none items-center">
            <span className="text-xs text-slate-200 ml-2 inline-block mt-2">{session?.user?.name}</span>
          </div>
          <div className="sm:hidden">
            <button type="button" className="hs-collapse-toggle relative size-7 flex justify-center items-center gap-2 rounded-lg border border-white/20 font-medium bg-blue-600 text-white shadow-sm align-middle hover:bg-white/10 focus:outline-none focus:bg-white/10 text-sm" id="hs-navbar-primary-collapse" aria-expanded="false" aria-controls="hs-navbar-primary" aria-label="Toggle navigation" data-hs-collapse="#hs-navbar-primary">
              <svg className="hs-collapse-open:hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
              <svg className="hs-collapse-open:block hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          </div>
        </div>
        <div id="hs-navbar-primary" className="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block" aria-labelledby="hs-navbar-primary-collapse">
          <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
            <Link className="font-medium text-white focus:outline-none hover:text-gray-300" href="/sihce/inicio" aria-current="page">Inicio</Link>
            {(webadmin) && (
              <Link className="font-medium text-white focus:outline-none hover:text-gray-300" href="/sihce/admision" aria-current="page">Admision</Link>
            )}
            {(webadmin || cetriaje) && (
              <Link className="font-medium text-white focus:outline-none hover:text-gray-300" href="/sihce/triaje" aria-current="page">Triaje</Link>
            )}
            {webadmin && (
              <Link className="font-medium text-white focus:outline-none hover:text-gray-300" href="/sihce/roles" aria-current="page">Roles</Link>
            )}


            <LogoutBtn />
          </div>
        </div>
      </nav>
    </header>
  )
}
