'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import { FormAdmision } from './FormAdmision';

interface Cita {
    idEspecialidad: number;
    fecha: string;
    cupos_Libres: string;
    total_Citas: string;
    especialidad: string;
}

interface AgrupadoCitas {
    [key: number]: {
        [key: string]: {
            totalCitas: number;
            cuposLibres: number;
        }
    }
}

const agruparYCuposLibres = (citas: Cita[]): AgrupadoCitas => {
    if (!Array.isArray(citas)) return {};

    const agrupado = citas.reduce((acc: AgrupadoCitas, cita: Cita) => {
        const { idEspecialidad, fecha, cupos_Libres, total_Citas } = cita;

        if (!acc[idEspecialidad]) {
            acc[idEspecialidad] = {};
        }

        if (!acc[idEspecialidad][fecha]) {
            acc[idEspecialidad][fecha] = { totalCitas: 0, cuposLibres: 0 };
        }

        acc[idEspecialidad][fecha].totalCitas += parseInt(total_Citas, 10);
        acc[idEspecialidad][fecha].cuposLibres += parseInt(cupos_Libres, 10);

        return acc;
    }, {});

    return agrupado;
};

const generarFechas = (citas: Cita[]): string[] => {
    const fechas = new Set<string>();
    citas.forEach((cita) => fechas.add(cita.fecha));
    return Array.from(fechas).sort();
};

export const ModuloAdmision = () => {
    const [citas, setCitas] = useState<Cita[]>([]);
    const [consultorio, setConsultorio] = useState<Cita[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const ver=async(id:string,fecha:any)=>{
        const especilidadDatos = citas.filter((item: Cita) => 
            item.idEspecialidad.toString() === id && item.fecha === fecha
          );
          setConsultorio(especilidadDatos)
    }

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.apiurl}/Admision/CuposLibres`);
            const data = response.data;
            const citasConCupo = data.filter((item: Cita) => parseInt(item.cupos_Libres) > 0);
            setCitas(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const citasAgrupadas = agruparYCuposLibres(citas);
    const fechas = generarFechas(citas);

    return (
        <div className="m-3 p-3 bg-white rounded">

            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="rounded-full h-20 w-20 bg-blue-600 animate-ping"></div>
                </div>
            ) : (
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-10">
                        <table className="table-auto w-full ">
                            <thead>
                                <tr>
                                    <th>Especialidad</th>
                                    {fechas.map((fecha) => (
                                        <th key={fecha}>{fecha}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(citasAgrupadas).map((idEspecialidad) => {
                                    const citaEspecialidad = citas.find(
                                        (cita) => cita.idEspecialidad === parseInt(idEspecialidad)
                                    );

                                    return (
                                        <tr key={idEspecialidad}>
                                            <td>{citaEspecialidad ? citaEspecialidad.especialidad : 'No disponible'}</td>
                                            {fechas.map((fecha) => (
                                                <td key={fecha}>
                                                    {citasAgrupadas[parseInt(idEspecialidad)][fecha] ? (
                                                        <div><button onClick={()=>ver(idEspecialidad,fecha)}>{citasAgrupadas[parseInt(idEspecialidad)][fecha].cuposLibres}</button></div>
                                                    ) : (
                                                        <div className="bg-slate-400"><button onClick={()=>ver(idEspecialidad,fecha)}> </button></div>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-span-12 md:col-span-2">
                        <FormAdmision consultorio={consultorio}/>
                    </div>
                </div>

            )}
        </div>
    );
};
