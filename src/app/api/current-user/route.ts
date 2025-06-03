import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


export async function GET(){
    const user = await currentUser()
    if(!user){
        return NextResponse.json({
            "message": "User not found"
        }, {status: 400})
    }

    return NextResponse.json({
        user
    }, {status: 200})
}