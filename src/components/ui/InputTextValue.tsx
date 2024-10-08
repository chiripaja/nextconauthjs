import React, { forwardRef } from 'react';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    value?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputTextValue = forwardRef<HTMLInputElement, InputTextProps>(
  ({ label, value = "", ...props }, ref) => {
    return (
      <div className="relative h-11 w-full min-w-[200px]">
        <input
          ref={ref}
          readOnly={false}
          value={value}
          className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
          {...props}
        />
        <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
          {label}
        </label>
      </div>
    );
  }
);

// Asignar un displayName al componente
InputTextValue.displayName = 'InputTextValue';

export default InputTextValue;
