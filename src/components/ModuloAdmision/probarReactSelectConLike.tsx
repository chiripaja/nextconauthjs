'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import axios from 'axios';

interface Establecimiento {
  value: string;
  label: string;
}

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

const SelectConLike = () => {
  const [optionsCombo, setOptionsCombo] = useState<Establecimiento[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Establecimiento | null>(null);

  const loadOptions = useCallback(async (inputValue: string) => {
    setIsLoading(true);
    const fetchedOptions = await fetchOptions(inputValue);
    setOptionsCombo(fetchedOptions);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (inputValue) {
      loadOptions(inputValue);
    } else {
      setOptionsCombo([]);
    }
  }, [inputValue, loadOptions]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedOptions = await fetchOptions("show");
        setOptionsCombo(fetchedOptions);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [inputValue]);

  return (
    <Select
      inputId="select-establecimientos"
      options={optionsCombo}
      placeholder={isLoading ? 'Cargando...' : 'Seleccione un establecimiento'}
      isSearchable={true}
      onInputChange={setInputValue}
      isLoading={isLoading}
      value={selectedOption} // Aquí se establece la opción seleccionada
      onChange={setSelectedOption} // Permite actualizar la opción seleccionada manualmente si el usuario lo desea
    />
  );
};

export default SelectConLike;
