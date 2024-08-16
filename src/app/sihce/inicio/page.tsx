import { auth } from "@/auth";
import { Inicio } from "@/components/inicio/Inicio";

export default async function inicioAdmin() {
  const session = await auth()
  return (
    <>
    
    <div className={`min-h-[90vh] flex items-center justify-center bg-gray-100 `}>
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
      <h1 className="text-3xl font-semibold mb-4 text-center text-gray-900">
        Bienvenido, {session?.user?.name}!
      </h1>
    
      <p className="text-gray-700 mb-6 text-center">
        Estamos encantados de tenerte como usuario. Desde aquí puedes gestionar todas las funciones asignadas.
      </p>
    
    </div>
  </div>
    </>
    
  );
}