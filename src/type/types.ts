// types.ts
export interface UserRole {
    idUsuarioRol: number;
    idEmpleadoRol: number;
    idRol: number;
    nombre: string;
  }
  
  export type RoleRoutes = {
    [key: string]: string[];
  };