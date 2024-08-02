import { SelectTriaje } from "@/components/ui/SelectTriaje";

export default function NamePage() {
    const opcionsUsuarios = [
        { id: 0, descripcion: "admin" },
        { id: 1, descripcion: "llaquise" },
        { id: 2, descripcion: "jrodriguez" },
        { id: 3, descripcion: "gacostae" },
        { id: 4, descripcion: "ecastillom" },
        { id: 5, descripcion: "jcruzc" },
        { id: 6, descripcion: "gencarnacionm" },
        { id: 7, descripcion: "jespinozaa" },
        { id: 8, descripcion: "lferrerg" },
        { id: 9, descripcion: "NPINTO" },
        { id: 10, descripcion: "jgaspard" },
        { id: 11, descripcion: "caguilar" },
        { id: 12, descripcion: "jcastillol" },
        { id: 13, descripcion: "jgarayh" },
        { id: 14, descripcion: "jbg" },
        { id: 15, descripcion: "hcrisanta" },
        { id: 16, descripcion: "hnavarroj" },
        { id: 17, descripcion: "mriverab" },
        { id: 18, descripcion: "balzamora" },
        { id: 19, descripcion: "lcastillo" },
    ];



    const opcionsRoles = [
        { id: 0, descripcion: "Administrador" },
        { id: 1, descripcion: "Administrador Version Facturacion" },
        { id: 2, descripcion: "Farmacia Jefe" },
        { id: 3, descripcion: "Almacén Jefe" },
        { id: 4, descripcion: "Farmacia Despacho" },
        { id: 5, descripcion: "Almacén Despacho" },
        { id: 6, descripcion: "Caja Cajeros" },
        { id: 7, descripcion: "Hospitalizacion Admisionista" },
        { id: 8, descripcion: "HospitalizacionAltas" },
        { id: 9, descripcion: "HospitalizacionTransferencias" },
        { id: 10, descripcion: "EmergenciaAdmisionista" },
        { id: 11, descripcion: "EmergenciaAltas" },
        { id: 12, descripcion: "EmergenciaTransferencias" },
        { id: 13, descripcion: "CEadmisión HR" },
        { id: 14, descripcion: "CEatencion HR" },
        { id: 15, descripcion: "EmergenciaEliminar" },
        { id: 16, descripcion: "Hospitalizacion" },
        { id: 17, descripcion: "consultaExterna" },
        { id: 18, descripcion: "ImagEcogGeneralYrayosX" },
        { id: 19, descripcion: "ImagTomografia" },
    ];
    return (
        <div>
            <div className="grid grid-cols-2 gap-5">
                <div>
                    <div className="bg-slate-200 rounded text-center font-bold">
                        Lista Usuarios
                    </div>
                    <div>
                        <SelectTriaje label="Apariencia" opciones={opcionsUsuarios} deshabilitado={false} />
                    </div>
                </div>
                <div>
                    <div className="bg-slate-200 rounded text-center font-bold">
                        Permisos
                    </div>
                    <div>
                        <SelectTriaje label="Apariencia" opciones={opcionsRoles} deshabilitado={false} />
                    </div>
                </div>

                <div className="col-span-2 text-center">
                    <button type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                        Registrar
                    </button>
                </div>
            </div>
        </div>
    );
}