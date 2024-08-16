import { TriajeBusqueda } from "@/components/Triaje/TriajeBusqueda";
import { TriajeDif } from '../../../components/TriajeDiferenciado/TriajeDif';

export default function triajepage() {
  return (
    <div className="flex-1 p-4">
 
      <div className="p-5 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Modulo Triaje</h2>
        {/*<TriajeBusqueda/>*/}
        <TriajeDif/>
      </div>
    </div>
  );
}