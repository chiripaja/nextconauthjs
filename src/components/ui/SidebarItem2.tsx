'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'


export const SidebarItem2 = () => {
  const pathName = usePathname();
  const session = useSession();
  const webadmin=session?.data?.user?.roles?.some(role => role.idRol === 1165);
  const cetriaje=session?.data?.user?.roles?.some(role => role.idRol === 101);
  return (
    <>
    <Link className="font-medium text-white focus:outline-none" href="/sihce/inicio" aria-current="page">Inicio</Link>
      <Link className="font-medium text-white focus:outline-none" href="/sihce/admision" aria-current="page">Admision</Link>
      {(webadmin || cetriaje) && (
      <Link className="font-medium text-white focus:outline-none" href="/sihce/triaje" aria-current="page">Triaje</Link>
      )}
      {webadmin && (
        <Link className="font-medium text-white focus:outline-none" href="/sihce/roles" aria-current="page">Roles</Link>
      )}
      
    </>
  )
}
