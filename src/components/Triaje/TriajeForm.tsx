'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { InputText } from '../ui/InputTextDefaultValue';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

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
};

export const TriajeForm = (data: any) => {
  const session = useSession()
  const [datosTriajePaciente, setDatosTriajePaciente] = useState<any>()
  const [datover, setDatover] = useState<any>()
  const { register, handleSubmit, setValue , formState: { errors } } = useForm<Input>();
  useEffect(() => {
    if (data) {
     
     
      console.log("---------------")
      if(data?.info?.triajeSolicita){
        const {triaje}=data?.info?.triajeSolicita
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

  const onSubmit: SubmitHandler<Input> = async (formData) => {
   
    console.log(formData)
    const datosTriaje={
      ...formData,
      triajeIdUsuario:Number(session?.data?.user.id),
      idAtencion:datosTriajePaciente?.info?.triajeSolicita?.idAtencion
    }
    const sanitizedData = Object.fromEntries(
      Object.entries(datosTriaje).map(([key, value]) => [key, value ?? ''])
    );
    setDatover(sanitizedData)
   try {
    const { data } = await axios.post(`${process.env.apiurl}/Triaje/Guardar`,sanitizedData)
    if(data.exito===0){
      Swal.fire({
        icon: "error",
        title: `<h5 classname='text-base'>Error </h5>`,
        html: `${data?.mensaje} <br\>`,
    });
    }
      console.log(data);      
    } catch (error) {
      console.error(error);
    }  /* */
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>
      datover
        <pre>
        {JSON.stringify(datover,null,2)}
        </pre>
        <pre>
        {JSON.stringify(datosTriajePaciente?.info?.triajeSolicita?.idAtencion,null,2)}
        </pre>
       
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="bg-gray-100 p-4 rounded">
          <InputText label="triajePulso"  {...register('triajePulso')} />
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <InputText label="triajeTemperatura"   {...register('triajeTemperatura')} />
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <InputText label="presionSist"  {...register('presionSist')} />
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <InputText label="presionDiast"   {...register('presionDiast')} />
        </div>



        <div className="bg-gray-100 p-4 rounded">
          <InputText label="triajeFrecCardiaca"   {...register('triajeFrecCardiaca')} />
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <InputText label="triajePerimetro" {...register('triajePerimetro')} />
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <InputText label="triajeFrecRespiratoria"   {...register('triajeFrecRespiratoria')} />
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <InputText label="triajePeso"  {...register('triajePeso')} />
        </div>


        <div className="bg-gray-100 p-4 rounded">
          <InputText label="triajeTalla"  {...register('triajeTalla')} />
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <InputText label="triajePerimCefalico" {...register('triajePerimCefalico')} />
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <InputText label="triajeSaturacion"  {...register('triajeSaturacion')} />
        </div>
        
      </div>
      {datosTriajePaciente?.info?.exito===0 ? true : false}
      {datosTriajePaciente?.info?.triajeSolicita?.exito ===1  && (
        <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded-r-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          Guardar
        </button>
      )}
    </form>
  );
};
