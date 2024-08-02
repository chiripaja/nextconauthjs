import { SelectTriaje } from "../ui/SelectTriaje";
import { CardServicios } from "./CardServicios"


export const FormAdmision = (data: any) => {
    const opcionesDNI = [
        { id: 1, descripcion: "DNI" },
        { id: 2, descripcion: "C.E." },
    ];
    const { consultorio } = data;
    console.log(consultorio)
    return (
        <>
            <div className="h-full bg-slate-400 md:bg-white ">
                <div className="h-3">

                </div>
                {
                    consultorio?.map((data: any, index: number) => (
                        <CardServicios key={index}>
                            <p>{data.nombre_Servicios}</p>
                            <p>{data.cupos_Libres}</p>
                        </CardServicios>
                    ))
                }
                <div className="grid grid-cols-2 gap-2">

                <SelectTriaje  opciones={opcionesDNI} deshabilitado={false} />
                <input
                                                    type="text"
                                                    className=" px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder=""
                                                  
                                                />
                </div>
            </div>
        </>
    )
}
