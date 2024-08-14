'use client'
import axios from "axios"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { json } from "stream/consumers"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { InputText } from "../ui/InputTextDefaultValue"
import { useSession } from 'next-auth/react';
import { InputWithHeader } from '../ui/InputWithHeader';
import { InputTextTriaje } from '../ui/InputTextTriaje';
import { SelectTriaje } from '../ui/SelectTriaje';
import { LuAlertTriangle } from "react-icons/lu"
import { InputWithHeaderDate } from "../ui/InputWithHeaderDate"

type Input = {
    triajePulso?: string;
    triajeTemperatura?: string;
    presionSist?: number;
    presionDiast?: number;
    triajeFrecCardiaca?: string;
    triajePerimetro?: string;
    triajeFrecRespiratoria?: string;
    triajePeso?: string;
    triajeTalla?: string;
    triajePerimCefalico?: string;
    triajeSaturacion?: string;
    EsGestante?: string;
    EsRecienNacido?: string;

    alturaUterina?: string;
    frecCardiaca?: string;
    edadGestacional?: string;
    fechaParto?: string;

    apariencia?: string;
    circulatorio?: string;
    respiratorio?: string;

    observaciones?: string;
};


type InputBusquedad = {
    numcuenta: string
}
export const TriajeDif = () => {
    const session = useSession()
    const {
        register: register2,
        handleSubmit: handleSubmit2,
        setValue: setValue2,
        watch: watch2,
        reset: reset2,
        formState: { errors: errors2 },
    } = useForm<InputBusquedad>()

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<Input>();

    const [datosTriajePaciente, setDatosTriajePaciente] = useState<any>()
    const [estadoGestacionalCheck, setEstadoGestacionalCheck] = useState<boolean>(true)
    const [estadoRecienNacido, setEstadoRecienNacido] = useState<boolean>(true)
    const [estadoPrioridadUnoFCAdulto, setEstadoPrioridadUnoFCAdulto] = useState<boolean>(false)
    const [estadoPrioridadUnoSistolicaAdulto, setEstadoPrioridadUnoSistolicaAdulto] = useState<boolean>(false)
    const [estadoPrioridadUnoDiastolicaAdulto, setEstadoPrioridadUnoDiastolicaAdulto] = useState<boolean>(false)
    const [estadoPrioridadUnoFRAdulto, setEstadoPrioridadUnoFRAdulto] = useState<boolean>(false)
    const [estadoPrioridadDosFR, setEstadoPrioridadDosFR] = useState<boolean>(false)
    const [ActivateButton, setActivateButton] = useState(false)

    const [verdataJson, setVerdataJson] = useState<any>()

    const checkGestante = watch('EsGestante');
    const checkRecienNacido = watch('EsRecienNacido');
    const InputTriajeFrecCardiaca = watch('triajeFrecCardiaca');
    const InputTriajeSistolica = watch('presionSist');
    const InputTriajeDiastolica = watch('presionDiast');
    const InputtriajeFrecRespiratoria = watch('triajeFrecRespiratoria');

    const [info, setInfo] = useState<any>()
    const [editable, setEditable] = useState<boolean>(false)



    //submit busqueda
    const onSubmit2: SubmitHandler<InputBusquedad> = async (numerocuenta) => {
        try {
            reset()
            const { numcuenta } = numerocuenta
            const { data } = await axios.get(`${process.env.apiurl}/Triaje/SolicitaAgregar/${numcuenta}`)
            if (data?.triajeSolicita?.exito === 0) {
                setEditable(false)
                Swal.fire({
                    icon: "error",
                    title: `<h5 classname='text-base'>${data?.triajeSolicita?.mensaje} </h5>`,
                    html: `${data?.triajeSolicita?.nroHistoria} - ${data?.triajeSolicita?.paterno} ${data?.triajeSolicita?.materno} , ${data?.triajeSolicita?.nombres}<br\>`,
                });
            }
            if (data?.triajeSolicita === null) {
                setEditable(false)
                Swal.fire({
                    icon: "error",
                    title: `<h5 classname='text-base'>No existe </h5>`,
                    html: `Ingrese numero de cuenta valido<br\>`,
                });
            }
            if (data?.triajeSolicita?.exito === 1) {
                setEditable(true)
            }
            setInfo(data)
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: `Incorrecto`,
                html: `Ingreso numero de cuenta incorrecto.`,
            });
            setInfo("")
        }

    }



    //submit formulario triaje
    const onSubmit: SubmitHandler<Input> = async (formData) => {
        setActivateButton(true)
        setTimeout(() => {
            setActivateButton(false)
        }, 2000);
        const datosTriaje = {
            ...formData,
            presionSist: formData.presionSist ? Number(formData.presionSist) : null,
            presionDiast: formData.presionDiast ? Number(formData.presionDiast) : null,
            triajeIdUsuario: Number(session?.data?.user.id),
            idAtencion: info?.triajeSolicita?.idAtencion
        }

        const sanitizedData = Object.fromEntries(
            Object.entries(datosTriaje).map(([key, value]) => [key, value ?? ''])
        );
        delete sanitizedData?.EsGestante
        delete sanitizedData?.EsRecienNacido
        delete sanitizedData?.alturaUterina
        delete sanitizedData?.apariencia
        delete sanitizedData?.circulatorio
        delete sanitizedData?.edadGestacional
        delete sanitizedData?.fechaParto
        delete sanitizedData?.frecCardiaca
        let idatenciongestante = 0;
        if (formData?.alturaUterina != null || formData?.edadGestacional != null || formData?.fechaParto != null) {
            idatenciongestante = info?.triajeSolicita?.idAtencion
        }
        let idreciennacido = 0;
        if (formData?.apariencia != null || formData?.circulatorio != null || formData?.respiratorio != null) {
            idreciennacido = info?.triajeSolicita?.idAtencion
        }

        const dataenviar = {
            ...sanitizedData,
            gestante: {
                idAtencion: idatenciongestante,
                alturaUterina: formData?.alturaUterina ?? "",
                frecCardiaca: formData?.frecCardiaca ?? "",
                edadGestacional: formData?.edadGestacional ?? "",
                fechaParto: formData?.fechaParto ?? "",
            },
            nacido: {
                idAtencion: idreciennacido,
                apariencia: formData?.apariencia ?? "",
                circulatorio: formData?.circulatorio ?? "",
                respiratorio: formData?.respiratorio ?? "",
            }
        }



        setVerdataJson(dataenviar)

        try {
            const { data } = await axios.post(`${process.env.apiurl}/Triaje/Guardar`, dataenviar)

            if (data.exito === 0) {
                Swal.fire({
                    icon: "error",
                    title: `<h5 classname='text-base'>Error </h5>`,
                    html: `${data?.mensaje} <br\>`,
                });
            }
            if (data.exito === 1) {
                reset()
                reset2()
                setInfo("")
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Se registro correctamente.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            setActivateButton(false)
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: `<h5 classname='text-base'>Error </h5>`,
                html: `${error} <br\>`,
            });
            setActivateButton(false)
        }/**/
    };





    //actualizacion de datos triaje
    useEffect(() => {
        if (info) {
            if (info?.triajeSolicita) {
                const { triaje } = info?.triajeSolicita

                if (triaje?.triajePresion) {
                    const [presionSist, presionDiast] = triaje.triajePresion.split('/');
                    setValue('presionSist', presionSist);
                    setValue('presionDiast', presionDiast);
                }
                setValue('triajePulso', triaje?.triajePulso);
                setValue('triajeTemperatura', triaje?.triajeTemperatura);
                setValue('triajeFrecCardiaca', triaje?.triajeFrecCardiaca);
                setValue('triajePerimetro', triaje?.triajePerimetro);
                setValue('triajeFrecRespiratoria', triaje?.triajeFrecRespiratoria);
                setValue('triajePeso', triaje?.triajePeso);
                setValue('triajeTalla', triaje?.triajeTalla);
                setValue('triajePerimCefalico', triaje?.triajePerimCefalico);
                setValue('triajeSaturacion', triaje?.triajeSaturacion);
                setValue('observaciones', triaje?.triajeObservacion);

                setValue('alturaUterina', info?.triajeGestante?.alturaUterina);
                setValue('edadGestacional', info?.triajeGestante?.edadGestacional);
                setValue('frecCardiaca', info?.triajeGestante?.frecCardiaca);
                setValue('fechaParto', info?.triajeGestante?.fechaParto);


                setValue('apariencia', info?.triajeNacido?.apariencia);
                setValue('circulatorio', info?.triajeNacido?.circulatorio);
                setValue('respiratorio', info?.triajeNacido?.respiratorio);
            }
            setDatosTriajePaciente(info)

        }

    }, [info]);



    //check box activar triaje gestante
    useEffect(() => {
        if (checkGestante) {
            setEstadoGestacionalCheck(false)
        } else {
            setEstadoGestacionalCheck(true)
        }
    }, [checkGestante]);

    //check box activar recien nacidos
    useEffect(() => {
        if (checkRecienNacido) {
            setEstadoRecienNacido(false)
        } else {
            setEstadoRecienNacido(true)
        }
    }, [checkRecienNacido]);


    const edad = 30;

    //condicional triajeAdultos 
    useEffect(() => {
        //prioridad uno
        const frecuenciaCardiaca = Number(InputTriajeFrecCardiaca);
        if (!isNaN(frecuenciaCardiaca) && frecuenciaCardiaca != 0) {
            if (edad >= 30 && (frecuenciaCardiaca < 50 || frecuenciaCardiaca > 150)) {
                setEstadoPrioridadUnoFCAdulto(true)
            } else {
                setEstadoPrioridadUnoFCAdulto(false)
            }
        } else {
            setEstadoPrioridadUnoFCAdulto(false)
        }
        const Sistolica = Number(InputTriajeSistolica);
        if (!isNaN(Sistolica) && Sistolica != 0) {

            if (info?.triajeSolicita?.edad >= 30 && (Sistolica < 90 || Sistolica > 220)) {

                setEstadoPrioridadUnoSistolicaAdulto(true)
            } else {

                setEstadoPrioridadUnoSistolicaAdulto(false)
            }
        } else {
            setEstadoPrioridadUnoSistolicaAdulto(false)
        }
        const Diastolica = Number(InputTriajeDiastolica);
        if (!isNaN(Diastolica) && Diastolica != 0) {
            if (info?.triajeSolicita?.edad >= 30 && (Diastolica > 110)) {

                setEstadoPrioridadUnoDiastolicaAdulto(true)
            } else {
                setEstadoPrioridadUnoDiastolicaAdulto(false)
            }
        } else {
            setEstadoPrioridadUnoDiastolicaAdulto(false)
        }

        const FrecuenciaRespiratoria = Number(InputtriajeFrecRespiratoria);
        if (!isNaN(FrecuenciaRespiratoria) && FrecuenciaRespiratoria != 0) {
            if (info?.triajeSolicita?.edad >= 30 && (FrecuenciaRespiratoria < 10 || FrecuenciaRespiratoria > 35)) {
                setEstadoPrioridadUnoFRAdulto(true)
            } else {
                setEstadoPrioridadUnoFRAdulto(false)
            }
        } else {
            setEstadoPrioridadUnoFRAdulto(false)
        }

        if (!isNaN(FrecuenciaRespiratoria) && FrecuenciaRespiratoria != 0) {
            if (FrecuenciaRespiratoria >= 24 && FrecuenciaRespiratoria <= 35) {
                setEstadoPrioridadDosFR(true)
            } else {

                setEstadoPrioridadDosFR(false)
            }
        } else {
            setEstadoPrioridadDosFR(false)
        }

    }, [InputTriajeFrecCardiaca, InputTriajeSistolica, InputTriajeDiastolica, InputtriajeFrecRespiratoria])





    //opciones parametros triaje


    const variablePeso = datosTriajePaciente?.triajeVariables.find(
        (variable: any) => variable.idTriajeVariable === 1
    );
    const ParametroPeso = variablePeso
        ? ` 0 a ${variablePeso.valorNormalMaximo} kg.`
        : '';


    const variableTalla = datosTriajePaciente?.triajeVariables.find(
        (variable: any) => variable.idTriajeVariable === 2
    );
    const ParametroTalla = variableTalla
        ? ` ${variableTalla.valorNormalMinimo} a ${variableTalla.valorNormalMaximo} cm.`
        : '';

    const variableCefalico = datosTriajePaciente?.triajeVariables.find(
        (variable: any) => variable.idTriajeVariable === 3
    );
    const ParametroCefalico = variableCefalico
        ? `  ${variableCefalico.valorNormalMinimo} a ${variableCefalico.valorNormalMaximo} cm.`
        : '';




    const variableSistolica = datosTriajePaciente?.triajeVariables.find(
        (variable: any) => variable.idTriajeVariable === 4
    );
    const ParametroSistolica = variableSistolica
        ? `${variableSistolica.valorNormalMinimo}-${variableSistolica.valorNormalMaximo}`
        : '';


    const variableDiastolica = datosTriajePaciente?.triajeVariables.find(
        (variable: any) => variable.idTriajeVariable === 5
    );
    const ParametroDiastolica = variableDiastolica
        ? `${variableDiastolica.valorNormalMinimo}-${variableDiastolica.valorNormalMaximo}`
        : '';

    const ParametrosPerimetro = ParametroSistolica && ParametroDiastolica
        ? `${ParametroSistolica}/${ParametroDiastolica} mmHg`
        : '';

    const variableTemperatura = datosTriajePaciente?.triajeVariables.find(
        (variable: any) => variable.idTriajeVariable === 6
    );
    const ParametroTemperatura = variableTemperatura
        ? ` ${variableTemperatura.valorNormalMinimo} a ${variableTemperatura.valorNormalMaximo} x min.`
        : '';


    const variableFC = datosTriajePaciente?.triajeVariables.find(
        (variable: any) => variable.idTriajeVariable === 7
    );
    const ParametroFrecuenciaCardiaca = variableFC
        ? ` ${variableFC.valorNormalMinimo} a ${variableFC.valorNormalMaximo} x min.`
        : '';


    const variableFR = datosTriajePaciente?.triajeVariables.find(
        (variable: any) => variable.idTriajeVariable === 8
    );
    const ParametroFrecuenciaRespiratoria = variableFR
        ? ` ${variableFR.valorNormalMinimo} a ${variableFR.valorNormalMaximo} x min.`
        : '';


    const variablePulso = datosTriajePaciente?.triajeVariables.find(
        (variable: any) => variable.idTriajeVariable === 9
    );
    const ParametroPulso = variablePulso
        ? ` ${variablePulso.valorNormalMinimo} a ${variablePulso.valorNormalMaximo}`
        : '';


    //opciones combo


    const opcionesApareciencia = [
        { id: 0, descripcion: "Elige una opción" },
        { id: 1, descripcion: "Inconsciente" },
        { id: 2, descripcion: "Tono anormal" },
        { id: 3, descripcion: "No Interactividad" },
        { id: 4, descripcion: "No consolable" },
        { id: 5, descripcion: "Mirada Anormal" },
        { id: 6, descripcion: "Llanto o lenguaje anormal" },
    ];
    const opcionesRespiratoria = [
        { id: 0, descripcion: "Elige una opción" },
        { id: 1, descripcion: "Taquipnea" },
        { id: 2, descripcion: "Sonidos anormales" },
        { id: 3, descripcion: "Posicion alterada" },
        { id: 4, descripcion: "Aleteo nasal" },
        { id: 5, descripcion: "Apnea" },
    ];
    const opcionesCirculatorio = [
        { id: 0, descripcion: "Elige una opción" },
        { id: 1, descripcion: "Palidez" },
        { id: 2, descripcion: "Cianosis" },
        { id: 3, descripcion: "Piel Reticulada" }
    ];


    return (
        <>
            <pre className="hidden">
                {JSON.stringify(verdataJson, null, 2)}
            </pre>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <form className="flex items-center space-x-2" onSubmit={handleSubmit2(onSubmit2)}>
                                <InputText label="N° Cuenta : "   {...register2('numcuenta', { required: true })}></InputText>
                                <button type="submit" className="mt-7 px-4 py-2 bg-green-500 text-white rounded-r-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Buscar</button>
                            </form>
                        </div>
                        <div>
                            <InputText label="Paciente : " readOnly={true} defaultValue={`${info?.triajeSolicita?.paterno || ''} ${info?.triajeSolicita?.materno || ''}  ${info?.triajeSolicita?.nombres || ''}  ${info?.triajeSolicita?.edad ? `(${info.triajeSolicita.edad} años)` : ''}`.trim()
                            }></InputText>
                        </div>
                        <div>
                            <InputText label="IAFA :" readOnly={true} defaultValue={`${info?.triajeSolicita?.iafa || ''}`}></InputText>
                        </div>
                        <div>
                            <InputText label="Datos Informativos : " readOnly={true} defaultValue={`${info?.triajeSolicita?.servicio || ''} ${info?.triajeSolicita?.fechaIngreso || ''}  `.trim()}></InputText>
                        </div>
                    </div>


                    {/* triaje formulario*/}



                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
                            <div>
                                <div className='bg-blue-300 text-center'>
                                    <h1 className='font-semibold text-slate-800'>Signos Vitales</h1>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 '>
                                    <InputTextTriaje label="Temperatura" readOnly={!editable} disabled={!editable} parametro={ParametroTemperatura} unidadMedida={"C°"} requerido={true} {...register('triajeTemperatura')} />

                                    <div className="flex items-center justify-center  ">
                                        <div className="flex flex-col">
                                            <label>
                                                Presion Arterial
                                                <span className="text-red-500">  (*)</span>
                                            </label>

                                            <div className="flex items-center ">

                                                <input
                                                    readOnly={!editable}
                                                    disabled={!editable}
                                                    type="text"
                                                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Sistolica"
                                                    {...register('presionSist')}
                                                />
                                                <div>
                                                    /
                                                </div>
                                                <input
                                                    readOnly={!editable}
                                                    disabled={!editable}
                                                    type="text"
                                                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Diastolica"
                                                    {...register('presionDiast')}
                                                />
                                                <div className="ml-1 w-1/3 h-11 bg-slate-200 text-center flex items-center justify-center rounded ">
                                                    <span>x mmHG</span>
                                                </div>
                                            </div>
                                            <span className="text-red-500 h-4">
                                                {ParametrosPerimetro}
                                            </span>
                                        </div>
                                    </div>
                                    <InputTextTriaje readOnly={!editable} disabled={!editable} label="Saturación (SAT)" requerido={true} unidadMedida={"%"} {...register('triajeSaturacion')} />
                                    <InputTextTriaje readOnly={!editable} disabled={!editable} label="Frec. Cardiaca (FC)" requerido={true} unidadMedida={"x min"} parametro={ParametroFrecuenciaCardiaca} {...register('triajeFrecCardiaca')} />
                                    <InputTextTriaje readOnly={!editable} disabled={!editable} label="Frec. Respiratoria" requerido={true} unidadMedida={"x min"} parametro={ParametroFrecuenciaRespiratoria} {...register('triajeFrecRespiratoria')} />
                                    <InputTextTriaje readOnly={!editable} disabled={!editable} label="Pulso" requerido={true} unidadMedida='bpm' {...register('triajePulso')} parametro={ParametroPulso} />
                                </div>


                            </div>

                            <div>
                                <div className='bg-blue-300 text-center'>
                                    <h1 className='font-semibold text-slate-800'>Datos Antopometricos</h1>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                    <InputTextTriaje readOnly={!editable} disabled={!editable} label="Peso" requerido={false} unidadMedida={"Kg"} parametro={ParametroPeso}  {...register('triajePeso')} />
                                    <InputTextTriaje readOnly={!editable} disabled={!editable} label="Perimetro Abdominal" requerido={false} unidadMedida={"cm"}  {...register('triajePerimetro')} />
                                    <InputTextTriaje readOnly={!editable} disabled={!editable} label="Talla" requerido={false} parametro={ParametroTalla} unidadMedida={"cm"}  {...register('triajeTalla')} />
                                    <InputTextTriaje readOnly={!editable} disabled={!editable} label="Perimetro Cefalico" requerido={false} parametro={ParametroCefalico} unidadMedida={"cm"}  {...register('triajePerimCefalico')} />
                                </div>
                            </div>




                            <hr className='border-blue-300 col-span-1 md:col-span-2  border-2' />

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>

                                <div className='col-span-1 md:col-span-2'>
                                    <div className="flex">
                                        <input type="checkbox" readOnly={!editable} disabled={!editable} {...register('EsGestante')} className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-default-checkbox" />
                                        <label className="text-sm text-gray-500 ms-3 dark:text-neutral-400">Es Gestante</label>
                                    </div>
                                </div>
                                <InputWithHeader label="Altura Uterina" {...register('alturaUterina')} deshabilitado={estadoGestacionalCheck} />
                                <InputWithHeader label="Frecuencia Cardiaca Fetal" {...register('frecCardiaca')} deshabilitado={estadoGestacionalCheck} />
                                <InputWithHeader label="Edad Gestacional" {...register('edadGestacional')} deshabilitado={estadoGestacionalCheck} />

                                <InputWithHeaderDate label="Fecha de Parto" {...register('fechaParto')} deshabilitado={estadoGestacionalCheck} />
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>

                                <div className='col-span-1 md:col-span-2' style={{ marginBottom: '-12px' }}>
                                    <div className="flex">
                                        <input type="checkbox" readOnly={!editable} disabled={!editable}  {...register('EsRecienNacido')} className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-default-checkbox" />
                                        <label className="text-sm text-gray-500 ms-3 dark:text-neutral-400">Recien Nacido</label>
                                    </div>
                                </div>
                                <SelectTriaje label="Apariencia"  {...register('apariencia')} opciones={opcionesApareciencia} deshabilitado={estadoRecienNacido} />
                                <SelectTriaje label="Circulatorio" {...register('circulatorio')} opciones={opcionesCirculatorio} deshabilitado={estadoRecienNacido} />

                                <SelectTriaje label="Respiratorio" {...register('respiratorio')} opciones={opcionesRespiratoria} deshabilitado={estadoRecienNacido} />
                            </div>


                            <div className=' col-span-1 md:col-span-2  ' >
                                <textarea {...register('observaciones')} readOnly={!editable} disabled={!editable} className="py-3 px-4 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Observaciones"></textarea>
                            </div>

                        </div>







                        {info?.triajeSolicita?.exito === 1 && (
                            <button
                                type="submit"
                                disabled={ActivateButton}
                                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-r-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                                Guardar
                            </button>
                        )}


                    </form>



                    {/* fom triaje formulario*/}





                </div>

                <div>

                    <div className={`bg-gray-200 mt-7 border border-gray-300 p-4 rounded  ${(estadoPrioridadUnoFCAdulto || estadoPrioridadUnoSistolicaAdulto || estadoPrioridadUnoDiastolicaAdulto || estadoPrioridadUnoFRAdulto) ? 'bg-red-300' : ''}`}>
                        <p className="font-semibold">Prioridad I</p>
                        <p className="text-justify">Paciente con alteración súbita y crítica del estado de salud, en riesgo inminente de muerte y que requieren atención inmediata.</p>
                        <p className="justify-center flex items-center "> <LuAlertTriangle className="text-red-700 mr-2" /> Traumashock </p>
                    </div>
                    <div className={`bg-gray-200 mt-7 border border-gray-300 p-4 rounded ${(estadoPrioridadDosFR) ? 'bg-red-300' : ''}`}>
                        <p className="font-semibold">Prioridad II</p>
                        <p className="text-justify">Paciente portadores de cuadro súbito, agudo con riesgo de muerte o complicaciones serias.</p>
                        <p className="justify-center flex items-center "> <LuAlertTriangle className="text-red-700 mr-2" /> Consultorio Emergencia </p>
                    </div>
                    <div className="bg-gray-200 mt-7 border border-gray-300 p-4 rounded">
                        <p className="font-semibold">Prioridad III</p>
                        <p className="text-justify">El paciente no presenta riesgo de muerte ni sucuelas invalidantes. Amerita atencion en el Topico de Emergencia.</p>
                        <p className="justify-center flex items-center "> <LuAlertTriangle className="text-red-700 mr-2" /> Topico Emergencia </p>
                    </div>
                    <div className="bg-gray-200 mt-7 border border-gray-300 p-4 rounded">
                        <p className="font-semibold">Prioridad IV</p>
                        <p className="text-justify">Paciente sin compromiso de funciones vitales ni riesgo de complicación inmediada, que puede ser atendido en Consulta Externa.</p>
                        <p className="justify-center flex items-center "> <LuAlertTriangle className="text-red-700 mr-2" /> Consultorio Externo </p>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="bg-gray-200  mt-7 border border-gray-300 p-4 rounded">
                            <p className="text-justify">Gestante requiere atencion inmediata, posible muerte prenatal.</p>
                        </div>
                        <div className="bg-gray-200  mt-7 border border-gray-300 p-4 rounded">
                            <p className="text-justify">Recien nacido requiere atencion inmediata, bebe inconciente, apnea y palidez.</p>
                        </div>
                    </div>

                </div>

            </div>

        </>
    )
}
