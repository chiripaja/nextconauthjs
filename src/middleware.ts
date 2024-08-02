import NextAuth from "next-auth";

import { NextRequest, NextResponse } from "next/server";
import authConfig from "./auth.config";
import { UserRole } from "./type/types";
import { auth } from "./auth"

const publicRoutes: string[] = [
    "/login",
]

const roleRoutes: Record<string, string[]> = {
  "/sihce/admision": ["webadmin","",""],
  "/sihce/triaje": ["webadmin"],
  // Añade más rutas y roles según sea necesario
};

export default auth((req: any) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth?.user;
    const userRoles: UserRole[] = req.auth?.user?.roles || [];
    // Verificar rutas públicas
    if (publicRoutes.includes(nextUrl.pathname)) {
      return NextResponse.next();
    }
  
    // Verificar si el usuario está autenticado
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
  
    // Verificar permisos basados en roles
    const requiredRoles = roleRoutes[nextUrl.pathname];

    if (requiredRoles && !requiredRoles.some((role:any) => userRoles.some(userRole => userRole.nombre === role))) {
      // Redirigir a una página de acceso denegado o a la página de inicio
      return NextResponse.redirect(new URL("/accessdenied", nextUrl));
    }
  
    return NextResponse.next();
  }); // El 'as any' es necesario debido a un problema de tipos con el middleware de Auth.js
  


export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};