import React, { forwardRef } from 'react'
interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value?: string;
  requerido?: boolean;
  readOnly?: boolean;
  defaultValue?: string;
  unidadMedida?: string;
  parametro?: string;
  deshabilitado?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const InputWithHeaderDate = forwardRef<HTMLInputElement, InputTextProps>(
  ({ unidadMedida = "", parametro = "", label = "", defaultValue = "", requerido = false, readOnly = false, deshabilitado = true, ...props }, ref) => {
    return (
      <>
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700">{label} {requerido && <span className="text-red-500">(*)</span>} </label>
          <div className="relative flex items-center">
            <input
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${deshabilitado ? 'bg-gray-200' : 'bg-white'
                }`}
              {...props}
              ref={ref}
              defaultValue={defaultValue}
              disabled={deshabilitado}
              type="date"
            />
            <span className="absolute right-3 text-gray-500">{unidadMedida}</span>
          </div>

          <span className="text-red-500 h-4">
            {parametro}
          </span>
        </div>
      </>
    )
  })
// Asignar un displayName al componente
InputWithHeaderDate.displayName = 'InputTextValue';

export default InputWithHeaderDate;