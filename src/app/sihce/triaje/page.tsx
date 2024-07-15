import { TriajeBusqueda } from "@/components/Triaje/TriajeBusqueda";

export default function () {
  return (
    <div className="flex-1 p-4">
      <h2 className="text-2xl font-semibold">Contenido de la tarjeta</h2>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Triaje</h2>
        <TriajeBusqueda/>
      </div>
    </div>
  );
}