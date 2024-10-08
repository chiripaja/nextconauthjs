'use client'

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FormAdmision } from './FormAdmision';
import * as StompJs from '@stomp/stompjs';

interface Cita {
    idEspecialidad: number;
    fecha: string;
    cuposLibres: string;
    total_Citas: string;
    nombreEspecialidad: string;
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
        const { idEspecialidad, fecha, cuposLibres, total_Citas } = cita;

        if (!acc[idEspecialidad]) {
            acc[idEspecialidad] = {};
        }

        if (!acc[idEspecialidad][fecha]) {
            acc[idEspecialidad][fecha] = { totalCitas: 0, cuposLibres: 0 };
        }

        const totalCitasInt = parseInt(total_Citas, 10);
        const cuposLibresInt = parseInt(cuposLibres, 10);

        // Solo sumar si los valores son no negativos
        if (totalCitasInt >= 0) {
            acc[idEspecialidad][fecha].totalCitas += totalCitasInt;
        }

        if (cuposLibresInt >= 0) {
            acc[idEspecialidad][fecha].cuposLibres += cuposLibresInt;
        }

        return acc;
    }, {});

    return agrupado;
};

const generarFechas = (citas: Cita[]): string[] => {
    const fechas = new Set<string>();
    citas.forEach((cita) => fechas.add(cita.fecha));
    return Array.from(fechas).sort();
};

export const ModuloAdmision = ({ usuario }:any) => {
  
    const [stompClient, setStompClient] = useState<StompJs.Client | null>(null);
    const [citas, setCitas] = useState<Cita[]>([]);
    const [consultorio, setConsultorio] = useState<Cita[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [daysToShow, setDaysToShow] = useState(15);
    const [TextoLoading, settextoLoading] = useState("No se esta ejecutando")
    const [activeIndex, setActiveIndex] = useState<any>(null);
    const [establecimientosLista, setEstablecimientosLista] = useState<any>()
    const [ffFinanciamiento, setffFinanciamiento] = useState<any>()
    const [tipoDoc, setTipoDoc] = useState<any>()

    const ver = async (id: string, fecha: any) => {
        await setActiveIndex({ id, fecha });
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
            setCitas(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProductsActualizacionPosterior = async () => {
        settextoLoading("cargando");
        try {
            const response = await axios.get(`${process.env.apiurl}/Admision/CuposLibres`);
            const data = response.data;
            setCitas(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            settextoLoading("No se esta ejecutando");
        }
    }


    const getTipoDoc=async()=>{
        try {
            const { data } = await axios.get(`${process.env.apiurl}/Publico/TiposDocumentos`);
            setTipoDoc(data);
        } catch (error) {
            console.log(error)
        }  

    }

    useEffect(() => {
        // Llamadas a otras funciones
        fetchProducts();
        obtenerff();
        getTipoDoc();
        //web socket
        const conectarWS = () => {
            const client = new StompJs.Client({
                webSocketFactory: () => new WebSocket(`${process.env.apiws}/websocket`),
                onConnect: () => {
                    console.log('Conexión STOMP establecida');
                    client.subscribe('/Actualiza/Cupos', (mensaje) => {
                        actualizarCitas(mensaje.body);
                    });
                },
                onStompError: (frame) => {
                    console.error('Error en STOMP: ', frame);
                },
                onWebSocketClose: () => {
                    console.log('Conexión WebSocket cerrada');
                },
            });
            client.activate();
            setStompClient(client);
        };
        conectarWS();
        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };

    }, []);

    function toBoolean(value:any) {
        if (value === 'True') {
            return true;
          } else if (value === 'False') {
            return false;
          } else {
            console.error(`Invalid boolean string: ${value}`);
            return null;
          }
      }
    // Función para mostrar los actualizar cupos
    const actualizarCitas = (mensaje: any) => {
        try {            
            const body = typeof mensaje === 'string' ? JSON.parse(mensaje) : mensaje;          
            const validarCambio=toBoolean(body.contenido)
            if(validarCambio){                
                fetchProductsActualizacionPosterior()
            }         
        } catch (error) {
            console.error('Error al parsear el mensaje:', error);
        }
    };

    const obtenerff = async () => {
        try {
            const { data } = await axios.get(`${process.env.apiurl}/FuentesFinanciamiento`);
            setffFinanciamiento(data);
        } catch (error) {
            console.log(error)
        }       
    }
    const citasAgrupadas = agruparYCuposLibres(citas);
    const fechas = generarFechas(citas);

    return (
        <div className="m-3 p-3 bg-white rounded print:m-0 print:p-0 print:bg-transparent print:rounded-none">

            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="rounded-full h-20 w-20 bg-blue-600 animate-ping"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-12 gap-4 ">
                        <div className="col-span-12 print:hidden">
                        
                        <h1>{TextoLoading}</h1>
                        </div>
                    
                        <div className="col-span-12 print:hidden">
                            <div className="grid grid-cols-2 gap-8">
                                <button
                                    type="button"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => setDaysToShow(Math.ceil(fechas.length / 2))} // Mostrar 50% (15 días)
                                >
                                    Mostrar Citas Proximas
                                </button>
                                <button
                                    type="button"
                                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => setDaysToShow(fechas.length)} // Mostrar 100% (30 días)
                                >
                                    Mostrar Total Citas
                                </button>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-8 print:hidden">
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
                                                <td>{citaEspecialidad ? citaEspecialidad.nombreEspecialidad : 'No disponible'}</td>
                                                {fechas.slice(0, daysToShow).map((fecha) => (
                                                    <td key={fecha} className={` p-1 `}  >
                                                        {citasAgrupadas[parseInt(idEspecialidad)][fecha] ? (
                                                            citasAgrupadas[parseInt(idEspecialidad)][fecha].cuposLibres > 0 ? (
                                                                <div onClick={() => ver(idEspecialidad, fecha)} className={`
                                                           ${(activeIndex?.id === idEspecialidad && activeIndex?.fecha === fecha) ? 'bg-yellow-400 font-bold' : ''} 
                                                           cursor-pointer  text-center rounded bg-teal-500 hover:bg-yellow-200 shadow-md transition duration-300 ease-in-out transform hover:scale-105`}>
                                                                    [{citasAgrupadas[parseInt(idEspecialidad)][fecha].cuposLibres}]
                                                                </div>
                                                            ) : (
                                                                (() => {
                                                                    const givenDate = new Date(fecha);
                                                                    const today = new Date();

                                                                    const todayString = today.toISOString().split('T')[0];
                                                                    const givenDateString = givenDate.toISOString().split('T')[0];

                                                                    if (todayString === givenDateString) {
                                                                        return (
                                                                            <div onClick={() => ver(idEspecialidad, fecha)} className={`
                                                                       ${(activeIndex?.id === idEspecialidad && activeIndex?.fecha === fecha) ? 'bg-yellow-400 font-bold' : ''} 
                                                                       bg-orange-600 cursor-pointer rounded text-center hover:bg-yellow-200 shadow-lg transition duration-300 ease-in-out transform hover:scale-105`}>
                                                                                [0]
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
                        <div className="col-span-12 md:col-span-4 border rounded print:col-span-12 print:md:col-span-12 print:border-none print:rounded-none">
                            <FormAdmision usuario={usuario} consultorio={consultorio} establecimientos={establecimientosLista} ffFinanciamiento={ffFinanciamiento} tipoDoc={tipoDoc} />
                        </div>
                    </div>


                </>


            )}
        </div>
    );
};
