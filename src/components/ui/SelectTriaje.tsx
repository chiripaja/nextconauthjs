import React, { forwardRef } from 'react'
interface Opcion {
    id: number;
    descripcion: string;
}
interface SelectTriajeProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    opciones?: Opcion[];
    deshabilitado?: boolean;
}
export const SelectTriaje = forwardRef<HTMLSelectElement, SelectTriajeProps>(
    ({  deshabilitado = true, label = "", opciones = [], defaultValue = "", ...props }, ref) => {
        return (
            <>
                <div>
                    <span className=''>
                        {label}
                    </span>
                    <select
                    ref={ref}
                    {...props}
                    // Asigna el ref al select
                    disabled={deshabilitado}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${deshabilitado ? 'bg-gray-200' : ''}`}
                >
                        {opciones.map(opcion => (                            
                            <option key={opcion.id} value={opcion.id}   disabled={opcion.id === 2}>
                                {opcion.descripcion}
                            </option>
                        ))}
                    </select>
                </div>
            </>
        )
    })
// Asignar un displayName al componente
SelectTriaje.displayName = 'InputTextValue';

export default SelectTriaje;