'use client'
import axios from "axios"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { json } from "stream/consumers"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { TriajeForm } from "./TriajeForm"
import { InputText } from "../ui/InputTextDefaultValue"
type Input = {
    numcuenta: string
}
export const TriajeBusqueda = () => {

  
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Input>()

    
    const [info, setInfo] = useState<any>()

    const onSubmit: SubmitHandler<Input> = async (numerocuenta) => {
        try {
            const { numcuenta } = numerocuenta
            const { data } = await axios.get(`${process.env.apiurl}/Triaje/SolicitaAgregar/${numcuenta}`)
            console.log(data)
            if (data?.triajeSolicita?.exito === 0) {
            
                Swal.fire({
                    icon: "error",
                    title: `<h5 classname='text-base'>${data?.triajeSolicita?.mensaje} </h5>`,
                    html: `${data?.triajeSolicita?.info1} <br\>`,
                });
            }
            setInfo(data)
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: `Incorrecto`,
                html: `Ingreso numero de cuenta incorrecto.`,
            });
        }

    }



    return (
        <>
   
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <form className="flex items-center space-x-2" onSubmit={handleSubmit(onSubmit)}>
                        <InputText label="N° Cuenta : "   {...register('numcuenta', { required: true })}></InputText>
                        <button type="submit" className="mt-6 px-4 py-2 bg-green-500 text-white rounded-r-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Buscar</button>
                    </form>
                </div>
                <div>
                    <InputText label="Paciente : " readOnly={true} defaultValue={info?.triajeSolicita?.info1}></InputText>
                </div>
                <div>
                    <InputText label="IAFA :" readOnly={true} defaultValue={info?.triajeSolicita?.info2}></InputText>
                </div>
                <div>
                    <InputText label="Datos Informativos : " readOnly={true} defaultValue={info?.triajeSolicita?.info3}></InputText>
                </div>
            
            </div>
            <TriajeForm info={info} />
        </>
    )
}
