'use client'

import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Select from 'react-select';
import axios from 'axios';

type InputBusquedadDni = {
  dni: string;
  tipodocumento: string;
  referenciaCodigo: string; // El código de establecimiento seleccionado
};
export default function PruebaPage() {
  const { control, handleSubmit, setValue,register } = useForm<InputBusquedadDni>();
  const [optionsCombo, setOptionsCombo] =  useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Función para autoseleccionar el establecimiento
  const AutoseleccionEstablecimiento = async (codigo: string) => {
    setIsLoading(true);
    const fetchedOptions = await fetchOptionsByCodigo(codigo);
   
    setOptionsCombo(fetchedOptions);



    setIsLoading(false);
  };

  // Función para obtener las opciones desde la API usando un código
  const fetchOptionsByCodigo = async (codigo: string): Promise<{ value: string, label: string }[]> => {
    try {
      const response = await axios.get(`${process.env.apiurl}/Totem/Establecimientos/${codigo}`);
      console.log("**************************************")
      console.log(response)
      return response.data.map((est: any) => ({
        value: est.codigo,
        label: est.nombre
      }));
    } catch (error) {
      console.error('Error fetching options', error);
      return [];
    }
  };

  // Función para buscar por DNI y autocompletar el establecimiento
  const BuscadorDni: SubmitHandler<InputBusquedadDni> = async (formdata) => {
    try {
      const { data }: any = await axios.get(`${process.env.apiurl}/Totem/SolicitaAdmitir?dni=${formdata.dni}&tipo=${formdata.tipodocumento}`);
      
      if (data?.sis?.eess) {
        AutoseleccionEstablecimiento(data.sis.eess.slice(-5));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(BuscadorDni)}>
      <div>
        <label>DNI:</label>
        <input {...register('dni')} placeholder="Ingrese DNI" required />
      </div>

     
      <button type="submit">Buscar y Auto-completar</button>
    </form>
  );
}