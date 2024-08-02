'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { InputText } from '../ui/InputTextDefaultValue';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import { InputWithHeader } from '../ui/InputWithHeader';
import { InputTextTwo } from '../ui/InputTextTwo';
import { InputTextTriaje } from '../ui/InputTextTriaje';
import { SelectTriaje } from '../ui/SelectTriaje';
import { CheckBox } from '../ui/CheckBox';

type Input = {
  triajePulso?: string;
  triajeTemperatura?: string;
  presionSist?: string;
  presionDiast?: string;
  triajeFrecCardiaca?: string;
  triajePerimetro?: string;
  triajeFrecRespiratoria?: string;
  triajePeso?: string;
  triajeTalla?: string;
  triajePerimCefalico?: string;
  triajeSaturacion?: string;
  EsGestante?:string;
  EsRecienNacido?:string;
};

export const TriajeForm = (data: any) => {
  const session = useSession()
  const [datosTriajePaciente, setDatosTriajePaciente] = useState<any>()
  const [estadoGestacionalCheck, setEstadoGestacionalCheck] = useState<boolean>(true)
  const [estadoRecienNacido, setEstadoRecienNacido] = useState<boolean>(true)
  const [estadoPrioridadUnoFC, setEstadoPrioridadUnoFC] = useState<boolean>(false)
  const { register, handleSubmit, setValue,watch, formState: { errors } } = useForm<Input>();
  const checkGestante = watch('EsGestante');
  const checkRecienNacido = watch('EsRecienNacido');  
  const InputTriajeFrecCardiaca=watch('triajeFrecCardiaca');



  //condicional triajeFrecuenciaCardiacaAdultos
  useEffect(() => {
    const frecuenciaCardiaca = Number(InputTriajeFrecCardiaca);
    
    if (!isNaN(frecuenciaCardiaca)) {
      if (edad >= 30 && (frecuenciaCardiaca < 50 || frecuenciaCardiaca > 150)) {
        console.log("entro a la condicional")
        setEstadoPrioridadUnoFC(true)
      } else {
        console.log("fallo")
        setEstadoPrioridadUnoFC(false)
      }
    } else {
      setEstadoPrioridadUnoFC(false)
    }
  
  
    
  }, [InputTriajeFrecCardiaca])
  

  //actualizacion de datos triaje
  useEffect(() => {
    if (data) {
      if (data?.info?.triajeSolicita) {
        const { triaje } = data?.info?.triajeSolicita
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
      }
      setDatosTriajePaciente(data)
    }

  }, [data]);



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


  const onSubmit: SubmitHandler<Input> = async (formData) => {

    console.log(formData)
   /* const datosTriaje = {
      ...formData,
      triajeIdUsuario: Number(session?.data?.user.id),
      idAtencion: datosTriajePaciente?.info?.triajeSolicita?.idAtencion
    }
    const sanitizedData = Object.fromEntries(
      Object.entries(datosTriaje).map(([key, value]) => [key, value ?? ''])
    );
    setDatover(sanitizedData)
    try {
      const { data } = await axios.post(`${process.env.apiurl}/Triaje/Guardar`, sanitizedData)
      if (data.exito === 0) {
        Swal.fire({
          icon: "error",
          title: `<h5 classname='text-base'>Error </h5>`,
          html: `${data?.mensaje} <br\>`,
        });
      }
    } catch (error) {
      console.error(error);
    }*/
  };
  const edad=30;

  const variablePeso = datosTriajePaciente?.info?.triajeVariables.find(
    (variable: any) => variable.idTriajeVariable === 1
  );
  const ParametroPeso = variablePeso
    ? ` 0 a ${variablePeso.valorNormalMaximo} kg.`
    : '';


  const variableTalla = datosTriajePaciente?.info?.triajeVariables.find(
    (variable: any) => variable.idTriajeVariable === 2
  );
  const ParametroTalla = variableTalla
    ? ` ${variableTalla.valorNormalMinimo} a ${variableTalla.valorNormalMaximo} cm.`
    : '';

  const variableCefalico = datosTriajePaciente?.info?.triajeVariables.find(
    (variable: any) => variable.idTriajeVariable === 3
  );
  const ParametroCefalico = variableCefalico
    ? `  ${variableCefalico.valorNormalMinimo} a ${variableCefalico.valorNormalMaximo} cm.`
    : '';




  const variableSistolica = datosTriajePaciente?.info?.triajeVariables.find(
    (variable: any) => variable.idTriajeVariable === 4
  );
  const ParametroSistolica = variableSistolica
    ? `${variableSistolica.valorNormalMinimo}-${variableSistolica.valorNormalMaximo}`
    : '';


  const variableDiastolica = datosTriajePaciente?.info?.triajeVariables.find(
    (variable: any) => variable.idTriajeVariable === 5
  );
  const ParametroDiastolica = variableDiastolica
    ? `${variableDiastolica.valorNormalMinimo}-${variableDiastolica.valorNormalMaximo}`
    : '';

  const ParametrosPerimetro = ParametroSistolica && ParametroDiastolica
    ? `${ParametroSistolica}/${ParametroDiastolica} mmHg`
    : '';

  const variableTemperatura = datosTriajePaciente?.info?.triajeVariables.find(
    (variable: any) => variable.idTriajeVariable === 6
  );
  const ParametroTemperatura = variableTemperatura
    ? ` ${variableTemperatura.valorNormalMinimo} a ${variableTemperatura.valorNormalMaximo} x min.`
    : '';


  const variableFC = datosTriajePaciente?.info?.triajeVariables.find(
    (variable: any) => variable.idTriajeVariable === 7
  );
  const ParametroFrecuenciaCardiaca = variableFC
    ? ` ${variableFC.valorNormalMinimo} a ${variableFC.valorNormalMaximo} x min.`
    : '';


  const variableFR = datosTriajePaciente?.info?.triajeVariables.find(
    (variable: any) => variable.idTriajeVariable === 8
  );
  const ParametroFrecuenciaRespiratoria = variableFR
    ? ` ${variableFR.valorNormalMinimo} a ${variableFR.valorNormalMaximo} x min.`
    : '';


  const variablePulso = datosTriajePaciente?.info?.triajeVariables.find(
    (variable: any) => variable.idTriajeVariable === 9
  );
  const ParametroPulso = variablePulso
    ? ` ${variablePulso.valorNormalMinimo} a ${variablePulso.valorNormalMaximo}`
    : '';


   
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
          <div>
            <div className='bg-blue-300 text-center'>
              <h1 className='font-semibold text-slate-800'>Signos Vitales</h1>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 '>
              <InputTextTriaje label="Temperatura" parametro={ParametroTemperatura} unidadMedida={"C°"} requerido={true} {...register('triajeTemperatura')} />

              <div className="flex items-center justify-center  ">
                <div className="flex flex-col">
                  <label>
                    Presion Arterial
                    <span className="text-red-500">  (*)</span>
                  </label>

                  <div className="flex items-center ">

                    <input
                      type="text"
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Sistolica"
                      {...register('presionSist')}
                    />
                    <div>
                      /
                    </div>
                    <input
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
              <InputTextTriaje label="Saturación (SAT)" requerido={true} unidadMedida={"%"} {...register('triajeSaturacion')} />
              <InputTextTriaje label="Frec. Cardiaca (FC)" requerido={true} unidadMedida={"x min"} parametro={ParametroFrecuenciaCardiaca} {...register('triajeFrecCardiaca')} />
              <InputTextTriaje label="Frec. Respiratoria" requerido={true} unidadMedida={"x min"} parametro={ParametroFrecuenciaRespiratoria} {...register('triajeFrecRespiratoria')} />
              <InputTextTriaje label="Pulso" requerido={true} unidadMedida='bpm' {...register('triajePulso')} parametro={ParametroPulso} />
            </div>


          </div>

          <div>
            <div className='bg-blue-300 text-center'>
              <h1 className='font-semibold text-slate-800'>Datos Antopometricos</h1>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <InputTextTriaje label="Peso" requerido={false} unidadMedida={"Kg"} parametro={ParametroPeso}  {...register('triajePeso')} />
              <InputTextTriaje label="Perimetro Abdominal" requerido={false} unidadMedida={"cm"}  {...register('triajePerimetro')} />
              <InputTextTriaje label="Talla" requerido={false} parametro={ParametroTalla} unidadMedida={"cm"}  {...register('triajeTalla')} />
              <InputTextTriaje label="Perimetro Cefalico" requerido={false} parametro={ParametroCefalico} unidadMedida={"cm"}  {...register('triajePerimCefalico')} />



            </div>
          </div>




          <hr className='border-blue-300 col-span-1 md:col-span-2  border-2' />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>

            <div className='col-span-1 md:col-span-2'>
              <div className="flex">
                <input type="checkbox" {...register('EsGestante')}  className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-default-checkbox" />
                <label className="text-sm text-gray-500 ms-3 dark:text-neutral-400">Es Gestante</label>
              </div>
            </div>
            <InputWithHeader label="Altura Uterina" deshabilitado={estadoGestacionalCheck}/>
            <InputWithHeader label="Frecuencia Cardiaca Fetal"  deshabilitado={estadoGestacionalCheck}/>
            <InputWithHeader label="Edad Gestacional" deshabilitado={estadoGestacionalCheck} />
            <InputWithHeader label="Fecha de Parto"  deshabilitado={estadoGestacionalCheck}/>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>

          <div className='col-span-1 md:col-span-2' style={{ marginBottom: '-12px' }}>
              <div className="flex">
                <input type="checkbox" {...register('EsRecienNacido')} className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-default-checkbox" />
                <label className="text-sm text-gray-500 ms-3 dark:text-neutral-400">Recien Nacido</label>
              </div>
            </div> 
            <SelectTriaje label="Apariencia" opciones={opcionesApareciencia} deshabilitado={estadoRecienNacido}/>
            <SelectTriaje label="Circulatorio" opciones={opcionesCirculatorio} deshabilitado={estadoRecienNacido}/>
            
            <SelectTriaje label="Respiratorio" opciones={opcionesRespiratoria} deshabilitado={estadoRecienNacido}/>
          </div>


          <div className=' col-span-1 md:col-span-2  ' >
          <textarea className="py-3 px-4 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Observaciones"></textarea>
            </div>

        </div>







        {datosTriajePaciente?.info?.triajeSolicita?.exito === 0 && (
          <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded-r-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Guardar
          </button>
        )}


      </form>
    </>
  );
};
