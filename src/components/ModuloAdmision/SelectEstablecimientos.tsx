import React from 'react';
import Select from 'react-select';

const establecimientoscombo = [
  { IdEstablecimiento: 1, Nombre: 'LABORATORIO CLINICO MUNICIPAL' },
  { IdEstablecimiento: 2, Nombre: 'DIRECCION DE SERVICIOS DE ATENCION MOVIL DE URGENCIAS Y EMERGENCIAS' },
  { IdEstablecimiento: 3, Nombre: 'SISTEMA DE ATENCION MOVIL DE URGENCIAS' },
  { IdEstablecimiento: 4, Nombre: 'SISTEMA DE ATENCION DE URGENCIA-SAMU' },
  { IdEstablecimiento: 5, Nombre: 'C. S. SAN JUAN DE MIRAFLORES' },
];

const EstablecimientosSelect = () => {
  const options = establecimientoscombo.map(est => ({
    value: est.IdEstablecimiento,
    label: est.Nombre,
  }));

  const handleChange = (selectedOption:any) => {
    console.log('Selected:', selectedOption);
    // Aquí puedes realizar acciones con el valor seleccionado
  };

  return (
    <Select
      options={options}
      onChange={handleChange}
      placeholder="Seleccione un establecimiento"
      isSearchable
    />
  );
};

export default EstablecimientosSelect;
