'use client'
import { useEffect, useState } from "react";
import { SelectTriaje } from "../ui/SelectTriaje";
import { FaPlus } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import Select from 'react-select';
import Swal from "sweetalert2";
import { FormNuevoUsuario } from './FormNuevoUsuario';
import { ModalGenerico } from "../ui/ModalGenerico";

type InputBusquedadDni = {
    dni: string
}

export const FormAdmision = (data: any) => {
  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [datospx, setDatospx] = useState<any>();
    const [activeIndex, setActiveIndex] = useState(null);
    const [datosConsultorio, setDatosConsultorio] = useState<any>();
    const [comboIafasDisable, setComboIafasDisable] = useState(false);
    const [iafas, setIafas] = useState<any>();
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [listadoProgramacion, setListadoProgramacion] = useState<any>()
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const establecimientoscombo = [
        { IdEstablecimiento: 1, Nombre: 'LABORATORIO CLINICO MUNICIPAL' },
        { IdEstablecimiento: 2, Nombre: 'DIRECCION DE SERVICIOS DE ATENCION MOVIL DE URGENCIAS Y EMERGENCIAS' },
        { IdEstablecimiento: 3, Nombre: 'SISTEMA DE ATENCION MOVIL DE URGENCIAS' },
        { IdEstablecimiento: 4, Nombre: 'SISTEMA DE ATENCION DE URGENCIA-SAMU' },
        { IdEstablecimiento: 5, Nombre: 'C. S. SAN JUAN DE MIRAFLORES' },
    ]
    const options = establecimientoscombo.map(est => ({
        value: est.IdEstablecimiento,
        label: est.Nombre,
    }));
    useEffect(() => {
        ObtenerIafas()
    }, [])

    const ObtenerIafas = async () => {
        try {
            const { data } = await axios.get(`${process.env.apiurl}/FuentesFinanciamiento`)
            const iafas = data.filter((opc: any) => opc.idFuenteFinanciamiento !== 1)
            setIafas(iafas);
        } catch (error) {
            console.log(error)
        }
    }

    

    useEffect(() => {
        setActiveIndex(null);
        setDatosConsultorio(null);
        setDatospx(null);
        reset2();
    }, [data])


    const opcionesDNI = [
        { id: 1, descripcion: "DNI" },
        { id: 2, descripcion: "C.E." },
    ];

    const verdata =async (data: any, index: any) => {
        setDatosConsultorio(data)
        setActiveIndex(index);
       
        const dataPromagracion=await axios.get(`${process.env.apiurl}/Citados/${data?.idProgramacion}`)
        setListadoProgramacion(dataPromagracion?.data)
       
    }

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

    const BuscadorDni: SubmitHandler<InputBusquedadDni> = async (formdata) => {
        try {
            setbuttonLoading(true)
            const { data }: any = await axios.get(`${process.env.apiurl}/Totem/SolicitaAdmitir?dni=${formdata.dni}&tipo=1`)

            setDatospx(data);
            if (data?.sisRpta?.exito) {
                console.log("si posee sis")
                setComboIafasDisable(false)
            }
            else {
                console.log("no posee sis")
                setComboIafasDisable(true)
            }

            const establecimientosis = await axios.get(`${process.env.apiurl}/Totem/Establecimientos/${data?.sis?.eess.slice(-5)}`)
            console.log(establecimientosis.data)

            setbuttonLoading(false)
        } catch (error) {
            Swal.fire({
                title: `<span>Atencion</span>`,
                html: `<h5>DNI no encontrado.</h5>`,
                timer: 5000,
                timerProgressBar: true,
                icon: 'error',
            });
        }
    }

    const handleChange = (selectedOption: any) => {
        console.log('Selected:', selectedOption);
    };

    const { consultorio } = data;
    if (data === null || data.consultorio === undefined) {
        return (
            <div className="bg-yellow-100 m-5 border border-yellow-300 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Aviso:</strong>
                <span className="block sm:inline"> Escoge alguna especialidad.</span>
            </div>
        );
    }

    return (
        <>

            <div className="h-full bg-slate-400 md:bg-white p-3">
                <div className="flex justify-center">

                    <button
                        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                        onClick={openModal}
                    >
                        Nuevo Paciente
                    </button>
                    <ModalGenerico isOpen={isModalOpen} onClose={closeModal}>
                        <h3 className="text-lg font-semibold text-gray-900">Modal Title</h3>
                        <div className="mt-4 text-sm text-gray-600">
                            <FormNuevoUsuario />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </ModalGenerico>
                </div>


                <div className="grid grid-cols-2 mt-3">
                    {
                        consultorio?.map((data: any, index: number) => (
                            <div
                                key={index}
                                onClick={() => verdata(data, index)}
                                className={`${activeIndex === index ? 'bg-yellow-400 text-black font-semibold' : 'bg-blue-500 text-white'} 
                                shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:bg-yellow-200 hover:text-black rounded-lg p-3 m-4 h-28 flex items-center justify-center`}
                            >    <div className="text-center" >
                                    <div className="mt-2 text-sm ">
                                        <p >{data.nombreServicio} ({data.cuposLibres})</p>
                                        <p >{data.nombreMedico}</p>
                                        <p >{data.horaInicio} - {data.horaFin} </p>
                                    </div>
                                </div>
                            </div>

                        ))
                    }
                </div>
                <form onSubmit={handleSubmit2(BuscadorDni)}>

                    <div className="grid grid-cols-3 gap-2">
                        <select
                            // Asigna el ref al selec
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 }`}
                        >
                            {opcionesDNI.map(opcion => (
                                <option key={opcion.id} value={opcion.id} disabled={opcion.id === 2}>
                                    {opcion.descripcion}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            className=" px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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


                        <button
                            type="submit"
                            className={` text-white py-2 px-4 rounded-r-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                                ${isValid2 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}
                                ${buttonLoading ? 'bg-gray-300 cursor-not-allowed' : ''}
                                `}
                            disabled={!isValid2 || buttonLoading}
                        >

                            {!buttonLoading ? 'Buscar' : 'Cargando...'}

                        </button>
                        {errors2.dni && (
                            <div className="text-red-500 text-sm mt-1 col-span-3 text-center">{errors2?.dni?.message}</div>
                        )}
                    </div>
                </form>


                <div className="grid grid-cols-1 gap-2 mt-3">
                    <Select
                        inputId="select-establecimientos"
                        options={options}
                        onChange={handleChange}
                        placeholder="Seleccione un establecimiento"
                        isSearchable={true} // Habilita la búsqueda
                    />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                    <span className=''>
                        Financiamiento :
                    </span>
                    <select
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        {iafas && iafas.length > 0 && iafas.map((opcion: any) => {

                            return (
                                <option key={opcion.idFuenteFinanciamiento} value={opcion.idFuenteFinanciamiento}>
                                    {opcion.descripcion}
                                </option>
                            );
                        })}
                    </select>

                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                    <label className="text-center">Nro de Referencia : </label>
                    <input
                        type="text"
                        className=" px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=""
                    />
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="flex justify-center items-center bg-amber-500 text-white rounded shadow hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 w-1/2 h-12"
                        >
                            <FaPlus />
                        </button>
                    </div>
                </div>

                {(datosConsultorio?.nombre_Medico || datospx?.paciente?.idPaciente) && (
                    <div className="max-w-xs mt-3 mx-auto bg-white border border-dashed border-gray-300 p-4 rounded-lg shadow-md text-sm font-mono">
                        <div className="text-center mb-4">
                            <p className="font-bold">Ticket de Consulta</p>
                        </div>
                        <div className="mb-2">
                            <p className="font-semibold">Consultorio:</p>
                            <p>{datosConsultorio?.nombre_Servicios}</p>
                        </div>
                        <div className="mb-2">
                            <p className="font-semibold">Médico:</p>
                            <p>{datosConsultorio?.nombre_Medico}</p>
                        </div>
                        {datospx && (
                            <div className="mb-2">
                                <p className="font-semibold">Paciente:</p>
                                <p>{datospx?.paciente?.apenom}</p>
                            </div>
                        )}
                        <div className="text-center mt-4 border-t pt-2">
                            <p className="text-xs">Gracias por su visita</p>
                        </div>
                    </div>
                )}


                <pre>
                    {JSON.stringify(listadoProgramacion,null,2)}
                </pre>
                <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Nombres</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Cuenta</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Hora</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Accion</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                              
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">John Brown</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">45</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">New York No. 1 Lake Park</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400">Delete</button>
                                            </td>
                                        </tr>                          
                                      
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
