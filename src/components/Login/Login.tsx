'use client'
const crypto = require('crypto');
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { docredentials } from "@/actions/auth-actions";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
type FormInput = {
    usuario: string
    clave: string
}
const MySwal = withReactContent(Swal);
export const Login = () => {
    const router = useRouter()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInput>();

    const [isLoading, setIsLoading] = useState(false);
    const onSubmit: SubmitHandler<FormInput> = async (data: FormInput) => {
        setIsLoading(true);
        
        const hash = crypto.createHash('sha1');
        hash.update(data.clave);
        const clave = hash.digest('hex');
        const usuario = data.usuario;
        /*const dataveraxios = await axios.post(`${process.env.apiurl}/Usuario/VerificaAcceso`, {
            usuario: usuario,
            clave: clave
        })
        console.log(dataveraxios.data)*/
        try {
            const response = await docredentials(usuario, clave)
            
            if (!!response.error) {
                MySwal.fire({
                    title: "Error",
                    text: "Credenciales incorrectas.",
                    icon: "error",
                  });
            } else {
                router.push("/sihce/inicio")
            }
        } catch (error) {
            MySwal.fire({
                title: "Error",
                text: "Error en el servidor. Inténtelo de nuevo más tarde.",
                icon: "error",
              });
        }
        finally {
            setIsLoading(false);
        }
    }


    return (
        <main className="flex justify-center bg-slate-400">
            <div className="w-full sm:w-[450px] px-10 ">
                <div className="flex flex-col min-h-screen pt-32 sm:pt-52 ">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded">
                      
                         {isLoading && (
                            <div className="font-regular relative mb-4 block w-full rounded-lg bg-yellow-500 p-4 text-base leading-5 text-white opacity-100">
                                Cargando...
                            </div>
                        )}
                        <h1 className={` text-4xl mb-5 text-center`}>SICHE WEB</h1>

                        <div className="flex flex-col">

                            <label htmlFor="email">Correo electrónico</label>
                            <input
                                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                                {...register("usuario")} />


                            <label htmlFor="email">Contraseña</label>
                            <input
                                type="password"
                                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                                {...register("clave", { required: true })} />

                            <button

                                className="middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                data-ripple-light="true">
                                Ingresar
                            </button>




                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}
