import { CardServicios } from "./CardServicios"


export const FormAdmision = (data: any) => {

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

                            <label>{JSON.stringify(data.nombre_Servicios)}</label>
                            <label>{JSON.stringify(data.cupos_Libres)}</label>
                            <label>{data.nombre_Medico}</label>

                        </CardServicios>
                    ))
                }

            </div>
        </>
    )
}
