import { useEffect, useState } from "react";
import { SelectTriaje } from "../ui/SelectTriaje";
import { FaPlus } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import Select from 'react-select';

type InputBusquedadDni = {
    dni: string
}

export const FormAdmision = (data: any) => {
    const [datospx, setDatospx] = useState<any>()
    const [activeIndex, setActiveIndex] = useState(null);
    const [datosConsultorio, setDatosConsultorio] = useState<any>()
    const [comboIafasDisable, setComboIafasDisable] = useState(false)
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
        setActiveIndex(null);
        setDatosConsultorio(null);
        setDatospx(null);
        reset2();
    }, [data])


    const opcionesDNI = [
        { id: 1, descripcion: "DNI" },
        { id: 2, descripcion: "C.E." },
    ];
    const opcionesFF = [
        { id: 1, descripcion: "SIS" },
        { id: 2, descripcion: "particular" },
    ];

    const verdata = (data: any, index: any) => {
        setDatosConsultorio(data)
        setActiveIndex(index);
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
        const { data } = await axios.get(`${process.env.apiurl}/Totem/SolicitaAdmitir?dni=${formdata.dni}&tipo=1`)
        setDatospx(data);
        console.log(data?.sisRpta?.exito)
        if(data?.sisRpta?.exito){
            console.log("si posee sis")
            setComboIafasDisable(false)
        }
        else{
            console.log("no posee sis")
            setComboIafasDisable(true)
        }
        console.log(data)
    }
    const handleChange = (selectedOption: any) => {
        console.log('Selected:', selectedOption);
    };
    const { consultorio } = data;
    return (
        <>
            <div className="h-full bg-slate-400 md:bg-white p-3">
                <pre>
                    {JSON.stringify(datospx,null,2)}
                    {JSON.stringify(datospx?.sisRpta?.exito,null,2)}
                </pre>
                <div className="grid grid-cols-2 mt-3">
                    {
                        consultorio?.map((data: any, index: number) => (
                            <div
                                key={index}
                                onClick={() => verdata(data, index)}
                                className={`${activeIndex === index ? 'bg-teal-500' : 'bg-blue-500'
                                    } shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 rounded-lg p-5 m-4 h-40 flex items-center justify-center`}
                            >    <div className="text-center" >
                                    <div className="mt-2 text-sm text-white">
                                        <p >{data.nombre_Servicios} ({data.cupos_Libres})</p>
                                        <p >{data.nombre_Medico}</p>
                                    </div>
                                </div>
                            </div>

                        ))
                    }
                </div>
                <form onSubmit={handleSubmit2(BuscadorDni)}>

                    <div className="grid grid-cols-3 gap-2">
                        <SelectTriaje opciones={opcionesDNI} deshabilitado={false} />
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
                            className={` text-white py-2 px-4 rounded-r-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isValid2 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
                            disabled={!isValid2}
                        >
                            Buscar
                        </button>
                        {errors2.dni && (
                            <div className="text-red-500 text-sm mt-1 col-span-3 text-center">{errors2?.dni?.message}</div>
                        )}
                    </div>
                </form>


                <div className="grid grid-cols-1 gap-2 mt-3">
                    <Select
                        options={options}
                        onChange={handleChange}
                        placeholder="Seleccione un establecimiento"
                        isSearchable={true} // Habilita la búsqueda
                    />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                    <label className="text-center">Financiamiento : </label>
                    <SelectTriaje opciones={opcionesFF} deshabilitado={false} />
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

                {datosConsultorio?.nombre_Medico && (
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
            </div>
        </>
    )
}
