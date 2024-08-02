import React, { forwardRef } from 'react'
interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement>{
    label: string;
    value?: string;
    requerido?:boolean;
    readOnly?: boolean;
    defaultValue?: string;
    unidadMedida?:string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const InputTextTwo = forwardRef<HTMLInputElement, InputTextProps>(
    ({ unidadMedida="",label="", defaultValue = "",requerido=false, readOnly = false , ...props }, ref) => {
      return (
    <div className="flex items-center justify-center  ">
      <div className="flex flex-col">
    
      Presion Arterial
        <div className="flex items-center">
            
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Sistolica"
          />
      <div>
        /
      </div>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Diastolica"
          />
        </div>
      
      </div>
    </div>
  )
})
