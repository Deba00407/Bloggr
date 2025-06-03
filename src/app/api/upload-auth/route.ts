import {getUploadAuthParams} from "@imagekit/next/server"
import { NextResponse } from "next/server"

export async function GET(){
    // Get auth details

    const {token, expire, signature} = getUploadAuthParams({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    })

    return NextResponse.json({token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY})
}