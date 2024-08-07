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
const [daysToShow, setDaysToShow] = useState(15);
    const today = new Date();

    const ver = async (id: string, fecha: any) => {
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
                    <div className="col-span-12">
                        <div className="grid grid-cols-2">
                            <button
                                type="button"
                                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                onClick={() => setDaysToShow(Math.ceil(fechas.length / 2))} // Mostrar 50% (15 días)
                            >
                                15 días
                            </button>
                            <button
                                type="button"
                                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                onClick={() => setDaysToShow(fechas.length)} // Mostrar 100% (30 días)
                            >
                                30 días
                            </button>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-8">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 ">
                            <thead>
                                <tr>
                                    <th>Especialidad</th>
                                    {fechas.slice(0, daysToShow).map((fecha) => {
                                        const partes = fecha.split("-");
                                        const mesDia = `${partes[1]}-${partes[2]}`;
                                        return (
                                            <th key={fecha}>{mesDia}</th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(citasAgrupadas).map((idEspecialidad) => {
                                    const citaEspecialidad = citas.find(
                                        (cita) => cita.idEspecialidad === parseInt(idEspecialidad)
                                    );

                                    return (
                                        <tr key={idEspecialidad} className="odd:bg-white even:bg-gray-100 dark:odd:bg-neutral-800 dark:even:bg-neutral-700 dark:hover:bg-neutral-700">
                                            <td>{citaEspecialidad ? citaEspecialidad.especialidad : 'No disponible'}</td>
                                            {fechas.slice(0, daysToShow).map((fecha) => (
                                                <td key={fecha} className="p-1">
                                                    {citasAgrupadas[parseInt(idEspecialidad)][fecha] ? (
                                                        citasAgrupadas[parseInt(idEspecialidad)][fecha].cuposLibres > 0 ? (
                                                            <div className="bg-emerald-400 rounded text-center">
                                                                <button onClick={() => ver(idEspecialidad, fecha)}>
                                                                    [{citasAgrupadas[parseInt(idEspecialidad)][fecha].cuposLibres}]
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            (() => {
                                                                const givenDate = new Date(fecha);
                                                                const today = new Date();

                                                                const todayString = today.toISOString().split('T')[0];
                                                                const givenDateString = givenDate.toISOString().split('T')[0];

                                                                if (todayString === givenDateString) {
                                                                    return (
                                                                        <div className="bg-orange-600 rounded text-center">
                                                                            <button onClick={() => ver(idEspecialidad, fecha)}>
                                                                                [0]
                                                                            </button>

                                                                        </div>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <div className="bg-gray-300 rounded">
                                                                            <button onClick={() => ver(idEspecialidad, fecha)}></button>
                                                                        </div>
                                                                    ); // No mostrar nada si las fechas no coinciden
                                                                }
                                                            })()
                                                        )
                                                    ) : (
                                                        <div className="bg-gray-300 rounded">
                                                            <button onClick={() => ver(idEspecialidad, fecha)}></button>
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>


                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        <FormAdmision consultorio={consultorio} />
                    </div>
                </div>

            )}
        </div>
    );
};
