'use client'
import React from 'react'
import { useForm } from 'react-hook-form';
import InputWithHeader from '../ui/InputWithHeader';
import { FaPlus } from 'react-icons/fa';
import SelectTriaje from '../ui/SelectTriaje';
import { GiCancel } from 'react-icons/gi';
import { BiSearchAlt } from 'react-icons/bi';
const opcionesDNI = [
    { id: 1, descripcion: "DNI" },
    { id: 2, descripcion: "C.E." },
];
type InputBusquedadDni = {
    dni: string
}

export const FormNuevoUsuario = () => {

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        setValue: setValue2,
        watch: watch2,
        reset: reset2,
        formState: { errors: errors2, isValid: isValid2 },
    } = useForm<InputBusquedadDni>({
        mode: 'onChange', // Valida en tiempo real
    })

    return (
        <div className='bg-white p-10'>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <div className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 bg-gray-100 p-2'>
                    <span className='font-semibold'>Información Personal</span>
                </div>

                {/* primera linea */}
                <div className='row-span-3 bg-slate-400'>
                    foto de perfil
                </div>
                <div>
                    <select className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                        {opcionesDNI.map(opcion => (
                            <option key={opcion.id} value={opcion.id} disabled={opcion.id === 2}>
                                {opcion.descripcion}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=""
                        autoComplete="false"
                        {...register2('dni', {
                            required: true,
                            minLength: {
                                value: 8,
                                message: "El DNI debe tener al menos 8 dígitos"
                            },
                            maxLength: {
                                value: 8,
                                message: "El DNI no debe exceder los 8 dígitos"
                            },
                            pattern: {
                                value: /^[0-9]{8}$/,
                                message: "El DNI debe contener exactamente 8 dígitos numéricos"
                            }
                        })}
                    />
                    <style jsx>{`
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            input[type="number"] {
                -moz-appearance: textfield;
            }
        `}</style>
                </div>

                <div className='flex justify-center items-center'>
                    <button type="button" className="w-fit h-fit mt-2  py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                        Buscar
                        <BiSearchAlt />
                    </button>
                </div>

                {/* segunda linea */}
                <div className='col-span-1 sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6'>

                    <InputWithHeader label="Nombres Completos" />

                    <InputWithHeader label="Departamento" />

                </div>

                {/* tercera linea */}
                <div className='col-span-1 sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6'>

                    <InputWithHeader label="Apellido Paterno" />

                    <InputWithHeader label="Provincia" />

                </div>

                {/* cuarta linea */}
                <div className='col-span-1 sm:col-span-2 md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-3'>

                    <InputWithHeader label="Fecha de Nacimiento" />

                    <div className='col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6'>

                        <InputWithHeader label="Apellido Materno" />

                        <InputWithHeader label="Distrito" />

                    </div>
                </div>
            </div>





            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {/* primera linea */}
                <div className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 bg-gray-100 p-2'>
                    <span className='font-semibold'>Datos de Contacto</span>
                </div>
                {/* segunda linea */}
                <div className='col-span-1 sm:col-span-2 md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-3'>

                    <InputWithHeader label="Celular" />

                    <div className='col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6'>

                        <InputWithHeader label="Telefono" />

                        <InputWithHeader label="Correo Electronico" />

                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2  gap-3">
                {/* primera linea */}
                <div className='col-span-1  md:col-span-2  bg-gray-100 p-2'>
                    <span className='font-semibold'>Datos de Familiares</span>
                </div>

                {/* segunda linea */}
                <div className='col-span-1 grid grid-cols-2 gap-2'>
                    <InputWithHeader label="Documento" />
                    <div className="flex items-center">
                        <button type="button" className="w-fit h-fit mt-2  py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                            Añadir
                            <FaPlus />
                        </button>
                    </div>
                </div>


                <InputWithHeader label="Parentesco" />
                {/* tercera linea */}
                <InputWithHeader label="Nombres y apellidos" />
                <InputWithHeader label="Celular" />
            </div>



            <div className="grid grid-cols-1 md:grid-cols-3  gap-3">
                {/* primera linea */}
                <div className='col-span-1  md:col-span-3  bg-gray-100 p-2'>
                    <span className='font-semibold'>Domicilio Actual</span>
                </div>
                {/* segunda linea */}

                <SelectTriaje label='Pais' />
                <SelectTriaje label='Departamento' />
                <SelectTriaje label='Provincia' />
                <SelectTriaje label='Distrito' />
                <SelectTriaje label='localidad' />
                <div></div>
                <div className='col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <InputWithHeader label="Direccion" />
                    <InputWithHeader label="Referencia" />
                </div>

            </div>

            <div className=' grid grid-cols-2 gap-3'>
                <div className="flex justify-end">
                    <button type="button" className="w-fit h-fit mt-2  py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                        Guardar
                        <FaPlus />
                    </button>
                </div>

                <div className="flex justify-start">
                    <button type="button" className="w-fit h-fit mt-2  py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-400 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                        Cancelar
                        <GiCancel />
                    </button>
                </div>

            </div>


        </div>
    )
}
