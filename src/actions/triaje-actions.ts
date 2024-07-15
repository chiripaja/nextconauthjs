'use server'

import axios from "axios"


export async function datosTriaje(){
    try {
        const data=await axios.get('http://192.168.250.10:4500/Triaje/SolicitaAgregar/125424')
        console.log(data)
        return {
            ok:true,
            data:data
        }
    } catch (error) {
        return {
            ok:false,
            message:'Error'
        }
    }
   
}