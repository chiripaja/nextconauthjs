import Link from 'next/link';

export default function AccessDenied() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
      <p className="text-lg text-gray-700 mb-6">
        No tienes los permisos necesarios para acceder a esta página.
      </p>
      <Link href="/login">
        <span className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
          Volver al Inicio
        </span>
      </Link>
    </div>
  </div>
  );
}