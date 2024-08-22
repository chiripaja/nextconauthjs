'use client'
import { useCallback, useEffect, useState } from "react";
import { SelectTriaje } from "../ui/SelectTriaje";
import { FaPlus } from "react-icons/fa";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import Select from 'react-select';
import Swal from "sweetalert2";
import { FormNuevoUsuario } from './FormNuevoUsuario';
import { ModalGenerico } from "../ui/ModalGenerico";
import { FiPrinter } from "react-icons/fi";
import { AiOutlineLoading } from "react-icons/ai";
import { TicketImpresion } from "./TicketImpresion";

type InputBusquedadDni = {
    dni: string
}
type formAdmision = {
    idPaciente: number,
    idProgramacion: number,
    idIafa: number,
    referenciaCodigo: string,
    referenciaNumero: string
}

interface Establecimiento {
    value: string;
    label: string;
}
const showAlert = (title: any, html: any) => {
    Swal.fire({
        title: `<span>${title}</span>`,
        html: `<h5>${html}</h5>`,
        timer: 5000,
        timerProgressBar: true,
        icon: 'error',
    });
};
const fetchOptions = async (establecimiento: string): Promise<Establecimiento[]> => {
    try {
        const response = await axios.get(`${process.env.apiurl}/Establecimientos/${establecimiento}`);
        return response.data.map((est: any) => ({
            value: est.codigo,
            label: est.nombre
        }));
    } catch (error) {
        console.error('Error fetching options', error);
        return [];
    }
};


const fetchOptionsByCodigo = async (codigo: string): Promise<Establecimiento[]> => {
    try {
        const response = await axios.get(`${process.env.apiurl}/Totem/Establecimientos/${codigo}`);
        return response.data.map((est: any) => ({
            value: est.codigo,
            label: est.nombre
        }));
    } catch (error) {
        console.error('Error fetching options', error);
        return [];
    }
};

export const FormAdmision = (data: any) => {
    const [nearest, setNearest] = useState<any>(null);
    const [optionsCombo, setOptionsCombo] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { ffFinanciamiento } = data;
    const { consultorio } = data;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [datospx, setDatospx] = useState<any>();
    const [activeIndex, setActiveIndex] = useState(null);
    const [datosConsultorio, setDatosConsultorio] = useState<any>();
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [listadoProgramacion, setListadoProgramacion] = useState<any[]>([])
    const [cargandoLista, setCargandoLista] = useState(false)
    const [isLoadingAdmisionar, setIsLoadingAdmisionar] = useState(false);
    const [shouldPrint, setShouldPrint] = useState(false);

    const loadOptions = useCallback(async (inputValue: string) => {
        setIsLoading(true);
        const fetchedOptions = await fetchOptions(inputValue);
        setOptionsCombo(fetchedOptions);
        setIsLoading(false);
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const opcionesDNI = [
        { id: 1, descripcion: "DNI" },
        { id: 2, descripcion: "C.E." },
    ];

    const verdata = async (data: any, index: any) => {
        setCargandoLista(true)
        setDatosConsultorio(data)
        setActiveIndex(index);
        const dataPromagracion = await axios.get(`${process.env.apiurl}/Citados/${data?.idProgramacion}`)
        setListadoProgramacion(dataPromagracion?.data.filter((data: any) => data?.idCuentaAtencion !== 0))
        setCargandoLista(false)
    }

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        setValue: setValue2,
        watch: watch2,
        reset: reset2,
        formState: { errors: errors2, isValid: isValid2 },
    } = useForm<InputBusquedadDni>({
        mode: 'onChange',
    })

    const { control, register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<formAdmision>();


    const BuscadorDni: SubmitHandler<InputBusquedadDni> = async (formdata) => {
        try {
            setValue('idIafa', 0)
            setValue('referenciaNumero', "")
            setValue('referenciaCodigo', "")

            setbuttonLoading(true)
            const { data }: any = await axios.get(`${process.env.apiurl}/Totem/SolicitaAdmitir?dni=${formdata.dni}&tipo=1`)
            console.log(data?.sisRpta?.exito)

            AutoseleccionEstablecimiento(data?.sis?.eess.slice(-5))
            setDatospx(data);
            if (data?.sisRpta?.exito) {
                setValue('idIafa', 3)
            }
            else {
                setValue('idIafa', 5)
            }
            setbuttonLoading(false)
        } catch (error) {
            setbuttonLoading(true)
            showAlert("Atencion", "DNI no encontrado.")
            setbuttonLoading(false)
        }
    }

    const AutoseleccionEstablecimiento = async (codigo: string) => {
        setIsLoading(true);
        const fetchedOptions = await fetchOptionsByCodigo(codigo);
        setOptionsCombo(fetchedOptions);
        setIsLoading(false);
    }





    const AdmisionarPx: SubmitHandler<formAdmision> = async (formData: any) => {

        setIsLoadingAdmisionar(true)

        if (formData.idIafa === 3) {
            if (!formData?.idPaciente) {
                showAlert("Atencion", "Seleccionar paciente.")
                setIsLoadingAdmisionar(false);
            }
            else if (!formData?.idProgramacion) {
                showAlert("Atencion", "Seleccionar consultorio.")
                setIsLoadingAdmisionar(false);
            } else {
                const convertedData = {
                    ...formData,
                    idIafa: parseInt(formData?.idIafa, 10),
                    referenciaCodigo: formData?.referenciaCodigo?.value
                };
                try {
                    const data = await axios.post(`${process.env.apiurl}/AdmisionGuardar`, convertedData);

                    if (data?.data?.exito === '1') {
                        showAlert("Atencion", data?.data?.mensaje)
                    }
                    else {
                        showAlert("Atencion", data?.data?.mensaje)
                    }

                } catch (error) {
                    console.log(error)
                } finally {
                    setIsLoadingAdmisionar(false);
                }
            }
        } else {
            if (!formData?.idPaciente) {
                showAlert("Atencion", "Seleccionar paciente.")
                setIsLoadingAdmisionar(false);
            }
            else if (!formData?.idProgramacion) {
                showAlert("Atencion", "Seleccionar consultorio.")
                setIsLoadingAdmisionar(false);
            } else {
                try {
                    const data = await axios.post(`${process.env.apiurl}/AdmisionGuardar`, formData);
                    if (data?.data?.exito === '1') {
                        showAlert("Atencion", data?.data?.mensaje)
                    }
                    else {
                        showAlert("Atencion", data?.data?.mensaje)
                    }
                } catch (error) {
                    console.log(error)
                } finally {
                    setIsLoadingAdmisionar(false);
                }
            }

        }


    }



    const idIafaValue = watch('idIafa');

    useEffect(() => {
        if (inputValue) {
            loadOptions(inputValue);
        } else {
            setOptionsCombo([]);
        }
    }, [inputValue, loadOptions]);


    useEffect(() => {
        setActiveIndex(null);
        setDatosConsultorio(null);
        setDatospx(null);
        reset2();
        reset();
        setListadoProgramacion([]);
    }, [data])

    useEffect(() => {
        if (datospx?.paciente?.idPaciente) {
            setValue('idPaciente', datospx.paciente.idPaciente);
        }
    }, [datospx, setValue]);



    useEffect(() => {
        if (datosConsultorio?.idProgramacion) {
            setValue('idProgramacion', datosConsultorio?.idProgramacion)
        }
    }, [datosConsultorio, setValue])



    const idIafa = watch('idIafa');
    useEffect(() => {
        // Aquí puedes hacer algo cada vez que 'idIafa' cambie
        console.log('Valor seleccionado:', idIafa);

        // Ejemplo: Actualizar otro campo basado en el valor seleccionado
        if (idIafa) {
            console.log("entro aca")
            // Puedes hacer una solicitud, actualizar el estado, etc.
            setValue('referenciaCodigo', '');
            setValue('referenciaNumero', '');
        }
    }, [idIafa]);


    const impresionTicket=async(numcuenta:any)=>{
        const {data}=await axios.get(`${process.env.apiurl}/TicketAdmision/${numcuenta}`)
        await setNearest(data)
        setShouldPrint(true);
    }
    useEffect(() => {
        if (shouldPrint && nearest) {
            print(); // Imprime solo cuando shouldPrint es true y nearest tiene datos
            setShouldPrint(false); // Resetea el estado para evitar impresiones accidentales
        }
    }, [nearest, shouldPrint]);

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

            <div className="h-full bg-slate-400 md:bg-white p-3 print:hidden">
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


                <div className="grid grid-cols-2 mt-3 gap-2">
                    {
                        consultorio?.map((data: any, index: number) => (
                            <div
                                key={index}
                                onClick={() => verdata(data, index)}
                                className={`${activeIndex === index ? 'bg-yellow-400 text-black font-semibold' : 'bg-blue-500 text-white'} 
                                shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:bg-yellow-200 hover:text-black rounded-lg p-6 m-2 h-32 flex items-center justify-center`}
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
                            className={`px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500
                                `}
                            placeholder=""
                            autoComplete="false"
                            {...register2('dni', {
                                required: 'Este campo es obligatorio',
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
                <input
                    type="text"
                    className=" px-3 mt-4 w-full py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={datospx?.paciente?.apenom}
                    disabled={true}
                />

                <form onSubmit={handleSubmit(AdmisionarPx)}>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                        <span className='text-center'>
                            Financiamiento :
                        </span>
                        <select

                            {...register('idIafa')}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            {ffFinanciamiento && ffFinanciamiento.length > 0 && ffFinanciamiento.map((opcion: any) => {
                                return (
                                    <option key={opcion.idFuenteFinanciamiento} value={opcion.idFuenteFinanciamiento}>
                                        {opcion.descripcion}
                                    </option>
                                );
                            })}
                        </select>

                    </div>

                    {idIafaValue == 3 && (
                        <div>
                            <div className="grid grid-cols-1 gap-2 mt-3">
                                <Controller
                                    name="referenciaCodigo" // Nombre del campo en el formulario
                                    control={control}
                                    defaultValue="" // Valor predeterminado
                                    render={({ field }) => (
                                        <Select
                                            inputId="select-establecimientos"
                                            options={optionsCombo}
                                            placeholder={isLoading ? 'Cargando...' : 'Seleccione un establecimiento'}
                                            isSearchable={true}
                                            isLoading={isLoading}
                                            {...field}
                                            onInputChange={setInputValue}
                                            required={true}
                                        />
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <label className="text-center">Nro de Referencia : </label>
                                <input
                                    type="text"
                                    className={`px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 
${errors.referenciaNumero ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                    placeholder=""
                                    {...register('referenciaNumero', { required: 'Este campo es obligatorio' })}
                                />
                                <div className="text-red-500 col-span-3 text-center">
                                    {errors.referenciaNumero && <span>{errors.referenciaNumero.message}</span>}
                                </div>

                            </div>
                        </div>
                    )}





                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className={`flex justify-center items-center ${isLoadingAdmisionar ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'} text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 w-1/2 h-12`}
                            disabled={isLoadingAdmisionar}
                        >

                            {isLoadingAdmisionar ? <AiOutlineLoading className="animate-spin" /> : <FaPlus />} &nbsp;
                            {isLoadingAdmisionar ? 'Cargando...' : 'Admisionar'}

                        </button>
                    </div>
                </form>
                {(datosConsultorio?.nombre_Medico || datospx?.paciente?.idPaciente) && (
                    <div className="max-w-xs mt-3 mx-auto bg-white border border-dashed border-gray-300 p-4 rounded-lg shadow-md text-sm font-mono">
                        <div className="text-center mb-4">

                            <p className="font-bold">Ticket de Cita</p>
                        </div>
                        <div className="mb-2">
                            <p className="font-semibold">Consultorio:</p>
                            <p>{datosConsultorio?.nombreServicio} ({datosConsultorio?.horaInicio} - {datosConsultorio?.horaFin})</p>
                        </div>
                        <div className="mb-2">
                            <p className="font-semibold">Médico:</p>
                            <p>{datosConsultorio?.nombreMedico}</p>
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


                {/* tabla lista programados */}

                <div className="flex flex-col mt-4">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="overflow-hidden h-96"> {/* Establece la altura fija aquí */}
                                <div className="overflow-y-auto h-full"> {/* Habilita el scroll vertical */}
                                    {cargandoLista ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="rounded-full h-20 w-20 bg-blue-600 animate-ping"></div>
                                        </div>
                                    ) : listadoProgramacion && Array.isArray(listadoProgramacion) && listadoProgramacion.length === 0 ? (
                                        <div className="flex items-center justify-center h-full">
                                            <span className="text-gray-500">No tiene datos</span>
                                        </div>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 border">
                                            <thead>
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Nombres</th>
                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Cuenta</th>
                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Hora</th>
                                                    <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Acción</th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                                {listadoProgramacion.map((datalista: any) => {
                                                    const isCuentaAtencionNotZero = datalista?.idCuentaAtencion !== 0;

                                                    return (
                                                        <tr key={datalista?.idCita} className={isCuentaAtencionNotZero ? '' : 'bg-yellow-100'}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                                                {datalista?.paciente}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                                {datalista?.idCuentaAtencion}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                                {datalista?.horaInicio} - {datalista?.horaFin}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">


                                                                <button type="button" onClick={()=>impresionTicket(datalista?.idCuentaAtencion)} className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                                                    <FiPrinter />
                                                                    Imprimir
                                                                </button>

                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {nearest && (
                <TicketImpresion Datos={nearest} />
            )}

        </>
    )
}
