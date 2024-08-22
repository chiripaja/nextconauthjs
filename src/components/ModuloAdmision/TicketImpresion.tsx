

export const TicketImpresion = ({ Datos }: any) => {
  return (
<>
        {Datos && (
            <div className='container hidden print:block'>
                <div className="row text-center  text-xs">
                    <div className="col-sm-12 font-bold">
                        HOSPITAL REGIONAL HERMILIO VALDIZAN
                    </div>
                    <div className="col-sm-12 text-xs">
                        RUC : 20146038329
                    </div>
                    <div className="col-sm-12" style={{ fontSize: '8px' }}>
                        JIRON HERMILIO VALDIZAN NUMERO 950 DISTRITO HUANUCO
                    </div>
                    <div className="col-sm-12 font-bold text-xs">
                        TICKET DE CITA
                    </div>
                </div>
                <div className="row text-sm">
                    <div className="col-sm-12 font-bold">
                    
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {Datos.ordenPago ? ( <span> N° Orden Pago : {Datos.ordenPago} </span> ):(null)}
                    </div>
                    <div className="col-sm-12 font-bold">
                        Fecha: {Datos.fechaIngreso} Hr: {Datos.horaIngreso}
                    </div>
                    <div className="col-sm-12">
                        Servicio : {Datos.servicio}
                    </div>
                    <div className="col-sm-12">
                        Médico. : {Datos.nombreMedico}
                    </div>
                    <div className="col-sm-12">
                        <div className="border-b w-full">
                        </div>
                    </div>
                    <div className="col-sm-12 font-bold">
                        <span>N° Historia : {Datos.nroHistoriaClinica}  </span>
                    </div>
                    <div className="col-sm-12 font-bold">
                        <span>N° Cuenta : {Datos.idCuentaAtencion} </span>
                    </div>
                    <div className="col-sm-12 font-bold">
                        <span>Paciente : {Datos.nombrePaciente} </span>
                    </div>
                    <div className='col-sm-12 font-bold'>
                        {Datos.fuenteFinanciamiento}     <span style={{fontSize: '11px'}}>  {Datos.ordenPago ? ( <> (DIRIJASE A CAJA) </> ):(null)}  </span>
                    </div>
                    <div>
                        Interconsulta: Si( )  No ( )
                    </div>
                    <div className="col-sm-12">
                        <div className="border-b w-full"></div>
                    </div>
                    <div className="col-sm-12">
                        Terminal: TOTEM
                    </div>
                    <div className="col-sm-12 text-center font-bold" style={{ fontSize: '11px' }}>
                        CONSERVE SU TICKET-CENTRAL DE EMERGENCIAS LLAME AL 106 SAMU RECUERDE LLEGAR 30 MIN ANTES DE LA CITA O PERDERA LA MISMA
                    </div>
                    <div className="col-sm-12 text-xs">
                        <p>Fecha y Hora de Impresión: {new Date().toLocaleString('es-ES')}</p>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
        )}
    </>
  )
}
