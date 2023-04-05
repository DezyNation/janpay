import { NextResponse } from "next/server";
 
const Middleware = (req) => {
    
    const verified = req.cookies.get("verified")

    const url = req.url
    
    if(!verified && url.includes("in/dashboard")){
        return NextResponse.redirect(process.env.NEXT_PUBLIC_FRONTEND_URL+"/auth/login")
    }
    else if(verified && url.includes("/auth")){
        return NextResponse.redirect(process.env.NEXT_PUBLIC_FRONTEND_URL+"in/dashboard")
    }
}

export default Middleware