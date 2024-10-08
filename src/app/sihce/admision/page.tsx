import { auth } from '@/auth';
import { ModuloAdmision } from '@/components/ModuloAdmision/ModuloAdmision'
import React from 'react'

export default async function admisionPage() {
  const session = await auth()
  return (
    <div className="flex-1 p-4 bg-white shadow print:p-0 print:bg-transparent print:shadow-none">
      <h2 className="text-2xl font-semibold print:hidden">Modulo Admision</h2>
      <ModuloAdmision usuario={session}/>
    </div>
  );
}
