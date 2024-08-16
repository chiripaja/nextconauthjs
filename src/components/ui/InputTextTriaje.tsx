import React, { forwardRef } from 'react';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    value?: string;
    requerido?: boolean;
    readOnly?: boolean;
    defaultValue?: string;
    unidadMedida?: string;
    parametro?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputTextTriaje = forwardRef<HTMLInputElement, InputTextProps>(
    ({ unidadMedida = "", parametro = "", label = "", defaultValue = "", requerido = false, readOnly = false, ...props }, ref) => {
        return (
            <div className='grid grid-cols-1'>
                <div>
                    <span>{label} {requerido && <span className="text-red-500">(*)</span>}</span>
                </div>
                <div className='grid grid-cols-3 gap-1'>
                    <input
                        {...props}
                        ref={ref}
                        defaultValue={defaultValue}
                        className="col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="ml-1 bg-slate-200 text-center flex items-center justify-center rounded">
                        <span>{unidadMedida}</span>
                    </div>
                </div>
                <div className="text-red-500 h-4">
                    {parametro}
                </div>
            </div>
        );
    }
);

// Asignar un displayName al componente
InputTextTriaje.displayName = 'InputTextTriaje';

export default InputTextTriaje;
