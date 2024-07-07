import NextAuth from "next-auth";

import { NextResponse } from "next/server";
import authConfig from "./auth.config";
const { auth } = NextAuth(authConfig);

const publicRoutes=[
    "/login2",
    "/login",
]

export default auth((req) => {
   
    const {nextUrl,auth}=req
    console.log(nextUrl.pathname)
    const isLoggedin=!!auth?.user
    console.log(isLoggedin)
    if(!publicRoutes.includes(nextUrl.pathname) && !isLoggedin){
        console.log("entro")
        console.log(nextUrl.pathname)
       return NextResponse.redirect(new URL("/login2",nextUrl))
    }
    return NextResponse.next()
})


export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  };