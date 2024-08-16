import { ModuloAdmision } from '@/components/ModuloAdmision/ModuloAdmision'
import React from 'react'

export default function admisionPage() {
  return (
    <div className="flex-1 p-4 bg-white shadow">
      <h2 className="text-2xl font-semibold">Modulo Admision</h2>
      <ModuloAdmision />
    </div>
  );
}
